function tryParseJson(value) {
  try {
    return JSON.parse(value);
  } catch (_error) {
    return null;
  }
}

function removeMarkdownFences(value) {
  return value
    .replace(/```(?:json)?/gi, '')
    .replace(/```/g, '')
    .trim();
}

function extractJsonCandidates(value) {
  const candidates = [];

  for (let index = 0; index < value.length; index += 1) {
    const openingChar = value[index];

    if (openingChar !== '{' && openingChar !== '[') {
      continue;
    }

    const closingChar = openingChar === '{' ? '}' : ']';
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let cursor = index; cursor < value.length; cursor += 1) {
      const char = value[cursor];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (inString) {
        continue;
      }

      if (char === openingChar) {
        depth += 1;
      }

      if (char === closingChar) {
        depth -= 1;
      }

      if (depth === 0) {
        candidates.push(value.slice(index, cursor + 1));
        break;
      }
    }
  }

  return candidates;
}

function parseJson(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'object') {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const directParse = tryParseJson(trimmedValue);

  if (directParse !== null) {
    return directParse;
  }

  const withoutMarkdown = removeMarkdownFences(trimmedValue);
  const markdownParse = tryParseJson(withoutMarkdown);

  if (markdownParse !== null) {
    return markdownParse;
  }

  const jsonCandidates = extractJsonCandidates(withoutMarkdown);

  for (const jsonCandidate of jsonCandidates) {
    const candidateParse = tryParseJson(jsonCandidate);

    if (candidateParse !== null) {
      return candidateParse;
    }
  }

  return null;
}

module.exports = {
  parseJson
};
