import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import ContactForm from '../../components/ContactForm';

interface SocialLinks {
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  email?: string;
}

export default function ConnectPreview() {
  const [social, setSocial] = useState<SocialLinks>({});

  useEffect(() => {
    apiClient
      .get('/connect')
      .then((res) => setSocial(res.data?.data || res.data || {}))
      .catch(() => setSocial({}));
  }, []);

  const formatUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) return url;
    return `https://${url}`;
  };

  const socialButtons = [
    { key: 'whatsapp', label: 'WhatsApp', icon: '💬', url: formatUrl(social.whatsapp) },
    { key: 'instagram', label: 'Instagram', icon: '📷', url: formatUrl(social.instagram) },
    { key: 'linkedin', label: 'LinkedIn', icon: '💼', url: formatUrl(social.linkedin) },
    { key: 'email', label: 'Email', icon: '✉️', url: social.email ? `mailto:${social.email}` : undefined },
  ].filter((s) => s.url);

  return (
    <section id="connect" className="scroll-mt-24 bg-[var(--brown)] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
          Connect
        </div>
        <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[var(--cream)] sm:text-4xl">
          Let's Work Together
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--cream)]/70">
          Whether it's a project, partnership, or just a conversation — I'd love to hear from you.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-[var(--cream)]">Find me on</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {socialButtons.length > 0 ? (
                socialButtons.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold)]/30 px-5 py-3 text-sm font-medium text-[var(--cream)] transition-all duration-200 hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-white"
                  >
                    <span>{s.icon}</span>
                    {s.label}
                  </a>
                ))
              ) : (
                <p className="text-sm text-[var(--cream)]/50">Social links coming soon.</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[var(--cream)]">Send a Message</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
