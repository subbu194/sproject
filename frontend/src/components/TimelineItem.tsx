interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  isLast?: boolean;
}

export default function TimelineItem({ year, title, description, isLast }: TimelineItemProps) {
  return (
    <div className="grid grid-cols-[40px_1fr] gap-4">
      <div className="relative flex flex-col items-center">
        {/* Gold dot */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] shadow-sm">
          <div className="h-3 w-3 rounded-full bg-white" />
        </div>
        {/* Connector line */}
        {!isLast && (
          <div className="mt-1 w-0.5 flex-1 bg-gradient-to-b from-[var(--gold)] to-[var(--gold-light)]/30" />
        )}
      </div>
      <div className="pb-8">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
          {year}
        </div>
        <h3 className="mt-1 text-base font-bold text-[var(--brown)]">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
      </div>
    </div>
  );
}
