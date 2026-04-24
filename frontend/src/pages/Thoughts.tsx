import { useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import apiClient from '../api/client';
import SectionPageShell from '../components/SectionPageShell';
import OptimizedImage from '../components/OptimizedImage';
import CalendarWidget from '../components/CalendarWidget';
import { Lightbulb, Tag } from 'lucide-react';

interface Thought {
  _id: string;
  topic: string;
  title: string;
  summary: string;
  images?: string[];
  imageBlurUrls?: string[];
  createdAt?: string;
}

function ThoughtCard({ t, index }: { t: Thought; index: number }) {
  const hasImage = t.images && t.images.length > 0;

  return (
    <NavLink
      to={`/page/thoughts/${t._id}`}
      className="block group animate-fade-up relative overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer"
      style={{
        backgroundColor: 'white',
        border: '1px solid rgba(44,26,14,0.07)',
        boxShadow: '0 2px 12px rgba(44,26,14,0.04)',
        animationDelay: `${index * 0.06}s`,
        textDecoration: 'none',
      }}
    >
      {/* Hero image */}
      {hasImage && (
        <div className="relative aspect-video w-full overflow-hidden">
          <OptimizedImage
            src={t.images![0]}
            blurSrc={t.imageBlurUrls?.[0]}
            alt={t.title}
            fit="cover"
            loading="lazy"
            imgClassName="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
          {/* gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(44,26,14,0.4) 0%, transparent 60%)' }}
          />
          {/* Topic badge over image */}
          <span
            className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white"
            style={{ background: 'rgba(200,150,42,0.85)', backdropFilter: 'blur(4px)' }}
          >
            <Tag className="h-2.5 w-2.5" />
            {t.topic}
          </span>
        </div>
      )}

      <div className="p-6">
        {/* Topic badge (no image) */}
        {!hasImage && (
          <span
            className="mb-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]"
            style={{
              backgroundColor: 'rgba(200,150,42,0.08)',
              color: 'var(--gold)',
              border: '1px solid rgba(200,150,42,0.2)',
            }}
          >
            <Tag className="h-2.5 w-2.5" />
            {t.topic}
          </span>
        )}

        {/* Date */}
        {t.createdAt && (
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            {new Date(t.createdAt).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        )}

        {/* Title */}
        <h3
          className="font-bold leading-snug transition-colors duration-200 group-hover:text-[var(--gold)]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.1rem',
            color: 'var(--brown)',
          }}
        >
          {t.title}
        </h3>

        {/* Summary */}
        <p className="mt-3 text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--muted)' }}>
          {t.summary}
        </p>

        {/* Extra images grid */}
        {t.images && t.images.length > 1 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {t.images.slice(1, 4).map((img, i) => (
              <div
                key={i + 1}
                className="aspect-square overflow-hidden rounded-xl border transition-all duration-300 hover:border-[var(--gold)]/50"
                style={{ borderColor: 'rgba(44,26,14,0.08)' }}
              >
                <OptimizedImage
                  src={img}
                  blurSrc={t.imageBlurUrls?.[i + 1]}
                  alt=""
                  fit="cover"
                  loading="lazy"
                  imgClassName="h-full w-full transition-transform duration-500 hover:scale-110"
                />
              </div>
            ))}
          </div>
        )}
        {t.images && t.images.length > 4 && (
          <p className="mt-2 text-right text-xs font-bold" style={{ color: 'var(--gold)' }}>
            +{t.images.length - 4} more
          </p>
        )}
      </div>

      {/* Gold bottom accent on hover */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full transition-all duration-500 group-hover:w-full"
        style={{ background: 'linear-gradient(90deg, var(--gold), var(--gold-light))' }}
      />
    </NavLink>
  );
}

export default function Thoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/thoughts')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setThoughts(Array.isArray(data) ? data : []);
      })
      .catch(() => setThoughts([]))
      .finally(() => setLoading(false));
  }, []);

  const entryDates = useMemo(
    () => thoughts.filter((t) => t.createdAt).map((t) => t.createdAt as string),
    [thoughts],
  );

  return (
    <SectionPageShell
      kicker="Thoughts"
      title="Insights & Ideas"
      subtitle="Reflections, lessons, and observations from the journey."
    >
      {loading && thoughts.length === 0 ? (
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div>
            <div className="skeleton h-64 w-full rounded-2xl" />
          </div>
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-36 w-full rounded-3xl" />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <div className="space-y-6">
            <CalendarWidget entryDates={entryDates} />
          </div>

          {/* Feed */}
          <div>
            {thoughts.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
                {thoughts.map((t, i) => (
                  <ThoughtCard key={t._id} t={t} index={i} />
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
                <Lightbulb className="mb-4 h-12 w-12" style={{ color: 'rgba(200,150,42,0.3)' }} />
                <p className="font-bold" style={{ color: 'var(--muted)' }}>
                  No thoughts published yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </SectionPageShell>
  );
}
