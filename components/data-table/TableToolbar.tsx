import React from 'react';
import { Search, X, SlidersHorizontal, Download, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColumnDef, ColumnVisibility } from '@/lib/table-utils';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TableToolbarProps<T> {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  hideToolbarSearch?: boolean;
  columns: ColumnDef<T>[];
  columnVisibility: ColumnVisibility;
  onColumnVisibilityChange: (key: string, visible: boolean) => void;
  selectedCount: number;
  onClearSelection: () => void;
}

export default function TableToolbar<T>({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  hideToolbarSearch = false,
  columns,
  columnVisibility,
  onColumnVisibilityChange,
  selectedCount,
  onClearSelection
}: TableToolbarProps<T>) {
  return (
    <div className="relative">
      {/* Bulk Actions Bar */}
      <div className={cn(
        "absolute inset-0 z-10 flex items-center justify-between px-6 bg-blue-600 transition-all duration-300 transform",
        selectedCount > 0 ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}>
        <div className="flex items-center gap-4">
          <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase">
            {selectedCount} Selected
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearSelection}
            className="text-white hover:bg-white/10 text-xs font-bold"
          >
            Clear Selection
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10 gap-2 text-xs font-bold"
          >
            <Download className="h-3.5 w-3.5" />
            Export Selected
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-red-500/20 text-xs font-bold gap-2"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-200" />
            Delete
          </Button>
        </div>
      </div>

      {/* Default Toolbar */}
      <div className="flex items-center justify-between gap-4 px-6 py-4 bg-gray-950/30 border-b border-gray-800">
        {hideToolbarSearch ? <div /> : (
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10 bg-gray-900 border-gray-800 text-gray-200 focus:ring-blue-500/20 focus:border-blue-500/50"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200 gap-2 font-bold"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
              <DropdownMenuLabel className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                Toggle Columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              {columns.map(col => (
                <DropdownMenuCheckboxItem
                  key={col.key as string}
                  checked={columnVisibility[col.key as string] ?? true}
                  onCheckedChange={(checked) => onColumnVisibilityChange(col.key as string, !!checked)}
                  className="text-gray-300 focus:bg-gray-800 focus:text-white"
                >
                  {col.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
