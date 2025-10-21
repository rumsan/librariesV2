'use client';

import { ColumnDef, flexRender, Table } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';

import React from 'react';
import {
  TableBody,
  TableCell,
  Table as TableDom,
  TableHead,
  TableHeader,
  TableRow,
} from '@rumsan/shadcn/components/table';
import { DataTableNoData } from '../data-table/datatable.nodata';

interface DataTableProps<T, TData> {
  columns: ColumnDef<T>[];
  table: Table<TData>;
  isLoading?: boolean;
  handleRowClick?: (row: any) => void;
}

export function DataTable<T, TData>({
  table,
  columns,
  isLoading,
  handleRowClick,
}: DataTableProps<T, TData>) {
  return (
    <TableDom className="w-full">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  className="text-sm text-black-900 cursor-pointer"
                  key={header.id}
                  //onClick={header.column.getToggleSortingHandler()}
                >
                  <span
                    className="inline-flex items-center gap-1 w-full"
                    //onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {/* {header.column.getIsSorted() === 'asc' ? (
                      <span className="text-gray-600">▲</span> // Lighter gray color
                    ) : header.column.getIsSorted() === 'desc' ? (
                      <span className="text-gray-600">▼</span>
                    ) : null} */}
                  </span>
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>

      {/* <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="bg-gray-200">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="border p-2 cursor-pointer"
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
                {header.column.getIsSorted() === 'asc'
                  ? ' ▲'
                  : header.column.getIsSorted() === 'desc'
                    ? ' ▼'
                    : ''}
              </th>
            ))}
          </tr>
        ))}
      </thead> */}
      <TableBody>
        {isLoading ? (
          <TableRow className="h-96">
            <TableCell colSpan={columns.length} className="text-center">
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin h-5 w-5 text-black" />{' '}
              </div>
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              className="text-sm text-black-900 cursor-pointer h-5"
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              onClick={() => handleRowClick && handleRowClick(row)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {
                    flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    ) as React.ReactNode
                  }
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow className="h-96">
            <TableCell colSpan={columns.length} className="text-center">
              <DataTableNoData />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </TableDom>
  );
}
