import { useState } from 'react';

export const useCopyToClipboard = () => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyToClipboard = async (text: string, snippetId?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (snippetId) {
        setCopiedSnippet(snippetId);
        setTimeout(() => setCopiedSnippet(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return {
    copiedSnippet,
    copyToClipboard,
  };
};
