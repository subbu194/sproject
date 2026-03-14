import { useEffect, useState, useMemo } from 'react';
import apiClient from '../api/client';
import SectionPageShell from '../components/SectionPageShell';
import LogEntry from '../components/LogEntry';
import CalendarWidget from '../components/CalendarWidget';
import TagFilter from '../components/TagFilter';

interface LogItem {
  _id: string;
  date: string;
  title: string;
  body: string;
  tags?: string[];
  images?: string[];
}

export default function DailyLog() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('');

  useEffect(() => {
    const url = activeTag ? `/log?tag=${encodeURIComponent(activeTag)}` : '/log';
    setLoading(true);
    apiClient
      .get(url)
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setLogs(Array.isArray(data) ? data : []);
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [activeTag]);

  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    apiClient
      .get('/log/tags')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setAllTags(Array.isArray(data) ? data : []);
      })
      .catch(() => setAllTags([]));
  }, []);

  const entryDates = useMemo(() => logs.map((l) => l.date), [logs]);

  return (
    <SectionPageShell
      kicker="Daily Log"
      title="What's Happening"
      subtitle="A running log of activities, updates, and progress."
    >
      {loading && logs.length === 0 ? (
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="space-y-4">
            <div className="skeleton h-64 w-full rounded-2xl" />
            <div className="skeleton h-12 w-full rounded-2xl" />
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
            {allTags.length > 0 && (
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Filter by Tag
                </h3>
                <TagFilter tags={allTags} activeTag={activeTag} onSelect={setActiveTag} />
              </div>
            )}
          </div>

          {/* Feed */}
          <div className="space-y-4">
            {logs.length > 0 ? (
              logs.map((log) => (
                <LogEntry
                  key={log._id}
                  date={new Date(log.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  title={log.title}
                  body={log.body}
                  tags={log.tags}
                  images={log.images}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-10 text-center text-sm text-[var(--muted)]">
                {activeTag ? `No entries tagged "${activeTag}".` : 'No log entries yet.'}
              </div>
            )}
          </div>
        </div>
      )}
    </SectionPageShell>
  );
}
