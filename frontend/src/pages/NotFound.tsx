import { NavLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="font-['Playfair_Display'] text-8xl font-bold text-[var(--gold)]">404</div>
      <h1 className="mt-4 font-['Playfair_Display'] text-2xl font-bold text-[var(--brown)]">
        Page Not Found
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <NavLink
        to="/"
        className="mt-8 rounded-xl bg-[var(--gold)] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--gold-light)]"
      >
        Back to Home
      </NavLink>
    </div>
  );
}
