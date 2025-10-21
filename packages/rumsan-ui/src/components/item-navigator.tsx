import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '@rumsan/shadcn/components/button';

interface ItemNavigatorProps {
  currentId: string;
  onNavigate: (id: string) => void;
  getPreviousId: () => string | null;
  getNextId: () => string | null;
  className?: string;
  loading?: boolean;
}

export function ItemNavigator({
  currentId,
  onNavigate,
  getPreviousId,
  getNextId,
  className = '',
  loading = false,
}: ItemNavigatorProps): React.JSX.Element {
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    // Check if previous/next items exist
    if (loading) return;
    const checkNavigation = () => {
      const prevId = getPreviousId();
      setHasPrevious(!!prevId);

      const nextId = getNextId();
      setHasNext(!!nextId);
    };
    checkNavigation();
  }, [currentId, getPreviousId, getNextId, loading, hasPrevious, hasNext]);

  const handlePrevious = () => {
    const prevId = getPreviousId();
    if (prevId) onNavigate(prevId);
  };

  const handleNext = () => {
    const nextId = getNextId();
    if (nextId) onNavigate(nextId);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={!hasPrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={!hasNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
