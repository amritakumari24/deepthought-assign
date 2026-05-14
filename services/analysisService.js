const { loadRubric, loadContext } = require('../utils/loadFiles');
const { parseJson } = require('../utils/parseJson');
const { buildEvidencePrompt } = require('../prompts/evidencePrompt');
const { buildScoringPrompt } = require('../prompts/scoringPrompt');
const { buildKpiPrompt } = require('../prompts/kpiPrompt');
const { buildGapPrompt } = require('../prompts/gapPrompt');
const { generateFromOllama } = require('./ollamaService');

const DEFAULT_PARSE_RETRIES = 2;
const ALLOWED_KPI_NAMES = new Set([
  'Productivity',
  'Accountability',
  'Team Coordination',
  'Process Improvement',
  'Communication',
  'Ownership',
  'Systems Building',
  'Execution Reliability'
]);

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

    console.warn(`[parse] ${stepName} returned invalid JSON on attempt ${attempt + 1}`);
    currentPrompt = buildRetryPrompt(prompt, lastResponse);
  }

  throw new Error(`Failed to parse valid JSON from ${stepName} response`);
}

async function generateParsedJsonOrFallback(prompt, stepName, fallbackValue, retries = DEFAULT_PARSE_RETRIES) {
  try {
    return await generateParsedJson(prompt, stepName, retries);
  } catch (error) {
    console.warn(
      `[parse] ${stepName} failed after retries; using fallback response: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );

    return fallbackValue;
  }
}

function normalizeEvidence(evidenceResult) {
  if (!evidenceResult || !Array.isArray(evidenceResult.evidence)) {
    return [];
  }

  return evidenceResult.evidence;
}

function normalizeScore(scoringResult) {
  if (!scoringResult || scoringResult.score === null || scoringResult.score === undefined) {
    return null;
  }

  const numericScore = Number(scoringResult && scoringResult.score);

  if (!Number.isFinite(numericScore)) {
    return null;
  }

  return Math.min(10, Math.max(1, numericScore));
}

function normalizeKpis(kpiResult) {
  if (!kpiResult || !Array.isArray(kpiResult.kpis)) {
    return [];
  }

  return kpiResult.kpis
    .filter((kpi) => kpi && ALLOWED_KPI_NAMES.has(kpi.name))
    .map((kpi) => ({
      name: kpi.name,
      reason: typeof kpi.reason === 'string' ? kpi.reason : '',
      evidence: typeof kpi.evidence === 'string' ? kpi.evidence : ''
    }));
}

function mergeAnalysisResults({ evidenceResult, scoringResult, kpiResult, gapResult }) {
  return {
    evidence: normalizeEvidence(evidenceResult),
    score: normalizeScore(scoringResult),
    justification: scoringResult && typeof scoringResult.justification === 'string' ? scoringResult.justification : '',
    kpis: normalizeKpis(kpiResult),
    gaps: gapResult && Array.isArray(gapResult.gaps) ? gapResult.gaps : [],
    followUpQuestions:
      gapResult && Array.isArray(gapResult.followUpQuestions) ? gapResult.followUpQuestions : []
  };
}

async function analyzeTranscript(transcript) {
  assertTranscript(transcript);

  try {
    const startedAt = Date.now();
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

    const kpiPrompt = buildKpiPrompt({
      transcript,
      kpiContext,
      evidence
    });
    const kpiResult = await generateParsedJsonOrFallback(kpiPrompt, 'KPI classification', {
      kpis: []
    });

    const gapPrompt = buildGapPrompt({
      transcript,
      rubric,
      kpiContext
    });
    const gapResult = await generateParsedJsonOrFallback(gapPrompt, 'gap analysis', {
      gaps: [],
      followUpQuestions: []
    });

    const analysis = mergeAnalysisResults({
      evidenceResult,
      scoringResult,
      kpiResult,
      gapResult
    });

    console.log(`[analysis] completed successfully in ${Date.now() - startedAt}ms`);

    return analysis;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze transcript');
  }
}

module.exports = {
  analyzeTranscript,
  generateParsedJson,
  generateParsedJsonOrFallback,
  normalizeKpis
};
