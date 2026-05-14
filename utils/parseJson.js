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

function extractJsonCandidate(value) {
  const objectStart = value.indexOf('{');
  const objectEnd = value.lastIndexOf('}');
  const arrayStart = value.indexOf('[');
  const arrayEnd = value.lastIndexOf(']');

  const objectCandidate =
    objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart
      ? value.slice(objectStart, objectEnd + 1)
      : null;

  const arrayCandidate =
    arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart
      ? value.slice(arrayStart, arrayEnd + 1)
      : null;

  if (!objectCandidate) {
    return arrayCandidate;
  }

  if (!arrayCandidate) {
    return objectCandidate;
  }

  return objectStart < arrayStart ? objectCandidate : arrayCandidate;
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

  const jsonCandidate = extractJsonCandidate(withoutMarkdown);

  if (!jsonCandidate) {
    return null;
  }

  return tryParseJson(jsonCandidate);
}

module.exports = {
  parseJson
};
