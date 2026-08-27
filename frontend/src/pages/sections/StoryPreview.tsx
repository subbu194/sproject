import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import apiClient from '../../api/client';
import OptimizedImage from '../../components/OptimizedImage';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TimelineEntry {
  _id: string;
  year: string;
  title: string;
  description: string;
  images?: string[];
  imageBlurUrls?: string[];
}

export default function StoryPreview() {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const desktopContainerRef = useRef<HTMLDivElement>(null);

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

  const items = timeline.slice(0, 4);

  useGSAP(() => {
    if (loading || items.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const totalItems = items.length;

      if (totalItems <= 1) {
        // Fallback: show only the first item statically
        gsap.set(".desktop-text:not(.item-0)", { opacity: 0, zIndex: 0 });
        gsap.set(".desktop-img:not(.item-0)", { opacity: 0, zIndex: 0 });
        gsap.set(".desktop-text.item-0", { opacity: 1, zIndex: 10 });
        gsap.set(".desktop-img.item-0", { opacity: 1, zIndex: 10 });
        gsap.set(".progress-fill", { height: "100%" });
        return;
      }

      // Reset states initially
      gsap.set(".desktop-text", { zIndex: 0 });
      gsap.set(".desktop-text:not(.item-0) .desktop-text-elem", { opacity: 0, y: 30 });
      
      gsap.set(".desktop-img:not(.item-0)", { opacity: 0, z: -100, rotateX: -10, y: 100, zIndex: 0 });
      
      gsap.set(".desktop-text.item-0", { zIndex: 10 });
      gsap.set(".desktop-text.item-0 .desktop-text-elem", { opacity: 1, y: 0 });
      gsap.set(".desktop-img.item-0", { opacity: 1, z: 0, rotateX: 0, y: 0, scale: 1, zIndex: 10 });
      gsap.set(".progress-fill", { height: "0%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: desktopContainerRef.current,
          start: "top top",
          end: `+=${totalItems * 150}%`, // Increased scroll distance to make progression feel more deliberate
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });

      // Animate progress bar in parallel with the pinned scroll
      gsap.to(".progress-fill", {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: desktopContainerRef.current,
          start: "top top",
          end: `+=${totalItems * 150}%`,
          scrub: true,
        }
      });

      items.forEach((_, i) => {
        if (i !== 0) {
          tl.to({}, { duration: 1 }) // Hold previous item on screen
            
            // Fade out previous
            .to(`.desktop-text.item-${i - 1} .desktop-text-elem`, { opacity: 0, y: -30, duration: 0.5, stagger: 0.1, ease: "power2.in" })
            .to(`.desktop-img.item-${i - 1}`, { opacity: 0, z: -50, rotateX: 10, y: -50, zIndex: 0, duration: 0.8, ease: "power2.inOut" }, "<")
            
            // Set z-indexes
            .set(`.desktop-text.item-${i}`, { zIndex: 10 }, "<0.4")
            .set(`.desktop-img.item-${i}`, { zIndex: 10 }, "<0.4")
            
            // Fade in current
            .to(`.desktop-text.item-${i} .desktop-text-elem`, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "<0.2")
            .to(`.desktop-img.item-${i}`, { opacity: 1, z: 0, rotateX: 0, y: 0, duration: 1, ease: "power3.out" }, "<");
        }
      });

      // Final pause so the last item stays on screen briefly before unpinning
      tl.to({}, { duration: 1 });

    });

    mm.add("(max-width: 1023px)", () => {
      gsap.utils.toArray(".mobile-item").forEach((el: any) => {
        const img = el.querySelector("img");
        
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            }
          }
        );

        if (img) {
          gsap.fromTo(img,
            { y: "-15%", scale: 1.15 },
            {
              y: "15%",
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            }
          );
        }
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [items.length, loading] });

  return (
    <section id="story" ref={sectionRef} className="bg-[var(--cream)]">
      {loading ? (
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="mt-10 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-20 w-full" />
            ))}
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-10 text-center text-sm text-[var(--muted)]">
            Timeline coming soon.
          </div>
        </div>
      ) : (
        <>
          {/* DESKTOP PINNED COMPOSITION */}
          <div ref={desktopContainerRef} className="hidden lg:flex h-[100dvh] w-full overflow-hidden bg-[var(--cream)] relative">
            
            {/* Header Overlay */}
            <div className="absolute top-12 left-12 z-20 xl:top-16 xl:left-16">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
                <span className="inline-block h-px w-6 bg-[var(--gold)]" />
                My Story
              </div>
              <h2 className="mt-3 font-['Playfair_Display'] text-4xl font-bold tracking-tight text-[var(--brown)] xl:text-5xl">
                The journey so far.
              </h2>
            </div>

            <div className="absolute bottom-12 left-12 z-20 xl:bottom-16 xl:left-16">
              <NavLink
                to="/page/story"
                className="group inline-flex items-center gap-2 rounded-full border border-[var(--brown)]/20 px-6 py-3 text-sm font-semibold text-[var(--brown)] transition hover:bg-[var(--brown)] hover:text-[var(--cream)]"
              >
                View Full Story
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </NavLink>
            </div>

            {/* Left Side: Progress & Text */}
            <div className="relative flex w-1/2 flex-col justify-center pl-12 pr-16 xl:pl-16 xl:pr-24">
              {/* Progress Bar */}
              <div className="absolute left-12 xl:left-16 top-1/2 h-[40vh] w-[2px] -translate-y-1/2 bg-[var(--brown)]/10 rounded-full">
                <div className="progress-fill w-full bg-gradient-to-b from-[var(--gold)] to-[var(--gold-light)] h-0 relative rounded-full">
                  <div className="absolute -bottom-1.5 -left-[5px] h-[12px] w-[12px] rounded-full bg-white shadow-[0_0_15px_var(--gold)] border-[2px] border-[var(--gold)] z-10" />
                </div>
              </div>

              {/* Text Items */}
              <div className="relative ml-8 xl:ml-12 h-[300px] w-full">
                {items.map((entry, i) => (
                  <div key={entry._id} className={`desktop-text item-${i} absolute top-1/2 flex w-full -translate-y-1/2 flex-col`}>
                    <div className="desktop-text-elem text-sm font-semibold uppercase tracking-widest text-[var(--gold)]">
                      {entry.year}
                    </div>
                    <h3 className="desktop-text-elem mt-4 font-['Playfair_Display'] text-3xl font-bold leading-tight text-[var(--brown)] xl:text-4xl">
                      {entry.title}
                    </h3>
                    <p className="desktop-text-elem mt-6 max-w-md text-base leading-relaxed text-[var(--muted)] xl:text-lg">
                      {entry.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Visuals */}
            <div className="relative flex w-1/2 items-center justify-center p-12 xl:p-16" style={{ perspective: "1000px" }}>
              <div className="relative h-full max-h-[70vh] w-full max-w-[600px]" style={{ transformStyle: "preserve-3d" }}>
                {items.map((entry, i) => (
                  <div key={entry._id} className={`desktop-img item-${i} absolute inset-0 overflow-hidden rounded-2xl shadow-2xl shadow-[var(--brown)]/15 border border-[var(--gold)]/20 bg-white/30 backdrop-blur-sm p-2`}>
                    <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <OptimizedImage
                      src={entry.images && entry.images.length > 0 ? entry.images[0] : "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"}
                      blurSrc={entry.imageBlurUrls?.[0]}
                      alt={entry.title}
                      fit="cover"
                      loading={i === 0 ? "eager" : "lazy"}
                      imgClassName="h-full w-full object-cover"
                    />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MOBILE & TABLET COMPOSITION */}
          <div className="lg:hidden mx-auto max-w-7xl px-6 py-20">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
                <span className="inline-block h-px w-6 bg-[var(--gold)]" />
                My Story
              </div>
              <h2 className="mt-3 font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[var(--brown)] sm:text-4xl">
                The journey so far.
              </h2>
            </div>

            <div className="flex flex-col gap-12 sm:gap-16">
              {items.map((entry) => (
                <div key={entry._id} className="mobile-item flex flex-col gap-6">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-sm sm:aspect-[16/9]">
                    <OptimizedImage
                      src={entry.images && entry.images.length > 0 ? entry.images[0] : "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"}
                      blurSrc={entry.imageBlurUrls?.[0]}
                      alt={entry.title}
                      fit="cover"
                      loading="lazy"
                      imgClassName="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
                      {entry.year}
                    </div>
                    <h3 className="mt-2 font-['Playfair_Display'] text-2xl font-bold leading-tight text-[var(--brown)]">
                      {entry.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                      {entry.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center sm:text-left">
              <NavLink
                to="/page/story"
                className="group inline-flex items-center gap-2 rounded-full border border-[var(--brown)]/20 px-6 py-3 text-sm font-semibold text-[var(--brown)] transition hover:bg-[var(--brown)] hover:text-[var(--cream)]"
              >
                View Full Story
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </NavLink>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
