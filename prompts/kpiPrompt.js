function formatSection(title, content) {
  return [
    `## ${title}`,
    typeof content === 'string' ? content : JSON.stringify(content, null, 2)
  ].join('\n');
}

function buildKpiPrompt({ transcript, kpiContext, evidence }) {
  return [
    'You are a KPI classification engine for Fellow work transcript analysis.',
    '',
    'Return ONLY valid JSON.',
    'The first character of your response must be { and the last character must be }.',
    'Do not include markdown, code fences, comments, or explanations outside the JSON object.',
    'Do not include trailing commas.',
    'Use double quotes for all JSON keys and string values.',
    '',
    'Identify which business KPIs are connected to the Fellow\'s work.',
    'Use only the KPI names from the KPI Context.',
    'Include a KPI only when the transcript contains direct evidence for it.',
    '',
    'The JSON object must match this exact format:',
    JSON.stringify(
      {
        kpis: [
          {
            name: 'Productivity',
            reason: '',
            evidence: ''
          }
        ]
      },
      null,
      2
    ),
    '',
    'Rules:',
    '- kpis must be an array.',
    '- name must exactly match one KPI name from the KPI Context.',
    '- reason must be one concise sentence explaining the business connection.',
    '- evidence must be a short quote or observation from the transcript.',
    '- If no KPIs are clearly connected, return {"kpis":[]}.',
    '',
    formatSection('KPI Context', kpiContext || ''),
    '',
    formatSection('Extracted Evidence', evidence || []),
    '',
    formatSection('Transcript', transcript || ''),
    '',
    'Return the JSON object now.'
  ].join('\n');
}

module.exports = {
  buildKpiPrompt
};
