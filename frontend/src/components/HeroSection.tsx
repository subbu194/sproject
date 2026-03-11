import { NavLink } from 'react-router-dom';
import {
  HERO_BADGE,
  HERO_DESCRIPTION,
  PRIMARY_CTA_LABEL,
  PRIMARY_CTA_LINK,
  SECONDARY_CTA_LABEL,
  SECONDARY_CTA_LINK,
} from '../constants/content';
import heroPhoto from '../assets/hero.png';

export default function HeroSection() {
  return (
    <section id="hero" className="scroll-mt-24 grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
      {/* Text content */}
      <div className="min-w-0">
        {/* Badge */}
        <div className="animate-fade-up animate-fade-up-1 inline-flex items-center rounded-full bg-[var(--cream)] px-5 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--brown)]">
          {HERO_BADGE}
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up animate-fade-up-2 mt-6 font-['Playfair_Display'] text-4xl leading-[1.1] tracking-tight text-[var(--brown)] sm:text-5xl lg:text-6xl">
          Be Believers,{' '}
          <em className="text-[var(--gold)] italic">Be Leaders</em>
        </h1>

        {/* Description */}
        <p className="animate-fade-up animate-fade-up-3 mt-5 max-w-lg text-base leading-relaxed text-[var(--muted)]">
          {HERO_DESCRIPTION}
        </p>

        {/* CTAs */}
        <div className="animate-fade-up animate-fade-up-4 mt-7 flex flex-wrap gap-3">
          <NavLink
            to={PRIMARY_CTA_LINK}
            className="rounded-xl bg-[var(--gold)] px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[var(--gold-light)] hover:shadow-lg"
          >
            {PRIMARY_CTA_LABEL}
          </NavLink>
          <NavLink
            to={SECONDARY_CTA_LINK}
            className="rounded-xl border-2 border-[var(--brown)]/15 bg-[var(--warm-white)] px-7 py-3 text-sm font-semibold text-[var(--brown)] shadow-sm transition-all duration-200 hover:border-[var(--gold)] hover:bg-[var(--cream)]"
          >
            {SECONDARY_CTA_LABEL}
          </NavLink>
        </div>
      </div>

      {/* Hero Photo */}
      <div className="animate-fade-up animate-fade-up-3 flex justify-center lg:justify-end">
        <div className="w-[280px] sm:w-[320px] lg:w-[380px] overflow-hidden rounded-3xl shadow-[0_8px_32px_rgba(44,26,14,0.15)]">
          <img
            src={heroPhoto}
            alt="Salman Shariff"
            className="h-auto w-full object-cover"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
