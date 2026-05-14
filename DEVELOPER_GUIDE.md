# Developer Quick-Start & Best Practices

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## Architecture Overview

### Stack
- **UI Framework:** React 18
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Runtime:** Node.js / Browser

### Core Principles
1. **Component-Driven:** Small, reusable, single-responsibility components
2. **Props-Based:** Data flows down via props, events flow up via callbacks
3. **Hook-Based:** Custom hooks for stateful logic
4. **Service Layer:** All API calls centralized in `services/`
5. **Desktop-First:** Responsive design starts with desktop, scales down

---

## File Organization

```
src/
├── components/        ← Presentational components (never fetch data)
├── pages/            ← Page-level containers (orchestrate state)
├── hooks/            ← Custom React hooks (reusable logic)
├── services/         ← API & backend calls (fetch, auth, etc.)
├── utils/            ← Pure functions, constants, helpers
├── assets/           ← Images, icons, fonts
├── App.jsx           ← Root component
├── main.jsx          ← Vite entry point
└── index.css         ← Global styles
```

---

## Adding a New Component

### Example: Create a Rating Component

**File:** `src/components/RatingStars.jsx`

```jsx
export default function RatingStars({ rating = 0, onRatingChange = () => {} }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRatingChange(star)}
          className={`h-8 w-8 rounded-full transition-colors ${
            star <= rating
              ? 'bg-yellow-400 text-yellow-900'
              : 'bg-slate-200 text-slate-400'
          }`}
          aria-label={`Rate ${star} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
```

**Key Points:**
- ✅ Receives data via props
- ✅ Calls callback on change (no side effects)
- ✅ Fully responsive
- ✅ Accessible (aria-label)
- ✅ No external dependencies

---

## Adding a New Hook

### Example: useFormValidation

**File:** `src/hooks/useFormValidation.js`

```javascript
import { useState } from 'react';

