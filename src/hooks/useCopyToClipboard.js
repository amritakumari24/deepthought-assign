import { useState, useCallback } from 'react';

export function useCopyToClipboard() {
  const [copiedId, setCopiedId] = useState(null);

  const copy = useCallback(async (text, feedbackId = 'default') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(feedbackId);
      setTimeout(() => setCopiedId(null), 2000);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { copy, copiedId };
}
