const { analyzeTranscript } = require('../services/analysisService');

async function analyzeTranscriptController(req, res) {
  const { transcript } = req.body || {};

  if (typeof transcript !== 'string' || transcript.trim().length === 0) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'transcript is required and must be a non-empty string'
    });
  }

  try {
    const analysis = await analyzeTranscript(transcript);

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Transcript analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

module.exports = {
  analyzeTranscriptController
};
