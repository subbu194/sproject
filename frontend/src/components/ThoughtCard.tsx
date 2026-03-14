interface ThoughtCardProps {
  topic: string;
  title: string;
  summary: string;
  images?: string[];
}

export default function ThoughtCard({ topic, title, summary, images }: ThoughtCardProps) {
  return (
    <article className="group rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)] hover:shadow-md overflow-hidden">
      {images && images.length > 0 && (
        <div className="-mx-6 -mt-6 mb-5 aspect-video overflow-hidden">
          <img src={images[0]} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        </div>
      )}
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
        {topic}
      </div>
      <h3 className="mt-3 font-['Playfair_Display'] text-lg font-bold text-[var(--brown)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{summary}</p>
      {images && images.length > 1 && (
        <div className="mt-4 flex gap-2">
          {images.slice(1, 4).map((img, i) => (
            <div key={i} className="h-12 w-12 overflow-hidden rounded-lg border border-[var(--brown)]/8">
              <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
          ))}
          {images.length > 4 && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--brown)]/5 text-xs font-bold text-[var(--muted)]">
              +{images.length - 4}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
