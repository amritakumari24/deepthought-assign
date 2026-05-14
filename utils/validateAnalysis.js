function validateAnalysis(analysis) {
  const errors = [];

  if (!analysis || typeof analysis !== 'object' || Array.isArray(analysis)) {
    return {
      valid: false,
      errors: ['analysis must be an object']
    };
  }

  if (!Array.isArray(analysis.evidence)) {
    errors.push('evidence must be an array');
  }

  if (typeof analysis.score !== 'number' || analysis.score < 1 || analysis.score > 10) {
    errors.push('score must be a number between 1 and 10');
  }

  if (typeof analysis.justification !== 'string' || analysis.justification.trim().length === 0) {
    errors.push('justification must be a non-empty string');
  }

  if (!Array.isArray(analysis.gaps)) {
    errors.push('gaps must be an array');
  }

  if (!Array.isArray(analysis.followUpQuestions)) {
    errors.push('followUpQuestions must be an array');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateAnalysis
};
