require('dotenv').config();

const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const transcriptRoutes = require('./routes/transcriptRoutes');
const { notFoundHandler } = require('./utils/httpResponses');

const app = express();
const PORT = process.env.PORT || 3000;

process.env.OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
process.env.OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Deepthought API is running'
  });
});

app.use('/health', healthRoutes);
app.use('/api/analyze', analysisRoutes);
app.use('/api/transcripts', transcriptRoutes);

app.get(['/favicon.ico', '/.well-known/appspecific/com.chrome.devtools.json'], (_req, res) => {
  res.status(204).end();
});

app.use(notFoundHandler);

app.use((error, _req, res, _next) => {
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
