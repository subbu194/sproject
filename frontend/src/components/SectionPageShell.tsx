import { NavLink } from 'react-router-dom';

interface SectionPageShellProps {
  kicker: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function SectionPageShell({ kicker, title, subtitle, children }: SectionPageShellProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <NavLink
          to="/"
          className="group inline-flex items-center gap-2 rounded-xl border border-[var(--brown)]/10 bg-[var(--warm-white)] px-4 py-2 text-sm font-medium text-[var(--brown)] shadow-sm transition-all duration-200 hover:border-[var(--gold)] hover:bg-[var(--cream)]"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1" aria-hidden>←</span>
          Back to Home
        </NavLink>
      </div>

      <div className="animate-fade-up pt-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
          <span className="inline-block h-px w-6 bg-[var(--gold)]" />
          {kicker}
        </div>
        <h1 className="mt-4 font-['Playfair_Display'] text-4xl font-bold tracking-tight text-[var(--brown)] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
          {subtitle}
        </p>
        {/* Decorative underline */}
        <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)]" />
      </div>

      {children}
    </div>
  );
}
