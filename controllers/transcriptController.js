const { analyzeTranscriptWithAI } = require('../services/transcriptAnalysisService');

async function analyzeTranscript(req, res) {
  const { transcript } = req.body || {};

  if (typeof transcript !== 'string' || transcript.trim().length === 0) {
    return res.status(400).json({
      error: 'Invalid input. Expected JSON: { transcript: string }'
    });
  }

  try {
    const analysis = await analyzeTranscriptWithAI(transcript);
    return res.status(200).json(analysis);
  } catch (error) {
    return res.status(502).json({
      error: 'Failed to analyze transcript',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

module.exports = {
  analyzeTranscript
};
