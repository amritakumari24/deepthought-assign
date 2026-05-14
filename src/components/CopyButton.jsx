export default function CopyButton({ text, feedbackId, isCopied, onCopy, label = 'Copy' }) {
  return (
    <button
      type="button"
      onClick={() => onCopy(text, feedbackId)}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-100"
      title={`Copy ${label.toLowerCase()}`}
    >
      {isCopied ? (
        <>
          <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M5 3a2 2 0 012-2h6a2 2 0 012 2v2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2H3a2 2 0 01-2-2V7a2 2 0 012-2h2V3z" />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
