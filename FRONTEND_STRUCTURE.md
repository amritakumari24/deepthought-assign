# Frontend Folder Structure - Trinethra Supervisor Feedback Analyzer

## Production-Ready Architecture

```
src/
├── App.jsx                           # Root application component
├── main.jsx                          # Vite entry point
├── index.css                         # Global styles & Tailwind configuration
│
├── components/                       # Reusable UI components
│   ├── Layout.jsx                   # Main layout wrapper with responsive max-width
│   ├── Header.jsx                   # Sticky header with title & branding
│   │
│   ├── TranscriptInput.jsx          # Large textarea for transcript input
│   ├── AnalyzeButton.jsx            # CTA button with loading state & spinner
│   ├── SampleTranscriptSelector.jsx # Dropdown for loading demo transcripts
│   │
│   ├── AnalysisResults.jsx          # Parent container orchestrating all result sections
│   ├── EvidenceSection.jsx          # Displays extracted quotes with type badges
│   ├── ScoreSection.jsx             # Shows suggested score with reasoning
│   ├── KPISection.jsx               # Grid of detected KPIs with evidence
│   ├── GapSection.jsx               # Warning cards for assessment gaps
│   ├── FollowUpSection.jsx          # Numbered list of suggested questions
│   │
│   ├── DraftDisclaimer.jsx          # Blue info box: "AI-generated draft" message
│   ├── EmptyState.jsx               # Placeholder when no analysis exists
│   ├── ErrorAlert.jsx               # Red alert for API/form errors
│   ├── LoadingOverlay.jsx           # Full-screen spinner during analysis
│   ├── CopyButton.jsx               # Reusable copy-to-clipboard button
│
├── pages/                            # Route-level page components
│   ├── AnalyzePage.jsx              # Main analysis page (orchestrates input & results)
│
├── hooks/                            # Custom React hooks for state & side effects
│   ├── useTranscriptAnalysis.js     # Manages transcript, analysis, loading, error state
│   ├── useCopyToClipboard.js        # Clipboard utility with 2-sec feedback
│
├── services/                         # API & backend communication
│   ├── api.js                       # Primary: fetch-based POST to /api/analyze
│   ├── analysisApi.js               # Legacy: Vite env-based API wrapper
│
├── utils/                            # Pure functions & helpers
│   └── sampleTranscript.js          # Default transcript for demo/testing
│
└── assets/                           # Static files (icons, images, etc.)
    └── (reserved for future use)

public/
├── sample-transcripts.json           # Demo transcript data (4 supervision examples)
└── (other static assets)
```

## Folder Responsibilities

### **`components/`** - Reusable UI Building Blocks
**Purpose:** Encapsulate all presentational logic, styling, and interactions independent of data flow.

**Sub-categories:**

**Layout & Structure:**
- `Layout.jsx` - Responsive container with max-width and vertical spacing
- `Header.jsx` - Sticky navigation header with title

**Input & Action:**
- `TranscriptInput.jsx` - Controlled textarea with character count & clear button
- `AnalyzeButton.jsx` - Loading-aware CTA with animated spinner
- `SampleTranscriptSelector.jsx` - Async data loader + dropdown selector

**Analysis Results (Display):**
- `AnalysisResults.jsx` - Parent orchestrator (imports all result sections)
- `EvidenceSection.jsx` - Grid of quote cards with copy functionality
- `ScoreSection.jsx` - Large score display with color-coded indicator + copy
- `KPISection.jsx` - Responsive KPI grid with reason & evidence
- `GapSection.jsx` - Warning-style gap cards
- `FollowUpSection.jsx` - Numbered question list with copy

**Feedback & States:**
- `DraftDisclaimer.jsx` - Blue info box reinforcing AI-draft status
- `EmptyState.jsx` - Centered placeholder with instructions
- `ErrorAlert.jsx` - Dismissible red error message
- `LoadingOverlay.jsx` - Full-screen backdrop + spinner
- `CopyButton.jsx` - Reusable utility button (copy + success feedback)

---

### **`pages/`** - Route-Level Containers
**Purpose:** Orchestrate data flow, fetch state, and route-specific logic. Bridges components with hooks/services.

