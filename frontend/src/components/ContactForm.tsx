import { useState } from "react";
import apiClient from "../api/client";
import {
  Mail,
  User,
  MessageSquare,
  Send,
  CheckCircle,
} from "lucide-react";

import {
  FaWhatsapp,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

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
          className="mt-4 rounded-xl border border-[var(--gold)] px-5 py-2 text-sm font-semibold text-[var(--gold)] hover:bg-[var(--gold)] hover:text-white"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">

      {/* CONTACT INFO */}
      <div className="space-y-8">

        <h2 className="font-['Playfair_Display'] text-3xl text-[var(--brown)]">
          Get In Touch
        </h2>

        <p className="text-[var(--muted)] max-w-md">
          Feel free to reach out for collaborations, projects, or just a
          friendly hello 👋
        </p>

        {/* CONTACT BUTTONS */}

        <div className="space-y-4">

          <a
            href="https://wa.me/919000000000"
            target="_blank"
            className="flex items-center gap-4 rounded-xl border p-4 hover:bg-green-50 transition"
          >
            <FaWhatsapp className="text-green-500 text-xl" />
            <span className="text-sm font-semibold">WhatsApp</span>
          </a>

          <a
            href="https://instagram.com/yourprofile"
            target="_blank"
            className="flex items-center gap-4 rounded-xl border p-4 hover:bg-pink-50 transition"
          >
            <FaInstagram className="text-pink-500 text-xl" />
            <span className="text-sm font-semibold">Instagram</span>
          </a>

          <a
            href="mailto:your@email.com"
            className="flex items-center gap-4 rounded-xl border p-4 hover:bg-yellow-50 transition"
          >
            <Mail className="text-[var(--gold)]" />
            <span className="text-sm font-semibold">Email</span>
          </a>

        </div>
      </div>

      {/* CONTACT FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid gap-6 sm:grid-cols-2">

          <label>
            <span className="text-xs uppercase text-[var(--muted)]">
              Name
            </span>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:border-[var(--gold)] outline-none"
              placeholder="Your name"
            />
          </label>

          <label>
            <span className="text-xs uppercase text-[var(--muted)]">
              Email
            </span>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:border-[var(--gold)] outline-none"
              placeholder="you@email.com"
            />
          </label>

        </div>

        <label>
          <span className="text-xs uppercase text-[var(--muted)]">
            Message
          </span>

          <textarea
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:border-[var(--gold)] outline-none"
            placeholder="Tell me about your project..."
          />
        </label>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[var(--gold)] py-3 text-white font-semibold hover:bg-[var(--gold-light)] transition"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>

      </form>
    </div>
  );
}