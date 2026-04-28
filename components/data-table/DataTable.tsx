"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  DataTableProps, 
  SortState, 
  ColumnVisibility, 
  sortData, 
  searchData 
} from '@/lib/table-utils';
import { cn } from '@/lib/utils';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableFooter from './TableFooter';
import TableToolbar from './TableToolbar';
import RowActionsMenu from './RowActionsMenu';

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  searchPlaceholder,
  hideToolbarSearch = false,
  searchKeys,
  selectable,
  onSelectionChange,
  rowActions,
  isLoading,
  emptyMessage,
  emptyIcon,
  onRowClick,
  onSort: externalOnSort,
  className,
  density = 'default'
}: DataTableProps<T>) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState<SortState>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    columns.reduce((acc, col) => ({ ...acc, [col.key as string]: !col.hidden }), {})
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle internal sort
  const handleSort = (key: string) => {
    const newSort: SortState = {
      key,
      direction: sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc'
    };
    setSort(newSort);
    externalOnSort?.(newSort.key!, newSort.direction);
  };

  // Process data: Search -> Sort -> Paginate
  const processedData = useMemo(() => {
    let result = searchData(data, debouncedSearch, searchKeys);
    result = sortData(result, sort);
    return result;
  }, [data, debouncedSearch, sort, searchKeys]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  // Selection logic
  const handleSelectRow = (id: string, checked: boolean) => {
    const next = new Set(selectedRows);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedRows(next);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedData.map(row => row.id);
      setSelectedRows(new Set([...Array.from(selectedRows), ...pageIds]));
    } else {
      const pageIds = paginatedData.map(row => row.id);
      const next = new Set(selectedRows);
      pageIds.forEach(id => next.delete(id));
      setSelectedRows(next);
    }
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => selectedRows.has(row.id));

  useEffect(() => {
    const selectedData = data.filter(row => selectedRows.has(row.id));
    onSelectionChange?.(selectedData);
  }, [selectedRows, data, onSelectionChange]);

  // Augment columns with Actions if provided
  const finalColumns = useMemo(() => {
    const cols = columns.map(col => ({
      ...col,
      hidden: !columnVisibility[col.key as string]
    }));

    if (rowActions && rowActions.length > 0) {
      cols.push({
        key: '_actions',
        header: '',
        hidden: false,
        width: '48px',
        align: 'right',
        render: (_, row) => <RowActionsMenu row={row} actions={rowActions} />
      });
    }
    return cols;
  }, [columns, columnVisibility, rowActions]);

  return (
    <div className={cn(
      "bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col",
      className
    )}>
      <TableToolbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={searchPlaceholder}
        hideToolbarSearch={hideToolbarSearch}
        columns={columns}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={(key, visible) => 
          setColumnVisibility(prev => ({ ...prev, [key]: visible }))
        }
        selectedCount={selectedRows.size}
        onClearSelection={() => setSelectedRows(new Set())}
      />

      <div className="overflow-x-auto scrollbar-thin scrollbar-track-gray-950 scrollbar-thumb-gray-800">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <TableHeader 
            columns={finalColumns}
            sort={sort}
            onSort={handleSort}
            density={density}
            selectable={selectable}
            isAllSelected={isAllSelected}
            onSelectAll={handleSelectAll}
          />
          <TableBody 
            data={paginatedData}
            columns={finalColumns}
            density={density}
            selectable={selectable}
            selectedRows={selectedRows}
            onSelectRow={handleSelectRow}
            isLoading={isLoading}
            searchQuery={debouncedSearch}
            onRowClick={onRowClick}
          />
        </table>
      </div>

      <TableFooter 
        state={{
          currentPage,
          pageSize,
          totalItems: processedData.length
        }}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}
