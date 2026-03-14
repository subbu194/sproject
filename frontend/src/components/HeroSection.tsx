import { NavLink } from "react-router-dom";
import {
  HERO_BADGE,
  HERO_DESCRIPTION,
  PRIMARY_CTA_LABEL,
  PRIMARY_CTA_LINK,
  SECONDARY_CTA_LABEL,
  SECONDARY_CTA_LINK,
} from "../constants/content";
import heroPhoto from "../assets/hero.png";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-[var(--warm-white)] via-[var(--cream)] to-[var(--warm-white)]"
    >
      <div className="mx-auto max-w-7xl grid min-h-screen items-center px-6  lg:grid-cols-2 lg:gap-16 lg:px-12">

        {/* LEFT TEXT */}
        <div className="space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-[var(--gold)]/20 bg-[var(--cream)] px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--brown)]">
            {HERO_BADGE}
          </div>

          {/* Heading */}
          <h1 className="font-['Playfair_Display'] text-4xl leading-tight text-[var(--brown)] sm:text-5xl lg:text-6xl">
            Be Believers,
            <span className="block text-[var(--gold)] italic">
              Be Leaders
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-lg text-lg leading-relaxed text-[var(--muted)]">
            {HERO_DESCRIPTION}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <NavLink
              to={PRIMARY_CTA_LINK}
              className="rounded-xl bg-[var(--gold)] px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[var(--gold-light)] hover:shadow-lg"
            >
              {PRIMARY_CTA_LABEL}
            </NavLink>

            <NavLink
              to={SECONDARY_CTA_LINK}
              className="rounded-xl border border-[var(--brown)]/20 px-8 py-3 text-sm font-semibold text-[var(--brown)] transition-all hover:border-[var(--gold)] hover:bg-[var(--cream)]"
            >
              {SECONDARY_CTA_LABEL}
            </NavLink>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center lg:justify-end">

          {/* glow background */}
          <div className="absolute h-[420px] w-[420px] rounded-full bg-[var(--gold)]/20 blur-3xl"></div>

          <div className="relative w-[320px] sm:w-[380px] lg:w-[460px] overflow-hidden rounded-3xl border border-[var(--gold)]/20 shadow-[0_20px_60px_rgba(44,26,14,0.25)]">
            <img
              src={heroPhoto}
              alt="Salman Shariff"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>

        </div>

      </div>
    </section>
  );
}