function formatSection(title, content) {
  return [
    `## ${title}`,
    typeof content === 'string' ? content : JSON.stringify(content, null, 2)
  ].join('\n');
}

function buildScoringPrompt({ transcript, rubric, evidence }) {
  return [
    'You are a rubric scoring engine for supervisor transcript analysis.',
    '',
    'Return ONLY valid JSON.',
    'Do not include markdown, code fences, comments, or explanations outside the JSON object.',
    'Do not include trailing commas.',
    'Use double quotes for all JSON keys and string values.',
    '',
    'Assign a score from 1 to 10 strictly using the provided rubric definitions.',
    'Do not invent scoring logic, categories, thresholds, or expectations that are not in the rubric.',
    'Explicitly connect transcript evidence, rubric criteria, and the final score in the justification.',
    '',
    'The JSON object must match this exact format:',
    JSON.stringify(
      {
        score: 7,
        justification: ''
      },
      null,
      2
    ),
    '',
    'Rules:',
    '- score must be a number from 1 to 10 when rubric definitions are present; otherwise score must be null.',
    '- Use the rubric definitions as the only basis for the score.',
    '- Select the score whose rubric definition best matches the available transcript evidence.',
    '- justification must name the relevant rubric criteria or score band used.',
    '- justification must mention the transcript evidence that supports the selected score.',
    '- justification must explain how the evidence does or does not satisfy the rubric criteria.',
    '- If evidence is weak, incomplete, ambiguous, or missing for important rubric criteria, acknowledge that uncertainty and avoid over-scoring.',
    '- If the rubric is missing or empty, assign score as null and explain that scoring cannot be grounded without rubric definitions.',
    '',
    formatSection('Rubric', rubric || {}),
    '',
    formatSection('Extracted Evidence', evidence || []),
    '',
    formatSection('Transcript', transcript || ''),
    '',
    'Return the JSON object now.'
  ].join('\n');
}

module.exports = {
  buildScoringPrompt
};
