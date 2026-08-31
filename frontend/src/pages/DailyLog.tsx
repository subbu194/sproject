import { useEffect, useState, useMemo, useRef } from 'react';
import apiClient from '../api/client';
import LogEntry from '../components/LogEntry';
import CalendarWidget from '../components/CalendarWidget';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOG_IMAGES } from '../constants/placeholders';

gsap.registerPlugin(ScrollTrigger);

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
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [allLogs, setAllLogs] = useState<LogItem[]>([]); // All logs for calendar
  const [loading, setLoading] = useState(true);
  const logRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const mainRef = useRef<HTMLDivElement>(null);

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
        // Add some offset for the sticky header if any, else center
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        // Highlight animation
        gsap.fromTo(element, 
          { boxShadow: "0 0 0 4px var(--gold)" }, 
          { boxShadow: "0 0 0 0px var(--gold)", duration: 2, ease: "power2.out" }
        );
      }
    }
  };

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

  // Use all logs for calendar dates
  const entryDates = useMemo(() => allLogs.map((l) => l.date), [allLogs]);

  useGSAP(() => {
    if (loading || logs.length === 0) return;
    
    // Animate cards on scroll
    gsap.utils.toArray<HTMLElement>('.log-card-reveal').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            toggleActions: "play none none none"
          },
          delay: i < 4 ? i * 0.15 : 0 // Stagger the first few cards on load
        }
      );
    });
  }, [loading, logs.length]);

  return (
    <div ref={mainRef} className="min-h-screen bg-[var(--warm-white)] pt-24 lg:pt-32 pb-24">
      {/* Bespoke Hero Section */}
      <section className="relative px-6 pb-16 lg:pb-24 max-w-7xl mx-auto">
        
        <div className="relative z-10 flex flex-col items-start text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)] shadow-sm backdrop-blur-md mb-6 ring-1 ring-black/5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--gold)] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--gold)]"></span>
            </span>
            Live Updates
          </div>
          <h1 className="font-['Playfair_Display'] text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--brown)] mb-6">
            Daily Log
          </h1>
          <p className="text-lg text-[var(--muted)] leading-relaxed font-medium">
            A running archive of day-to-day activities, sudden inspirations, progress, and continuous growth.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-6 max-w-7xl mx-auto relative z-10">
        {loading && logs.length === 0 ? (
          <div className="grid gap-10 lg:grid-cols-[320px_1fr] items-start">
            <div className="skeleton h-[400px] w-full rounded-[2rem]" />
            <div className="columns-1 md:columns-2 gap-8 space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-[460px] w-full rounded-[2rem] break-inside-avoid" />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[320px_1fr] items-start">
            {/* Sticky Sidebar */}
            <div className="hidden lg:block lg:sticky lg:top-32 space-y-8">
              <CalendarWidget entryDates={entryDates} onDateSelect={handleDateSelect} />
              
              <div className="hidden lg:block rounded-[2rem] border-2 border-dashed border-[var(--gold)]/20 bg-gradient-to-b from-white/40 to-transparent p-8 text-center backdrop-blur-xl">
                 <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[var(--brown)] mb-3">Total Logs</h3>
                 <div className="text-5xl font-black text-[var(--gold)] drop-shadow-sm">{logs.length}</div>
                 <div className="mt-4 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Entries Archived</div>
              </div>
            </div>

            {/* Premium Masonry Feed */}
            <div className="columns-1 md:columns-2 gap-8 space-y-8">
              {logs.length > 0 ? (
                logs.map((log, i) => {
                  const fallbackImage = LOG_IMAGES[i % LOG_IMAGES.length];
                  return (
                    <div 
                      key={log._id} 
                      ref={(el) => { if (el) logRefs.current.set(log._id, el); }}
                      className="log-card-reveal break-inside-avoid inline-block w-full rounded-[2rem]"
                    >
                      {/* Forcing style updates to the card variant so it spans 100% width of the masonry column */}
                      <div className="[&>article]:!w-full [&>article]:!h-auto [&>a]:!w-full [&>a]:!h-auto">
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
                          images={log.images && log.images.length > 0 ? log.images : [fallbackImage]}
                          imageBlurUrls={log.imageBlurUrls}
                          variant="card"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 rounded-[2rem] border-2 border-dashed border-[var(--brown)]/10 bg-white/50 p-16 text-center text-[var(--muted)] backdrop-blur-md">
                  <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[var(--brown)] mb-2">It's Quiet Here</h3>
                  <p>No log entries have been published yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
