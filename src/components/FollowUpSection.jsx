import { useCopyToClipboard } from '../hooks/useCopyToClipboard.js';
import CopyButton from './CopyButton.jsx';

export default function FollowUpSection({ followUpQuestions = [] }) {
  const { copy, copiedId } = useCopyToClipboard();
  const items = Array.isArray(followUpQuestions) ? followUpQuestions : [];

  function formatQuestionsForCopy() {
    return items
      .map((q, idx) => `${idx + 1}. ${q}`)
      .join('\n');
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Follow-Up Questions</h2>
          <p className="mt-1 text-sm text-slate-600">AI-suggested questions for next session — adapt as needed for your supervisee.</p>
        </div>
        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <CopyButton
              text={formatQuestionsForCopy()}
              feedbackId="questions"
              isCopied={copiedId === 'questions'}
              onCopy={copy}
              label="Copy all"
            />
          )}
          <div className="text-sm text-slate-600">{items.length.toLocaleString()} items</div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-md border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          No follow-up questions generated yet.
        </div>
      ) : (
        <ol className="space-y-4">
          {items.map((q, idx) => (
            <li key={idx} className="flex gap-4">
              <div className="shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-800 font-medium">
                  {idx + 1}
                </div>
              </div>
              <article className="flex-1 rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                <p className="text-sm text-slate-800">{q}</p>
              </article>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
