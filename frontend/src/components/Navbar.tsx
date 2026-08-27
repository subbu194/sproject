import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from 'framer-motion';
import { NAV_ITEMS } from '../constants/navItems';
import { SITE_NAME } from '../constants/content';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isHomePath = window.location.pathname === '/';
    // Hero is pinned for 400% (500vh total), so we transition at 4.9 viewport heights
    const threshold = isHomePath ? window.innerHeight * 4.9 : 10;
    return window.scrollY > threshold;
  });
  
  const { scrollY } = useScroll();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const threshold = isHome ? window.innerHeight * 4.9 : 10;
    const isScrolled = latest > threshold;
    if (scrolled !== isScrolled) {
      setScrolled(isScrolled);
    }
  });

  // Close mobile menu on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // The client requested a permanently transparent header with brighter text
  const navClasses = `fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-50 rounded-full transition-all duration-500 backdrop-blur-md border bg-black/20 border-white/10 shadow-lg shadow-black/10`;

  const textClasses = 'text-white';
  const mutedTextClasses = 'text-white/90 font-medium hover:text-[var(--gold)] hover:bg-white/10';
  const activeTextClasses = 'text-[var(--gold)] font-bold bg-white/10';

  return (
    <nav className={navClasses}>
      <div className="mx-auto flex max-w-7xl items-center justify-between pl-3 pr-5 py-2.5">
        {/* Logo */}
        <NavLink
          to="/"
          className={`flex items-center gap-3 group transition-all duration-300 hover:scale-[1.03] ${textClasses}`}
        >
          <div className="relative">
            {/* Gold gradient background for logo */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)] rounded-full blur-xl opacity-20 group-hover:opacity-35 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-br from-[var(--gold)]/10 via-[var(--gold-light)]/5 to-[var(--gold)]/10 p-1.5 rounded-full border border-[var(--gold)]/20 backdrop-blur-sm">
              <img
                src="/sprojectlogo.png"
                alt="S Project Logo"
                className="h-8 w-8 object-contain filter drop-shadow-sm transition-all duration-500 brightness-[2] contrast-150"
              />
            </div>
          </div>
          <span className="font-['Playfair_Display'] text-lg font-bold tracking-tight">
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
                `rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                  isActive ? activeTextClasses : mutedTextClasses
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors md:hidden text-white hover:bg-white/10"
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

      {/* Mobile menu with Framer Motion */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-50 border-t border-[var(--gold)]/10 bg-[var(--warm-white)] px-6 py-4 md:hidden"
            >
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.sectionId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                  >
                    <NavLink
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2.5 text-left text-sm font-medium transition hover:bg-[var(--cream)] hover:text-[var(--brown)] ${
                          isActive
                            ? 'bg-[var(--cream)] text-[var(--brown)]'
                            : 'text-[var(--muted)]'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
