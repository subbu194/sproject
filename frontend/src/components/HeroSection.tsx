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
      className="relative overflow-hidden bg-gradient-to-br from-[var(--warm-white)] via-[var(--cream)] to-[var(--warm-white)] pt-8 pb-16 lg:py-0"
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--brown) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative mx-auto max-w-7xl min-h-[calc(100vh-80px)] flex flex-col justify-center gap-12 px-6 lg:grid lg:grid-cols-2 lg:gap-16 lg:px-12 lg:items-center">

        {/* LEFT TEXT */}
        <div className="space-y-6 lg:space-y-8 flex flex-col items-center text-center lg:items-start lg:text-left mt-8 lg:mt-0">

          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center rounded-full border border-[var(--gold)]/20 bg-[var(--cream)] px-4 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--brown)] shadow-sm">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
            {HERO_BADGE}
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up animate-fade-up-1 font-['Playfair_Display'] text-4xl leading-tight text-[var(--brown)] sm:text-5xl lg:text-6xl xl:text-7xl">
            Be Believers,
            <span className="block text-[var(--gold)] italic mt-2">
              Be Leaders
            </span>
          </h1>

          {/* Description */}
          <p className="animate-fade-up animate-fade-up-2 max-w-md sm:max-w-lg text-base sm:text-lg leading-relaxed text-[var(--muted)]">
            {HERO_DESCRIPTION}
          </p>

          {/* Buttons */}
          <div className="animate-fade-up animate-fade-up-3 flex flex-col sm:flex-row flex-wrap gap-4 pt-4 w-full sm:w-auto justify-center lg:justify-start">
            <NavLink
              to={PRIMARY_CTA_LINK}
              className="w-full sm:w-auto text-center rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] px-8 py-3.5 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--gold)]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--gold)]/30 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              {PRIMARY_CTA_LABEL}
            </NavLink>

            <NavLink
              to={SECONDARY_CTA_LINK}
              className="w-full sm:w-auto text-center rounded-xl border border-[var(--brown)]/20 px-8 py-3.5 sm:py-3 text-sm font-semibold text-[var(--brown)] transition-all duration-300 hover:border-[var(--gold)] hover:bg-[var(--cream)] hover:-translate-y-0.5"
            >
              {SECONDARY_CTA_LABEL}
            </NavLink>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="animate-scale-in animate-fade-up-2 relative flex justify-center items-center lg:justify-end w-full">

          {/* Glow background */}
          <div className="absolute h-[250px] w-[250px] sm:h-[350px] sm:w-[350px] lg:h-[420px] lg:w-[420px] rounded-full bg-[var(--gold)]/15 blur-3xl animate-float" />

          <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-[460px] aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--gold)]/20 shadow-[0_20px_60px_rgba(44,26,14,0.25)] group">
            <img
              src={heroPhoto}
              alt="Salman Shariff"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              draggable={false}
            />
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brown)]/10 via-transparent to-transparent" />
          </div>

        </div>

      </div>
    </section>
  );
}
