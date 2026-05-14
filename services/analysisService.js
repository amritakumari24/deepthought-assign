const { loadRubric, loadContext } = require('../utils/loadFiles');
const { parseJson } = require('../utils/parseJson');
const { buildEvidencePrompt } = require('../prompts/evidencePrompt');
const { buildScoringPrompt } = require('../prompts/scoringPrompt');
const { buildGapPrompt } = require('../prompts/gapPrompt');
const { generateFromOllama } = require('./ollamaService');

const DEFAULT_PARSE_RETRIES = 1;

function assertTranscript(transcript) {
  if (typeof transcript !== 'string' || transcript.trim().length === 0) {
    throw new Error('Transcript must be a non-empty string');
  }
}

function buildRetryPrompt(prompt, invalidResponse) {
  return [
    prompt,
    '',
    'Your previous response was not valid JSON.',
    'Fix the response and return ONLY valid JSON matching the requested schema.',
    'Do not include markdown, code fences, comments, or explanatory text.',
    '',
    'Invalid previous response:',
    invalidResponse || ''
  ].join('\n');
}

async function generateParsedJson(prompt, stepName, retries = DEFAULT_PARSE_RETRIES) {
  let currentPrompt = prompt;
  let lastResponse = '';

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    lastResponse = await generateFromOllama(currentPrompt);

    const parsedResponse = parseJson(lastResponse);

    if (parsedResponse !== null) {
      return parsedResponse;
    }

    currentPrompt = buildRetryPrompt(prompt, lastResponse);
  }

  throw new Error(`Failed to parse valid JSON from ${stepName} response`);
}

function normalizeEvidence(evidenceResult) {
  if (!evidenceResult || !Array.isArray(evidenceResult.evidence)) {
    return [];
  }

  return evidenceResult.evidence;
}

function normalizeScore(scoringResult) {
  const numericScore = Number(scoringResult && scoringResult.score);

  if (!Number.isFinite(numericScore)) {
    return null;
  }

  return Math.min(10, Math.max(1, numericScore));
}

function mergeAnalysisResults({ evidenceResult, scoringResult, gapResult }) {
  return {
    evidence: normalizeEvidence(evidenceResult),
    score: normalizeScore(scoringResult),
    justification: scoringResult && typeof scoringResult.justification === 'string' ? scoringResult.justification : '',
    gaps: gapResult && Array.isArray(gapResult.gaps) ? gapResult.gaps : [],
    followUpQuestions:
      gapResult && Array.isArray(gapResult.followUpQuestions) ? gapResult.followUpQuestions : []
  };
}

async function analyzeTranscript(transcript) {
  assertTranscript(transcript);

  try {
    const [rubric, kpiContext] = await Promise.all([loadRubric(), loadContext()]);

    const evidencePrompt = buildEvidencePrompt(transcript);
    const evidenceResult = await generateParsedJson(evidencePrompt, 'evidence extraction');
    const evidence = normalizeEvidence(evidenceResult);

    const scoringPrompt = buildScoringPrompt({
      transcript,
      rubric,
      evidence
    });
    const scoringResult = await generateParsedJson(scoringPrompt, 'rubric scoring');

    const gapPrompt = buildGapPrompt({
      transcript,
      rubric,
      kpiContext
    });
    const gapResult = await generateParsedJson(gapPrompt, 'gap analysis');

    return mergeAnalysisResults({
      evidenceResult,
      scoringResult,
      gapResult
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze transcript');
  }
}

module.exports = {
  analyzeTranscript,
  generateParsedJson
};
