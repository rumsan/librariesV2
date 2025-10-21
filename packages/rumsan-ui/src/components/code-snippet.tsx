import React, { useState } from 'react';
import { Copy, Check, CheckSquare2, LucideCheckSquare } from 'lucide-react';
import { Button } from '@rumsan/shadcn/components/button';
import { useCopyToClipboard } from '../hooks';

interface CodeSnippetProps {
  code: string;
  language?: string;
  className?: string;
  snippetId: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
  code,
  language = 'typescript',
  className = '',
  snippetId,
}) => {
  const { copiedSnippet, copyToClipboard } = useCopyToClipboard();
  const [isCheckmark, setIsCheckmark] = useState(false);

  const handleCopy = () => {
    copyToClipboard(code, snippetId);
    setIsCheckmark(true);
    setTimeout(() => setIsCheckmark(false), 500);
  };

  return (
    <div className={`relative ${className}`}>
      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-muted-foreground/10 z-10"
        onClick={handleCopy}
        disabled={isCheckmark}
      >
        {isCheckmark ? (
          <LucideCheckSquare className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
