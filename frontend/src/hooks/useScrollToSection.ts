import { useCallback, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useScrollToSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const pendingRef = useRef<string | null>(null);

  useEffect(() => {
    if (location.pathname === '/' && pendingRef.current) {
      const el = document.getElementById(pendingRef.current);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
      pendingRef.current = null;
    }
  }, [location.pathname]);

  const scrollTo = useCallback(
    (sectionId: string) => {
      if (location.pathname === '/') {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        pendingRef.current = sectionId;
        navigate('/');
      }
    },
    [location.pathname, navigate]
  );

  return scrollTo;
}
