import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import SectionPageShell from '../components/SectionPageShell';
import TimelineItem from '../components/TimelineItem';

interface TimelineEntry {
  _id: string;
  year: string;
  title: string;
  description: string;
  images?: string[];
  imageBlurUrls?: string[];
}

export default function Story() {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/story/timeline')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        let parsedData = Array.isArray(data) ? [...data] : [];
        parsedData.sort((a, b) => {
          const yearA = a.year.match(/\d{4}/);
          const yearB = b.year.match(/\d{4}/);
          const valA = yearA ? parseInt(yearA[0], 10) : 0;
          const valB = yearB ? parseInt(yearB[0], 10) : 0;
          if (valA !== valB) return valB - valA;
          return b.year.localeCompare(a.year);
        });
        setTimeline(parsedData);
      })
      .catch(() => setTimeline([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SectionPageShell
      kicker="My Story"
      title="The Journey So Far"
      subtitle="A look at the path that shaped who I am and what I do."
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-20 w-full" />
          ))}
        </div>
      ) : (
        <div>
          {timeline.length > 0 ? (
            timeline.map((entry, i) => (
              <TimelineItem
                key={entry._id}
                year={entry.year}
                title={entry.title}
                description={entry.description}
                isLast={i === timeline.length - 1}
                images={entry.images}
                imageBlurUrls={entry.imageBlurUrls}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-10 text-center text-sm text-[var(--muted)]">
              Timeline coming soon.
            </div>
          )}
        </div>
      )}
    </SectionPageShell>
  );
}
