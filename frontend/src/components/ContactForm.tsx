import { useState } from 'react';
import apiClient from '../api/client';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiClient.post('/contact', { name, email, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setError('Could not send message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--brown-light)] p-8 text-center">
        <div className="text-3xl">✉️</div>
        <h3 className="mt-3 font-['Playfair_Display'] text-xl font-bold text-[var(--cream)]">
          Message Sent!
        </h3>
        <p className="mt-2 text-sm text-[var(--cream)]/70">
          Thank you for reaching out. I'll get back to you shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 rounded-xl border border-[var(--gold)] px-5 py-2 text-sm font-semibold text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-white"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cream)]/70">
            Name
          </span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 rounded-xl border border-[var(--cream)]/15 bg-[var(--cream)] px-4 text-sm text-[var(--brown)] outline-none transition focus:border-[var(--gold)]"
            placeholder="Your name"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cream)]/70">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl border border-[var(--cream)]/15 bg-[var(--cream)] px-4 text-sm text-[var(--brown)] outline-none transition focus:border-[var(--gold)]"
            placeholder="you@example.com"
          />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cream)]/70">
          Message
        </span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-xl border border-[var(--cream)]/15 bg-[var(--cream)] px-4 py-3 text-sm text-[var(--brown)] outline-none transition focus:border-[var(--gold)]"
          placeholder="Tell me about your project or just say hello..."
        />
      </label>

      {error && (
        <div className="rounded-xl border border-red-300/30 bg-red-100/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-[var(--gold)] py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[var(--gold-light)] hover:shadow-lg disabled:opacity-60"
      >
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
