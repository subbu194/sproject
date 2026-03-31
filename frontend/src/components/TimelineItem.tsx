interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  isLast?: boolean;
  images?: string[];
}

export default function TimelineItem({ year, title, description, isLast, images }: TimelineItemProps) {
  return (
    <div className="group grid grid-cols-[40px_1fr] gap-4">
      <div className="relative flex flex-col items-center">
        {/* Gold dot */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] shadow-sm transition-transform duration-300 group-hover:scale-110">
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
        <h3 className="mt-1 text-base font-bold text-[var(--brown)] transition-colors group-hover:text-[var(--brown-light)]">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
        {images && images.length > 0 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {images.slice(0, 5).map((img, i) => (
              <div key={i} className="h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-[var(--brown)]/8 shadow-sm">
                <img src={img} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
