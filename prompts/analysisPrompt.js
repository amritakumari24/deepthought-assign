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
    '- score: numeric score based strictly on the provided rubric definitions, or null if no rubric definitions are available.',
    '- justification: concise explanation that explicitly connects transcript evidence, rubric criteria, and the final score.',
    '- kpis: array of KPI results or insights from the KPI context.',
    '- gaps: array of important evaluation areas not mentioned, unclear, or weakly evidenced in the transcript.',
    '- followUpQuestions: array of 3 to 5 professional questions that would help a psychology intern collect missing evidence.',
    '',
    'Scoring rules:',
    '- Assign scores strictly using the provided rubric definitions.',
    '- Do not invent scoring logic, categories, thresholds, or expectations that are not in the rubric.',
    '- If evidence is weak, incomplete, ambiguous, or missing for important rubric criteria, acknowledge uncertainty in the justification and avoid over-scoring.',
    '',
    'Gap and follow-up rules:',
    '- Do not leave gaps empty unless the transcript is extremely detailed across the rubric and KPI context.',
    '- Look specifically for missing information about systems building, leadership influence, execution consistency, ownership under pressure, worker response, long-term impact, and process improvement.',
    '- Avoid generic follow-up questions; each question must target identified gaps and help collect concrete evidence.',
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
