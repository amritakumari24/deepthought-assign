const config = {
  port: process.env.PORT || 3000,
  ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2',
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434'
};

module.exports = {
  config
};
