import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import apiClient from '../api/client';
import OptimizedImage from '../components/OptimizedImage';

gsap.registerPlugin(ScrollTrigger);

interface TimelineEntry {
  _id: string;
  year: string;
  title: string;
  description: string;
  images?: string[];
  imageBlurUrls?: string[];
}

function StoryImageGallery({ entry, openLightbox }: { entry: TimelineEntry; openLightbox: (imgs: string[], idx: number) => void }) {
  const [autoIndex, setAutoIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => setIsVisible(e.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!entry.images || entry.images.length <= 1 || !isVisible) return;
    const timer = setInterval(() => {
      setAutoIndex((prev) => (prev + 1) % entry.images!.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [entry.images, isVisible]);

  if (!entry.images || entry.images.length === 0) return null;

  const images = entry.images;
  const total = images.length;
  const maxThumbs = Math.min(3, total - 1);
  const thumbs = Array.from({ length: maxThumbs }, (_, j) => (autoIndex + j + 1) % total);

  return (
    <div ref={containerRef} className="group relative overflow-hidden rounded-2xl shadow-lg shadow-[var(--brown)]/8">
      {/* Clickable overlay hint */}
      <button
        onClick={() => openLightbox(images, autoIndex)}
        className="absolute inset-0 z-10 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="View images"
      >
        <span className="rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm">
          {total > 1 ? `View all ${total} photos` : 'View photo'}
        </span>
      </button>
      <OptimizedImage
        src={images[autoIndex]}
        blurSrc={entry.imageBlurUrls?.[autoIndex]}
        alt={entry.title}
        fit="cover"
        loading="lazy"
        imgClassName="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] cursor-pointer"
      />
      {/* Thumbnail strip bottom-right — all screens */}
      {total > 1 && (
        <div className="absolute bottom-3 right-3 z-20 flex gap-1.5">
          {thumbs.map((idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); openLightbox(images, idx); }}
              className="h-10 w-10 overflow-hidden rounded-lg border-2 border-white/70 shadow-md transition-transform hover:scale-105"
            >
              <OptimizedImage src={images[idx]} blurSrc={entry.imageBlurUrls?.[idx]} alt="" fit="cover" loading="lazy" imgClassName="h-full w-full object-cover" />
            </button>
          ))}
          {total > 4 && (
            <button
              onClick={(e) => { e.stopPropagation(); openLightbox(images, (autoIndex + 4) % total); }}
              className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-white/70 bg-black/60 text-xs font-bold text-white shadow-md backdrop-blur-sm hover:bg-black/80 transition-colors"
            >
              +{total - 4}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Story() {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const travelingDotRef = useRef<HTMLDivElement>(null);
  const timelineAreaRef = useRef<HTMLDivElement>(null);
  const mobileProgressRef = useRef<HTMLDivElement>(null);
  const mobileDotRef = useRef<HTMLDivElement>(null);

  // Lightbox state
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const openLightbox = (images: string[], index: number) => setLightbox({ images, index });
  const closeLightbox = () => setLightbox(null);
  const prevImage = () => setLightbox((lb) => lb ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length } : null);
  const nextImage = () => setLightbox((lb) => lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : null);

  // Close on Escape / arrow keys
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]);

  useEffect(() => {
    apiClient
      .get('/story/timeline')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        const parsedData = Array.isArray(data) ? [...data] : [];
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

  useGSAP(() => {
    if (loading || timeline.length === 0) return;

    // Scroll-reveal panels only (no per-entry dots)
    const entries = gsap.utils.toArray<HTMLElement>('.story-entry');
    entries.forEach((entry) => {
      const imgPanel = entry.querySelector('.entry-img');
      const textPanel = entry.querySelector('.entry-text');
      const isEven = entry.classList.contains('even');

      gsap.fromTo(textPanel,
        { opacity: 0, x: isEven ? 50 : -50 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: entry, start: 'top 82%', toggleActions: 'play none none reverse' },
        }
      );
      if (imgPanel) {
        gsap.fromTo(imgPanel,
          { opacity: 0, x: isEven ? -50 : 50, scale: 0.96 },
          {
            opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: entry, start: 'top 82%', toggleActions: 'play none none reverse' },
          }
        );
      }
    });

    // Progress bar fill
    if (progressBarRef.current && timelineAreaRef.current) {
      gsap.fromTo(progressBarRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineAreaRef.current,
            start: 'top 50%',
            end: 'bottom 70%',
            scrub: 1,
          },
        }
      );
    }

    // Single traveling dot — moves top: 0% → 100% with scroll
    if (travelingDotRef.current && timelineAreaRef.current) {
      gsap.fromTo(travelingDotRef.current,
        { top: '0%' },
        {
          top: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: timelineAreaRef.current,
            start: 'top 50%',
            end: 'bottom 70%',
            scrub: 1,
          },
        }
      );
    }
    // Mobile line + dot (same scrub, left-side)
    if (mobileProgressRef.current && timelineAreaRef.current) {
      gsap.fromTo(mobileProgressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: timelineAreaRef.current, start: 'top 50%', end: 'bottom 70%', scrub: 1 },
        }
      );
    }
    if (mobileDotRef.current && timelineAreaRef.current) {
      gsap.fromTo(mobileDotRef.current,
        { top: '0%' },
        {
          top: '100%', ease: 'none',
          scrollTrigger: { trigger: timelineAreaRef.current, start: 'top 50%', end: 'bottom 70%', scrub: 1 },
        }
      );
    }
  }, { scope: pageRef, dependencies: [loading, timeline.length] });

  return (
    <div ref={pageRef} className="min-h-screen overflow-x-hidden bg-[var(--warm-white)]">

      {/* Compact Hero Header */}
      <div className="relative bg-[var(--cream)] px-6 pb-8 pt-20 sm:pb-10 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,rgba(200,150,42,0.10)_0%,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl">

          {/* Compact title row */}
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
                <span className="inline-block h-px w-5 bg-[var(--gold)]" />
                My Story
              </div>
              <h1 className="font-['Playfair_Display'] text-4xl font-bold tracking-tight text-[var(--brown)] sm:text-5xl lg:text-6xl">
                The Journey <span className="italic text-[var(--gold-light)]">So Far.</span>
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              A look at the path, the people, and the purpose that shaped who I am.
            </p>
          </div>
          <div className="mt-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)]" />
        </div>
      </div>

      {/* Timeline */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
        {loading ? (
          <div className="space-y-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-8 lg:flex-row">
                <div className="skeleton h-64 w-full rounded-3xl lg:w-1/2" />
                <div className="flex w-full flex-col gap-3 lg:w-1/2">
                  <div className="skeleton h-4 w-24 rounded" />
                  <div className="skeleton h-8 w-3/4 rounded" />
                  <div className="skeleton h-24 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : timeline.length === 0 ? (
          <div className="rounded-3xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-16 text-center text-sm text-[var(--muted)]">
            Timeline coming soon.
          </div>
        ) : (
          <div>

            {/* === Lines and entries wrapped in their own relative container === */}
            <div className="relative">
            <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[var(--brown)]/8 lg:block" />
            <div
              ref={progressBarRef}
              style={{ transformOrigin: 'top center' }}
              className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 origin-top bg-gradient-to-b from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)] lg:block"
            />
            {/* Desktop traveling dot — cursor style: 8px gold glow */}
            <div
              ref={travelingDotRef}
              className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 -translate-y-1/2 z-10 lg:block"
              style={{ top: '0%' }}
            >
              <div
                className="h-[8px] w-[8px] rounded-full bg-[var(--gold-light)]"
                style={{ boxShadow: '0 0 15px var(--gold-light), 0 0 30px var(--gold)' }}
              />
            </div>

            {/* === MOBILE LEFT-SIDE LINE === */}
            <div className="pointer-events-none absolute left-4 top-0 h-full w-px bg-[var(--brown)]/8 lg:hidden" />
            <div
              ref={mobileProgressRef}
              style={{ transformOrigin: 'top center' }}
              className="pointer-events-none absolute left-4 top-0 h-full w-[2px] origin-top bg-gradient-to-b from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)] lg:hidden"
            />
            {/* Mobile traveling dot */}
            <div
              ref={mobileDotRef}
              className="pointer-events-none absolute left-4 z-10 -translate-x-1/2 -translate-y-1/2 lg:hidden"
              style={{ top: '0%' }}
            >
              <div
                className="h-[8px] w-[8px] rounded-full bg-[var(--gold-light)]"
                style={{ boxShadow: '0 0 15px var(--gold-light), 0 0 30px var(--gold)' }}
              />
            </div>

            <div ref={timelineAreaRef} className="flex flex-col gap-20 pl-10 lg:gap-28 lg:pl-0">
              {timeline.map((entry, i) => {
                const isEven = i % 2 === 0;
                const hasImage = entry.images && entry.images.length > 0;
                return (
                  <div
                    key={entry._id}
                    className={`story-entry ${isEven ? 'even' : 'odd'} relative flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_56px_1fr] lg:items-center`}
                  >
                    {/* IMAGE PANEL */}
                    <div className={`entry-img w-full ${isEven ? 'lg:pr-8' : 'lg:order-3 lg:pl-8'}`}>
                      {hasImage ? (
                        <StoryImageGallery entry={entry} openLightbox={openLightbox} />
                      ) : (
                        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-[var(--gold)]/10 bg-gradient-to-br from-[var(--cream)] via-[var(--card-bg)] to-[var(--cream)]">
                          <div className="text-center">
                            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)]/10">
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <circle cx="9" cy="9" r="4" fill="#C8962A" opacity="0.7" />
                                <circle cx="9" cy="9" r="8" stroke="#C8962A" strokeWidth="1.5" opacity="0.3" />
                              </svg>
                            </div>
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">{entry.year}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Empty center column — dot is now a global traveler */}
                    <div className="hidden lg:order-2 lg:block" />

                    {/* TEXT PANEL */}
                    <div className={`entry-text w-full ${isEven ? 'lg:order-3 lg:pl-8' : 'lg:order-1 lg:pr-8'}`}>
                      <div className="lg:sticky lg:top-28">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/20 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--gold-light)]/5 px-3.5 py-1">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)]">{entry.year}</span>
                        </div>
                        <h2 className="font-['Playfair_Display'] text-2xl font-bold leading-tight text-[var(--brown)] sm:text-3xl lg:text-4xl">
                          {entry.title}
                        </h2>
                        <div className="mt-3 h-0.5 w-8 rounded-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)]" />
                        <p className="mt-4 text-sm leading-[1.8] text-[var(--muted)] sm:text-base">
                          {entry.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
            {/* End marker — outside the relative line container so line stops here */}
            <div className="mt-20 flex flex-col items-center gap-3 text-center">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] shadow-lg shadow-[var(--gold)]/30">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L8.5 5.5H13L9.5 8L11 12.5L7 10L3 12.5L4.5 8L1 5.5H5.5L7 1Z" fill="white" />
                </svg>
              </div>
              <p className="font-['Playfair_Display'] text-lg font-semibold italic text-[var(--brown)]">The story continues...</p>
              <p className="max-w-xs text-sm text-[var(--muted)]">Every chapter leads to the next.</p>
            </div>
          </div>
        )}
      </div>
      {/* ===== LIGHTBOX MODAL ===== */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Counter */}
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
            {lightbox.index + 1} / {lightbox.images.length}
          </div>

          {/* Prev */}
          {lightbox.images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-6"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative mx-16 max-h-[85vh] max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.images[lightbox.index]}
              alt=""
              className="h-full max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>

          {/* Next */}
          {lightbox.images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-6"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Thumbnail strip */}
          {lightbox.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-2xl bg-black/40 p-2 backdrop-blur-sm">
              {lightbox.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setLightbox((lb) => lb ? { ...lb, index: idx } : null); }}
                  className={`h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${idx === lightbox.index ? 'border-[var(--gold)] opacity-100 scale-105' : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}