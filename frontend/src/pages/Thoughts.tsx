import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import SectionPageShell from '../components/SectionPageShell';
import ThoughtCard from '../components/ThoughtCard';

interface Thought {
  _id: string;
  topic: string;
  title: string;
  summary: string;
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

  return (
    <SectionPageShell
      kicker="Thoughts"
      title="Insights & Ideas"
      subtitle="Reflections, lessons, and observations from the journey."
    >
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : thoughts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {thoughts.map((t) => (
            <ThoughtCard key={t._id} topic={t.topic} title={t.title} summary={t.summary} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-10 text-center text-sm text-[var(--muted)]">
          No thoughts published yet.
        </div>
      )}
    </SectionPageShell>
  );
}
