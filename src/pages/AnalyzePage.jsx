import { useTranscriptAnalysis } from '../hooks/useTranscriptAnalysis.js';
import { sampleTranscript } from '../utils/sampleTranscript.js';
import TranscriptInput from '../components/TranscriptInput.jsx';
import SampleTranscriptSelector from '../components/SampleTranscriptSelector.jsx';
import AnalyzeButton from '../components/AnalyzeButton.jsx';
import AnalysisResults from '../components/AnalysisResults.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import LoadingOverlay from '../components/LoadingOverlay.jsx';

function AnalyzePage() {
  const {
    transcript,
    setTranscript,
    analysis,
    error,
    isLoading,
    analyze,
    reset,
    clearError
  } = useTranscriptAnalysis(sampleTranscript);

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-4">
        <TranscriptInput transcript={transcript} setTranscript={setTranscript} />

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SampleTranscriptSelector onSelect={setTranscript} />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-100"
              >
                Reset
              </button>
              <AnalyzeButton
                onClick={analyze}
                loading={isLoading}
                disabled={transcript.trim().length === 0}
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Paste transcript text, then run analysis to generate evidence, score, KPI mapping, gaps, and follow-up prompts.
          </p>
        </div>
      </div>

      <aside className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-950">Analysis Output</h2>
        <p className="mt-1 text-sm text-slate-600">
          Review AI-generated draft sections and validate each finding with your professional judgment.
        </p>

        <div className="mt-6 space-y-6">
          {error && <ErrorAlert error={error} onClose={clearError} />}

          {!analysis && !error && <EmptyState />}

          {analysis && <AnalysisResults analysisData={analysis} />}
        </div>
      </aside>

      {isLoading && <LoadingOverlay loading={isLoading} message="Analyzing transcript..." />}
    </section>
  );
}

export default AnalyzePage;
