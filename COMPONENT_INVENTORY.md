# Component Inventory - Trinethra Feedback Analyzer

## Quick Reference Guide

### Layout & Navigation (3)
| Component | File | Props | Exports | Purpose |
|-----------|------|-------|---------|---------|
| Layout | `Layout.jsx` | `children` | Wrapper | Responsive max-width container with vertical spacing |
| Header | `Header.jsx` | None | Fixed | Sticky header with title + badge |
| EmptyState | `EmptyState.jsx` | None | Full-screen | Placeholder when no analysis exists |

### Input & Actions (3)
| Component | File | Props | Exports | Purpose |
|-----------|------|-------|---------|---------|
| TranscriptInput | `TranscriptInput.jsx` | `transcript`, `setTranscript` | Controlled | Textarea with character count & clear button |
| AnalyzeButton | `AnalyzeButton.jsx` | `onClick`, `loading`, `disabled` | Action | CTA with animated spinner |
| SampleTranscriptSelector | `SampleTranscriptSelector.jsx` | `onSelect` | Selector | Dropdown to load demo transcripts |

### Analysis Display (6)
| Component | File | Props | Exports | Purpose |
|-----------|------|-------|---------|---------|
| AnalysisResults | `AnalysisResults.jsx` | `analysisData` | Container | Orchestrates all result sections |
| EvidenceSection | `EvidenceSection.jsx` | `evidence[]` | Display | Quote cards with type badges + copy |
| ScoreSection | `ScoreSection.jsx` | `score`, `justification` | Display | Large score + reasoning + copy |
| KPISection | `KPISection.jsx` | `kpis[]` | Display | KPI grid with reason & evidence |
| GapSection | `GapSection.jsx` | `gaps[]` | Display | Warning-style gap cards |
| FollowUpSection | `FollowUpSection.jsx` | `followUpQuestions[]` | Display | Numbered question list + copy |

### Feedback & States (5)
| Component | File | Props | Exports | Purpose |
|-----------|------|-------|---------|---------|
| DraftDisclaimer | `DraftDisclaimer.jsx` | None | Display | Blue info: "AI-generated draft" |
| ErrorAlert | `ErrorAlert.jsx` | `error`, `onClose` | Modal | Dismissible error message |
| LoadingOverlay | `LoadingOverlay.jsx` | `loading`, `message` | Modal | Full-screen backdrop + spinner |
| CopyButton | `CopyButton.jsx` | `text`, `feedbackId`, `isCopied`, `onCopy`, `label` | Action | Reusable copy button + feedback |

---

## Pages (1)
| Page | File | Purpose |
|------|------|---------|
| AnalyzePage | `AnalyzePage.jsx` | Main analysis page; orchestrates state + components |

---

## Hooks (2)
| Hook | File | Returns | Purpose |
|------|------|---------|---------|
| useTranscriptAnalysis | `useTranscriptAnalysis.js` | `{ transcript, setTranscript, analysis, error, isLoading, analyze, reset }` | Manages analysis flow & state |
| useCopyToClipboard | `useCopyToClipboard.js` | `{ copy, copiedId }` | Clipboard with 2-sec feedback |

---

## Services (2)
| Service | File | Exports | Purpose |
|---------|------|---------|---------|
| api | `api.js` | `analyzeTranscript(transcript)` | Fetch POST /api/analyze [PRIMARY] |
| analysisApi | `analysisApi.js` | `analyzeTranscript(transcript)` | Environment-aware wrapper [LEGACY] |

---

## Utils (1)
| Util | File | Exports | Purpose |
|------|------|---------|---------|
| sampleTranscript | `sampleTranscript.js` | `sampleTranscript` string | Default demo transcript |

---

## File Count Summary
- **Components:** 17
- **Pages:** 1
- **Hooks:** 2
- **Services:** 2
- **Utils:** 1
- **Total:** 23 source files

---

## Dependency Map

```
App.jsx
├── Header.jsx
├── Layout.jsx
└── AnalyzePage.jsx
    ├── useTranscriptAnalysis hook
    │   └── api.js service
    ├── TranscriptInput.jsx
    ├── SampleTranscriptSelector.jsx
    ├── AnalyzeButton.jsx
    ├── LoadingOverlay.jsx
    ├── ErrorAlert.jsx
    ├── EmptyState.jsx (conditional)
    └── AnalysisResults.jsx
        ├── DraftDisclaimer.jsx
        ├── EvidenceSection.jsx
        │   ├── CopyButton.jsx
        │   └── useCopyToClipboard hook
        ├── ScoreSection.jsx
        │   ├── CopyButton.jsx
        │   └── useCopyToClipboard hook
        ├── KPISection.jsx
        ├── GapSection.jsx
        └── FollowUpSection.jsx
            ├── CopyButton.jsx
            └── useCopyToClipboard hook
```

---

## Component Communication Patterns

### Props Down
- `AnalyzePage` → `AnalysisResults` (via `analysisData` prop)
- `AnalysisResults` → child sections (via `evidence`, `score`, etc.)
- `useTranscriptAnalysis` state → `AnalyzePage` props

### Events Up
- `TranscriptInput` → `setTranscript` callback
- `AnalyzeButton` → `onClick` callback
- `SampleTranscriptSelector` → `onSelect` callback
- `ErrorAlert` → `onClose` callback
- `CopyButton` → `onCopy` callback

### Hooks
- `useTranscriptAnalysis` manages app-level state
- `useCopyToClipboard` manages clipboard + feedback UI

---

## Production Deployment Notes

1. **Environment Variables** (`.env` or similar):
   ```
   VITE_API_BASE_URL=https://api.example.com
   ```

2. **Build Output:**
   ```
   dist/
   ├── index.html
   ├── assets/
   │   ├── main-*.js
   │   ├── main-*.css
   │   └── (vendor bundles)
   ```

3. **Load Testing Focus:**
   - Large transcripts (10K+ characters)
   - Copy-to-clipboard reliability
   - Loading state UX
   - Error recovery

4. **Accessibility Checklist:**
   - ✅ Semantic HTML
   - ✅ ARIA labels (aria-live, aria-busy, etc.)
   - ✅ Keyboard navigation
   - ✅ Color contrast ratios

5. **Performance:**
   - Code splitting: Lazy-load `AnalysisResults` on demand
   - Image optimization: Compress any SVG icons
   - CSS purging: Tailwind production build removes unused classes

---

## Future Extensibility

### New Features
- **Export to PDF:** Create `services/exportService.js` + add export buttons
- **History/Save:** Create `hooks/useAnalysisHistory.js` + storage layer
- **Compare Transcripts:** Add `pages/ComparePage.jsx` + comparison components
- **User Auth:** Add `hooks/useAuth.js` + login/profile pages
- **Dark Mode:** Add to `App.jsx` + `index.css` + context provider

### New Components
```
components/
├── Sidebar.jsx              # Collapsible navigation
├── AnalysisCard.jsx         # Reusable saved analysis card
├── ExportModal.jsx          # PDF/CSV export dialog
└── HistoryPanel.jsx         # Previous analyses list
```

### New Services
```
services/
├── storageService.js        # localStorage / IndexedDB
├── exportService.js         # PDF/CSV generation
├── authService.js           # Login / session
└── analyticsService.js      # Usage tracking
```
