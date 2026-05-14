require('dotenv').config();

const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const transcriptRoutes = require('./routes/transcriptRoutes');
const { notFoundHandler } = require('./utils/httpResponses');
const { config } = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const startedAt = Date.now();

  console.log(`[request] ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
    console.log(`[request] ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms`);
  });

  next();
});

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

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
