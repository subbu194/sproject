
interface SectionPageShellProps {
  kicker: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function SectionPageShell({ kicker, title, subtitle, children }: SectionPageShellProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-12">

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
