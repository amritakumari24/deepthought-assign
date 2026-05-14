export default function GapSection({ gaps = [] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Suggested Gaps</h2>
          <p className="mt-1 text-sm text-slate-600">AI-identified assessment dimensions that may be missing or underrepresented \u2014 review for your context.</p>
        </div>
        <div className="text-sm text-slate-600">{gaps.length.toLocaleString()} items</div>
      </div>

      {gaps.length === 0 ? (
        <div className="rounded-md border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          No gaps detected — the transcript appears to cover expected assessment dimensions.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {gaps.map((gap, idx) => {
            const name = gap.dimension || gap.name || `Gap ${idx + 1}`;
            const detail = gap.reason || gap.detail || gap.description || '';

            return (
              <article
                key={idx}
                className="flex items-start gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm"
              >
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.516 9.817c.75 1.333-.213 2.984-1.742 2.984H4.483c-1.529 0-2.492-1.651-1.742-2.984L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-.993.883L9 6v4a1 1 0 001.993.117L11 10V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-amber-900 truncate">{name}</h3>
                  <p className="mt-2 text-sm text-amber-800">{detail || 'No additional details provided.'}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
