function TranscriptInput({ transcript, setTranscript }) {
  const characterCount = transcript.length;

  function handleClear() {
    setTranscript('');
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Transcript</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Paste the supervisor transcript below for review and analysis.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClear}
          disabled={characterCount === 0}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </button>
      </div>

      <label className="sr-only" htmlFor="supervisor-transcript">
        Supervisor transcript
      </label>
      <textarea
        id="supervisor-transcript"
        value={transcript}
        onChange={(event) => setTranscript(event.target.value)}
        placeholder="Paste supervisor transcript here..."
        spellCheck="false"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        className="min-h-96 w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
      />

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-600 sm:text-sm">
        <p>Paste-friendly input with no formatting restrictions.</p>
        <p aria-live="polite" className="font-medium text-slate-700">
          {characterCount.toLocaleString()} characters
        </p>
      </div>
    </section>
  );
}

export default TranscriptInput;
