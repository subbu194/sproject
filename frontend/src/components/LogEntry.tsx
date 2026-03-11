interface LogEntryProps {
  date: string;
  title: string;
  body: string;
  tags?: string[];
}

export default function LogEntry({ date, title, body, tags }: LogEntryProps) {
  return (
    <article className="rounded-2xl border-l-4 border-l-[var(--gold)] bg-white p-6 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        {date}
      </div>
      <h3 className="mt-2 text-base font-bold text-[var(--brown)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
      {tags && tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-medium text-[var(--brown-light)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
