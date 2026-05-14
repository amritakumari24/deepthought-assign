import { useCopyToClipboard } from '../hooks/useCopyToClipboard.js';
import CopyButton from './CopyButton.jsx';

function badgeClass(type) {
  switch ((type || '').toLowerCase()) {
    case 'positive':
      return 'inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100';
    case 'negative':
      return 'inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-rose-100';
    default:
      return 'inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-100';
  }
}

function EvidenceCard({ item }) {
  const { quote, type, speaker } = item || {};

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">Quote</p>
        </div>
        <div className="shrink-0">
          <span className={badgeClass(type)}>{(type || 'neutral').toLowerCase()}</span>
        </div>
      </div>

      <blockquote className="mt-3 text-sm leading-7 text-slate-900 italic">"{quote}"</blockquote>

      {speaker && <cite className="mt-3 block text-xs text-slate-500">— {speaker}</cite>}
    </div>
  );
}

export default function EvidenceSection({ evidence = [] }) {
  const { copy, copiedId } = useCopyToClipboard();

  function formatEvidenceForCopy() {
    return evidence
      .map((item) => {
        const parts = [`"${item.quote}"`];
        if (item.speaker) parts.push(`— ${item.speaker}`);
        if (item.type) parts.push(`[${(item.type || 'neutral').toLowerCase()}]`);
        return parts.join(' ');
      })
      .join('\n\n');
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Suggested Evidence</h2>
          <p className="mt-1 text-sm text-slate-600">AI-identified quotes and observations — verify and expand as needed.</p>
        </div>
        <div className="flex items-center gap-3">
          {evidence.length > 0 && (
            <CopyButton
              text={formatEvidenceForCopy()}
              feedbackId="evidence"
              isCopied={copiedId === 'evidence'}
              onCopy={copy}
              label="Copy all"
            />
          )}
          <div className="text-sm text-slate-600">{evidence.length.toLocaleString()} items</div>
        </div>
      </div>

      {evidence.length === 0 ? (
        <div className="rounded-md border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          No evidence extracted yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {evidence.map((item, idx) => (
            <EvidenceCard key={idx} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
