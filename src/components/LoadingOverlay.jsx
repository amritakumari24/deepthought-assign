import { useEffect } from 'react';

export default function LoadingOverlay({ loading = false, message = 'Analyzing transcript...' }) {
  useEffect(() => {
    if (!loading) return undefined;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="flex items-center gap-4 rounded-lg bg-white px-6 py-4 shadow-lg">
        <svg
          className="h-6 w-6 animate-spin text-emerald-700"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2Z"
          />
        </svg>

        <span className="text-sm font-medium text-slate-900">{message}</span>
      </div>
    </div>
  );
}
