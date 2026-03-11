interface PressRowProps {
  outlet: string;
  title: string;
  year: string;
  link?: string;
}

export default function PressRow({ outlet, title, year, link }: PressRowProps) {
  const content = (
    <div className="group flex items-center justify-between rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-5 transition-all duration-200 hover:border-[var(--gold)] hover:shadow-sm">
      <div className="flex-1">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
          {outlet}
        </div>
        <h3 className="mt-1.5 text-base font-bold text-[var(--brown)]">{title}</h3>
      </div>
      <div className="ml-4 flex items-center gap-3">
        <span className="text-sm font-medium text-[var(--muted)]">{year}</span>
        <span className="text-[var(--gold)] transition group-hover:translate-x-1">→</span>
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
