const express = require('express');
const { analyzeTranscriptController } = require('../controllers/analysisController');

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    endpoint: 'POST /api/analyze',
    requiredBody: {
      transcript: 'string'
    }
  });
});

router.post('/', analyzeTranscriptController);

router.all('/', (_req, res) => {
  res.status(405).json({
    error: 'Method not allowed',
    message: 'Use POST /api/analyze with JSON body: { "transcript": "..." }'
  });
});

module.exports = router;
