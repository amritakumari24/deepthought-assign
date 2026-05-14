function buildEvidencePrompt(transcript) {
  return [
    'You are an evidence extraction engine for transcript analysis.',
    '',
    'Extract behavioral quotes from the transcript.',
    'Classify each quote as one of: positive, negative, neutral.',
    '',
    'Return ONLY valid JSON.',
    'Do not include markdown, code fences, comments, or explanations outside the JSON object.',
    'Do not include trailing commas.',
    'Use double quotes for all JSON keys and string values.',
    '',
    'The JSON object must match this exact format:',
    JSON.stringify(
      {
        evidence: [
          {
            quote: '',
            type: ''
          }
        ]
      },
      null,
      2
    ),
    '',
    'Rules:',
    '- quote must contain the exact transcript text that supports the classification.',
    '- type must be exactly one of: positive, negative, neutral.',
    '- If there is no useful behavioral evidence, return {"evidence":[]}.',
    '',
    'Transcript:',
    transcript || '',
    '',
    'Return the JSON object now.'
  ].join('\n');
}

module.exports = {
  buildEvidencePrompt
};
