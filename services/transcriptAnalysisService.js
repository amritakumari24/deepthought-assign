const { buildTranscriptAnalysisPrompt } = require('../prompts/transcriptAnalysisPrompt');
const { generateFromOllama } = require('./ollamaService');
const { config } = require('../config');

async function analyzeTranscriptWithAI(transcript) {
  const prompt = buildTranscriptAnalysisPrompt(transcript);
  const analysis = await generateFromOllama(prompt);

  return {
    model: config.ollamaModel,
    analysis
  };
}

module.exports = {
  analyzeTranscriptWithAI
};
