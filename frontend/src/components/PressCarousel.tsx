import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import { NavLink } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface PressItem {
  _id: string;
  outlet: string;
  title: string;
  year: string;
  link?: string;
  url?: string;
  images?: string[];
  imageBlurUrls?: string[];
}

interface PressCarouselProps {
  items: PressItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const AUTO_ROTATE_MS = 3000;    // how long each slide stays up, on every platform
const SCROLL_SETTLE_MS = 140;   // debounce after the user stops scrolling/dragging
const DRAG_CLICK_GUARD_PX = 6;  // movement past this cancels the click-through link

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function PressCarousel({ items }: PressCarouselProps) {
  const count = items.length;
  const loop = count > 1;

  // displayItems adds a clone of the last item before, and a clone of the
  // first item after, so the scroller can be scrolled "past the end" and we
  // silently teleport back — giving the illusion of an infinite loop while
  // still using plain native scroll-snap underneath.
  const displayItems = loop ? [items[count - 1], ...items, items[0]] : items;
  const realIndexOf = useCallback(
    (domIdx: number) => (loop ? mod(domIdx - 1, count) : domIdx),
    [loop, count],
  );
  const domIndexOf = useCallback(
    (realIdx: number) => (loop ? realIdx + 1 : realIdx),
    [loop],
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);  // always-fresh copy for use inside intervals
  const [liveText, setLiveText] = useState('');
  const [reducedMotion, setReducedMotion] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Interaction state lives in refs so the autoplay loop can read it without
  // needing to be an effect dependency (which was the root of the old bug).
  const isTouchingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mouse drag state
  const isDraggingRef = useRef(false);
  const mouseStartXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);

  // Autoplay uses a simple "last advance" timestamp. Every time the carousel
  // advances (whether by autoplay, swipe, arrow click, or dot click)
  // this gets set to Date.now(). The autoplay timer only fires when
  // Date.now() - lastAdvanceRef >= AUTO_ROTATE_MS AND no interaction is active.
  // This is intentionally separate from "user activity" — we want autoplay to
  // keep working even if the user moves their mouse over the carousel.
  const lastAdvanceRef = useRef<number>(Date.now());

  // When true, scroll events are from programmatic scrolling (autoplay/navigate)
  // and should NOT be treated as user interaction.
  const isProgrammaticScrollRef = useRef(false);

  // Touch swipe click guard — prevents accidental link open after swiping
  const draggedFarRef = useRef(false);

  // ── respect prefers-reduced-motion, and keep it live if it changes ──
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // ── scroll a given real index to the center of the track ────────────
  const scrollToIndex = useCallback(
    (realIdx: number, behavior: ScrollBehavior = 'smooth') => {
      const scroller = scrollerRef.current;
      const el = itemRefs.current.get(domIndexOf(realIdx));
      if (!scroller || !el) return;
      const left = el.offsetLeft - (scroller.clientWidth - el.clientWidth) / 2;
      scroller.scrollTo({ left, behavior: reducedMotion ? 'auto' : behavior });
    },
    [domIndexOf, reducedMotion],
  );

