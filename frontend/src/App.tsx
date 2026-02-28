import heroPhoto from './assets/hero.png';
import { useEffect } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';

export default function App() {
  const navItems = [
    { label: 'Story', to: '/story', sectionId: 'story' },
    { label: 'Ventures', to: '/ventures', sectionId: 'ventures' },
    { label: 'Daily Log', to: '/daily-log', sectionId: 'daily-log' },
    { label: 'Thoughts', to: '/thoughts', sectionId: 'thoughts' },
    { label: 'Press', to: '/press', sectionId: 'press' },
    { label: 'Achievements', to: '/achievements', sectionId: 'achievements' },
    { label: 'Connect', to: '/page/connect', sectionId: 'connect' },
  ] as const;

  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname || '/';
    if (pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    if (pathname.startsWith('/page/')) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    const match = navItems.find((i) => i.to === pathname);
    if (!match) return;

    const el = document.getElementById(match.sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.pathname]);

  const SectionPageShell = ({
    kicker,
    title,
    subtitle,
    children,
  }: {
    kicker: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
  }) => {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-55)] bg-[var(--surface-70)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] shadow-sm transition hover:bg-[var(--surface-80)]"
          >
            <span aria-hidden>←</span> Back to Home
          </NavLink>
          <div className="text-sm text-[var(--color-secondary)]">
            Separate page view
          </div>
        </div>

        <div className="pt-2">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-secondary)]">
            {kicker}
          </div>
          <h1 className="mt-4 font-[var(--font-serif)] text-5xl tracking-tight text-[var(--color-primary)] sm:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-secondary)] sm:text-base">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    );
  };

  const values = [
    {
      title: 'Safety first',
      text: 'Site discipline, clear checks, and zero shortcuts.',
    },
    {
      title: 'On-time delivery',
      text: 'Realistic schedules and proactive updates.',
    },
    {
      title: 'Craftsmanship',
      text: 'Finishes that look great and last longer.',
    },
  ] as const;

  const storyStats = [
    { kpi: '12+', label: 'Years in construction' },
    { kpi: '50+', label: 'Projects delivered' },
    { kpi: '100%', label: 'Client-first process' },
    { kpi: '5★', label: 'Quality & trust' },
  ] as const;

  const journey = [
    {
      year: '2013',
      title: 'Started on-site',
      text: 'Learned the fundamentals: safety, sequencing, and how good work is built day by day.',
    },
    {
      year: '2017',
      title: 'First major responsibility',
      text: 'Led a full floor execution plan and coordinated trades to hit milestone dates.',
    },
    {
      year: '2021',
      title: 'Expanded into turnkey delivery',
      text: 'Took end-to-end ownership: BOQ, timeline, vendor network, and client updates.',
    },
    {
      year: 'Now',
      title: 'Building in public',
      text: 'Sharing lessons, systems, and progress—so clients know what “professional execution” looks like.',
    },
  ] as const;

  const featuredProjects = [
    {
      title: 'Modern Villa — Structural + Finish',
      meta: 'Residential • Turnkey',
      text: 'From foundation to final handover with clear milestones and weekly reporting.',
      tags: ['Planning', 'Execution', 'Handover'],
    },
    {
      title: 'Retail Space Fit-out',
      meta: 'Commercial • Fast-track',
      text: 'Optimized sequencing to reduce downtime and meet opening-day commitments.',
      tags: ['Fit-out', 'Coordination', 'Timeline'],
    },
    {
      title: 'Apartment Renovation',
      meta: 'Residential • Remodel',
      text: 'Smart design changes, controlled dust/noise, and clean site management.',
      tags: ['Renovation', 'Quality', 'Detailing'],
    },
  ] as const;

  const services = [
    { title: 'End-to-end construction', text: 'Planning, procurement, execution, and handover.' },
    { title: 'Project management', text: 'Budgeting, scheduling, and site coordination.' },
    { title: 'Renovations & upgrades', text: 'Structural changes, interiors, and modern finishes.' },
    { title: 'Quality & safety checks', text: 'Process-driven checks at every stage.' },
  ] as const;

  const dailyUpdates = [
    {
      kicker: 'Today · Feb 19, 2026',
      title: 'Slab pour scheduled + checklist cleared',
      body:
        'Confirmed pump slot, labor, and formwork inspection. Rebar cover and embed points verified before closing.',
      tags: ['Site', 'Schedule', 'Quality'],
    },
    {
      kicker: 'Yesterday · Feb 18',
      title: 'Client walkthrough + scope lock',
      body:
        'Captured final layout tweaks, updated the BOQ, and aligned on finish selections to avoid surprises later.',
      tags: ['Client', 'Decisions'],
    },
    {
      kicker: 'Feb 15',
      title: 'Safety audit + site housekeeping',
      body:
        'Tool storage, walkways, and PPE compliance reviewed. Small fixes now prevent big problems later.',
      tags: ['Safety', 'Process'],
    },
  ] as const;

  const calendar = {
    month: 'February 2026',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    weeks: [
      [null, null, null, null, 1, 2, 3],
      [4, 5, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23, 24],
    ] as Array<Array<number | null>>,
    highlighted: new Set([1, 4, 6, 7, 8, 12, 13, 14, 19]),
  };

  const thoughts = [
    {
      title: 'How to keep a site on schedule',
      text: 'A simple checklist for sequencing work, removing blockers, and keeping momentum.',
      topic: 'Execution',
    },
    {
      title: 'Quality is a process, not an inspection',
      text: 'Why consistent checks and documentation beat last-minute fixes every time.',
      topic: 'Quality',
    },
    {
      title: 'Communicating with clients during builds',
      text: 'Clear updates reduce stress and prevent expensive misunderstandings.',
      topic: 'Communication',
    },
  ] as const;

  const press = [
    { outlet: 'Construction Today', title: 'Modern site management in practice', year: '2025' },
    { outlet: 'City Journal', title: 'Craftsmanship + client trust', year: '2024' },
    { outlet: 'Local Business Weekly', title: 'Reliable delivery with clean handovers', year: '2023' },
  ] as const;

  const milestones = [
    { year: '2025', title: 'Expanded team + vendor network', text: 'Better coverage across trades.' },
    { year: '2024', title: '50+ projects delivered', text: 'Residential + commercial combined.' },
    { year: '2023', title: 'Introduced weekly reporting', text: 'Photos, progress, and next steps.' },
  ] as const;

  const recognition = [
    {
      title: 'Safety Excellence — Site Compliance',
      text: 'Recognized for implementing consistent safety checks and documentation across active sites.',
      year: '2024',
    },
    {
      title: 'Client Trust Award — Repeat Projects',
      text: 'Multiple repeat clients through clear timelines, clean handovers, and transparent updates.',
      year: '2023',
    },
    {
      title: 'Feature — Local Construction Spotlight',
      text: 'Highlighted for practical systems that keep projects moving without compromising quality.',
      year: '2022',
    },
    {
      title: 'Milestone — 50+ Deliveries',
      text: 'Residential and commercial projects completed with a process-first approach.',
      year: '2021–Present',
    },
  ] as const;

  const heroSection = (
    <section id="hero" className="scroll-mt-24 grid items-center gap-10 lg:grid-cols-2">
      <div>
        <div className="inline-flex items-center rounded-full bg-[var(--color-highlight)] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)] shadow-sm">
          Entrepreneur · Builder · Thinker
        </div>

        <h1 className="mt-6 max-w-xl font-[var(--font-serif)] text-5xl leading-[1.02] tracking-tight sm:text-6xl">
          Building strong, <span className="text-[var(--color-accent)] italic">safe</span> spaces from the
          ground up.
        </h1>

        <p className="mt-6 max-w-lg text-sm leading-relaxed text-[var(--color-secondary)] sm:text-base">
          I&apos;m Salman Shariff — focused on quality construction, reliable timelines, and craftsmanship
          that lasts.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <NavLink
            to="/ventures"
            className="rounded-xl bg-[var(--color-cta)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            See My Work
          </NavLink>
          <NavLink
            to="/daily-log"
            className="rounded-xl border border-[var(--border-55)] bg-[var(--color-bg)] px-6 py-3 text-sm font-semibold text-[var(--color-primary)] shadow-sm transition hover:bg-[var(--surface-70)]"
          >
            Today&apos;s Update
          </NavLink>
        </div>
      </div>

      <div className="relative">
        <div className="relative mx-auto aspect-[4/3.2] w-full max-w-lg overflow-hidden rounded-[36px] border border-[var(--border-45)] bg-gradient-to-br from-[var(--accent-25)] via-[var(--color-bg)] to-white shadow-sm">
          <img
            src={heroPhoto}
            alt="Salman Shariff"
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-18)] via-transparent to-transparent" />
        </div>

        <div className="pointer-events-none absolute bottom-5 left-5 w-[220px] rounded-2xl border border-[var(--border-55)] bg-[var(--bg-90)] px-3.5 py-2.5 shadow-sm backdrop-blur">
          <div className="flex items-start gap-2.5">
            <span className="mt-1.5 inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            <div>
              <div className="text-[13px] font-semibold leading-tight text-[var(--color-primary)]">
                Available for consulting
              </div>
              <div className="mt-0.5 text-[11px] leading-tight text-[var(--color-secondary)]">
                Updated today
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const storySection = (
    <section
      id="story"
      className="scroll-mt-24 rounded-[28px] border border-[var(--border-45)] bg-[var(--surface-70)] p-6 shadow-sm backdrop-blur sm:p-7 lg:p-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-secondary)]">
            My journey
          </div>
          <h2 className="mt-2 font-[var(--font-serif)] text-2xl leading-tight tracking-tight text-[var(--color-accent)] sm:text-3xl">
            From a strong foundation to trusted delivery.
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-[var(--color-secondary)]">Who he is</div>
          <NavLink to="/page/story" className="text-xs font-semibold text-[var(--color-cta)] hover:opacity-90">
            Open page →
          </NavLink>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {storyStats.map((s) => (
          <div
            key={s.label}
            className="rounded-[20px] border border-[var(--border-45)] bg-[var(--color-bg)] p-4 text-center shadow-sm"
          >
            <div className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--color-accent)] sm:text-3xl">
              {s.kpi}
            </div>
            <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[22px] border border-[var(--border-45)] bg-[var(--surface-70)] p-4 shadow-sm backdrop-blur sm:p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-secondary)]">
            Timeline
          </div>
          <div className="mt-4 space-y-3">
            {journey.map((step, idx) => (
              <div key={step.title} className="grid grid-cols-[36px_1fr] gap-4">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--color-highlight)] text-xs font-bold text-[var(--color-primary)]">
                    {idx + 1}
                  </div>
                  {idx !== journey.length - 1 ? (
                    <div className="absolute left-1/2 top-9 h-[calc(100%-36px)] w-px -translate-x-1/2 bg-[var(--border-55)]" />
                  ) : null}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                    {step.year}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[var(--color-primary)]">{step.title}</div>
                  <div className="mt-1 text-sm leading-relaxed text-[var(--color-secondary)]">{step.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--border-45)] bg-[var(--color-primary)] p-5 shadow-sm sm:p-6">
          <div className="font-[var(--font-serif)] text-lg leading-relaxed tracking-tight text-white/90 sm:text-xl">
            “We don&apos;t build just structures — we build trust, through clarity, safety, and execution.”
          </div>
          <div className="mt-4 text-sm font-semibold text-white/70">— Salman Shariff</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-[18px] bg-white/10 p-3">
                <div className="text-sm font-semibold text-white/90">{v.title}</div>
                <div className="mt-1 text-sm leading-relaxed text-white/70">{v.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const storyContent = (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {storyStats.map((s) => (
          <div
            key={s.label}
            className="rounded-[22px] border border-[var(--border-45)] bg-[var(--color-bg)] p-6 text-center shadow-sm"
          >
            <div className="font-[var(--font-serif)] text-4xl tracking-tight text-[var(--color-accent)]">
              {s.kpi}
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[22px] border border-[var(--border-45)] bg-[var(--surface-70)] p-6 shadow-sm backdrop-blur">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-secondary)]">
            Timeline
          </div>
          <div className="mt-6 space-y-6">
            {journey.map((step, idx) => (
              <div key={step.title} className="grid grid-cols-[44px_1fr] gap-4">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-highlight)] text-sm font-bold text-[var(--color-primary)]">
                    {idx + 1}
                  </div>
                  {idx !== journey.length - 1 ? (
                    <div className="absolute left-1/2 top-11 h-[calc(100%-44px)] w-px -translate-x-1/2 bg-[var(--border-55)]" />
                  ) : null}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                    {step.year}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[var(--color-primary)]">{step.title}</div>
                  <div className="mt-1 text-sm leading-relaxed text-[var(--color-secondary)]">{step.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--border-45)] bg-[var(--color-primary)] p-8 shadow-sm">
          <div className="font-[var(--font-serif)] text-2xl leading-relaxed tracking-tight text-white/90 sm:text-3xl">
            “We don&apos;t build just structures — we build trust, through clarity, safety, and execution.”
          </div>
          <div className="mt-6 text-sm font-semibold text-white/70">— Salman Shariff</div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-[18px] bg-white/10 p-4">
                <div className="text-sm font-semibold text-white/90">{v.title}</div>
                <div className="mt-1 text-sm leading-relaxed text-white/70">{v.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const venturesSection = (
    <section id="ventures" className="scroll-mt-24 space-y-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-secondary)]">
            What I&apos;ve built
          </div>
          <h2 className="mt-3 font-[var(--font-serif)] text-4xl tracking-tight text-[var(--color-accent)] sm:text-5xl">
            Ventures &amp; Projects
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-secondary)] sm:text-base">
            A curated set of projects showing how I plan, execute, and deliver—without surprises.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-[var(--color-secondary)]">What he built</div>
          <NavLink
            to="/page/ventures"
            className="text-sm font-semibold text-[var(--color-cta)] hover:opacity-90"
          >
            Open page →
          </NavLink>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {featuredProjects.map((p) => (
          <article
            key={p.title}
            className="rounded-[22px] border border-[var(--border-45)] bg-[var(--surface-70)] p-6 shadow-sm backdrop-blur"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
              {p.meta}
            </div>
            <div className="mt-3 text-base font-semibold text-[var(--color-primary)]">{p.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-[var(--color-secondary)]">{p.text}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[var(--border-55)] bg-[var(--color-bg)] px-3 py-1 text-xs font-semibold text-[var(--color-secondary)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-[var(--border-45)] bg-[var(--surface-70)] p-8 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-[var(--color-accent)]">Services</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-[18px] border border-[var(--border-45)] bg-[var(--color-bg)] p-4"
              >
                <div className="text-sm font-semibold text-[var(--color-primary)]">{s.title}</div>
                <div className="mt-1 text-sm leading-relaxed text-[var(--color-secondary)]">{s.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--border-45)] bg-[var(--surface-70)] p-8 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-[var(--color-primary)]">How I work</div>
          <ol className="mt-5 space-y-4">
            {[
              { n: '01', t: 'Plan', d: 'Scope, BOQ, and a realistic timeline.' },
              { n: '02', t: 'Build', d: 'Daily site checks + coordinated execution.' },
              { n: '03', t: 'Deliver', d: 'Clean handover with punch-list closure.' },
            ].map((step) => (
              <li key={step.n} className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-highlight)] text-sm font-bold text-[var(--color-primary)]">
                  {step.n}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--color-primary)]">{step.t}</div>
                  <div className="mt-1 text-sm leading-relaxed text-[var(--color-secondary)]">{step.d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );

  const venturesContent = (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        {featuredProjects.map((p) => (
          <article
            key={p.title}
            className="rounded-[22px] border border-[var(--border-45)] bg-[var(--surface-70)] p-6 shadow-sm backdrop-blur"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
              {p.meta}
            </div>
            <div className="mt-3 text-base font-semibold text-[var(--color-primary)]">{p.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-[var(--color-secondary)]">{p.text}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[var(--border-55)] bg-[var(--color-bg)] px-3 py-1 text-xs font-semibold text-[var(--color-secondary)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-[var(--border-45)] bg-[var(--surface-70)] p-8 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-[var(--color-accent)]">Services</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-[18px] border border-[var(--border-45)] bg-[var(--color-bg)] p-4"
              >
                <div className="text-sm font-semibold text-[var(--color-primary)]">{s.title}</div>
                <div className="mt-1 text-sm leading-relaxed text-[var(--color-secondary)]">{s.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--border-45)] bg-[var(--surface-70)] p-8 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-[var(--color-primary)]">How I work</div>
          <ol className="mt-5 space-y-4">
            {[
              { n: '01', t: 'Discover', d: 'Scope, budget, and constraints—no assumptions.' },
              { n: '02', t: 'Plan', d: 'BOQ + timeline + risk plan with weekly reporting.' },
              { n: '03', t: 'Execute', d: 'Site discipline, safety checks, and clean handovers.' },
            ].map((step) => (
              <li key={step.n} className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-highlight)] text-sm font-bold text-[var(--color-primary)]">
                  {step.n}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--color-primary)]">{step.t}</div>
                  <div className="mt-1 text-sm leading-relaxed text-[var(--color-secondary)]">{step.d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );

  const dailyLogSection = (
    <section
      id="daily-log"
      className="scroll-mt-24 rounded-[28px] border border-[var(--border-45)] bg-[var(--surface-70)] p-8 shadow-sm backdrop-blur"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-secondary)]">
            Building in public
          </div>
          <h2 className="mt-3 font-[var(--font-serif)] text-4xl tracking-tight text-[var(--color-accent)] sm:text-5xl">
            Daily Log
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-secondary)] sm:text-base">
            Every day. Real updates. No filter.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-[var(--color-secondary)]">What&apos;s happening now</div>
          <NavLink
            to="/page/daily-log"
            className="text-sm font-semibold text-[var(--color-cta)] hover:opacity-90"
          >
            Open page →
          </NavLink>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-[28px] border border-[var(--border-45)] bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="text-sm font-semibold text-[var(--color-primary)]">{calendar.month}</div>

            <div className="mt-5 grid grid-cols-7 gap-3 text-center text-xs text-[var(--color-secondary)]">
              {calendar.days.map((d) => (
                <div key={d} className="font-medium">
                  {d}
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3">
              {calendar.weeks.map((week, i) => (
                <div key={i} className="grid grid-cols-7 gap-3">
                  {week.map((day, j) => {
                    if (!day) return <div key={`${i}-${j}`} />;
                    const active = calendar.highlighted.has(day);
                    return (
                      <div
                        key={`${i}-${j}`}
                        className={[
                          'flex h-9 items-center justify-center rounded-xl text-xs font-semibold',
                          active
                            ? 'bg-[var(--color-accent)] text-white'
                            : 'text-[var(--color-secondary)]',
                        ].join(' ')}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--border-45)] bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="text-sm font-semibold text-[var(--color-primary)]">Filter by tag</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['All', 'Site', 'Schedule', 'Quality', 'Client', 'Safety', 'Process'].map((tag, idx) => (
                <button
                  key={tag}
                  type="button"
                  className={[
                    'rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition',
                    idx === 0
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                      : 'border-[var(--border-55)] bg-[var(--surface-70)] text-[var(--color-secondary)] hover:bg-[var(--surface-80)]',
                  ].join(' ')}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          {dailyUpdates.map((u) => (
            <article
              key={u.title}
              className="rounded-[28px] border border-[var(--border-45)] bg-white/70 p-7 shadow-sm backdrop-blur"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                {u.kicker}
              </div>
              <div className="mt-3 text-lg font-semibold tracking-tight text-[var(--color-primary)] sm:text-xl">
                {u.title}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-secondary)]">{u.body}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {u.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--border-55)] bg-[var(--surface-60)] px-3 py-1 text-xs font-semibold text-[var(--color-secondary)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  const dailyLogContent = (
    <div className="mt-10 grid gap-8 lg:grid-cols-[360px_1fr]">
      <aside className="space-y-6">
        <div className="rounded-[28px] border border-[var(--border-45)] bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-[var(--color-primary)]">{calendar.month}</div>

          <div className="mt-5 grid grid-cols-7 gap-3 text-center text-xs text-[var(--color-secondary)]">
            {calendar.days.map((d) => (
              <div key={d} className="font-medium">
                {d}
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3">
            {calendar.weeks.map((week, i) => (
              <div key={i} className="grid grid-cols-7 gap-3">
                {week.map((day, j) => {
                  if (!day) return <div key={`${i}-${j}`} />;
                  const active = calendar.highlighted.has(day);
                  return (
                    <div
                      key={`${i}-${j}`}
                      className={[
                        'flex h-9 items-center justify-center rounded-xl text-xs font-semibold',
                        active ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-secondary)]',
                      ].join(' ')}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--border-45)] bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-[var(--color-primary)]">Filter by tag</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['All', 'Site', 'Schedule', 'Quality', 'Client', 'Safety', 'Process'].map((tag, idx) => (
              <button
                key={tag}
                type="button"
                className={[
                  'rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition',
                  idx === 0
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                    : 'border-[var(--border-55)] bg-[var(--surface-70)] text-[var(--color-secondary)] hover:bg-[var(--surface-80)]',
                ].join(' ')}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="space-y-6">
        {dailyUpdates.map((u) => (
          <article
            key={u.title}
            className="rounded-[28px] border border-[var(--border-45)] bg-white/70 p-7 shadow-sm backdrop-blur"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
              {u.kicker}
            </div>
            <div className="mt-3 text-lg font-semibold tracking-tight text-[var(--color-primary)] sm:text-xl">
              {u.title}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-secondary)]">{u.body}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {u.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[var(--border-55)] bg-[var(--surface-60)] px-3 py-1 text-xs font-semibold text-[var(--color-secondary)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  const thoughtsSection = (
    <section
      id="thoughts"
      className="scroll-mt-24 rounded-[28px] border border-[var(--border-45)] bg-[var(--surface-70)] p-8 shadow-sm backdrop-blur"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-[var(--font-serif)] text-3xl tracking-tight text-[var(--color-accent)]">
          Thoughts
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-[var(--color-secondary)]">What he believes</div>
          <NavLink
            to="/page/thoughts"
            className="text-sm font-semibold text-[var(--color-cta)] hover:opacity-90"
          >
            Open page →
          </NavLink>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {thoughts.map((p) => (
          <a
            key={p.title}
            href="#"
            className="group rounded-[22px] border border-[var(--border-45)] bg-[var(--color-bg)] p-6 shadow-sm transition hover:bg-[var(--surface-70)]"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {p.topic}
            </div>
            <div className="mt-3 text-sm font-semibold text-[var(--color-primary)] group-hover:underline">
              {p.title}
            </div>
            <div className="mt-2 text-sm leading-relaxed text-[var(--color-secondary)]">{p.text}</div>
            <div className="mt-4 text-xs font-semibold text-[var(--color-cta)]">Read →</div>
          </a>
        ))}
      </div>
    </section>
  );

  const pressSection = (
    <section id="press" className="scroll-mt-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-[var(--font-serif)] text-3xl tracking-tight text-[var(--color-accent)]">Press</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-[var(--color-secondary)]">Where he was featured</div>
          <NavLink
            to="/page/press"
            className="text-sm font-semibold text-[var(--color-cta)] hover:opacity-90"
          >
            Open page →
          </NavLink>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-[var(--border-45)] bg-[var(--surface-70)] shadow-sm backdrop-blur">
        <div className="grid grid-cols-1 divide-y divide-[var(--border-35)]">
          {press.map((row) => (
            <div key={row.title} className="flex items-center justify-between gap-4 p-6">
              <div>
                <div className="text-sm font-semibold text-[var(--color-primary)]">{row.title}</div>
                <div className="mt-1 text-sm text-[var(--color-secondary)]">
                  {row.outlet} · {row.year}
                </div>
              </div>
              <a href="#" className="text-sm font-semibold text-[var(--color-cta)] hover:opacity-90">
                Read →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const achievementsSection = (
    <section
      id="achievements"
      className="scroll-mt-24 rounded-[28px] border border-[var(--border-45)] bg-[var(--surface-70)] p-8 shadow-sm backdrop-blur"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-secondary)]">
            Recognition
          </div>
          <h2 className="mt-3 font-[var(--font-serif)] text-4xl tracking-tight text-[var(--color-accent)] sm:text-5xl">
            Milestones &amp; Achievements
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-secondary)] sm:text-base">
            A few highlights that reflect the work, the systems, and the trust built over time.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-[var(--color-secondary)]">Awards, milestones</div>
          <NavLink
            to="/page/achievements"
            className="text-sm font-semibold text-[var(--color-cta)] hover:opacity-90"
          >
            Open page →
          </NavLink>
        </div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {recognition.map((r) => (
          <div
            key={r.title}
            className="rounded-[28px] border border-[var(--border-45)] bg-[var(--surface-70)] p-6 shadow-sm backdrop-blur"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-highlight)] text-[var(--color-primary)]">
                <span className="text-lg font-bold" aria-hidden>
                  ✦
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--color-primary)]">{r.title}</div>
                <div className="mt-1 text-sm leading-relaxed text-[var(--color-secondary)]">{r.text}</div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                  {r.year}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-[28px] border border-[var(--border-45)] bg-[var(--color-bg)] p-8 shadow-sm">
        <div className="text-sm font-semibold text-[var(--color-primary)]">More milestones</div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {milestones.map((m) => (
            <div
              key={m.year}
              className="rounded-[22px] border border-[var(--border-45)] bg-[var(--surface-70)] p-5"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                {m.year}
              </div>
              <div className="mt-2 text-sm font-semibold text-[var(--color-primary)]">{m.title}</div>
              <div className="mt-1 text-sm leading-relaxed text-[var(--color-secondary)]">{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const connectSection = (
    <section
      id="connect"
      className="scroll-mt-24 rounded-[28px] border border-[var(--border-45)] bg-gradient-to-br from-[var(--surface-70)] via-[var(--surface-60)] to-[var(--color-bg)] p-8 shadow-sm backdrop-blur"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-[var(--font-serif)] text-3xl tracking-tight text-[var(--color-accent)]">
          Connect
        </h2>
        <div className="text-sm text-[var(--color-secondary)]">Contact + socials</div>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--color-secondary)] sm:text-base">
        Want to discuss a project? Send a message and we&apos;ll set up a quick call.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          className="rounded-[22px] border border-[var(--border-45)] bg-[var(--surface-70)] p-6 shadow-sm backdrop-blur"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                Name
              </span>
              <input
                className="h-11 rounded-xl border border-[var(--border-55)] bg-[var(--surface-80)] px-4 text-sm text-[var(--color-primary)] outline-none ring-0 placeholder:text-[var(--color-highlight)] focus:border-[var(--color-accent)]"
                placeholder="Your name"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                Email
              </span>
              <input
                type="email"
                className="h-11 rounded-xl border border-[var(--border-55)] bg-[var(--surface-80)] px-4 text-sm text-[var(--color-primary)] outline-none ring-0 placeholder:text-[var(--color-highlight)] focus:border-[var(--color-accent)]"
                placeholder="you@email.com"
              />
            </label>
          </div>

          <label className="mt-4 grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
              Message
            </span>
            <textarea
              className="min-h-[120px] resize-none rounded-xl border border-[var(--border-55)] bg-[var(--surface-80)] px-4 py-3 text-sm text-[var(--color-primary)] outline-none placeholder:text-[var(--color-highlight)] focus:border-[var(--color-accent)]"
              placeholder="Tell me about your project..."
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-[var(--color-cta)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Send message
            </button>
            <a
              href="mailto:hello@example.com"
              className="rounded-xl border border-[var(--border-55)] bg-[var(--surface-70)] px-6 py-3 text-sm font-semibold text-[var(--color-primary)] shadow-sm transition hover:bg-[var(--surface-80)]"
            >
              Email directly
            </a>
          </div>
          <div className="mt-3 text-xs text-[var(--color-secondary)]">
            Replace <span className="font-semibold">hello@example.com</span> with your real email.
          </div>
        </form>

        <div className="space-y-4">
          <div className="rounded-[22px] border border-[var(--border-45)] bg-[var(--color-bg)] p-6 shadow-sm">
            <div className="text-sm font-semibold text-[var(--color-primary)]">Quick links</div>
            <div className="mt-4 grid gap-3">
              {[
                { label: 'WhatsApp', href: '#' },
                { label: 'Instagram', href: '#' },
                { label: 'LinkedIn', href: '#' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between rounded-xl border border-[var(--border-55)] bg-[var(--surface-70)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)] shadow-sm transition hover:bg-[var(--surface-80)]"
                >
                  <span>{link.label}</span>
                  <span className="text-[var(--color-accent)]">→</span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-[var(--border-45)] bg-[var(--surface-70)] p-6 shadow-sm backdrop-blur">
            <div className="text-sm font-semibold text-[var(--color-primary)]">Availability</div>
            <div className="mt-2 text-sm leading-relaxed text-[var(--color-secondary)]">
              Taking on a limited number of projects each month. Best fit: quality-focused builds with
              clear timelines.
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const homeConnectCta = (
    <footer className="rounded-[28px] border border-[var(--border-45)] bg-[var(--surface-70)] p-8 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-secondary)]">
            Let&apos;s talk
          </div>
          <div className="mt-3 font-[var(--font-serif)] text-3xl tracking-tight text-[var(--color-primary)] sm:text-4xl">
            Have a project in mind?
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-secondary)] sm:text-base">
            Share your scope, timeline, and location. I&apos;ll reply with next steps and we can schedule a
            quick call.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <NavLink
            to="/page/connect"
            className="rounded-xl bg-[var(--color-cta)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Open contact page
          </NavLink>
          <a
            href="mailto:hello@example.com"
            className="rounded-xl border border-[var(--border-55)] bg-[var(--surface-70)] px-6 py-3 text-sm font-semibold text-[var(--color-primary)] shadow-sm transition hover:bg-[var(--surface-80)]"
          >
            Email
          </a>
        </div>
      </div>
      <div className="mt-8 h-px w-full bg-[var(--border-35)]" />
      <div className="mt-4 text-xs text-[var(--color-secondary)]">
        © {new Date().getFullYear()} Salman Shariff. All rights reserved.
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-primary)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border-45)] bg-[var(--bg-80)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink
            className="text-lg font-bold tracking-tight text-[var(--color-accent)] transition-colors hover:text-[var(--color-primary)] sm:text-xl"
            to="/"
            aria-label="Salman Shariff home"
          >
            Salman Shariff
          </NavLink>

          <nav className="hidden items-center gap-10 text-base font-semibold md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'font-semibold transition-colors',
                    isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-primary)]',
                    'hover:text-[var(--color-accent)]',
                  ].join(' ')
                }
                aria-label={item.label}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="inline-flex items-center rounded-full border border-[var(--border-55)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-secondary)] shadow-sm transition hover:bg-[var(--surface-70)] md:hidden"
            aria-label="Open menu"
            onClick={() => {
              // Placeholder for future mobile menu
            }}
          >
            Menu
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-14">
        <Routes>
          {/* Home (single-page site) */}
          <Route
            path="/"
            element={
              <>
                {heroSection}
                <div className="mt-16 space-y-16">
                  {storySection}
                  {venturesSection}
                  {dailyLogSection}
                  {thoughtsSection}
                  {pressSection}
                  {achievementsSection}
                  {homeConnectCta}
                </div>
              </>
            }
          />

          {/* Separate professional pages */}
          <Route
            path="/page/story"
            element={
              <SectionPageShell
                kicker="The entrepreneur"
                title="Story & Principles"
                subtitle="An entrepreneur’s approach to building: clear timelines, disciplined execution, and trust-first relationships."
              >
                {storyContent}
              </SectionPageShell>
            }
          />
          <Route
            path="/page/ventures"
            element={
              <SectionPageShell
                kicker="Portfolio"
                title="Ventures & Projects"
                subtitle="Selected work—how projects are planned, executed, and delivered with quality and transparency."
              >
                {venturesContent}
              </SectionPageShell>
            }
          />
          <Route
            path="/page/daily-log"
            element={
              <SectionPageShell
                kicker="Building in public"
                title="Daily Log"
                subtitle="Every day. Real updates. No filter. A transparent view into progress, decisions, and on-site execution."
              >
                {dailyLogContent}
              </SectionPageShell>
            }
          />
          <Route
            path="/page/thoughts"
            element={
              <SectionPageShell
                kicker="Principles"
                title="Thoughts"
                subtitle="Short, practical lessons from the field—process, quality, safety, and communication."
              >
                {thoughtsSection}
              </SectionPageShell>
            }
          />
          <Route
            path="/page/press"
            element={
              <SectionPageShell
                kicker="Features"
                title="Press"
                subtitle="Mentions and highlights that reflect the work and the approach."
              >
                {pressSection}
              </SectionPageShell>
            }
          />
          <Route
            path="/page/achievements"
            element={
              <SectionPageShell
                kicker="Recognition"
                title="Milestones & Achievements"
                subtitle="A few highlights that made the journey feel real—client trust, process maturity, and consistent delivery."
              >
                {achievementsSection}
              </SectionPageShell>
            }
          />
          <Route
            path="/page/connect"
            element={
              <SectionPageShell
                kicker="Contact"
                title="Connect"
                subtitle="If you’re planning a project, send details and we’ll schedule a quick call."
              >
                {connectSection}
              </SectionPageShell>
            }
          />

          <Route
            path="*"
            element={
              <SectionPageShell
                kicker="Navigation"
                title="Page not found"
                subtitle="That page doesn’t exist. Head back to the home page and use the header to explore sections."
              >
                {heroSection}
              </SectionPageShell>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
