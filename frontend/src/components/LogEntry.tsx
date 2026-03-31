import { NavLink } from 'react-router-dom';

interface LogEntryProps {
  date: string;
  title: string;
  body: string;
  tags?: string[];
  images?: string[];
  readMoreLink?: string;
}

export default function LogEntry({ date, title, body, tags, images, readMoreLink }: LogEntryProps) {
  const isLong = body.length > 200;
  const shouldTruncate = isLong && !!readMoreLink;

  return (
    <article className="group rounded-2xl border border-[var(--brown)]/8 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[var(--gold)]/30 hover:shadow-md relative overflow-hidden">
      {/* Gold accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--gold)] to-[var(--gold-light)] rounded-l-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

      <div className="pl-3">
        {images && images.length > 0 && (
          <div className="float-left mr-5 mb-3 w-96 h-64 overflow-hidden rounded-xl border border-[var(--brown)]/8">
            <img src={images[0]} alt="" className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
          </div>
        )}
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          {date}
        </div>
        <h3 className="mt-2 text-base font-bold text-[var(--brown)] transition-colors group-hover:text-[var(--brown-light)]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {shouldTruncate ? body.slice(0, 200) + '...' : body}
        </p>
        {shouldTruncate && (
          <NavLink
            to={readMoreLink}
            className="mt-2 inline-block text-xs font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
          >
            Read More →
          </NavLink>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-medium text-[var(--brown-light)] transition-colors hover:bg-[var(--gold)]/10 hover:text-[var(--gold)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="clear-both" />
      </div>
    </article>
  );
}
