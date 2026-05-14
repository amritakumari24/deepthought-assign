const { retry, createRetryableError } = require('../utils/retry');
const { config } = require('../config');

const OLLAMA_GENERATE_URL = `${config.ollamaUrl}/api/generate`;

async function generateFromOllama(prompt) {
  if (typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new Error('Prompt must be a non-empty string');
  }

  return retry(async () => {
    const startedAt = Date.now();
    let response;

    try {
      response = await fetch(OLLAMA_GENERATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: config.ollamaModel,
          prompt,
          stream: false
        })
      });
    } finally {
      console.log(`[ollama] generate request completed in ${Date.now() - startedAt}ms`);
    }

    let body;

    try {
      body = await response.json();
    } catch (_error) {
      console.warn('[ollama] invalid JSON response received');
      throw createRetryableError('Ollama returned an invalid JSON response', 'invalid_json');
    }

    if (!response.ok) {
      throw new Error(body.error || `Ollama request failed with status ${response.status}`);
    }

    if (typeof body.response !== 'string' || body.response.trim().length === 0) {
      console.warn('[ollama] empty response received');
      throw createRetryableError('Ollama returned an empty response', 'empty_response');
    }

    return body.response;
  });
}

module.exports = {
  generateFromOllama
};
