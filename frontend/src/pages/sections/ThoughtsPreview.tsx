import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import apiClient from '../../api/client';
import LogEntry from '../../components/LogEntry';
import { DEMO_THOUGHTS, THOUGHT_IMAGES } from '../../constants/placeholders';

interface Thought {
  _id: string;
  topic: string;
  title: string;
  summary: string;
  images?: string[];
  imageBlurUrls?: string[];
  createdAt?: string;
}

export default function ThoughtsPreview() {
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

  const items: Thought[] = thoughts.length > 0
    ? thoughts.slice(0, 3).map((t, i) => ({
        ...t,
        images: t.images && t.images.length > 0 ? t.images : [THOUGHT_IMAGES[i % THOUGHT_IMAGES.length]],
      }))
    : DEMO_THOUGHTS as Thought[];

  return (
    <section id="thoughts" className="scroll-mt-24 bg-[var(--warm-white)] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              <span className="inline-block h-px w-6 bg-[var(--gold)]" />
              Thoughts
            </div>
            <h2 className="mt-3 font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[var(--brown)] sm:text-4xl">
              Insights & Ideas
            </h2>
          </div>
          <NavLink
            to="/page/thoughts"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--gold)] transition hover:text-[var(--gold-light)]"
          >
            View All
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </NavLink>
        </div>

        {loading ? (
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((t) => (
              <LogEntry
                key={t._id}
                date={t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : t.topic}
                title={t.title}
                body={t.summary}
                tags={[t.topic]}
                images={t.images}
                imageBlurUrls={t.imageBlurUrls}
                readMoreLink="/page/thoughts"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
