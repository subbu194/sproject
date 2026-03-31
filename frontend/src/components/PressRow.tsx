interface PressRowProps {
  outlet: string;
  title: string;
  year: string;
  link?: string;
  images?: string[];
}

export default function PressRow({ outlet, title, year, link, images }: PressRowProps) {
  const content = (
    <div className="group flex items-center justify-between rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-5 transition-all duration-200 hover:border-[var(--gold)]/40 hover:shadow-md hover:shadow-[var(--gold)]/5">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {images && images.length > 0 && (
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--brown)]/8">
            <img src={images[0]} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            {outlet}
          </div>
          <h3 className="mt-1.5 text-base font-bold text-[var(--brown)] truncate transition-colors group-hover:text-[var(--brown-light)]">{title}</h3>
        </div>
      </div>
      <div className="ml-4 flex items-center gap-3 shrink-0">
        <span className="text-sm font-medium text-[var(--muted)]">{year}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--gold)] transition-all duration-200 group-hover:bg-[var(--gold)] group-hover:text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}
