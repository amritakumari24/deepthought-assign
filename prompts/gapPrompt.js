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
    'The first character of your response must be { and the last character must be }.',
    'Do not include markdown, code fences, comments, or explanations outside the JSON object.',
    'Do not include trailing commas.',
    'Use double quotes for all JSON keys and string values.',
    '',
    'Identify important evaluation areas that were NOT mentioned in the transcript.',
    'Do not leave gaps empty unless the transcript is extremely detailed across the rubric and KPI context.',
    'Generate 3 to 5 professional follow-up questions that help a psychology intern collect missing evidence.',
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
    '- gaps must be an array of concise strings naming missing, unclear, or weak evaluation areas.',
    '- Look specifically for missing information about systems building, leadership influence, execution consistency, ownership under pressure, worker response, long-term impact, and process improvement.',
    '- Also include any rubric-defined evaluation areas that are absent or only weakly evidenced.',
    '- followUpQuestions must contain 3 to 5 concise, professional questions.',
    '- Each question must target one or more identified gaps and help a psychology intern collect concrete evidence.',
    '- Avoid generic questions such as "Can you tell me more?" or "What happened next?"',
    '- If gaps is empty, the transcript must show unusually complete evidence across the rubric, KPI context, and all listed missing-information areas.',
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
