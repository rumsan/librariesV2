import { PaginationQuery } from '@rumsan/sdk/types';
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

function convertArrayToObject(
  arr: { id: string; value: any }[],
): Record<string, any> {
  return arr.reduce(
    (acc, { id, value }) => {
      acc[id] = Array.isArray(value) && value.length === 1 ? value[0] : value;
      return acc;
    },
    {} as Record<string, any>,
  );
}

export function useDataTableState(
  searchParams: URLSearchParams,
  router: { replace: (url: string) => void },
  defaults: {
    page: number;
    limit: number;
    sort?: string;
    order?: 'asc' | 'desc';
  } = {
    page: 1,
    limit: 15,
    sort: 'createdAt',
    order: 'desc',
  },
) {
  // Parse query params for initial state
  const initialPage = Number(searchParams.get('page')) || defaults.page;
  const initialLimit = Number(searchParams.get('limit')) || defaults.limit;
  const initialSort = searchParams.get('sort') || defaults.sort;
  const initialOrder = searchParams.get('order') || defaults.order;

  const getPageFromParams = () => initialPage;
  const getLimitFromParams = () => initialLimit;

  const [sorting, setSorting] = useState<SortingState>(
    initialSort ? [{ id: initialSort, desc: initialOrder === 'desc' }] : [],
  );
  const [columnFilters, setColumnFilters] = useState<
    { id: string; value: any }[]
  >([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [pagination, setPaginationState] = useState({
    pageIndex: Math.max(getPageFromParams() - 1, 0),
    pageSize: getPageFromParams(),
  });

  // Function to update query parameters
  const updateQueryParams = (
    params: Partial<Record<string, string | number>>,
  ) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (!value) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    router.replace(`?${newParams.toString()}`);
  };

  const onSortingChange = (updater: Updater<SortingState>) => {
    const newSorting =
      typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(newSorting);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    updateQueryParams({
      page: 1,
      sort: newSorting[0]?.id || '',
      order: newSorting[0]?.desc ? 'desc' : 'asc',
    });
  };

  const onColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    const newFilters =
      typeof updater === 'function' ? updater(columnFilters) : updater;
    setColumnFilters(newFilters);
    if (newFilters.length) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      updateQueryParams({ page: 1 });
    }
  };

  const setPagination = (updater: Updater<PaginationState>) => {
    const newPagination =
      typeof updater === 'function' ? updater(pagination) : updater;
    setPaginationState(newPagination);
    updateQueryParams({
      page: newPagination.pageIndex + 1,
      limit: newPagination.pageSize,
    });
  };

  useEffect(() => {
    const newPage = getPageFromParams();
    const newLimit = getLimitFromParams();

    if (
      pagination.pageIndex !== newPage - 1 ||
      pagination.pageSize !== newLimit
    ) {
      setPaginationState({
        pageIndex: Math.max(newPage - 1, 0),
        pageSize: newLimit,
      });
    }
  }, [searchParams]);

  const pageQueryState: PaginationQuery = {
    pagination: {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sort: sorting[0]?.id,
      order: (sorting[0]?.desc ?? true) ? 'desc' : 'asc',
    },
    filters: convertArrayToObject(columnFilters),
  };

  return {
    pageQueryState,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination,
    setPaginationState,
    onSortingChange,
    onColumnFiltersChange,
    updateQueryParams,
  };
}
