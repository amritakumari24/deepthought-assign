export default function ErrorAlert({ error = null, onClose = () => {} }) {
  if (!error) return null;

  const technical = typeof error === 'string' ? '' : error && error.message ? error.message : '';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-md border border-rose-200 bg-rose-50 p-4"
    >
      <div className="flex items-start">
        <div className="shrink-0">
          <svg className="h-6 w-6 text-rose-700" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11.001 10h2v5h-2z" fill="currentColor" />
            <path d="M11 16h2v2h-2z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z" fill="currentColor" />
          </svg>
        </div>

        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-semibold text-rose-800">We couldn't complete the request</p>
          <p className="mt-1 text-sm text-rose-700">Please try again in a moment. If the issue continues, contact support.</p>
          {technical && (
            <p className="mt-2 text-xs text-rose-600">Details: {technical}</p>
          )}
        </div>

        <div className="ml-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-md border border-rose-200 bg-white px-3 py-1 text-sm font-medium text-rose-700 shadow-sm hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-100"
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
