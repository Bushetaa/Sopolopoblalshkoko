import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';
import { getPageNumbers, PaginationState } from '@/lib/table-utils';
import { cn } from '@/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface TableFooterProps {
  state: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions: number[];
}

export default function TableFooter({
  state,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions
}: TableFooterProps) {
  const { currentPage, pageSize, totalItems } = state;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startRange = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalItems);

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-950/50 border-t border-gray-800">
      <div className="flex items-center gap-6">
        <p className="text-sm text-gray-500 font-medium">
          Showing <span className="text-gray-300 font-bold">{startRange}–{endRange}</span> of <span className="text-gray-300 font-bold">{totalItems}</span> results
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Rows per page</span>
          <Select 
            value={pageSize.toString()} 
            onValueChange={(v) => onPageSizeChange(parseInt(v))}
          >
            <SelectTrigger className="h-8 w-[70px] bg-gray-900 border-gray-800 text-gray-300 text-xs font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              {pageSizeOptions.map(option => (
                <SelectItem key={option} value={option.toString()} className="text-gray-300 text-xs font-bold">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 text-gray-500 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-30"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 text-gray-500 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          {pageNumbers.map((num, i) => (
            num === '...' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-600 font-bold">...</span>
            ) : (
              <Button
                key={`page-${num}`}
                variant={currentPage === num ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onPageChange(num as number)}
                className={cn(
                  "h-8 w-8 text-xs font-black transition-all duration-200",
                  currentPage === num 
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20" 
                    : "text-gray-500 hover:text-gray-200 hover:bg-gray-800"
                )}
              >
                {num}
              </Button>
            )
          ))}
        </div>

        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 w-8 text-gray-500 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 w-8 text-gray-500 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-30"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
