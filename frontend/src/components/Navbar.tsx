import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../constants/navItems';
import { SITE_NAME } from '../constants/content';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-[var(--gold)]/10 bg-[var(--warm-white)]/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? 'shadow-lg shadow-[var(--brown)]/5' : 'shadow-none'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3 group transition-all duration-300 hover:scale-[1.03]"
        >
          <div className="relative">
            {/* Gold gradient background for logo */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)] rounded-full blur-xl opacity-20 group-hover:opacity-35 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-br from-[var(--gold)]/10 via-[var(--gold-light)]/5 to-[var(--gold)]/10 p-2 rounded-full border border-[var(--gold)]/20 backdrop-blur-sm">
              <img
                src="/sprojectlogo.png"
                alt="S Project Logo"
                className="h-10 w-10 object-contain filter drop-shadow-sm"
              />
            </div>
          </div>
          <span className="font-['Playfair_Display'] text-xl font-bold tracking-tight text-[var(--brown)]">
            {SITE_NAME}
          </span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.sectionId}
              to={item.path}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-[var(--cream)] hover:text-[var(--brown)] ${
                  isActive
                    ? 'bg-[var(--cream)] text-[var(--brown)]'
                    : 'text-[var(--muted)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--brown)] transition hover:bg-[var(--cream)] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <div className="relative w-5 h-5">
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                mobileOpen ? 'top-2.5 rotate-45' : 'top-0.5'
              }`}
            />
            <span
              className={`absolute left-0 top-2.5 block h-0.5 w-5 bg-current transition-all duration-300 ${
                mobileOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                mobileOpen ? 'top-2.5 -rotate-45' : 'top-4.5'
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50 border-t border-[var(--gold)]/10 bg-[var(--warm-white)] px-6 py-4 md:hidden mobile-menu-enter">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item, i) => (
                <NavLink
                  key={item.sectionId}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-left text-sm font-medium transition hover:bg-[var(--cream)] hover:text-[var(--brown)] ${
                      isActive
                        ? 'bg-[var(--cream)] text-[var(--brown)]'
                        : 'text-[var(--muted)]'
                    }`
                  }
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
