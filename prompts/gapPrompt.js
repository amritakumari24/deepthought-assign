function formatSection(title, content) {
  return [
    `## ${title}`,
    typeof content === 'string' ? content : JSON.stringify(content, null, 2)
  ].join('\n');
}

function buildGapPrompt({ transcript, rubric, kpiContext }) {
  return [
    'You are a gap analysis engine for transcript analysis.',
    '',
    'Return ONLY valid JSON.',
    'Do not include markdown, code fences, comments, or explanations outside the JSON object.',
    'Do not include trailing commas.',
    'Use double quotes for all JSON keys and string values.',
    '',
    'Identify missing assessment dimensions.',
    'Identify important items that were NOT discussed in the transcript.',
    'Generate 3 to 5 follow-up questions that would clarify the gaps.',
    '',
    'The JSON object must match this exact format:',
    JSON.stringify(
      {
        gaps: [],
        followUpQuestions: []
      },
      null,
      2
    ),
    '',
    'Rules:',
    '- gaps must be an array of concise strings.',
    '- followUpQuestions must contain 3 to 5 concise questions.',
    '- Questions should directly address the identified gaps.',
    '- If no gaps are found, return an empty gaps array and still provide useful follow-up questions.',
    '',
    formatSection('Rubric', rubric || {}),
    '',
    formatSection('KPI Context', kpiContext || ''),
    '',
    formatSection('Transcript', transcript || ''),
    '',
    'Return the JSON object now.'
  ].join('\n');
}

module.exports = {
  buildGapPrompt
};
