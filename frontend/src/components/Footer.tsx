import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SITE_NAME, FOOTER_TEXT } from '../constants/content';
import { NAV_ITEMS } from '../constants/navItems';
import apiClient from '../api/client';
import { FaWhatsapp, FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Mail } from 'lucide-react';

interface SocialLinks {
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  email?: string;
}

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [social, setSocial] = useState<SocialLinks>({});

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    apiClient
      .get('/connect')
      .then((res) => setSocial(res.data?.data || res.data || {}))
      .catch(() => setSocial({}));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) return url;
    return `https://${url}`;
  };

  const socialIcons = [
    { key: 'whatsapp', icon: <FaWhatsapp className="h-5 w-5" />, url: formatUrl(social.whatsapp), label: 'WhatsApp' },
    { key: 'twitter', icon: <FaXTwitter className="h-5 w-5" />, url: formatUrl(social.twitter), label: 'Twitter' },
    { key: 'facebook', icon: <FaFacebook className="h-5 w-5" />, url: formatUrl(social.facebook), label: 'Facebook' },
    { key: 'instagram', icon: <FaInstagram className="h-5 w-5" />, url: formatUrl(social.instagram), label: 'Instagram' },
    { key: 'linkedin', icon: <FaLinkedin className="h-5 w-5" />, url: formatUrl(social.linkedin), label: 'LinkedIn' },
    { key: 'email', icon: <Mail className="h-5 w-5" />, url: social.email ? `mailto:${social.email}` : undefined, label: 'Email' },
  ].filter((s) => s.url);

  return (
    <>
      <footer className="border-t border-[var(--gold)]/20 bg-[var(--brown)]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)] rounded-full blur-lg opacity-25"></div>
                  <div className="relative bg-gradient-to-br from-[var(--gold)]/15 via-[var(--gold-light)]/10 to-[var(--gold)]/15 p-1.5 rounded-full border border-[var(--gold)]/25 backdrop-blur-sm">
                    <img
                      src="/sprojectlogo.png"
                      alt="S Project Logo"
                      className="h-6 w-6 object-contain filter drop-shadow-sm"
                    />
                  </div>
                </div>
                <span className="font-['Playfair_Display'] text-lg font-bold text-[var(--cream)]">
                  {SITE_NAME}
                </span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--cream)]/50">
                Social Entrepreneur, Philanthropist & Humanitarian — creating impact through community building.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-2.5">
                {NAV_ITEMS.map((item) => (
                  <li key={item.sectionId}>
                    <NavLink
                      to={item.path}
                      className="text-sm text-[var(--cream)]/60 transition-colors hover:text-[var(--gold)]"
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                Connect With Me
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--cream)]/50">
                Interested in collaborating or just want to say hello?
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {socialIcons.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--cream)]/15 text-[var(--cream)]/60 transition-all duration-200 hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-white"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
              <NavLink
                to="/page/connect"
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[var(--gold)]/30 px-5 py-2.5 text-sm font-semibold text-[var(--gold)] transition-all duration-200 hover:bg-[var(--gold)] hover:text-white"
              >
                Contact Me
                <span>→</span>
              </NavLink>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--cream)]/10 pt-6 sm:flex-row">
            <p className="text-sm text-[var(--cream)]/40">
              {FOOTER_TEXT}
            </p>
            <button
              onClick={scrollToTop}
              className="text-sm text-[var(--cream)]/40 transition-colors hover:text-[var(--gold)]"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* Floating back-to-top button */}
      <button
        onClick={scrollToTop}
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        aria-label="Back to top"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="18 15l-6-6-6 6" />
        </svg>
      </button>
    </>
  );
}
