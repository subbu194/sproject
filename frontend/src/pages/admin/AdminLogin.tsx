import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { setAdminToken } from '../../api/client';
import { ArrowLeft, KeyRound, Mail, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const token = res.data?.data?.token || res.data?.token;
      if (token) {
        localStorage.setItem('adminToken', token);
        setAdminToken(token);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials.');
      }
    } catch {
      setError('Invalid credentials or server unreachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--warm-white)] px-6 relative overflow-hidden font-sans">
      {/* Decorative background blurs */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-[var(--gold)]/20 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[var(--brown)]/10 blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <NavLink
          to="/"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--muted)] transition-all hover:text-[var(--brown)]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to site
        </NavLink>

        <div className="rounded-2xl border border-[var(--brown)]/10 bg-white/80 p-10 shadow-xl shadow-black/5 backdrop-blur-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brown)] text-white shadow-lg shadow-[var(--brown)]/20 mb-6">
            <ShieldCheck className="h-6 w-6" />
          </div>
          
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)]">
            Command Center
          </div>
          <h1 className="mt-2 font-['Playfair_Display'] text-4xl font-black tracking-tight text-[var(--brown)]">
            Admin Login
          </h1>
          <p className="mt-2 text-sm font-medium text-[var(--muted)]">Please verify your identity to continue.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block group">
              <span className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)] group-focus-within:text-[var(--gold)] transition-colors">
                <Mail className="h-3.5 w-3.5" /> Email Address
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border-2 border-[var(--brown)]/10 bg-[var(--warm-white)] px-4 py-3 text-sm font-medium text-[var(--brown)] outline-none transition-all hover:border-[var(--brown)]/20 focus:border-[var(--gold)] focus:bg-white focus:ring-4 focus:ring-[var(--gold)]/10"
                placeholder="admin@example.com"
              />
            </label>

            <label className="block group">
               <span className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)] group-focus-within:text-[var(--gold)] transition-colors">
                <KeyRound className="h-3.5 w-3.5" /> Security Password
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border-2 border-[var(--brown)]/10 bg-[var(--warm-white)] px-4 py-3 text-sm font-medium text-[var(--brown)] outline-none transition-all hover:border-[var(--brown)]/20 focus:border-[var(--gold)] focus:bg-white focus:ring-4 focus:ring-[var(--gold)]/10"
                placeholder="••••••••"
              />
            </label>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm font-bold text-red-600 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] py-3.5 text-sm font-bold tracking-wide text-white shadow-lg shadow-[var(--gold)]/20 transition-all hover:shadow-[var(--gold)]/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? 'Authenticating…' : 'Establish Connection'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-[var(--muted)] pt-6 border-t border-[var(--brown)]/5">
            Initial setup?{' '}
            <NavLink to="/admin/signup" className="font-bold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors">
              Initialize Account
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
