const path = require('path');
const { readFile } = require('fs/promises');

const DATA_DIR = path.join(__dirname, '..', 'data');

async function readFileSafely(filePath) {
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

async function loadJsonFile(fileName, fallbackValue = null) {
  const fileContent = await readFileSafely(path.join(DATA_DIR, fileName));

  if (fileContent === null) {
    return fallbackValue;
  }

  return JSON.parse(fileContent);
}

async function loadMarkdownFile(fileName, fallbackValue = '') {
  const fileContent = await readFileSafely(path.join(DATA_DIR, fileName));
  return fileContent === null ? fallbackValue : fileContent;
}

async function loadRubric() {
  return loadJsonFile('rubric.json', null);
}

async function loadContext() {
  return loadMarkdownFile('context.md', '');
}

async function loadSampleTranscripts() {
  return loadJsonFile('sample-transcripts.json', []);
}

module.exports = {
  loadRubric,
  loadContext,
  loadSampleTranscripts,
  loadJsonFile,
  loadMarkdownFile
};
