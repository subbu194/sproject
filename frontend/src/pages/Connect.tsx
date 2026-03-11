import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import ContactForm from '../components/ContactForm';

interface SocialLinks {
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  email?: string;
}

export default function Connect() {
  const [social, setSocial] = useState<SocialLinks>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/connect')
      .then((res) => setSocial(res.data?.data || res.data || {}))
      .catch(() => setSocial({}))
      .finally(() => setLoading(false));
  }, []);

  const socialButtons = [
    { key: 'whatsapp', label: 'WhatsApp', icon: '💬', url: social.whatsapp },
    { key: 'instagram', label: 'Instagram', icon: '📷', url: social.instagram },
    { key: 'linkedin', label: 'LinkedIn', icon: '💼', url: social.linkedin },
    { key: 'email', label: 'Email', icon: '✉️', url: social.email ? `mailto:${social.email}` : undefined },
  ].filter((s) => s.url);

  return (
    <div className="min-h-screen bg-[var(--brown)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        {/* Back */}
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--cream)]/15 px-4 py-2 text-sm font-medium text-[var(--cream)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
        >
          <span aria-hidden>←</span> Back to Home
        </a>

        <div className="mt-8">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            Connect
          </div>
          <h1 className="mt-4 font-['Playfair_Display'] text-4xl font-bold tracking-tight text-[var(--cream)] sm:text-5xl">
            Let's Work Together
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--cream)]/70">
            Reach out for collaborations, partnerships, or just to say hello.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          {/* Social links */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--cream)]">Find Me On</h3>
            {loading ? (
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-12 w-48 !bg-white/5" />
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
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold)]/30 px-6 py-3.5 text-sm font-medium text-[var(--cream)] transition-all duration-200 hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-white"
                    >
                      <span className="text-lg">{s.icon}</span>
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
