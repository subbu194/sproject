import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../constants/navItems';
import { SITE_NAME } from '../constants/content';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--gold)]/10 bg-[var(--warm-white)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            {/* Gold gradient background for logo */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)] rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
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
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--gold)]/10 bg-[var(--warm-white)] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
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
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
