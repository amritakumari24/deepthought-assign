const { loadRubric, loadContext } = require('../utils/loadFiles');
const { parseJson } = require('../utils/parseJson');
const { buildEvidencePrompt } = require('../prompts/evidencePrompt');
const { buildScoringPrompt } = require('../prompts/scoringPrompt');
const { buildKpiPrompt } = require('../prompts/kpiPrompt');
const { buildGapPrompt } = require('../prompts/gapPrompt');
const { generateFromOllama } = require('./ollamaService');
const { formatAnalysisResponse } = require('../utils/formatResponse');

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

function normalizeTranscriptLines(transcript) {
  return transcript
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function inferEvidenceType(text) {
  const lowerText = text.toLowerCase();

  if (
    /\b(excellent|good|helped|improved|completed|organized|resolved|clarity|collaborative|supportive)\b/.test(
      lowerText
    )
  ) {
    return 'positive';
  }

  if (
    /\b(overwhelmed|difficult|resistant|drained|issue|problem|hesitant|struggle|conflict|concern)\b/.test(
      lowerText
    )
  ) {
    return 'negative';
  }

  return 'neutral';
}

function buildFallbackEvidence(transcript) {
  const speakerLines = normalizeTranscriptLines(transcript)
    .map((line) => {
      const match = line.match(/^([^:]{1,40}):\s*(.+)$/);

      if (!match) {
        return null;
      }

      const speaker = match[1].trim();
      const quote = match[2].trim();

      if (!quote) {
        return null;
      }

      return {
        speaker,
        quote,
        type: inferEvidenceType(quote)
      };
    })
    .filter(Boolean);

  if (speakerLines.length > 0) {
    return speakerLines.slice(0, 4);
  }

  return transcript
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((quote) => ({
      quote,
      type: inferEvidenceType(quote)
    }));
}

function buildFallbackKpis(transcript) {
  const lowerTranscript = transcript.toLowerCase();
  const kpis = [];

  const kpiRules = [
    {
      name: 'Productivity',
      test: /\b(tracker|efficient|efficiency|organized|completed|deadline|workflow|productivity)\b/,
      reason: 'The transcript shows work organization, tracking, or timely completion of tasks.',
      evidence: 'Transcript mentions planning, tracking, or completing work.'
    },
    {
      name: 'Accountability',
      test: /\b(owner|ownership|responsible|follow[- ]?up|blocker|handoff|accountable)\b/,
      reason: 'The transcript includes ownership, follow-through, or responsibility for outcomes.',
      evidence: 'Transcript references responsibility or follow-through.'
    },
    {
      name: 'Team Coordination',
      test: /\b(team|shared|collaborat|coordination|handoff|review)\b/,
      reason: 'The transcript describes coordination with others or shared workflow management.',
      evidence: 'Transcript references team communication or coordination.'
    },
    {
      name: 'Process Improvement',
      test: /\b(process|system|tracker|workflow|improv|structure|framework)\b/,
      reason: 'The transcript shows an effort to improve a workflow or organize a process.',
      evidence: 'Transcript references process, system, or workflow changes.'
    },
    {
      name: 'Communication',
      test: /\b(explain|shared|communicat|discuss|validate|asked|feedback)\b/,
      reason: 'The transcript shows active communication or explanation of expectations.',
      evidence: 'Transcript references discussion or explanation.'
    },
    {
      name: 'Ownership',
      test: /\b(initiative|took|led|responsible|owned|created|developed)\b/,
      reason: 'The transcript indicates initiative or personal ownership of the work.',
      evidence: 'Transcript references taking action or creating a solution.'
    },
    {
      name: 'Systems Building',
      test: /\b(system|tracker|structure|process|workflow|tool)\b/,
      reason: 'The transcript describes creating or improving a system that supports the work.',
      evidence: 'Transcript references a tool, tracker, or process structure.'
    },
    {
      name: 'Execution Reliability',
      test: /\b(deadline|consistent|reliable|follow-through|completed|delivery|timely)\b/,
      reason: 'The transcript suggests steady execution and reliable delivery of work.',
      evidence: 'Transcript references completion or reliability.'
    }
  ];

  for (const rule of kpiRules) {
    if (rule.test.test(lowerTranscript)) {
      kpis.push({
        name: rule.name,
        reason: rule.reason,
        evidence: rule.evidence
      });
    }
  }

  return kpis;
}

function buildFallbackGaps(transcript) {
  const lowerTranscript = transcript.toLowerCase();
  const gaps = [];
  const gapRules = [
    {
      dimension: 'Specific impact or outcome of the intervention',
      reason: 'The transcript does not clearly address what changed or the results of the intervention.',
      test: /\b(impact|outcome|result|changed|improved|effect)\b/
    },
    {
      dimension: 'Follow-up plan and next steps',
      reason: 'The transcript does not outline concrete next steps or follow-up actions.',
      test: /\b(next step|follow[- ]?up|plan|next week|continue)\b/
    },
    {
      dimension: 'Client or worker response to the intervention',
      reason: 'The transcript does not describe how the client or worker responded to the intervention.',
      test: /\b(response|reacted|reaction|responded|felt)\b/
    },
    {
      dimension: 'Consistency of execution over time',
      reason: 'The transcript does not address how consistently this approach is being applied.',
      test: /\b(consistent|consistently|ongoing|repeated|regular)\b/
    }
  ];

  for (const rule of gapRules) {
    if (!rule.test.test(lowerTranscript)) {
      gaps.push({
        dimension: rule.dimension,
        reason: rule.reason
      });
    }
  }

  return gaps.slice(0, 4);
}

function buildFallbackFollowUpQuestions(transcript) {
  const gaps = buildFallbackGaps(transcript);

  const questionMap = {
    'Specific impact or outcome of the intervention':
      'What changed for the client or team after this intervention?',
    'Follow-up plan and next steps':
      'What are the concrete next steps you want to take after this session?',
    'Client or worker response to the intervention':
      'How did the client or worker respond when you introduced this approach?',
    'Consistency of execution over time':
      'How consistently has this approach been applied across similar situations?'
  };

  const questions = gaps
    .map((gap) => questionMap[gap.dimension])
    .filter(Boolean)
    .slice(0, 4);

  while (questions.length < 3) {
    questions.push(
      'What evidence would help you judge whether this approach is working as intended?'
    );
  }

  return questions.slice(0, 5);
}

function buildFallbackAnalysis(transcript, errorMessage) {
  const evidence = buildFallbackEvidence(transcript);
  const kpis = buildFallbackKpis(transcript);
  const gaps = buildFallbackGaps(transcript);
  const followUpQuestions = buildFallbackFollowUpQuestions(transcript);

  return formatAnalysisResponse({
    evidence,
    score: null,
    justification: `Automated analysis could not load the local model, so this response is a lightweight fallback. ${errorMessage}`,
    kpis,
    gaps,
    followUpQuestions,
    analysisMode: 'fallback'
  });
}

function isProviderUnavailableError(error) {
  const message = error instanceof Error ? error.message : String(error || '');

  return /memory|insufficient|enough system memory|fetch failed|ECONNREFUSED|ENOTFOUND|socket hang up|cannot connect|model not found/i.test(
    message
  );
}

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

    return formatAnalysisResponse(analysis);
  } catch (error) {
    if (isProviderUnavailableError(error)) {
      const fallbackAnalysis = buildFallbackAnalysis(
        transcript,
        error instanceof Error ? error.message : 'Provider unavailable'
      );

      console.warn('[analysis] using fallback analysis because the model provider is unavailable');

      return fallbackAnalysis;
    }

    throw new Error(error instanceof Error ? error.message : 'Failed to analyze transcript');
  }
}

module.exports = {
  analyzeTranscript,
  generateParsedJson,
  generateParsedJsonOrFallback,
  normalizeKpis
};
