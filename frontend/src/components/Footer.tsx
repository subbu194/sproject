import { SITE_NAME, FOOTER_TEXT } from '../constants/content';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--gold)]/20 bg-[var(--brown)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* Gold gradient background for footer logo */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)] rounded-full blur-lg opacity-25"></div>
            <div className="relative bg-gradient-to-br from-[var(--gold)]/15 via-[var(--gold-light)]/10 to-[var(--gold)]/15 p-1.5 rounded-full border border-[var(--gold)]/25 backdrop-blur-sm">
              <img 
                src="/sprojectlogo.png" 
                alt="S Project Logo" 
                className="h-5 w-5 object-contain filter drop-shadow-sm"
              />
            </div>
          </div>
          <span className="font-['Playfair_Display'] text-lg font-bold text-[var(--cream)]">
            {SITE_NAME}
          </span>
        </div>
        <div className="text-sm text-[var(--muted)]">
          {FOOTER_TEXT}
        </div>
      </div>
    </footer>
  );
}
