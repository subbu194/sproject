import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import apiClient from '../../api/client';
import ThoughtCard from '../../components/ThoughtCard';

interface Thought {
  _id: string;
  topic: string;
  title: string;
  summary: string;
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

  return (
    <section id="thoughts" className="scroll-mt-24 bg-[var(--warm-white)] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              Thoughts
            </div>
            <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[var(--brown)] sm:text-4xl">
              Insights & Ideas
            </h2>
          </div>
          <NavLink
            to="/page/thoughts"
            className="text-sm font-semibold text-[var(--gold)] transition hover:text-[var(--gold-light)]"
          >
            View All →
          </NavLink>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-40 w-full rounded-2xl" />
            ))}
          </div>
        ) : thoughts.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {thoughts.slice(0, 3).map((t) => (
              <ThoughtCard key={t._id} topic={t.topic} title={t.title} summary={t.summary} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-10 text-center text-sm text-[var(--muted)]">
            No thoughts published yet.
          </div>
        )}
      </div>
    </section>
  );
}
