import { useEffect, useState, useMemo } from 'react';
import apiClient from '../api/client';
import SectionPageShell from '../components/SectionPageShell';
import LogEntry from '../components/LogEntry';
import CalendarWidget from '../components/CalendarWidget';

interface Thought {
  _id: string;
  topic: string;
  title: string;
  summary: string;
  images?: string[];
  createdAt?: string;
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
          <div className="space-y-4">
            <div className="skeleton h-64 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-28 w-full rounded-2xl" />
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
          <div className="space-y-4">
            {thoughts.length > 0 ? (
              thoughts.map((t) => (
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
                />
              ))
            ) : (
              <div className="rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-10 text-center text-sm text-[var(--muted)]">
                No thoughts published yet.
              </div>
            )}
          </div>
        </div>
      )}
    </SectionPageShell>
  );
}
