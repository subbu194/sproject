import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorBoundary({ 
  title = 'Something went wrong', 
  message = 'Please try again or contact support if the problem persists.',
  onRetry,
  className = ''
}: ErrorBoundaryProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="relative mb-4">
        {/* Gold gradient background for error icon */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)] rounded-full blur-lg opacity-25"></div>
        <div className="relative bg-gradient-to-br from-[var(--gold)]/15 via-[var(--gold-light)]/10 to-[var(--gold)]/15 p-3 rounded-full border border-[var(--gold)]/25 backdrop-blur-sm">
          <AlertTriangle className="h-6 w-6 text-[var(--gold)]" />
        </div>
      </div>
      
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)] rounded-full blur-xl opacity-20"></div>
        <div className="relative bg-gradient-to-br from-[var(--gold)]/10 via-[var(--gold-light)]/5 to-[var(--gold)]/10 p-2 rounded-full border border-[var(--gold)]/20 backdrop-blur-sm">
          <img 
            src="/sprojectlogo.png" 
            alt="S Project Logo" 
            className="h-4 w-4 object-contain filter drop-shadow-sm"
          />
        </div>
      </div>
      
      <h3 className="font-['Playfair_Display'] text-xl font-bold text-[var(--brown)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--muted)] mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[var(--gold-light)] hover:shadow-lg hover:scale-105"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
