import {
  PaginationCache,
  PaginationQuery,
} from '@rumsan/sdk/types/pagination.types';
import { useEffect, useState } from 'react';
import { useItemNavigation } from '../hooks/itemNavgation.hook';

type useListItemNavigationProps<T> = {
  itemId: string;
  paginationCache: PaginationCache<T>;
  setPaginationCache: (cache: PaginationCache<T>) => void;
  fetchItem: (pageQuery: PaginationQuery) => Promise<{ response: any }>;
  navigateTo: (id: string) => void;
};

export function useListItemNavigation<
  T extends { cuid: string; description?: string },
>({
  itemId,
  paginationCache,
  setPaginationCache,
  fetchItem,
  navigateTo,
}: useListItemNavigationProps<T>) {
  const [currentItemId, setCurrentItemId] = useState(itemId);
  const [isLoading, setIsLoading] = useState(false);

  const { getPreviousId, getNextId, setList, prependListIds, appendListIds } =
    useItemNavigation<T>({
      currentId: currentItemId,
    });

  // Initialize the list with cache data
  useEffect(() => {
    if (
      paginationCache &&
      paginationCache.data &&
      paginationCache.data.length > 0
    ) {
      setList(
        paginationCache.data.map((item) => ({
          cuid: item.cuid,
          name: item.description || '',
        })),
      );
    }
  }, []);

  // Monitor current item position in the list
  useEffect(() => {
    if (!paginationCache.data || !paginationCache.data.length) return;

    const itemIndex = paginationCache.data.findIndex(
      (item) => item.cuid === currentItemId,
    );

    if (itemIndex === -1) return;

    const isLastItem = itemIndex === paginationCache.data.length - 1;
    const isFirstItem = itemIndex === 0;

    // If we're at the last item, fetch more data
    if (isLastItem && !isLoading) {
      fetchNextPage();
    }

    // If we're at the first item, fetch previous data
    if (
      isFirstItem &&
      !isLoading &&
      paginationCache.pageQuery.pagination.page > 1
    ) {
      fetchPreviousPage();
    }
  }, [currentItemId, paginationCache.data]);

  // Function to fetch the next page of items
  const fetchNextPage = async () => {
    setIsLoading(true);
    try {
      // Increment the page number for the next request
      const nextPageQuery = {
        ...paginationCache.pageQuery,
        pagination: {
          ...paginationCache.pageQuery.pagination,
          page: paginationCache.pageQuery.pagination.page
            ? paginationCache.pageQuery.pagination.page + 1
            : 1,
        },
      };

      console.log('Page:', nextPageQuery.pagination.page);

      const { response } = await fetchItem(nextPageQuery);
      const newData = response.data as T[];

      if (newData && newData.length > 0) {
        // Update the item list cache with the new data
        const updatedItemList = [...(paginationCache.data || []), ...newData];

        // Add new items to the navigation list
        appendListIds(
          newData.map((item) => ({
            cuid: item.cuid,
            name: item.description || '',
          })),
        );

        // Update pagination cache with the new page and data
        setPaginationCache({
          ...paginationCache,
          pageQuery: nextPageQuery,
          data: updatedItemList,
          meta: response.meta || paginationCache.meta,
        });
      }
    } catch (error) {
      console.error('Failed to fetch next page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch the previous page of items
  const fetchPreviousPage = async () => {
    setIsLoading(true);
    try {
      // Decrement the page number for the previous request
      const prevPageQuery = {
        ...paginationCache.pageQuery,
        pagination: {
          ...paginationCache.pageQuery.pagination,
          page: Math.max(
            (paginationCache.pageQuery.pagination.page || 1) - 1,
            1,
          ),
        },
      };

      console.log('Page:', prevPageQuery.pagination.page);

      // Don't fetch if we're already at page 1
      if (prevPageQuery.pagination.page < 1) {
        setIsLoading(false);
        return;
      }

      const { response } = await fetchItem(prevPageQuery);
      const newData = response.data as T[];

      if (newData && newData.length > 0) {
        // Update the item list cache with the new data
        const updatedItemList = [...newData, ...(paginationCache.data || [])];

        // Add new items to the beginning of the navigation list
        prependListIds(
          newData.map((item) => ({
            cuid: item.cuid,
            name: item.description || '',
          })),
        );

        // Update pagination cache with the new page and data
        setPaginationCache({
          ...paginationCache,
          pageQuery: prevPageQuery,
          data: updatedItemList,
          meta: response.meta || paginationCache.meta,
        });
      }
    } catch (error) {
      console.error('Failed to fetch previous page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (id: string) => {
    setCurrentItemId(id);
    navigateTo(id);
  };

  return {
    currentItemId,
    isLoading,
    getPreviousId,
    getNextId,
    handleNavigate,
  };
}
