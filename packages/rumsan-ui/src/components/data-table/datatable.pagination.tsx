import { Table } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import React from 'react';

import { Button } from '@rumsan/shadcn/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rumsan/shadcn/components/select';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  setPagination?: any;
  pagination?: any;
}

export function DataTablePagination<TData>({
  table,
  setPagination,
  pagination,
}: DataTablePaginationProps<TData>): React.JSX.Element {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-6 lg:space-x-8 ml-auto">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              setPagination((prev: any) => ({
                ...prev,
                pageSize: Number(value),
                pageIndex: 0,
              }));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 15, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(0); // Update internal table state
              setPagination((prev: any) => ({ ...prev, pageIndex: 0 })); // Update external state
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            //onClick={() => table.previousPage()}
            onClick={() => {
              const prevPageIndex = table.getState().pagination.pageIndex - 1;
              table.setPageIndex(prevPageIndex);
              setPagination((prev: any) => ({
                ...prev,
                pageIndex: prevPageIndex,
              }));
            }}
            // disabled={!table.getCanPreviousPage()}
            disabled={pagination.pageIndex === 0}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            //onClick={() => table.nextPage()}
            onClick={() => {
              const nextPageIndex = table.getState().pagination.pageIndex + 1;
              table.setPageIndex(nextPageIndex);
              setPagination((prev: any) => ({
                ...prev,
                pageIndex: nextPageIndex,
              }));
            }}
            // disabled={!table.getCanNextPage()}
            disabled={pagination.pageIndex + 1 >= table.getPageCount()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            // onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            onClick={() => {
              const lastPageIndex = table.getPageCount() - 1;
              table.setPageIndex(lastPageIndex);
              setPagination((prev: any) => ({
                ...prev,
                pageIndex: lastPageIndex,
              }));
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
