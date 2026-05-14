# Deepthought Backend

AI-powered transcript analysis backend built with Node.js, Express, and Ollama.

The service analyzes supervisor or workplace transcripts and returns structured JSON containing evidence, rubric score, KPI insights, gaps, follow-up questions, and a generation timestamp.

## Features

- Express.js API backend
- Ollama integration using `fetch`
- Modular prompt strategy
- Robust JSON parsing for LLM responses
- Retry handling for empty or invalid Ollama responses
- CORS enabled
- Environment-based configuration
- Health check endpoint
- Clean production-ready folder structure

## Requirements

- Node.js 18 or newer
- npm
- Ollama installed and running locally
- A supported Ollama model, for example `llama3.2`

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Start the backend in development mode:

```bash
npm run dev
```

Start the backend in production mode:

```bash
npm start
```

By default, the API runs at:

```txt
http://localhost:3000
```

## Ollama Installation

Install Ollama from:

```txt
https://ollama.com
```

After installation, pull a model:

```bash
ollama pull llama3.2
```

Run Ollama:

```bash
ollama serve
```

Ollama should be available at:

```txt
http://localhost:11434
```

## Environment Variables

Example `.env`:

```env
PORT=3000
OLLAMA_MODEL=llama3.2
OLLAMA_URL=http://localhost:11434
```

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Express server port | `3000` |
| `OLLAMA_MODEL` | Ollama model used for generation | `llama3.2` |
| `OLLAMA_URL` | Base URL for the Ollama server | `http://localhost:11434` |

Configuration is centralized in:

```txt
config/index.js
```

## API Endpoints

### Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "service": "deepthought-api",
  "timestamp": "2026-05-14T04:45:00.000Z"
}
```

### Analyze Transcript

```http
POST /api/analyze
Content-Type: application/json
```

Request body:

```json
{
  "transcript": "Supervisor: Before restarting the line, I checked the guard and asked the operator to lock out the panel..."
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "evidence": [
      {
        "quote": "I checked the guard and asked the operator to lock out the panel.",
        "type": "positive"
      }
    ],
    "score": 8,
    "justification": "The supervisor demonstrated strong safety behavior by checking guarding and using lockout procedures.",
    "gaps": [
      "Quality checks after restart were not discussed."
    ],
    "followUpQuestions": [
      "Was a first-piece inspection completed after the line restarted?"
    ]
  }
}
```

## Architecture Overview

```txt
deepthought/
├── config/
├── controllers/
├── data/
├── prompts/
├── routes/
├── services/
├── utils/
├── .env.example
├── package.json
└── server.js
```

### `routes/`

Defines Express routes and connects endpoints to controllers.

- `analysisRoutes.js`: Handles `POST /api/analyze`
- `healthRoutes.js`: Handles health checks
- `transcriptRoutes.js`: Legacy or alternate transcript route support

### `controllers/`

Handles HTTP-level concerns:

- request validation
- status codes
- JSON responses
- forwarding work to services

### `services/`

Contains core business logic:

- `analysisService.js`: Orchestrates the full AI workflow
- `ollamaService.js`: Sends generation requests to Ollama
- `transcriptAnalysisService.js`: Earlier transcript analysis service wrapper

### `prompts/`

Contains modular prompt builders:

- `evidencePrompt.js`: Extracts behavioral evidence
- `scoringPrompt.js`: Scores transcript using rubric and evidence
- `gapPrompt.js`: Finds missing dimensions and follow-up questions
- `analysisPrompt.js`: Broader structured analysis prompt

### `utils/`

Shared utilities:

- `loadFiles.js`: Loads rubric, context, and sample transcript files
- `parseJson.js`: Parses clean or messy LLM JSON responses
- `retry.js`: Retries selected failure cases
- `validateAnalysis.js`: Validates final AI output shape
- `formatResponse.js`: Normalizes response fields
- `httpResponses.js`: Shared HTTP helpers

### `config/`

Centralizes environment configuration.

### `data/`

Stores static analysis inputs:

- `rubric.json`
- `context.md`
- `sample-transcripts.json`

## Prompt Strategy

The backend uses a multi-step prompting workflow instead of asking the model to do everything in one response.

1. **Evidence extraction**
   - Extracts behavioral quotes from the transcript.
   - Classifies each quote as `positive`, `negative`, or `neutral`.

2. **Rubric scoring**
   - Uses the transcript, rubric, and extracted evidence.
   - Produces a score from `1` to `10`.
   - Provides a concise justification referencing evidence.

3. **Gap analysis**
   - Identifies missing assessment dimensions.
   - Finds what was not discussed.
   - Generates follow-up questions.

All prompts instruct the model to return only valid JSON and avoid markdown, code fences, and explanations outside JSON.

## Retry Handling

Retry logic lives in:

```txt
utils/retry.js
```

Ollama requests are retried up to 2 times only for retryable response issues:

- invalid JSON
- empty response

The retry wrapper adds a short delay between attempts and avoids retrying normal application errors, validation errors, or non-retryable provider failures.

## JSON Parsing Strategy

LLM responses can be inconsistent, so parsing is handled defensively in:

```txt
utils/parseJson.js
```

The parser:

1. Tries `JSON.parse` directly.
2. Removes markdown code fences if present.
3. Extracts the most likely JSON object or array from messy text.
4. Retries parsing safely.
5. Returns `null` if parsing fails.

The analysis service retries prompt generation when parsing fails.

## Logging

The backend uses console logging only.

Current logs include:

- incoming requests
- completed request status and duration
- Ollama response time
- invalid JSON or empty Ollama responses
- retry attempts
- final successful analysis duration

## Error Handling

The API returns meaningful status codes:

- `200`: successful request
- `400`: invalid client input, such as missing transcript
- `404`: route not found
- `500`: analysis or server failure

A global error handler is registered in `server.js`.

## Future Improvements

- Add schema validation with Zod or Joi.
- Add automated unit and integration tests.
- Add request IDs for easier log tracing.
- Add persistent storage for transcript analysis history.
- Add model timeout handling with `AbortController`.
- Add support for streaming Ollama responses.
- Add authentication for production deployments.
- Add Dockerfile and Docker Compose setup.
- Add rate limiting and request size limits.
- Add response validation into the main analysis pipeline.
