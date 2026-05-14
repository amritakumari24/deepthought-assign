function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeScore(value) {
  const score = Number(value);

  if (!Number.isFinite(score)) {
    return null;
  }

  return Math.min(10, Math.max(1, score));
}

function normalizeString(value) {
  return typeof value === 'string' ? value : '';
}

function formatAnalysisResponse(analysis = {}) {
  return {
    evidence: normalizeArray(analysis.evidence),
    score: normalizeScore(analysis.score),
    justification: normalizeString(analysis.justification),
    kpis: normalizeArray(analysis.kpis),
    gaps: normalizeArray(analysis.gaps),
    followUpQuestions: normalizeArray(analysis.followUpQuestions),
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  formatAnalysisResponse
};
