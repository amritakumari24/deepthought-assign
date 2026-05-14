const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function analyzeTranscript(transcript) {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ transcript })
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || payload.error || 'Analysis request failed');
  }

  return payload.data || payload;
}
