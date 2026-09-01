import ContactForm from '../components/ContactForm';
import { ArrowLeft } from 'lucide-react';
import useSocialLinks from '../hooks/useSocialLinks';

export default function Connect() {
  const { socialButtons, loading } = useSocialLinks();

  return (
    <div className="min-h-screen bg-[var(--brown)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        {/* Back */}
        <a
          href="/"
          className="group inline-flex items-center gap-2 rounded-xl border border-[var(--cream)]/15 px-4 py-2 text-sm font-medium text-[var(--cream)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </a>

        <div className="mt-8">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            Connect
          </div>
          <h1 className="mt-4 font-['Playfair_Display'] text-4xl font-bold tracking-tight text-[var(--cream)] sm:text-5xl">
            Let's Work Together{' '}
            <span className="text-[var(--gold)]">+</span>
            {' '}Create Together{' '}
            <span className="text-[var(--gold)]">+</span>
            {' '}Grow Together{' '}
            <span className="text-[var(--gold)]">=</span>
            {' '}SUCCESS
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--cream)]/70">
            Whether it's a project, partnership, or just a conversation — I'd love to hear from you.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          {/* Social links */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--cream)]">Find Me On</h3>
            {loading ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-12 w-32 !bg-white/5 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap gap-3">
                {socialButtons.length > 0 ? (
                  socialButtons.map((s) => (
                    <a
                      key={s.key}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2.5 rounded-xl border border-[var(--cream)]/15 px-6 py-3.5 text-sm font-medium text-[var(--cream)] transition-all duration-200 ${s.hoverClass}`}
                    >
                      {s.icon}
                      {s.label}
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-[var(--cream)]/50">Social links coming soon.</p>
                )}
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-[var(--cream)]">Send a Message</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
