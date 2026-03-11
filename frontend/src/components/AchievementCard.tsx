interface AchievementCardProps {
  icon?: string;
  title: string;
  description: string;
  year: string;
}

export default function AchievementCard({ icon, title, description, year }: AchievementCardProps) {
  return (
    <article className="group rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-6 shadow-sm transition-all duration-300 hover:border-[var(--gold)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] text-xl text-white shadow-sm">
        {icon || '🏆'}
      </div>
      <h3 className="mt-4 font-['Playfair_Display'] text-lg font-bold text-[var(--brown)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
      <div className="mt-3 text-sm font-semibold text-[var(--gold)]">{year}</div>
    </article>
  );
}
