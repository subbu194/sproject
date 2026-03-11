import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

export default function AdminSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/auth/signup', { name, email, password });
      navigate('/admin/login');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Signup failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--warm-white)] px-6">
      <div className="w-full max-w-sm">
        <NavLink
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--brown)]"
        >
          ← Back to site
        </NavLink>

        <div className="rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-8 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            Admin
          </div>
          <h1 className="mt-3 font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[var(--brown)]">
            Create Account
          </h1>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Full Name
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl border border-[var(--brown)]/10 bg-[var(--warm-white)] px-4 text-sm text-[var(--brown)] outline-none transition focus:border-[var(--gold)]"
                placeholder="Salman Shariff"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border border-[var(--brown)]/10 bg-[var(--warm-white)] px-4 text-sm text-[var(--brown)] outline-none transition focus:border-[var(--gold)]"
                placeholder="admin@example.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Password
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border border-[var(--brown)]/10 bg-[var(--warm-white)] px-4 text-sm text-[var(--brown)] outline-none transition focus:border-[var(--gold)]"
                placeholder="••••••••"
              />
            </label>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-[var(--gold)] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--gold-light)] disabled:opacity-60"
            >
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-[var(--muted)]">
            Already have an account?{' '}
            <NavLink to="/admin/login" className="font-semibold text-[var(--gold)] hover:underline">
              Sign in
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
