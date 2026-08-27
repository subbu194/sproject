import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return; // Fallback to native scrolling
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.5, // Slightly longer duration for smoother inertia
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: true, // Syncs touch events for touchpads
      wheelMultiplier: 1,
      touchMultiplier: 1, // Reduced to prevent aggressive touchpad scaling
      // @ts-ignore - Some Lenis typedef versions omit this but it is required to fix trackpad velocity
      normalizeWheel: true,
    });
    lenisRef.current = lenis;

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Sync GSAP ticker with Lenis requestAnimationFrame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // GSAP time is in seconds, Lenis expects ms
    });
    
    // Prevent GSAP lag smoothing from conflicting with Lenis
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Cleanup to prevent StrictMode duplicates or memory leaks
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Handle route changes by resetting scroll
  useEffect(() => {
    if (lenisRef.current) {
      // If there's a hash, we let the Home page handle it or let Lenis scroll to it natively
      if (!hash) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    } else {
      if (!hash) {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash]);

  return <>{children}</>;
}
