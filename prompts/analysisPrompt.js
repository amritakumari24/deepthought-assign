function formatPromptSection(title, content) {
  return [
    `## ${title}`,
    typeof content === 'string' ? content : JSON.stringify(content, null, 2)
  ].join('\n');
}

function buildAnalysisPrompt({ transcript, rubricData, kpiContext }) {
  return [
    'You are an AI transcript analysis engine.',
    '',
    'Return ONLY valid JSON.',
    'Do not include markdown, code fences, comments, or explanations outside the JSON object.',
    'Do not include trailing commas.',
    'Use double quotes for all JSON keys and string values.',
    '',
    'The JSON object must match this exact top-level structure:',
    JSON.stringify(
      {
        evidence: [],
        score: 0,
        justification: '',
        kpis: [],
        gaps: [],
        followUpQuestions: []
      },
      null,
      2
    ),
    '',
    'Field instructions:',
    '- evidence: array of short transcript quotes or observations that support the score.',
    '- score: numeric score based on the rubric.',
    '- justification: concise explanation for the score.',
    '- kpis: array of KPI results or insights from the KPI context.',
    '- gaps: array of missing, unclear, or weak areas found in the transcript.',
    '- followUpQuestions: array of questions that would clarify gaps or improve evaluation.',
    '',
    formatPromptSection('Rubric Data', rubricData || {}),
    '',
    formatPromptSection('KPI Context', kpiContext || ''),
    '',
    formatPromptSection('Transcript', transcript || ''),
    '',
    'Analyze the transcript using the rubric data and KPI context.',
    'Return the JSON object now.'
  ].join('\n');
}

module.exports = {
  buildAnalysisPrompt
};
