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
    <div className="relative overflow-hidden rounded-[2rem] border-2 border-white/60 bg-white/60 p-6 sm:p-8 shadow-2xl shadow-[var(--brown)]/5 backdrop-blur-2xl">
      {/* Decorative gradient orb */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-[var(--gold)]/20 to-[var(--gold-light)]/20 blur-3xl" />
      
      <div className="relative z-10 mb-6 flex items-center justify-between">
        <button 
          onClick={goToPrevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[var(--muted)] shadow-sm transition-all hover:bg-white hover:text-[var(--gold)] hover:shadow-md"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="font-['Playfair_Display'] text-lg font-bold tracking-wide text-[var(--brown)]">
          {monthName}
        </div>
        <button 
          onClick={goToNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[var(--muted)] shadow-sm transition-all hover:bg-white hover:text-[var(--gold)] hover:shadow-md"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="relative z-10 grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase tracking-widest text-[var(--muted)]/70">
        {dayHeaders.map((d, i) => (
          <div key={i} className="pb-2">{d}</div>
        ))}
      </div>
      
      <div className="relative z-10 grid grid-cols-7 gap-2">
        {weeks.flat().map((day, i) => {
          if (day === null) return <div key={i} />;

          const isToday = isCurrentMonth && day === todayDay;
          const hasEntry = entryDaysMap.has(day);

          return (
            <button
              key={i}
              onClick={() => handleDayClick(day)}
              disabled={!hasEntry}
              className={`relative flex aspect-square w-full items-center justify-center rounded-xl text-xs font-bold transition-all duration-300
                ${isToday && !hasEntry ? 'border-2 border-[var(--gold)]/40 text-[var(--gold)]' : ''}
                ${isToday && hasEntry ? 'border-2 border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)] hover:bg-[var(--gold)]/20' : ''}
                ${hasEntry && !isToday ? 'bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] text-white shadow-lg shadow-[var(--gold)]/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--gold)]/40' : ''}
                ${!isToday && !hasEntry ? 'text-[var(--muted)] hover:bg-white/50' : ''}
                ${!hasEntry ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
      
      {entryDaysMap.size > 0 && (
        <div className="relative z-10 mt-6 pt-5 border-t border-[var(--brown)]/10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--gold)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--gold)] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--gold)]"></span>
            </span>
            {entryDaysMap.size} {entryDaysMap.size === 1 ? 'Log' : 'Logs'} This Month
          </span>
        </div>
      )}
    </div>
  );
}