  // ── center the current item on mount and on resize ──────────────────
  useLayoutEffect(() => {
    scrollToIndex(activeIdx, 'auto');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => scrollToIndex(activeIdx, 'auto'), 100);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx]);

  // ── figure out which card is centered, fix clone teleports ──────────
  const handleScrollSettle = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || count === 0) return;

    const centerX = scroller.scrollLeft + scroller.clientWidth / 2;
    let closestDom = loop ? 1 : 0;
    let closestDist = Infinity;
    itemRefs.current.forEach((el, domIdx) => {
      const c = el.offsetLeft + el.clientWidth / 2;
      const d = Math.abs(c - centerX);
      if (d < closestDist) {
        closestDist = d;
        closestDom = domIdx;
      }
    });

    const lastDomIdx = displayItems.length - 1;
    const realIdx = realIndexOf(closestDom);

    // Landed on a clone at either edge — silently snap back to the real
    // card in the same visual position, no animation, no visible jump.
    if (loop && (closestDom === 0 || closestDom === lastDomIdx)) {
      const targetDom = domIndexOf(realIdx);
      const el = itemRefs.current.get(targetDom);
      if (el) {
        const left = el.offsetLeft - (scroller.clientWidth - el.clientWidth) / 2;
        scroller.scrollTo({ left, behavior: 'auto' });
      }
    }

    setActiveIdx((prev) => {
      if (prev !== realIdx) {
        setLiveText(`Now showing: ${items[realIdx].outlet} — ${items[realIdx].title}`);
        // A user-initiated swipe/scroll landed on a new card — reset the
        // advance timer so autoplay waits a full fresh interval.
        if (!isProgrammaticScrollRef.current) {
          lastAdvanceRef.current = Date.now();
        }
      }
      activeIdxRef.current = realIdx;
      return realIdx;
    });

    // Clear the programmatic scroll flag once scrolling has settled
    isProgrammaticScrollRef.current = false;
  }, [count, loop, displayItems.length, realIndexOf, domIndexOf, items]);

  const handleScroll = useCallback(() => {
    if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    settleTimeoutRef.current = setTimeout(handleScrollSettle, SCROLL_SETTLE_MS);
  }, [handleScrollSettle]);

  // ── programmatic navigation (arrows, dots, keyboard, autoplay) ──────
  const navigate = useCallback(
    (dir: 'next' | 'prev') => {
      if (count <= 1) return;
      // Read from ref so autoplay interval always sees the latest index,
      // even if React hasn't re-rendered since the last setActiveIdx.
      const current = activeIdxRef.current;
      const newIdx = mod(current + (dir === 'next' ? 1 : -1), count);
      setLiveText(`Now showing: ${items[newIdx].outlet} — ${items[newIdx].title}`);
      setActiveIdx(newIdx);
      activeIdxRef.current = newIdx;
      isProgrammaticScrollRef.current = true;
      scrollToIndex(newIdx);
      lastAdvanceRef.current = Date.now();
    },
    [count, items, scrollToIndex],
  );

  const jumpTo = useCallback(
    (realIdx: number) => {
      if (realIdx === activeIdxRef.current) return;
      setLiveText(`Now showing: ${items[realIdx].outlet} — ${items[realIdx].title}`);
      setActiveIdx(realIdx);
      activeIdxRef.current = realIdx;
      isProgrammaticScrollRef.current = true;
      scrollToIndex(realIdx);
      lastAdvanceRef.current = Date.now();
    },
    [items, scrollToIndex],
  );

  // ── autoplay — one persistent interval, works identically on every
  //    platform (desktop, tablet, mobile). Pauses only for genuine
  //    interaction: an active touch or keyboard focus inside the carousel.
  //    Plain mouse hover does NOT pause it. ──────
  useEffect(() => {
    if (count <= 1) return;

    const id = setInterval(() => {
      // Don't auto-advance while user is actively interacting
      if (isTouchingRef.current || isFocusedRef.current || isHoveredRef.current || isDraggingRef.current) return;
      // Only advance once enough time has passed since the last advance
      if (Date.now() - lastAdvanceRef.current >= AUTO_ROTATE_MS) {
        navigate('next');
      }
    }, 250);

    return () => clearInterval(id);
  }, [count, navigate]);

  // ── keyboard ──────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); navigate('prev'); }
      if (e.key === 'ArrowRight') { e.preventDefault(); navigate('next'); }
    },
    [navigate],
  );

  // Guards the click-through link so a touch swipe that ends on top of a
  // card doesn't accidentally open it.
  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    if (draggedFarRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedFarRef.current = false;
    }
  }, []);

  const handleFocusIn = useCallback((e: React.FocusEvent) => { 
    try {
      if ((e.target as Element).matches(':focus-visible')) {
        isFocusedRef.current = true; 
      }
    } catch {
      isFocusedRef.current = true;
    }
  }, []);
  
  const handleFocusOut = useCallback(() => {
    isFocusedRef.current = false;
    lastAdvanceRef.current = Date.now();
  }, []);

  const handleMouseEnter = useCallback(() => { isHoveredRef.current = true; }, []);
  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    lastAdvanceRef.current = Date.now();
  }, []);

  // ── touch swipe — native scroll-snap does the actual card-to-card
  //    movement; we only track touching state (to pause autoplay) and
  //    a drag-guard flag (so a swipe doesn't accidentally fire click). ──
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    isTouchingRef.current = true;
    draggedFarRef.current = false;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const dx = e.touches[0].clientX - touchStartXRef.current;
    const dy = e.touches[0].clientY - touchStartYRef.current;
    if (Math.abs(dx) > DRAG_CLICK_GUARD_PX || Math.abs(dy) > DRAG_CLICK_GUARD_PX) {
      draggedFarRef.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    isTouchingRef.current = false;
    // Reset the advance timer so autoplay waits a full interval after swipe
    lastAdvanceRef.current = Date.now();
  }, []);

  // ── mouse drag implementation ───────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // only left click
    isDraggingRef.current = true;
    draggedFarRef.current = false;
    mouseStartXRef.current = e.pageX;
    if (scrollerRef.current) {
      scrollLeftStartRef.current = scrollerRef.current.scrollLeft;
      scrollerRef.current.style.scrollSnapType = 'none';
      scrollerRef.current.style.cursor = 'grabbing';
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.preventDefault(); // prevent text selection
    const dx = e.pageX - mouseStartXRef.current;
    if (Math.abs(dx) > DRAG_CLICK_GUARD_PX) {
      draggedFarRef.current = true;
    }
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft = scrollLeftStartRef.current - dx;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    lastAdvanceRef.current = Date.now();
    if (scrollerRef.current) {
      scrollerRef.current.style.scrollSnapType = '';
      scrollerRef.current.style.cursor = '';
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = setTimeout(handleScrollSettle, 50);
    }
  }, [handleScrollSettle]);

  const setItemRef = useCallback((domIdx: number) => (el: HTMLDivElement | null) => {
    if (el) itemRefs.current.set(domIdx, el);
    else itemRefs.current.delete(domIdx);
  }, []);

  if (count === 0) return null;

  return (
    <section
      id="press"
      className="scroll-mt-24 py-20 lg:py-28 overflow-hidden"
      aria-label="Press & Media carousel"
      aria-roledescription="carousel"
      onFocusCapture={handleFocusIn}
      onBlurCapture={handleFocusOut}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Section header ──────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 mb-10 sm:mb-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: 'var(--gold)' }}
            >
              <span className="inline-block h-px w-6" style={{ background: 'var(--gold)' }} />
              Press &amp; Media
            </div>
            <h2
              className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}
            >
              In the News
            </h2>
          </div>
          <NavLink
            to="/page/press"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded"
            style={{ color: 'var(--gold)' }}
          >
            View all
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </NavLink>
        </div>
      </div>

      {/* ── Carousel stage ──────────────────────────────────────── */}
      <div className="relative">
        <div
          ref={scrollerRef}
          className={[
            'flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain',
            'px-[11vw] sm:px-[calc((100%-380px)/2)] md:px-[calc((100%-420px)/2)] lg:px-[calc((100%-460px)/2)]',
            'gap-4 sm:gap-6',
            '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          ].join(' ')}
          style={{ touchAction: 'pan-x' }}
          onScroll={handleScroll}
          onClickCapture={handleClickCapture}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {displayItems.map((item, domIdx) => {
            const realIdx = realIndexOf(domIdx);
            const isActive = realIdx === activeIdx;
            const href = item.link || item.url;
            const image = item.images?.[0];

            return (
              <div
                key={`${item._id}-${domIdx}`}
                ref={setItemRef(domIdx)}
                data-dom-idx={domIdx}
                className="shrink-0 snap-center w-[78vw] max-w-[320px] sm:w-[380px] sm:max-w-none md:w-[420px] lg:w-[460px]"
                aria-hidden={domIdx === 0 || domIdx === displayItems.length - 1 ? true : undefined}
              >
                <div
                  className="overflow-hidden rounded-[28px] transition-[transform,opacity,box-shadow] duration-500 ease-out"
                  onClick={() => {
                    if (href && !draggedFarRef.current) window.open(href, '_blank', 'noopener,noreferrer');
                  }}
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    transform: isActive ? 'scale(1)' : 'scale(0.9)',
                    opacity: isActive ? 1 : 0.55,
                    cursor: href ? 'pointer' : 'default',
                    boxShadow: isActive
                      ? '0 20px 45px -12px rgba(44,26,14,0.28)'
                      : '0 8px 20px -8px rgba(44,26,14,0.15)',
                  }}
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    {image ? (
                      <OptimizedImage
                        src={image}
                        blurSrc={item.imageBlurUrls?.[0]}
                        alt={`${item.outlet} — ${item.title}`}
                        fit="cover"
                        loading={isActive ? 'eager' : 'lazy'}
                        fetchPriority={isActive ? 'high' : undefined}
                        imgClassName="h-full w-full pointer-events-none select-none"
                      />
                    ) : (
                      <div
                        className="h-full w-full"
                        style={{ background: 'linear-gradient(135deg, var(--cream), var(--card-bg))' }}
                      />
                    )}
                  </div>

                  <div className="px-6 py-6 sm:px-7 sm:py-7 flex flex-col gap-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>
                        {item.outlet}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>
                        {item.year}
                      </span>
                    </div>

                    <h3
                      className="font-bold leading-snug"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(1.1rem, 1rem + 1vw, 1.5rem)',
                        color: 'var(--brown)',
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Arrow controls — desktop / larger tablets only ─────── */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => navigate('prev')}
              aria-label="Previous press item"
              className="hidden md:flex absolute left-3 lg:left-6 top-[calc(50%-2rem)] -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full transition-transform duration-150 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--brown)', boxShadow: '0 6px 20px rgba(44,26,14,0.18)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => navigate('next')}
              aria-label="Next press item"
              className="hidden md:flex absolute right-3 lg:right-6 top-[calc(50%-2rem)] -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full transition-transform duration-150 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--brown)', boxShadow: '0 6px 20px rgba(44,26,14,0.18)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* ── Progress ────────────────────────────────────────────── */}
      {count > 1 && (
        <div className="mt-10 sm:mt-12 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2.5" role="tablist" aria-label="Press items">
            {items.map((item, i) => (
              <button
                key={item._id}
                type="button"
                role="tab"
                aria-selected={i === activeIdx}
                aria-label={`Go to press item ${i + 1}: ${item.outlet}`}
                onClick={() => jumpTo(i)}
                className="rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  width: i === activeIdx ? '1.75rem' : '0.5rem',
                  height: '0.5rem',
                  background: i === activeIdx ? 'var(--gold)' : 'var(--muted)',
                  opacity: i === activeIdx ? 1 : 0.35,
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            ))}
          </div>
          <span className="text-xs tabular-nums" style={{ color: 'var(--muted)' }}>
            {activeIdx + 1} / {count}
          </span>
        </div>
      )}

      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveText}
      </div>
    </section>
  );
}