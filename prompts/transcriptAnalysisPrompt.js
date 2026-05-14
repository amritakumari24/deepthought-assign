function buildTranscriptAnalysisPrompt(transcript) {
  return [
    'Analyze the following transcript.',
    '',
    'Return concise insights covering:',
    '- summary',
    '- key topics',
    '- action items',
    '- sentiment',
    '',
    'Transcript:',
    transcript
  ].join('\n');
}

module.exports = {
  buildTranscriptAnalysisPrompt
};
