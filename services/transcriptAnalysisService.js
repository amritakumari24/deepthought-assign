const { buildTranscriptAnalysisPrompt } = require('../prompts/transcriptAnalysisPrompt');
const { generateFromOllama } = require('./ollamaService');

async function analyzeTranscriptWithAI(transcript) {
  const prompt = buildTranscriptAnalysisPrompt(transcript);
  const analysis = await generateFromOllama(prompt);

  return {
    model: process.env.OLLAMA_MODEL || 'llama3.2',
    analysis
  };
}

module.exports = {
  analyzeTranscriptWithAI
};
