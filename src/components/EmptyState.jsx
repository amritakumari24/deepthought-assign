export default function EmptyState() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <svg
            className="h-8 w-8 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">Ready to analyze a transcript?</h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
            Paste a supervisor or workplace transcript in the input field above, then click "Run Analysis" to begin the assessment.
          </p>
        </div>

        <div className="mt-6 space-y-2 text-sm text-slate-600">
          <p className="font-medium text-slate-700">Analysis will provide:</p>
          <ul className="space-y-1">
            <li>✓ Extracted evidence and quotes</li>
            <li>✓ Rubric score (1–10)</li>
            <li>✓ Key Performance Indicators</li>
            <li>✓ Assessment gaps</li>
            <li>✓ Follow-up questions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
