import { SITE_NAME, FOOTER_TEXT } from '../constants/content';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--gold)]/20 bg-[var(--brown)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="font-['Playfair_Display'] text-lg font-bold text-[var(--cream)]">
          {SITE_NAME}
        </div>
        <div className="text-sm text-[var(--muted)]">
          {FOOTER_TEXT}
        </div>
      </div>
    </footer>
  );
}
