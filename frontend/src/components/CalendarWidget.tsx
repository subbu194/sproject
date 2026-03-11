import { useMemo } from 'react';

interface CalendarWidgetProps {
  entryDates: string[]; // ISO date strings
}

export default function CalendarWidget({ entryDates }: CalendarWidgetProps) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const { monthName, dayHeaders, weeks, entryDays, todayDay } = useMemo(() => {
    const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const dayHeaders = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // Monday = 0, Sunday = 6
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = Array(startDay).fill(null);

    for (let d = 1; d <= totalDays; d++) {
      currentWeek.push(d);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }

    const entryDays = new Set(
      entryDates.map((d) => {
        const date = new Date(d);
        if (date.getFullYear() === year && date.getMonth() === month) {
          return date.getDate();
        }
        return -1;
      }).filter((d) => d > 0)
    );

    const todayDay = today.getDate();

    return { monthName, dayHeaders, weeks, entryDays, todayDay };
  }, [entryDates, year, month]);

  return (
    <div className="rounded-2xl border border-[var(--gold)]/15 bg-white p-5 shadow-sm">
      <div className="text-center text-sm font-bold text-[var(--brown)]">{monthName}</div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {dayHeaders.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {weeks.flat().map((day, i) => {
          if (day === null) return <div key={i} />;

          const isToday = day === todayDay;
          const hasEntry = entryDays.has(day);

          return (
            <div
              key={i}
              className={`flex h-8 w-full items-center justify-center rounded-lg text-xs font-medium transition
                ${isToday ? 'border-2 border-[var(--gold)] font-bold text-[var(--gold)]' : ''}
                ${hasEntry && !isToday ? 'bg-[var(--gold)]/15 font-semibold text-[var(--gold)]' : ''}
                ${!isToday && !hasEntry ? 'text-[var(--muted)]' : ''}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
