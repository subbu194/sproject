interface ThoughtCardProps {
  topic: string;
  title: string;
  summary: string;
  images?: string[];
}

export default function ThoughtCard({ topic, title, summary, images }: ThoughtCardProps) {
  return (
    <article className="group rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)]/40 hover:shadow-lg hover:shadow-[var(--gold)]/5 overflow-hidden">
      {images && images.length > 0 && (
        <div className="-mx-6 -mt-6 mb-5 aspect-video overflow-hidden">
          <img src={images[0]} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        </div>
      )}
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
        {topic}
      </div>
      <h3 className="mt-3 font-['Playfair_Display'] text-lg font-bold text-[var(--brown)] transition-colors group-hover:text-[var(--brown-light)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{summary}</p>
      {images && images.length > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {images.slice(1, 4).map((img, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-xl border border-[var(--brown)]/8 transition-all duration-300 hover:border-[var(--gold)]/40 hover:shadow-md">
              <img src={img} alt="" className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" loading="lazy" />
            </div>
          ))}
        </div>
      )}
      {images && images.length > 4 && (
        <div className="mt-2 text-right text-xs font-semibold text-[var(--gold)]">
          +{images.length - 4} more
        </div>
      )}
    </article>
  );
}
