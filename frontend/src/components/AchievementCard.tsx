import { NavLink } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

interface AchievementCardProps {
  icon?: string;
  title: string;
  description: string;
  year: string;
  images?: string[];
  imageBlurUrls?: string[];
  readMoreLink?: string;
}

export default function AchievementCard({
  icon,
  title,
  description,
  year,
  images,
  imageBlurUrls,
  readMoreLink,
}: AchievementCardProps) {
  const isLong = description.length > 200;
  const shouldTruncate = isLong && !!readMoreLink;

  return (
    <article className="group rounded-2xl border border-[var(--brown)]/8 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[var(--gold)]/30 hover:shadow-md relative overflow-hidden">
      {/* Gold accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--gold)] to-[var(--gold-light)] rounded-l-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

      <div className="pl-3">
        {images && images.length > 0 && (
          <div className="float-left mr-5 mb-3 w-96 h-64 overflow-hidden rounded-xl border border-[var(--brown)]/8">
            <OptimizedImage
              src={images[0]}
              blurSrc={imageBlurUrls?.[0]}
              alt=""
              fit="cover"
              loading="lazy"
              imgClassName="h-full w-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] flex items-center gap-2">
          {icon && <span className="text-base">{icon}</span>}
          {year}
        </div>
        <h3 className="mt-2 text-base font-bold text-[var(--brown)] transition-colors group-hover:text-[var(--brown-light)]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {shouldTruncate ? description.slice(0, 200) + '...' : description}
        </p>
        {shouldTruncate && (
          <NavLink
            to={readMoreLink}
            className="mt-2 inline-block text-xs font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
          >
            Read More →
          </NavLink>
        )}
        <div className="clear-both" />
      </div>
    </article>
  );
}
