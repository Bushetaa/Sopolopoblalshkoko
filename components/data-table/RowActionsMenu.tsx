import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { RowAction } from '@/lib/table-utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RowActionsMenuProps<T> {
  row: T;
  actions: RowAction<T>[];
}

export default function RowActionsMenu<T>({ row, actions }: RowActionsMenuProps<T>) {
  const visibleActions = actions.filter(action => !action.hidden?.(row));

  if (visibleActions.length === 0) return null;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 opacity-0 group-hover/row:opacity-100 transition-opacity data-[state=open]:opacity-100 hover:bg-gray-800 text-gray-500 hover:text-gray-200"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 w-48">
          {visibleActions.map((action, i) => (
            <DropdownMenuItem
              key={i}
              onClick={() => action.onClick(row)}
              disabled={action.disabled?.(row)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 cursor-pointer text-xs font-bold transition-colors focus:bg-gray-800",
                action.variant === 'destructive' 
                  ? "text-red-400 focus:text-red-300 focus:bg-red-500/10" 
                  : "text-gray-300 focus:text-white"
              )}
            >
              {action.icon && <action.icon className="h-3.5 w-3.5" />}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
