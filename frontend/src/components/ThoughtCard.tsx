interface ThoughtCardProps {
  topic: string;
  title: string;
  summary: string;
}

export default function ThoughtCard({ topic, title, summary }: ThoughtCardProps) {
  return (
    <article className="group rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)] hover:shadow-md">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
        {topic}
      </div>
      <h3 className="mt-3 font-['Playfair_Display'] text-lg font-bold text-[var(--brown)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{summary}</p>
    </article>
  );
}
