interface AchievementCardProps {
  icon?: string;
  title: string;
  description: string;
  year: string;
  images?: string[];
}

export default function AchievementCard({ icon, title, description, year, images }: AchievementCardProps) {
  return (
    <article className="group rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-6 shadow-sm transition-all duration-300 hover:border-[var(--gold)] overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] text-xl text-white shadow-sm">
          {icon || '🏆'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-['Playfair_Display'] text-lg font-bold text-[var(--brown)]">
            {title}
          </h3>
          <div className="mt-1 text-sm font-semibold text-[var(--gold)]">{year}</div>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
      {images && images.length > 0 && (
        <div className="mt-4 grid gap-2 grid-cols-3">
          {images.slice(0, 3).map((img, i) => (
            <div key={i} className="aspect-video overflow-hidden rounded-lg border border-[var(--brown)]/8">
              <img src={img} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
