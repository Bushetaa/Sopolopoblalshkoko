import React from 'react';
import { ColumnDef, DENSITY_CONFIG } from '@/lib/table-utils';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import HighlightText from './HighlightText';
import TableEmptyState from './TableEmptyState';
import { Skeleton } from '@/components/ui/skeleton';

interface TableBodyProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDef<T>[];
  density: keyof typeof DENSITY_CONFIG;
  selectable?: boolean;
  selectedRows: Set<string>;
  onSelectRow: (id: string, checked: boolean) => void;
  isLoading?: boolean;
  searchQuery?: string;
  onRowClick?: (row: T) => void;
}

export default function TableBody<T extends { id: string }>({
  data,
  columns,
  density,
  selectable,
  selectedRows,
  onSelectRow,
  isLoading,
  searchQuery,
  onRowClick
}: TableBodyProps<T>) {
  const config = DENSITY_CONFIG[density];
  const visibleColumns = columns.filter(col => !col.hidden);

  if (isLoading) {
    return (
      <tbody className="divide-y divide-gray-800/50">
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <tr key={rowIndex} className="animate-pulse">
            {selectable && (
              <td className={cn("px-4", config.rowPadding)}>
                <Skeleton className="h-4 w-4 rounded bg-gray-800" />
              </td>
            )}
            {visibleColumns.map((col, colIndex) => (
              <td key={colIndex} className={cn("px-4", config.rowPadding)}>
                <Skeleton className={cn(
                  "h-4 bg-gray-800 rounded",
                  col.width ? `w-[${col.width}]` : "w-full"
                )} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={visibleColumns.length + (selectable ? 1 : 0)}>
            <TableEmptyState isSearch={!!searchQuery} />
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-gray-800/50">
      {data.map((row, rowIndex) => {
        const isSelected = selectedRows.has(row.id);
        
        return (
          <tr 
            key={row.id}
            onClick={() => onRowClick?.(row)}
            className={cn(
              "group/row transition-all duration-200 hover:bg-gray-900/40",
              isSelected && "bg-blue-500/5 hover:bg-blue-500/10",
              onRowClick && "cursor-pointer"
            )}
          >
            {selectable && (
              <td className={cn("px-4", config.rowPadding)} onClick={(e) => e.stopPropagation()}>
                <Checkbox 
                  checked={isSelected}
                  onCheckedChange={(checked) => onSelectRow(row.id, !!checked)}
                  className="border-gray-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </td>
            )}
            {visibleColumns.map((column) => {
              const value = (row as any)[column.key];
              
              return (
                <td 
                  key={column.key as string}
                  className={cn(
                    "px-4 text-gray-300 font-medium transition-colors group-hover/row:text-gray-100",
                    config.rowPadding,
                    config.fontSize,
                    column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                  )}
                >
                  {column.render ? (
                    column.render(value, row, rowIndex)
                  ) : (
                    <HighlightText text={String(value ?? '')} query={searchQuery} />
                  )}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
