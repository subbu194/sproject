import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import apiClient from '../api/client';
import SectionPageShell from '../components/SectionPageShell';
import OptimizedImage from '../components/OptimizedImage';
import { Trophy } from 'lucide-react';

interface Achievement {
  _id: string;
  icon?: string;
  title: string;
  description: string;
  year: string;
  images?: string[];
  imageBlurUrls?: string[];
}

function AchievementItem({ a, index }: { a: Achievement; index: number }) {
  const hasImage = a.images && a.images.length > 0;

  return (
    <NavLink
      to={`/page/achievements/${a._id}`}
      className="block group animate-fade-up relative flex flex-col gap-6 overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:flex-row"
      style={{
        backgroundColor: 'white',
        border: '1px solid rgba(44,26,14,0.07)',
        boxShadow: '0 2px 12px rgba(44,26,14,0.04)',
        animationDelay: `${index * 0.08}s`,
        textDecoration: 'none',
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl transition-all duration-300 group-hover:w-1.5"
        style={{ background: 'linear-gradient(to bottom, var(--gold), var(--gold-light))' }}
      />

      {/* Icon / image */}
      <div className="flex shrink-0 items-start gap-5 pl-3">
        <div
          className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-4xl transition-transform duration-300 group-hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, rgba(200,150,42,0.08) 0%, rgba(232,184,75,0.12) 100%)',
            border: '1px solid rgba(200,150,42,0.2)',
            boxShadow: '0 4px 16px rgba(200,150,42,0.1)',
          }}
        >
          {a.icon || '🏆'}
          {/* Year badge */}
          <div
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white"
            style={{ background: 'linear-gradient(90deg, var(--gold), var(--gold-light))' }}
          >
            {a.year}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col pl-3">
        <h3
          className="text-xl font-bold leading-tight transition-colors duration-200 group-hover:text-[var(--gold)]"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}
        >
          {a.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          {a.description}
        </p>

        {/* Gallery */}
        {hasImage && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {a.images!.slice(0, 3).map((img, i) => (
              <div
                key={i}
                className="aspect-video overflow-hidden rounded-xl border transition-all duration-300 hover:border-[var(--gold)]/40"
                style={{ borderColor: 'rgba(44,26,14,0.08)' }}
              >
                <OptimizedImage
                  src={img}
                  blurSrc={a.imageBlurUrls?.[i]}
                  alt=""
                  fit="cover"
                  loading="lazy"
                  imgClassName="h-full w-full transition-transform duration-500 hover:scale-110"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </NavLink>
  );
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/achievements')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setAchievements(Array.isArray(data) ? data : []);
      })
      .catch(() => setAchievements([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SectionPageShell
      kicker="Achievements"
      title="Milestones & Recognition"
      subtitle="Key achievements, awards, and milestones that mark the journey."
    >
      {loading ? (
        <div className="space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-36 w-full rounded-3xl" />
          ))}
        </div>
      ) : achievements.length > 0 ? (
        <div className="space-y-5">
          {achievements.map((a, i) => (
            <AchievementItem key={a._id} a={a} index={i} />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-3xl py-24 text-center"
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '2px dashed rgba(200,150,42,0.2)',
          }}
        >
          <Trophy className="mb-4 h-12 w-12" style={{ color: 'rgba(200,150,42,0.3)' }} />
          <p className="font-bold" style={{ color: 'var(--muted)' }}>
            No achievements listed yet.
          </p>
        </div>
      )}
    </SectionPageShell>
  );
}
