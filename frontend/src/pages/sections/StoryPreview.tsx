import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import apiClient from '../../api/client';
import TimelineItem from '../../components/TimelineItem';

interface TimelineEntry {
  _id: string;
  year: string;
  title: string;
  description: string;
}

export default function StoryPreview() {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/story/timeline')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setTimeline(Array.isArray(data) ? data : []);
      })
      .catch(() => setTimeline([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="story" className="scroll-mt-24 bg-[var(--cream)] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              My Story
            </div>
            <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[var(--brown)] sm:text-4xl">
              The journey so far.
            </h2>
          </div>
          <NavLink
            to="/page/story"
            className="text-sm font-semibold text-[var(--gold)] transition hover:text-[var(--gold-light)]"
          >
            View Full Story →
          </NavLink>
        </div>

        {loading ? (
          <div className="mt-10 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-20 w-full" />
            ))}
          </div>
        ) : (
          <div className="mt-10">
            {timeline.length > 0 ? (
              timeline.slice(0, 4).map((entry, i) => (
                <TimelineItem
                  key={entry._id}
                  year={entry.year}
                  title={entry.title}
                  description={entry.description}
                  isLast={i === Math.min(timeline.length, 4) - 1}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-[var(--brown)]/8 bg-white p-8 text-center text-sm text-[var(--muted)]">
                Timeline coming soon.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
