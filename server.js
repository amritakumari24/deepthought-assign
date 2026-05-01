const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Deepthought server is running. Use POST /analyze with { transcript: string }'
  });
});

app.get('/favicon.ico', (_req, res) => {
  res.status(204).end();
});

app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.status(204).end();
});

app.post('/analyze', async (req, res) => {
  const { transcript } = req.body || {};

  if (typeof transcript !== 'string') {
    return res.status(400).json({
      error: 'Invalid input. Expected JSON: { transcript: string }'
    });
  }

  try {
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'llama3.2',
        prompt: transcript,
        stream: false
      })
    });

    const rawBody = await ollamaResponse.text();
    const contentType = ollamaResponse.headers.get('content-type') || 'application/json';

    return res.status(ollamaResponse.status).type(contentType).send(rawBody);
  } catch (error) {
    return res.status(502).json({
      error: 'Failed to reach Ollama API',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
