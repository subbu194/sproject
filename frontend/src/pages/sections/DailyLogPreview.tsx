import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import apiClient from '../../api/client';
import LogEntry from '../../components/LogEntry';
import { DEMO_LOGS, LOG_IMAGES } from '../../constants/placeholders';

interface LogItem {
  _id: string;
  date: string;
  title: string;
  body: string;
  tags?: string[];
  images?: string[];
}

export default function DailyLogPreview() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/log')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setLogs(Array.isArray(data) ? data : []);
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  const items = logs.length > 0
    ? logs.slice(0, 3).map((log, i) => ({
        ...log,
        images: log.images && log.images.length > 0 ? log.images : [LOG_IMAGES[i % LOG_IMAGES.length]],
      }))
    : DEMO_LOGS;

  return (
    <section id="daily-log" className="scroll-mt-24 bg-[var(--warm-white)] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              <span className="inline-block h-px w-6 bg-[var(--gold)]" />
              Daily Log
            </div>
            <h2 className="mt-3 font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[var(--brown)] sm:text-4xl">
              What's Happening
            </h2>
          </div>
          <NavLink
            to="/page/daily-log"
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
            {items.map((log) => (
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
                readMoreLink="/page/daily-log"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