**File:**
- `AnalyzePage.jsx` - Composes `TranscriptInput`, `AnalyzeButton`, `AnalysisResults`, `LoadingOverlay`, `ErrorAlert`; uses `useTranscriptAnalysis` hook

---

### **`hooks/`** - Custom React Hooks
**Purpose:** Encapsulate stateful logic, side effects, and reusable behavior patterns.

**Files:**
- `useTranscriptAnalysis.js` - Manages transcript state, loading, analysis response, errors; calls API
- `useCopyToClipboard.js` - Wraps `navigator.clipboard.writeText()` with feedback UI state (copiedId, 2-sec timeout)

---

### **`services/`** - Backend Communication
**Purpose:** Abstract all HTTP/API calls and backend data fetching.

**Files:**
- `api.js` **[PRIMARY]** - Fetch-based `analyzeTranscript(transcript)` → POST `/api/analyze` with error handling
- `analysisApi.js` **[Legacy]** - Environment-aware wrapper (VITE_API_BASE_URL); used by `useTranscriptAnalysis`

**Recommendations:**
- Use `api.js` for new features
- Keep `analysisApi.js` for backwards compatibility

---

### **`utils/`** - Pure Functions & Constants
**Purpose:** Stateless helpers, constants, formatters, validators.

**Files:**
- `sampleTranscript.js` - Default demo transcript string

**Future additions:**
- `formatters.js` - Text formatting helpers (truncate, capitalize, etc.)
- `validators.js` - Input validation (transcript length, special chars, etc.)
- `constants.js` - Shared constants (score ranges, API timeouts, etc.)

---

### **`assets/`** - Static Files
**Purpose:** Images, icons, fonts, and other non-code resources.

**Current:** Empty (reserved for production use)

**Future structure:**
```
assets/
├── icons/
│   ├── copy.svg
│   ├── spinner.svg
│   └── ...
├── images/
│   └── logo.png
└── fonts/
    └── (custom fonts if needed)
```

---

### **`public/`** - Public Static Assets (Root Level)
**Purpose:** Vite-served files (favicon, manifest, data files, etc.)

**Files:**
- `sample-transcripts.json` - 4 demo supervision transcripts loaded by `SampleTranscriptSelector`

---

## Key Design Patterns

### 1. **Component Responsibilities**
- **Presentational components** (e.g., `ScoreSection`, `EvidenceSection`) receive props only; no API calls
- **Container components** (e.g., `AnalysisResults`) orchestrate child components
- **Page components** (e.g., `AnalyzePage`) manage app-level state and coordinate services

### 2. **Data Flow**
```
AnalyzePage (state: transcript, analysis, loading, error)
  ↓
useTranscriptAnalysis hook (calls api.js)
  ↓
services/api.js (POST /api/analyze)
  ↓
Components (receive via props, render UI)
```

### 3. **Error Handling**
- `ErrorAlert` displays API/form errors
- All API calls wrapped in try-catch with user-friendly messages
- Toast/overlay patterns prevent cascading failures

### 4. **Copy Functionality**
- `CopyButton` + `useCopyToClipboard` hook
- Used by `EvidenceSection`, `ScoreSection`, `FollowUpSection`
- 2-second success feedback with icon swap

---

## Production Checklist

✅ **Components:** 17 reusable, tested components  
✅ **Hooks:** 2 custom hooks for state & clipboard  
✅ **Services:** 2 API wrappers (primary + legacy)  
✅ **Utils:** Sample data + extensible structure  
✅ **Assets:** Reserved for icons, images, fonts  
✅ **Responsive:** Desktop-first, Tailwind CSS  
✅ **Accessibility:** ARIA labels, semantic HTML  
✅ **Error Handling:** Graceful API failures + user feedback  
✅ **Loading States:** Full-screen spinner + disabled inputs  
✅ **Draft Messaging:** Disclaimer component in all analysis displays  

---

## Scaling Notes

- **Add new analysis sections:** Create in `components/`, pass data via `AnalysisResults`
- **Add new services:** Create in `services/`, import in hooks
- **Add utilities:** Create in `utils/` (formatters, validators, etc.)
- **Add pages:** Create in `pages/`, wire routing in `App.jsx`
- **Refactor duplicated logic:** Extract to custom hooks
