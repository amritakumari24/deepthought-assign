import { useState } from 'react';
import { analyzeTranscript } from '../services/analysisApi.js';

export function useTranscriptAnalysis(initialTranscript = '') {
  const [transcript, setTranscript] = useState(initialTranscript);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function analyze() {
    setError('');
    setAnalysis(null);
    setIsLoading(true);

    try {
      const result = await analyzeTranscript(transcript);
      setAnalysis(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to analyze transcript'
      );
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setTranscript(initialTranscript);
    setAnalysis(null);
    setError('');
  }

  return {
    transcript,
    setTranscript,
    analysis,
    error,
    isLoading,
    analyze,
    reset
  };
}
