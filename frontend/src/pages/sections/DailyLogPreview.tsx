import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import apiClient from '../../api/client';
import LogEntry from '../../components/LogEntry';

interface LogItem {
  _id: string;
  date: string;
  title: string;
  body: string;
  tags?: string[];
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

  return (
    <section id="daily-log" className="scroll-mt-24 bg-[var(--cream)] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              Daily Log
            </div>
            <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[var(--brown)] sm:text-4xl">
              What's Happening
            </h2>
          </div>
          <NavLink
            to="/page/daily-log"
            className="text-sm font-semibold text-[var(--gold)] transition hover:text-[var(--gold-light)]"
          >
            View All →
          </NavLink>
        </div>

        {loading ? (
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : logs.length > 0 ? (
          <div className="mt-8 space-y-4">
            {logs.slice(0, 3).map((log) => (
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
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[var(--brown)]/8 bg-white p-10 text-center text-sm text-[var(--muted)]">
            No log entries yet.
          </div>
        )}
      </div>
    </section>
  );
}
