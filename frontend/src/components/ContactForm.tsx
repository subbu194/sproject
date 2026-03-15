import { useState } from "react";
import apiClient from "../api/client";
import { Send, CheckCircle } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await apiClient.post("/contact", { name, email, message });

      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Could not send message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--brown-light)] p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-8 w-8 text-[var(--gold)]" />

        <h3 className="font-['Playfair_Display'] text-xl font-bold text-[var(--cream)]">
          Message Sent!
        </h3>

        <p className="mt-2 text-sm text-[var(--cream)]/70">
          Thank you for reaching out. I'll get back to you shortly.
        </p>

        <button
          onClick={() => setSuccess(false)}
          className="mt-4 rounded-xl border border-[var(--gold)] px-5 py-2 text-sm font-semibold text-[var(--gold)] transition-all hover:bg-[var(--gold)] hover:text-white"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--cream)]/60">
            Name
          </span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[var(--cream)]/15 bg-[var(--brown-light)]/50 px-4 py-3 text-sm font-medium text-[var(--cream)] placeholder-[var(--cream)]/30 outline-none transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
            placeholder="Your name"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--cream)]/60">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--cream)]/15 bg-[var(--brown-light)]/50 px-4 py-3 text-sm font-medium text-[var(--cream)] placeholder-[var(--cream)]/30 outline-none transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
            placeholder="you@email.com"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--cream)]/60">
          Message
        </span>
        <textarea
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-[var(--cream)]/15 bg-[var(--brown-light)]/50 px-4 py-3 text-sm font-medium text-[var(--cream)] placeholder-[var(--cream)]/30 outline-none transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 resize-none"
          placeholder="Tell me about your project..."
        />
      </label>

      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] py-3.5 text-sm font-bold tracking-wide text-white shadow-lg shadow-[var(--gold)]/20 transition-all hover:shadow-[var(--gold)]/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
      >
        {submitting ? (
          "Sending..."
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}