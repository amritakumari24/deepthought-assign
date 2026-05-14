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
    'Assign a score from 1 to 10 based on the rubric.',
    'Explain the reasoning in the justification field.',
    'Reference the extracted evidence in the justification.',
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
    '- score must be a number from 1 to 10.',
    '- justification must be concise and directly tied to the rubric.',
    '- justification must mention the relevant evidence used to support the score.',
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
