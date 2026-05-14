import { useState, useEffect } from 'react';

export default function SampleTranscriptSelector({ onSelect = () => {} }) {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSamples() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/sample-transcripts.json');

        if (!response.ok) {
          throw new Error('Failed to load sample transcripts');
        }

        const data = await response.json();
        setSamples(data.samples || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load samples');
        setSamples([]);
      } finally {
        setLoading(false);
      }
    }

    loadSamples();
  }, []);

  function handleSelectSample(event) {
    const selectedId = event.target.value;

    if (!selectedId) return;

    const selected = samples.find((s) => s.id === selectedId);

    if (selected) {
      onSelect(selected.transcript);
      event.target.value = '';
    }
  }

  if (loading) {
    return (
      <div className="text-sm text-slate-600">Loading samples...</div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-rose-600">{error}</div>
    );
  }

  if (samples.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sample-select" className="text-sm font-medium text-slate-700">
        Load sample:
      </label>
      <select
        id="sample-select"
        onChange={handleSelectSample}
        defaultValue=""
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:border-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      >
        <option value="">Choose a transcript...</option>
        {samples.map((sample) => (
          <option key={sample.id} value={sample.id}>
            {sample.title}
          </option>
        ))}
      </select>
    </div>
  );
}
