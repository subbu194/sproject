import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../constants/navItems';
import { SITE_NAME } from '../constants/content';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path: string, sectionId: string) => {
    setMobileOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--gold)]/10 bg-[var(--warm-white)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <NavLink
          to="/"
          className="font-['Playfair_Display'] text-xl font-bold tracking-tight text-[var(--brown)]"
        >
          {SITE_NAME}
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.sectionId}
              onClick={() => handleNavClick(item.path, item.sectionId)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition-all duration-200 hover:bg-[var(--cream)] hover:text-[var(--brown)]"
            >
              {item.label}
            </button>
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
              <button
                key={item.sectionId}
                onClick={() => handleNavClick(item.path, item.sectionId)}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--cream)] hover:text-[var(--brown)]"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
