const { retry, createRetryableError } = require('../utils/retry');

const OLLAMA_GENERATE_URL = 'http://localhost:11434/api/generate';

async function generateFromOllama(prompt) {
  const model = process.env.OLLAMA_MODEL || 'llama3.2';

  if (typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new Error('Prompt must be a non-empty string');
  }

  return retry(async () => {
    const response = await fetch(OLLAMA_GENERATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false
      })
    });

    let body;

    try {
      body = await response.json();
    } catch (_error) {
      throw createRetryableError('Ollama returned an invalid JSON response', 'invalid_json');
    }

    if (!response.ok) {
      throw new Error(body.error || `Ollama request failed with status ${response.status}`);
    }

    if (typeof body.response !== 'string' || body.response.trim().length === 0) {
      throw createRetryableError('Ollama returned an empty response', 'empty_response');
    }

    return body.response;
  });
}

module.exports = {
  generateFromOllama
};
