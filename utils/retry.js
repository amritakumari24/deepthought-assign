const RETRYABLE_REASONS = new Set(['invalid_json', 'empty_response']);

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function createRetryableError(message, reason) {
  const error = new Error(message);
  error.retryable = true;
  error.reason = reason;
  return error;
}

function isRetryableError(error) {
  return Boolean(error && error.retryable === true && RETRYABLE_REASONS.has(error.reason));
}

async function retry(operation, options = {}) {
  const maxRetries = options.maxRetries ?? 2;
  const delayMs = options.delayMs ?? 500;
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error;
      }

      await delay(delayMs);
    }
  }

  throw lastError;
}

module.exports = {
  retry,
  createRetryableError,
  isRetryableError
};
