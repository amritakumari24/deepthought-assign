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
    reset
  } = useTranscriptAnalysis(sampleTranscript);

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      {/* Input Column */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Transcript</h2>
            <p className="text-sm text-slate-600">
              Paste a workplace or supervision transcript for structured analysis.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-100"
          >
            Reset
          </button>
        </div>

        <TranscriptInput transcript={transcript} setTranscript={setTranscript} />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <SampleTranscriptSelector onSelect={setTranscript} />
          <AnalyzeButton onClick={analyze} loading={isLoading} disabled={transcript.trim().length === 0} />
        </div>
      </div>

      {/* Results Sidebar */}
      <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-950">Results</h2>
        <div className="mt-6 space-y-6">
          {error && <ErrorAlert error={error} onClose={() => {}} />}

          {!analysis && !error && <EmptyState />}

          {analysis && <AnalysisResults analysisData={analysis} />}
        </div>
      </aside>

      {isLoading && <LoadingOverlay loading={isLoading} message="Analyzing transcript..." />}
    </section>
  );
}

export default AnalyzePage;
