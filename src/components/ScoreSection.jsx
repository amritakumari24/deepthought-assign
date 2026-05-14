import { useCopyToClipboard } from '../hooks/useCopyToClipboard.js';
import CopyButton from './CopyButton.jsx';

function scoreClasses(score) {
  const s = Number(score);

  if (!Number.isFinite(s)) {
    return {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      ring: 'ring-slate-100'
    };
  }

  if (s <= 3) {
    return {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      ring: 'ring-rose-100'
    };
  }

  if (s <= 6) {
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      ring: 'ring-amber-100'
    };
  }

  return {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-100'
  };
}

export default function ScoreSection({ score = null, justification = '' }) {
  const { bg, text, ring } = scoreClasses(score);
  const { copy, copiedId } = useCopyToClipboard();

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Rubric Score</h2>
          <p className="mt-1 text-sm text-slate-600">AI-suggested score (1–10) based on transcript content — review before finalizing.</p>
        </div>
        <div className={`inline-flex items-center gap-3 rounded-full px-3 py-1 text-sm font-medium ${bg} ${text} ring-1 ${ring}`}>
          <span className="whitespace-nowrap">Score</span>
          <span className="ml-1 font-semibold">{score ?? '—'}</span>
        </div>
      </div>

      <div className="flex flex-col items-start gap-6 sm:flex-row">
        <div className={`flex h-32 w-32 flex-none items-center justify-center rounded-lg border border-slate-100 ${bg} ${text} ring-1 ${ring}`}>
          <span className="text-5xl font-extrabold leading-none" aria-label={`Suggested score ${score ?? 'not available'}`}>
            {score ?? '—'}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-slate-800">Reasoning</h3>
            {justification && (
              <CopyButton
                text={justification}
                feedbackId="justification"
                isCopied={copiedId === 'justification'}
                onCopy={copy}
                label="Copy"
              />
            )}
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-700">{justification || 'No reasoning provided.'}</p>
          <p className="mt-3 text-xs text-slate-500">Review this reasoning and update the score if it does not align with your assessment.</p>
        </div>
      </div>
    </section>
  );
}
