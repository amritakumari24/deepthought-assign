const API_URL = 'http://localhost:3000/api/analyze';

function parseResponseJson(responseText) {
  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error('Invalid JSON response from analyze API');
  }
}

export async function analyzeTranscript(transcript) {
  if (typeof transcript !== 'string' || transcript.trim().length === 0) {
    throw new Error('Transcript must be a non-empty string');
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ transcript })
    });

    const responseText = await response.text();
    const payload = responseText ? parseResponseJson(responseText) : {};

    if (!response.ok) {
      throw new Error(
        payload.message || payload.error || `Analysis request failed with status ${response.status}`
      );
    }

    return payload.data ?? payload;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to analyze transcript');
  }
}