export function useFormValidation(initialValues = {}, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  }

  function validate(vals) {
    const errs = {};
    if (!vals.email) errs.email = 'Email required';
    if (!vals.message) errs.message = 'Message required';
    return errs;
  }

  return { values, errors, handleChange, handleSubmit };
}
```

**Usage in Component:**

```jsx
export default function ContactForm() {
  const { values, errors, handleChange, handleSubmit } = useFormValidation(
    { email: '', message: '' },
    (data) => console.log('Form submitted:', data)
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
      />
      {errors.email && <p className="text-red-600">{errors.email}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Key Points:**
- ✅ Encapsulates state logic
- ✅ Reusable across components
- ✅ Pure functions for validation
- ✅ Callback-based (no direct component coupling)

---

## Adding an API Service

### Example: Create userService

**File:** `src/services/userService.js`

```javascript
const API_URL = 'https://api.example.com';

export async function fetchUser(userId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user');
    }

    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function updateUser(userId, updates) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user');
    }

    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error');
  }
}
```

**Usage in Hook:**

```jsx
import { useEffect, useState } from 'react';
import { fetchUser } from '../services/userService.js';

export function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchUser(userId);
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    }

    if (userId) load();
  }, [userId]);

  return { user, loading, error };
}
```

**Key Points:**
- ✅ Centralized API calls
- ✅ Consistent error handling
- ✅ Environment-aware URLs
- ✅ No direct component coupling

---

## Naming Conventions

### Components
- **Descriptive, PascalCase:** `ScoreSection`, `ErrorAlert`, `CopyButton`
- **Avoid vague names:** ❌ `Card`, `Box`, `Container` → ✅ `EvidenceCard`, `ResultsContainer`

### Hooks
- **Start with `use`:** `useTranscriptAnalysis`, `useCopyToClipboard`
- **Descriptive:** `useFormValidation`, `useLocalStorage`, `usePagination`

### Files
- **Match component/function name:** `ScoreSection.jsx`, `useAnalysis.js`
- **Lowercase for utils:** `formatters.js`, `constants.js`, `validators.js`

### Props
- **Event callbacks:** `onSubmit`, `onClick`, `onClose`, `onSelect`
- **Data:** `score`, `evidence`, `loading`, `error`
- **Style flags:** `isActive`, `isDisabled`, `isDark`

---

## Code Style Guidelines

### Styling with Tailwind
```jsx
// ✅ Good: Responsive classes, semantic names
<div className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
  Title
</div>

// ❌ Bad: Hardcoded colors, no semantic meaning
<div style={{ fontSize: '16px', color: '#333', fontWeight: 'bold' }}>
  Title
</div>
```

### Component Structure
```jsx
// ✅ Good structure
import { useState } from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard.js';
import CopyButton from './CopyButton.jsx';

export default function MyComponent({ data, onAction = () => {} }) {
  const { copy, copiedId } = useCopyToClipboard();

  return (
    <div className="rounded-lg bg-white p-4">
      {/* Content */}
    </div>
  );
}

// ❌ Avoid: No clear structure, mixed concerns
function MyComponent(props) {
  // Business logic + UI mixed together
}
```

### Props Documentation
```jsx
/**
 * ScoreSection - Displays analysis score with reasoning
 * @param {number} score - Score 1-10
 * @param {string} justification - Reason for score
 * @returns {JSX.Element}
 */
export default function ScoreSection({ score = null, justification = '' }) {
  // ...
}
```

---

## Error Handling

### In Components
```jsx
{error && (
  <ErrorAlert
    error={error}
    onClose={() => setError('')}
  />
)}
```

### In Services
```javascript
try {
  // API call
} catch (error) {
  throw new Error(
    error instanceof Error ? error.message : 'Unknown error'
  );
}
```

### In Hooks
```javascript
try {
  const result = await fetchData();
  setData(result);
} catch (error) {
  setError(error instanceof Error ? error.message : 'Failed to load');
}
```

---

## Testing Checklist

Before committing:

- [ ] Component renders without errors
- [ ] Props validation (required props present)
- [ ] Event handlers called correctly
- [ ] No console warnings/errors
- [ ] Responsive across breakpoints
- [ ] Accessibility: keyboard navigation, ARIA labels
- [ ] No unused imports
- [ ] Linting passes (`npm run lint`)

---

## Common Patterns

### Conditional Rendering
```jsx
{data.length === 0 ? (
  <EmptyState />
) : (
  <DataGrid data={data} />
)}
```

### Loading State
```jsx
{loading && <LoadingOverlay />}
{error && <ErrorAlert error={error} />}
{!loading && !error && <Results data={analysis} />}
```

### Copy Button
```jsx
const { copy, copiedId } = useCopyToClipboard();

<CopyButton
  text="Text to copy"
  feedbackId="unique-id"
  isCopied={copiedId === 'unique-id'}
  onCopy={copy}
  label="Copy"
/>
```

### Responsive Container
```jsx
<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

---

## Debugging Tips

### React DevTools
```bash
# Install React DevTools browser extension
# Inspect component props, state, render count
```

### Console Logging
```jsx
useEffect(() => {
  console.log('Analysis updated:', analysis);
}, [analysis]);
```

### Vite Debug Mode
```bash
npm run dev -- --debug
```

---

## Performance Tips

1. **Lazy Load Components:**
   ```jsx
   const AnalysisResults = lazy(() => import('./components/AnalysisResults.jsx'));
   ```

2. **Memoize Expensive Components:**
   ```jsx
   export default memo(EvidenceSection);
   ```

3. **Avoid Re-renders:**
   ```jsx
   const handleChange = useCallback((val) => {
     setTranscript(val);
   }, []);
   ```

4. **Code Split Large Pages:**
   ```jsx
   const ComparePage = lazy(() => import('./pages/ComparePage.jsx'));
   ```

---

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
```bash
# .env.production
VITE_API_BASE_URL=https://api.production.example.com
```

### Vercel Deployment
```bash
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## Troubleshooting

### Issue: "Cannot find module"
**Solution:** Check import paths (relative paths from project root for src/)

### Issue: Tailwind classes not applying
**Solution:** Ensure class name is in `index.css` config; check for typos

### Issue: API call failing
**Solution:** Check browser DevTools Network tab; verify VITE_API_BASE_URL

### Issue: Component not updating
**Solution:** Check if state setter is called; use React DevTools to inspect

---

## Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
- [MDN Web Docs](https://developer.mozilla.org)
