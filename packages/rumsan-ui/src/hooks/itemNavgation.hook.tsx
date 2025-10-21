import { useCallback, useMemo, useState } from 'react';

export type ListResponse<T> = {
  data: T[];
  meta: Record<string, number>;
};

interface UseItemNavigationProps<T> {
  currentId: string;
}

export function useItemNavigation<T extends { [key: string]: any }>({
  currentId,
}: UseItemNavigationProps<T>) {
  const [listIds, setListIds] = useState<{ cuid: string; name: string }[]>([]);

  // Dynamically calculate currentIndex whenever listIds or currentId changes
  const currentIndex = useMemo(
    () => listIds.findIndex((item) => item.cuid === currentId),
    [listIds, currentId],
  );

  //const currentIndex = listIds.findIndex((item) => item.cuid === currentId);

  const getPreviousId = useCallback((): string | null => {
    if (currentIndex > 0) {
      return listIds[currentIndex - 1]?.cuid || null;
    }
    return null;
  }, [currentIndex, listIds]);

  const getNextId = useCallback((): string | null => {
    if (currentIndex < listIds.length - 1) {
      return listIds[currentIndex + 1]?.cuid || null;
    }
    return null;
  }, [currentIndex, listIds]);

  const prependListIds = useCallback(
    (items: { cuid: string; name: string }[]) => {
      setListIds((prev) => [...items, ...prev]);
    },
    [],
  );

  const appendListIds = useCallback(
    (items: { cuid: string; name: string }[]) => {
      setListIds((prev) => {
        return [...prev, ...items];
      });
    },
    [],
  );

  const clearListIds = useCallback(() => {
    setListIds([]);
  }, []);

  const setList = useCallback((items: { cuid: string; name: string }[]) => {
    setListIds(items);
  }, []);

  return {
    getPreviousId,
    getNextId,
    listIds,
    setList, // Use this instead of direct setListIds
    prependListIds, // Add items to the beginning of the list
    appendListIds, // Add items to the end of the list
    clearListIds,
  };
}
