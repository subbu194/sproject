import { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import {
  HERO_BADGE,
  HERO_DESCRIPTION,
  PRIMARY_CTA_LINK,
} from "../constants/content";
import { ChevronDown } from "lucide-react";

// --- HERO VIDEO CONFIGURATION ---
// Option 1: Local video import
// import LOCAL_VIDEO_URL from "../assets/720p.mp4";

// Option 2: Remote video link
const REMOTE_VIDEO_URL = "https://pub-1087c4416ebe4187b644cf689b486474.r2.dev/wtbi/optimized_video/about-us/Service_Hero/2068b673-f057-45ee-850e-1f4bf963181b/720p.mp4"; // Example link

// Choose which one to use by commenting/uncommenting below:
// const HERO_VIDEO_URL = LOCAL_VIDEO_URL;
const HERO_VIDEO_URL = REMOTE_VIDEO_URL;
// ------------------------------

export default function HeroSection() {
  const container = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Ensure the branding loader shows for at least 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLoadedData = () => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsVideoLoaded(true);
    }
  };

  // Fallback check in case the browser caches the video and fires events before React attaches listeners
  useEffect(() => {
    if (videoRef.current) {
      if (videoRef.current.readyState >= 3) {
        queueMicrotask(() => setIsVideoLoaded(true));
      }
    }
  }, []);

  const isVideoReady = isVideoLoaded && minTimeElapsed;

  // Animate the intro text in when the video is ready
  useGSAP(() => {
    if (isVideoReady) {
      gsap.to(".hero-intro", {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5,
        ease: "power2.out",
      });
    }
  }, [isVideoReady]);

  useGSAP(() => {
    // Set initial states
    gsap.set(".hero-elem", { opacity: 0, y: 30 });
    gsap.set(".hero-title-line", { opacity: 0, y: 60, rotateX: 10 });
    // Note: .hero-desc-char already has 'hidden' class in JSX, so we don't set opacity: 0 here!
    gsap.set(".hero-btn", { opacity: 0, y: 20 }); // Button slides up
    gsap.set(".hero-cursor", { display: "none" }); // Hide the cursor on initial load

    // Scroll-Triggered Native Playback
    let scrollTimeout: ReturnType<typeof setTimeout>;
    let playPromise: Promise<void> | undefined;
    let isIntendedToPlay = false;

    if (!videoRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 300px)", () => {
      // 1. Unified Cinematic Scroll Timeline
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "+=400%", // Slightly increased for the explicit sequence
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (videoRef.current) {
              const video = videoRef.current;

              // Only trigger play if actively scrolling INSIDE the hero section
              if (self.isActive && Math.abs(self.getVelocity()) > 5) {
                isIntendedToPlay = true;

                // If paused and no pending promise, initiate playback
                if (video.paused && !playPromise) {
                  playPromise = video.play();
                  if (playPromise !== undefined) {
                    playPromise.then(() => {
                      playPromise = undefined;
                      // Race condition fix: if scroll stopped before promise resolved, pause now!
                      if (!isIntendedToPlay) video.pause();
                    }).catch(() => {
                      playPromise = undefined;
                    });
                  }
                }

                // Debounce to stop playback
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                  isIntendedToPlay = false;
                  if (!playPromise && !video.paused) video.pause();
                }, 150);

              } else if (!self.isActive) {
                // HARD FAILSAFE: Force pause immediately if user scrolls out of the Hero Section
                isIntendedToPlay = false;
                if (!playPromise && !video.paused) video.pause();
              }
            }
          }
        }
      });

      // Background Video Parallax
      scrollTl.to(".hero-vid-container", { scale: 1.15, transformOrigin: "center center", ease: "none", duration: 12 }, 0)
        .to(".hero-overlay", { opacity: 0.85, ease: "none", duration: 12 }, 0);

      // PHASE 1: Fade out the giant intro text immediately
      scrollTl.fromTo(".hero-intro",
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 1.05, duration: 1, ease: "power2.out", immediateRender: false },
        0
      );

      // PHASE 2: True Typewriter Effect (Top Right)
      // First, reveal the cursor precisely as typing begins
      scrollTl.to(".hero-cursor", { display: "inline-block", duration: 0.01 }, 1);
      // Starts at time 1 (after intro disappears). ~100 chars * 0.05 stagger = 5 seconds of typing
      scrollTl.to(".hero-desc-char", {
        display: "inline", stagger: 0.05, duration: 0.01
      }, 1);

      // PHASE 3: Title & Badge Reveal (Bottom Left)
      // Starts at time 6 (strictly AFTER typing completes)
      scrollTl.to(".hero-title-line", {
        opacity: 1, y: 0, rotateX: 0, duration: 1.5, stagger: 0.3, ease: "back.out(1.2)"
      }, 6)
        .to(".hero-badge", {
          opacity: 1, y: 0, duration: 1, ease: "power2.out"
        }, 7.5);

      // PHASE 4: Button Reveal (Bottom Right)
      // Starts at time 8.5 (strictly AFTER Title & Badge complete)
      scrollTl.to(".hero-btn", {
        opacity: 1, y: 0, duration: 1.5, ease: "power3.out"
      }, 8.5);

      // Pad out the end slightly before release
      scrollTl.to({}, { duration: 1 }, 10);
    });

    return () => {
      mm.revert();
    };
  }, { scope: container });

  return (
    <section
      id="hero"
      ref={container}
      className="relative flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[var(--brown)]"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-[var(--brown)]">
        <div className="hero-vid-container h-full w-full will-change-transform">
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            onLoadedData={handleLoadedData}
            onCanPlay={() => setIsVideoLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-700 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        </div>
        {/* Dynamic Gradient Overlay */}
        <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70 opacity-100 will-change-opacity" />
      </div>

      {/* Branded Loading Experience */}
      <div
        className={`absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-opacity duration-700 pointer-events-none ${isVideoReady ? 'opacity-0' : 'opacity-100'
          }`}
      >
        <div className="flex flex-col items-center">
          <img
            src="/sprojectlogo.png"
            alt="Loading S Project..."
            className="h-24 w-24 object-contain animate-flip-y filter drop-shadow-lg"
          />
        </div>
      </div>

      {/* 1. INITIAL STATE: Center Title & Bouncing Arrow */}
      <div className="hero-intro absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center opacity-0 translate-y-4 pointer-events-none">
        <h1 className="font-['Playfair_Display'] pointer-events-auto tracking-wide">
          <span 
            className="block text-2xl font-medium text-white/95 sm:text-3xl md:text-4xl lg:text-5xl"
            style={{ textShadow: "1px 2px 8px rgba(0,0,0,0.7)" }}
          >
            Scroll to know about
          </span>
          <span 
            className="mt-2 lg:mt-3 block text-4xl font-bold italic text-[var(--gold)] sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ textShadow: "2px 4px 12px rgba(0,0,0,0.8)" }}
          >
            Salman WTBI
          </span>
        </h1>

        {/* Bouncing Arrow Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex animate-bounce flex-col items-center justify-center">
          <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">Scroll</span>
          <ChevronDown className="h-6 w-6 text-[var(--gold)]/80" strokeWidth={2} />
        </div>
      </div>

      {/* 2. TOP CENTER (Mobile) / TOP RIGHT (Desktop): True Scroll-Driven Typewriter */}
      <div className="absolute top-24 left-1/2 z-20 w-[90%] max-w-[340px] -translate-x-1/2 text-center lg:left-auto lg:right-24 lg:top-32 lg:w-[420px] lg:translate-x-0 lg:text-left xl:w-[500px]">
        <p className="font-['Playfair_Display'] text-2xl leading-snug text-white sm:text-3xl lg:text-4xl">
          {HERO_DESCRIPTION.split("").map((char, i) => (
            <span key={i} className="hero-desc-char hidden">
              {char}
            </span>
          ))}
          {/* Blinking Cursor */}
          <span className="hero-cursor ml-1 inline-block h-[0.8em] w-[3px] animate-pulse align-baseline bg-[var(--gold)]" />
        </p>
      </div>

      {/* 3. BOTTOM CENTER (Mobile) / BOTTOM RIGHT (Desktop): Transparent Button */}
      <div className="absolute bottom-12 left-1/2 z-20 -translate-x-1/2 lg:bottom-24 lg:left-auto lg:right-24 lg:translate-x-0">
        <NavLink
          to={PRIMARY_CTA_LINK}
          className="hero-btn group relative flex items-center justify-center whitespace-nowrap rounded-full border border-white/50 bg-transparent px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white hover:bg-white/10"
        >
          <span className="relative z-10 text-xs uppercase tracking-widest">Know More</span>
          <span className="relative z-10 ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
        </NavLink>
      </div>

      {/* 4. BOTTOM CENTER (Mobile) / BOTTOM LEFT (Desktop): Main Title & Badge */}
      <div className="absolute bottom-32 left-1/2 z-20 flex w-full -translate-x-1/2 flex-col items-center px-4 text-center lg:bottom-24 lg:left-24 lg:w-auto lg:translate-x-0 lg:items-start lg:px-0 lg:text-left">
        <h2 className="mb-6 font-['Playfair_Display'] text-5xl leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          <div className="hero-elem hero-title-line overflow-hidden opacity-0">
            Be Believers,
          </div>
          <div className="hero-elem hero-title-line mt-1 overflow-hidden text-[var(--gold-light)] italic opacity-0 sm:mt-2">
            Be Leaders
          </div>
        </h2>
        <div className="hero-elem hero-badge inline-flex items-center text-xs font-semibold uppercase tracking-widest text-white/80 opacity-0 sm:text-sm">
          <span className="mr-4 hidden h-[2px] w-8 bg-[var(--gold)] lg:inline-block" />
          {HERO_BADGE}
        </div>
      </div>
    </section>
  );
}
