import heroPhoto from './assets/hero.png';

export default function App() {
  const navItems = [
    { label: 'Story', href: '#story' },
    { label: 'Ventures', href: '#ventures' },
    { label: 'Daily Log', href: '#daily-log' },
    { label: 'Thoughts', href: '#thoughts' },
    { label: 'Press', href: '#press' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Connect', href: '#connect' },
  ] as const;

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
      date: 'Today',
      title: 'Pour schedule confirmed',
      text: 'Locked concrete pour timing, manpower, and pump availability for the slab.',
      tags: ['Site', 'Schedule'],
    },
    {
      date: 'Yesterday',
      title: 'Rebar inspection completed',
      text: 'Verified spacing, cover blocks, and tie quality before shuttering close.',
      tags: ['Quality', 'Safety'],
    },
    {
      date: 'This week',
      title: 'Client walkthrough + changes',
      text: 'Captured small layout tweaks and updated the BOQ to reflect scope.',
      tags: ['Client', 'Decisions'],
    },
  ] as const;

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

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#1F2A44]">
      <header className="sticky top-0 z-20 border-b border-[#A7B0B9]/45 bg-[#F4F6F8]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a
            className="text-lg font-bold tracking-tight text-[#5E5E5E] transition-colors hover:text-[#1F2A44] sm:text-xl"
            href="#"
            aria-label="Salman Shariff home"
          >
            Salman Shariff
          </a>

          <nav className="hidden items-center gap-10 text-sm text-[#5E5E5E] md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-[#1F2A44]"
                aria-label={item.label}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="inline-flex items-center rounded-full border border-[#A7B0B9]/55 bg-[#F4F6F8] px-4 py-2 text-sm text-[#5E5E5E] shadow-sm transition hover:bg-white/70 md:hidden"
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
        <section id="hero" className="scroll-mt-24 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center rounded-full bg-[#A7B0B9] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1F2A44] shadow-sm">
              Entrepreneur · Builder · Thinker
            </div>

            <h1 className="mt-6 max-w-xl font-[var(--font-serif)] text-5xl leading-[1.02] tracking-tight sm:text-6xl">
              Building strong,{' '}
              <span className="text-[#3A6EA5] italic">safe</span> spaces from the ground up.
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-relaxed text-[#5E5E5E] sm:text-base">
              I&apos;m Salman Shariff — focused on quality construction, reliable timelines, and craftsmanship that lasts.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#ventures"
                className="rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                See My Work
              </a>
              <a
                href="#daily-log"
                className="rounded-xl border border-[#A7B0B9]/55 bg-[#F4F6F8] px-6 py-3 text-sm font-semibold text-[#1F2A44] shadow-sm transition hover:bg-white/70"
              >
                Today&apos;s Update
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-[4/3.2] w-full max-w-lg overflow-hidden rounded-[36px] border border-[#A7B0B9]/45 bg-gradient-to-br from-[#3A6EA5]/25 via-[#F4F6F8] to-white shadow-sm">
              <img
                src={heroPhoto}
                alt="Salman Shariff"
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#1F2A44]/18 via-[#1F2A44]/0 to-[#1F2A44]/0" />
            </div>

            <div className="pointer-events-none absolute bottom-5 left-5 w-[220px] rounded-2xl border border-[#A7B0B9]/55 bg-[#F4F6F8]/90 px-3.5 py-2.5 shadow-sm backdrop-blur">
              <div className="flex items-start gap-2.5">
                <span className="mt-1.5 inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                <div>
                  <div className="text-[13px] font-semibold leading-tight text-[#1F2A44]">
                    Available for consulting
                  </div>
                  <div className="mt-0.5 text-[11px] leading-tight text-[#5E5E5E]">Updated today</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-16 space-y-16">
          <section
            id="story"
            className="scroll-mt-24 rounded-[28px] border border-[#A7B0B9]/45 bg-white/70 p-8 shadow-sm backdrop-blur"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-[var(--font-serif)] text-3xl tracking-tight text-[#1F2A44]">
                Story
              </h2>
              <div className="text-sm text-[#5E5E5E]">Who he is</div>
            </div>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
              <div>
                <p className="text-sm leading-relaxed text-[#5E5E5E] sm:text-base">
                  Salman Shariff is a construction professional focused on delivering clean, safe, and
                  well-managed builds. The goal is simple: build spaces that look great, perform
                  better, and stay on schedule.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {values.map((v) => (
                    <div
                      key={v.title}
                      className="rounded-[18px] border border-[#A7B0B9]/45 bg-[#F4F6F8] p-4"
                    >
                      <div className="text-sm font-semibold text-[#1F2A44]">{v.title}</div>
                      <div className="mt-1 text-sm leading-relaxed text-[#5E5E5E]">{v.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-[#A7B0B9]/45 bg-[#F4F6F8] p-6 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5E5E5E]">
                  At a glance
                </div>
                <dl className="mt-4 space-y-3">
                  {[
                    { k: 'Focus', v: 'Residential + Commercial' },
                    { k: 'Style', v: 'Turnkey delivery' },
                    { k: 'Strength', v: 'Timelines + quality' },
                  ].map((row) => (
                    <div key={row.k} className="flex items-center justify-between gap-4">
                      <dt className="text-sm text-[#5E5E5E]">{row.k}</dt>
                      <dd className="text-sm font-semibold text-[#1F2A44]">{row.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          <section id="ventures" className="scroll-mt-24">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-[var(--font-serif)] text-3xl tracking-tight text-[#1F2A44]">
                Ventures
              </h2>
              <div className="text-sm text-[#5E5E5E]">What he built</div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {featuredProjects.map((p) => (
                <article
                  key={p.title}
                  className="rounded-[22px] border border-[#A7B0B9]/45 bg-white/70 p-6 shadow-sm backdrop-blur"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5E5E5E]">
                    {p.meta}
                  </div>
                  <div className="mt-3 text-base font-semibold text-[#1F2A44]">{p.title}</div>
                  <div className="mt-2 text-sm leading-relaxed text-[#5E5E5E]">{p.text}</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[#A7B0B9]/55 bg-[#F4F6F8] px-3 py-1 text-xs font-semibold text-[#5E5E5E]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] border border-[#A7B0B9]/45 bg-white/70 p-8 shadow-sm backdrop-blur">
                <div className="text-sm font-semibold text-[#1F2A44]">Services</div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {services.map((s) => (
                    <div key={s.title} className="rounded-[18px] border border-[#A7B0B9]/45 bg-[#F4F6F8] p-4">
                      <div className="text-sm font-semibold text-[#1F2A44]">{s.title}</div>
                      <div className="mt-1 text-sm leading-relaxed text-[#5E5E5E]">{s.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#A7B0B9]/45 bg-white/70 p-8 shadow-sm backdrop-blur">
                <div className="text-sm font-semibold text-[#1F2A44]">How I work</div>
                <ol className="mt-5 space-y-4">
                  {[
                    { n: '01', t: 'Plan', d: 'Scope, BOQ, and a realistic timeline.' },
                    { n: '02', t: 'Build', d: 'Daily site checks + coordinated execution.' },
                    { n: '03', t: 'Deliver', d: 'Clean handover with punch-list closure.' },
                  ].map((step) => (
                    <li key={step.n} className="flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#A7B0B9] text-sm font-bold text-[#1F2A44]">
                        {step.n}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#1F2A44]">{step.t}</div>
                        <div className="mt-1 text-sm leading-relaxed text-[#5E5E5E]">{step.d}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section
            id="daily-log"
            className="scroll-mt-24 rounded-[28px] border border-[#A7B0B9]/45 bg-white/70 p-8 shadow-sm backdrop-blur"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-[var(--font-serif)] text-3xl tracking-tight text-[#1F2A44]">
                Daily Log
              </h2>
              <div className="text-sm text-[#5E5E5E]">What&apos;s happening now</div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {dailyUpdates.map((u) => (
                <article
                  key={u.title}
                  className="rounded-[22px] border border-[#A7B0B9]/45 bg-[#F4F6F8] p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5E5E5E]">
                      {u.date}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {u.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[#A7B0B9]/55 bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-[#5E5E5E]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 text-sm font-semibold text-[#1F2A44]">{u.title}</div>
                  <div className="mt-2 text-sm leading-relaxed text-[#5E5E5E]">{u.text}</div>
                </article>
              ))}
            </div>
          </section>

          <section
            id="thoughts"
            className="scroll-mt-24 rounded-[28px] border border-[#A7B0B9]/45 bg-white/70 p-8 shadow-sm backdrop-blur"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-[var(--font-serif)] text-3xl tracking-tight text-[#1F2A44]">
                Thoughts
              </h2>
              <div className="text-sm text-[#5E5E5E]">What he believes</div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {thoughts.map((p) => (
                <a
                  key={p.title}
                  href="#"
                  className="group rounded-[22px] border border-[#A7B0B9]/45 bg-[#F4F6F8] p-6 shadow-sm transition hover:bg-white/70"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3A6EA5]">
                    {p.topic}
                  </div>
                  <div className="mt-3 text-sm font-semibold text-[#1F2A44] group-hover:underline">
                    {p.title}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-[#5E5E5E]">{p.text}</div>
                  <div className="mt-4 text-xs font-semibold text-[#2563EB]">Read →</div>
                </a>
              ))}
            </div>
          </section>

          <section id="press" className="scroll-mt-24">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-[var(--font-serif)] text-3xl tracking-tight text-[#1F2A44]">
                Press
              </h2>
              <div className="text-sm text-[#5E5E5E]">Where he was featured</div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[28px] border border-[#A7B0B9]/45 bg-white/70 shadow-sm backdrop-blur">
              <div className="grid grid-cols-1 divide-y divide-[#A7B0B9]/35">
                {press.map((row) => (
                  <div key={row.title} className="flex items-center justify-between gap-4 p-6">
                    <div>
                      <div className="text-sm font-semibold text-[#1F2A44]">{row.title}</div>
                      <div className="mt-1 text-sm text-[#5E5E5E]">
                        {row.outlet} · {row.year}
                      </div>
                    </div>
                    <a href="#" className="text-sm font-semibold text-[#2563EB] hover:opacity-90">
                      Read →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="achievements"
            className="scroll-mt-24 rounded-[28px] border border-[#A7B0B9]/45 bg-white/70 p-8 shadow-sm backdrop-blur"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-[var(--font-serif)] text-3xl tracking-tight text-[#1F2A44]">
                Achievements
              </h2>
              <div className="text-sm text-[#5E5E5E]">Awards, milestones</div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { kpi: '50+', label: 'Projects delivered' },
                { kpi: '10+', label: 'Years experience' },
                { kpi: '5★', label: 'Client satisfaction' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[22px] border border-[#A7B0B9]/45 bg-[#F4F6F8] p-6 text-center shadow-sm"
                >
                  <div className="text-3xl font-bold tracking-tight text-[#1F2A44]">{stat.kpi}</div>
                  <div className="mt-2 text-sm text-[#5E5E5E]">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[22px] border border-[#A7B0B9]/45 bg-white/60 p-6">
              <div className="text-sm font-semibold text-[#1F2A44]">Milestones</div>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {milestones.map((m) => (
                  <div key={m.year} className="rounded-[18px] border border-[#A7B0B9]/45 bg-[#F4F6F8] p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5E5E5E]">
                      {m.year}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-[#1F2A44]">{m.title}</div>
                    <div className="mt-1 text-sm leading-relaxed text-[#5E5E5E]">{m.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="connect"
            className="scroll-mt-24 rounded-[28px] border border-[#A7B0B9]/45 bg-gradient-to-br from-white/70 via-white/60 to-[#F4F6F8] p-8 shadow-sm backdrop-blur"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-[var(--font-serif)] text-3xl tracking-tight text-[#1F2A44]">
                Connect
              </h2>
              <div className="text-sm text-[#5E5E5E]">Contact + socials</div>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#5E5E5E] sm:text-base">
              Want to discuss a project? Send a message and we&apos;ll set up a quick call.
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <form
                className="rounded-[22px] border border-[#A7B0B9]/45 bg-white/70 p-6 shadow-sm backdrop-blur"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5E5E5E]">
                      Name
                    </span>
                    <input
                      className="h-11 rounded-xl border border-[#A7B0B9]/55 bg-white/80 px-4 text-sm text-[#1F2A44] outline-none ring-0 placeholder:text-[#A7B0B9] focus:border-[#3A6EA5]"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5E5E5E]">
                      Email
                    </span>
                    <input
                      type="email"
                      className="h-11 rounded-xl border border-[#A7B0B9]/55 bg-white/80 px-4 text-sm text-[#1F2A44] outline-none ring-0 placeholder:text-[#A7B0B9] focus:border-[#3A6EA5]"
                      placeholder="you@email.com"
                    />
                  </label>
                </div>

                <label className="mt-4 grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5E5E5E]">
                    Message
                  </span>
                  <textarea
                    className="min-h-[120px] resize-none rounded-xl border border-[#A7B0B9]/55 bg-white/80 px-4 py-3 text-sm text-[#1F2A44] outline-none placeholder:text-[#A7B0B9] focus:border-[#3A6EA5]"
                    placeholder="Tell me about your project..."
                  />
                </label>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  >
                    Send message
                  </button>
                  <a
                    href="mailto:hello@example.com"
                    className="rounded-xl border border-[#A7B0B9]/55 bg-white/70 px-6 py-3 text-sm font-semibold text-[#1F2A44] shadow-sm transition hover:bg-white"
                  >
                    Email directly
                  </a>
                </div>
                <div className="mt-3 text-xs text-[#5E5E5E]">
                  Replace <span className="font-semibold">hello@example.com</span> with your real email.
                </div>
              </form>

              <div className="space-y-4">
                <div className="rounded-[22px] border border-[#A7B0B9]/45 bg-[#F4F6F8] p-6 shadow-sm">
                  <div className="text-sm font-semibold text-[#1F2A44]">Quick links</div>
                  <div className="mt-4 grid gap-3">
                    {[
                      { label: 'WhatsApp', href: '#' },
                      { label: 'Instagram', href: '#' },
                      { label: 'LinkedIn', href: '#' },
                    ].map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="flex items-center justify-between rounded-xl border border-[#A7B0B9]/55 bg-white/70 px-4 py-3 text-sm font-semibold text-[#1F2A44] shadow-sm transition hover:bg-white"
                      >
                        <span>{link.label}</span>
                        <span className="text-[#3A6EA5]">→</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="rounded-[22px] border border-[#A7B0B9]/45 bg-white/70 p-6 shadow-sm backdrop-blur">
                  <div className="text-sm font-semibold text-[#1F2A44]">Availability</div>
                  <div className="mt-2 text-sm leading-relaxed text-[#5E5E5E]">
                    Taking on a limited number of projects each month. Best fit: quality-focused builds
                    with clear timelines.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
