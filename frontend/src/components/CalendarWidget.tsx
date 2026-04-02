import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarWidgetProps {
  entryDates: string[]; // ISO date strings
  onDateSelect?: (date: Date) => void;
}

export default function CalendarWidget({ entryDates, onDateSelect }: CalendarWidgetProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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

  // Map entry dates to day numbers for current month view
  const entryDaysMap = new Map<number, string>();
  entryDates.forEach((d) => {
    const date = new Date(d);
    if (date.getFullYear() === year && date.getMonth() === month) {
      entryDaysMap.set(date.getDate(), d);
    }
  });

  const todayDay = today.getDate();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const goToPrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    if (entryDaysMap.has(day) && onDateSelect) {
      onDateSelect(new Date(year, month, day));
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--gold)]/15 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button 
          onClick={goToPrevMonth}
          className="p-1 rounded-lg text-[var(--muted)] hover:bg-[var(--warm-white)] hover:text-[var(--brown)] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-bold text-[var(--brown)]">{monthName}</div>
        <button 
          onClick={goToNextMonth}
          className="p-1 rounded-lg text-[var(--muted)] hover:bg-[var(--warm-white)] hover:text-[var(--brown)] transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {dayHeaders.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {weeks.flat().map((day, i) => {
          if (day === null) return <div key={i} />;

          const isToday = isCurrentMonth && day === todayDay;
          const hasEntry = entryDaysMap.has(day);

          return (
            <button
              key={i}
              onClick={() => handleDayClick(day)}
              disabled={!hasEntry}
              className={`flex h-8 w-full items-center justify-center rounded-lg text-xs font-medium transition
                ${isToday ? 'border-2 border-[var(--gold)] font-bold text-[var(--gold)]' : ''}
                ${hasEntry && !isToday ? 'bg-[var(--gold)]/15 font-semibold text-[var(--gold)] cursor-pointer hover:bg-[var(--gold)]/25' : ''}
                ${!isToday && !hasEntry ? 'text-[var(--muted)] cursor-default' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
      {entryDaysMap.size > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--brown)]/5 text-center text-xs text-[var(--muted)]">
          {entryDaysMap.size} {entryDaysMap.size === 1 ? 'entry' : 'entries'} this month
        </div>
      )}
    </div>
  );
}
