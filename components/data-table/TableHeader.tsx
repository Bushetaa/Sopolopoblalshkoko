import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { ColumnDef, SortState, DENSITY_CONFIG } from '@/lib/table-utils';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface TableHeaderProps<T> {
  columns: ColumnDef<T>[];
  sort: SortState;
  onSort: (key: string) => void;
  density: keyof typeof DENSITY_CONFIG;
  selectable?: boolean;
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
}

export default function TableHeader<T>({
  columns,
  sort,
  onSort,
  density,
  selectable,
  isAllSelected,
  onSelectAll
}: TableHeaderProps<T>) {
  const config = DENSITY_CONFIG[density];

  return (
    <thead className="bg-gray-950/50 border-b border-gray-800">
      <tr>
        {selectable && (
          <th className={cn("px-4 text-left align-middle", config.headerPadding)}>
            <Checkbox 
              checked={isAllSelected} 
              onCheckedChange={(checked) => onSelectAll(!!checked)}
              className="border-gray-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
          </th>
        )}
        {columns.filter(col => !col.hidden).map((column) => {
          const isSorted = sort.key === column.key;
          
          return (
            <th
              key={column.key as string}
              className={cn(
                "px-4 font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap group/header transition-colors",
                config.headerPadding,
                config.fontSize,
                column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left',
                column.sortable && "cursor-pointer hover:text-gray-300"
              )}
              style={{ width: column.width, minWidth: column.minWidth }}
              onClick={() => column.sortable && onSort(column.key as string)}
            >
              <div className={cn(
                "flex items-center gap-2",
                column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-start'
              )}>
                {column.renderHeader ? column.renderHeader() : column.header}
                
                {column.sortable && (
                  <div className={cn(
                    "transition-all duration-200",
                    isSorted ? "text-blue-400 opacity-100" : "opacity-0 group-hover/header:opacity-100"
                  )}>
                    {isSorted ? (
                      sort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </div>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
