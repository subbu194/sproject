import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;

    // Create an incredibly fast tracking dot
    const xDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });

    let trailIndex = 0;
    const trails = trailsRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      // Move the main bright glowing dot (offset by half its width/height, which is 4px for an 8px dot)
      xDot(e.clientX - 4);
      yDot(e.clientY - 4);

      // Leave behind a "fire" particle from our massive pool
      const trail = trails[trailIndex];
      if (trail) {
        // Place the particle instantly at the current mouse position
        gsap.set(trail, {
          x: e.clientX - 3, // Offset for 6px trail dot
          y: e.clientY - 3,
          scale: 1.5,
          opacity: 0.8
        });

        // Animate the particle to rise up like fire and fade/shrink out
        gsap.to(trail, {
          y: e.clientY - 30 - Math.random() * 20, // Rise up randomly
          x: e.clientX - 3 + (Math.random() * 20 - 10), // Slight horizontal drift
          scale: 0,
          opacity: 0,
          duration: 0.8 + Math.random() * 0.4, // Fast enough to recycle cleanly
          ease: "power2.out"
        });
      }

      // Cycle to the next particle in the pool (100 total ensures we don't run out during continuous movement)
      trailIndex = (trailIndex + 1) % trails.length;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Massive pool of 100 invisible spark particles for an endless, continuous trailing fire effect */}
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailsRef.current[i] = el; }}
          className="pointer-events-none fixed top-0 left-0 z-[99997] h-[6px] w-[6px] rounded-full bg-[var(--gold)] shadow-[0_0_8px_var(--gold)] opacity-0 md:block"
        />
      ))}

      {/* Main bright glowing core dot (no mix-blend-mode so it stays gold everywhere) */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[99999] hidden h-[8px] w-[8px] rounded-full bg-[var(--gold-light)] shadow-[0_0_15px_var(--gold-light),0_0_30px_var(--gold)] md:block"
      />
    </>
  );
}
