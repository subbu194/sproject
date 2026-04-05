import { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  imageBlurUrls?: string[];
}

export default function DailyLog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [allLogs, setAllLogs] = useState<LogItem[]>([]); // All logs for calendar
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState(searchParams.get('tag') || '');
  const logRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleTagSelect = (tag: string) => {
    setLoading(true);
    setActiveTag(tag);
    if (tag) {
      setSearchParams({ tag });
    } else {
      setSearchParams({});
    }
  };

  const handleDateSelect = (date: Date) => {
    // Find log entry for this date and scroll to it
    const dateStr = date.toISOString().split('T')[0];
    const matchingLog = logs.find((log) => {
      const logDate = new Date(log.date).toISOString().split('T')[0];
      return logDate === dateStr;
    });
    if (matchingLog) {
      const element = logRefs.current.get(matchingLog._id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-[var(--gold)]');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-[var(--gold)]');
        }, 2000);
      }
    }
  };

  useEffect(() => {
    const url = activeTag ? `/log?tag=${encodeURIComponent(activeTag)}` : '/log';
    apiClient
      .get(url)
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setLogs(Array.isArray(data) ? data : []);
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [activeTag]);

  // Fetch all logs for calendar (without tag filter)
  useEffect(() => {
    apiClient
      .get('/log')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setAllLogs(Array.isArray(data) ? data : []);
      })
      .catch(() => setAllLogs([]));
  }, []);

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

  // Use all logs for calendar dates
  const entryDates = useMemo(() => allLogs.map((l) => l.date), [allLogs]);

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
            <CalendarWidget entryDates={entryDates} onDateSelect={handleDateSelect} />
            {allTags.length > 0 && (
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Filter by Tag
                </h3>
                <TagFilter tags={allTags} activeTag={activeTag} onSelect={handleTagSelect} />
              </div>
            )}
          </div>

          {/* Feed */}
          <div className="space-y-4">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div 
                  key={log._id} 
                  ref={(el) => { if (el) logRefs.current.set(log._id, el); }}
                  className="transition-all duration-300"
                >
                  <LogEntry
                    id={log._id}
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
                    imageBlurUrls={log.imageBlurUrls}
                  />
                </div>
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
