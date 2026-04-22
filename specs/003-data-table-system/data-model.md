# Data Models: Data Table System

## Core Interfaces

```typescript
export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  minWidth?: string;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;              // Hidden by default (togglable)
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
}

export interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;             // Default: 10
  pageSizeOptions?: number[];    // Default: [10, 20, 50, 100]
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];      // Fields to search; defaults to all string fields
  selectable?: boolean;
  onSelectionChange?: (rows: T[]) => void;
  rowActions?: RowAction<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
  onRowClick?: (row: T) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  className?: string;
  density?: 'compact' | 'default' | 'comfortable';
}

export interface RowAction<T> {
  label: string;
  icon?: LucideIcon;
  variant?: 'default' | 'destructive';
  onClick: (row: T) => void;
  hidden?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}

export interface SortState {
  key: string | null;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  currentPage: number;  // 1-indexed
  pageSize: number;
  totalItems: number;
}

export type ColumnVisibility = Record<string, boolean>;
```

## Status Badge Config

```typescript
export type EntityStatus = 'active' | 'inactive' | 'maintenance' | 'deprecated' | 'error';

export const STATUS_CONFIG: Record<EntityStatus, {
  label: string;
  dot: string;
  bg: string;
  text: string;
  border: string;
  animated: boolean;
}> = {
  active:      { label: 'Active',      dot: 'bg-green-400',  bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20',  animated: true },
  inactive:    { label: 'Inactive',    dot: 'bg-gray-400',   bg: 'bg-gray-700/50',   text: 'text-gray-400',   border: 'border-gray-700',      animated: false },
  maintenance: { label: 'Maintenance', dot: 'bg-yellow-400', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', animated: false },
  deprecated:  { label: 'Deprecated',  dot: 'bg-orange-400', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', animated: false },
  error:       { label: 'Error',       dot: 'bg-red-400',    bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20',    animated: false },
};
```

## Density Config

```typescript
export const DENSITY_CONFIG = {
  compact:     { rowPadding: 'py-2', headerPadding: 'py-2', fontSize: 'text-xs' },
  default:     { rowPadding: 'py-3', headerPadding: 'py-3', fontSize: 'text-sm' },
  comfortable: { rowPadding: 'py-4', headerPadding: 'py-4', fontSize: 'text-sm' },
} as const;
```

## Pagination Utility

```typescript
// Smart page numbers: [1] ... [4] [5] [6] ... [20]
export function getPageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
  if (currentPage >= totalPages - 3) return [1, '...', totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages];
  return [1, '...', currentPage-1, currentPage, currentPage+1, '...', totalPages];
}

// Sort utility
export function sortData<T>(data: T[], sort: SortState): T[] {
  if (!sort.key) return data;
  return [...data].sort((a, b) => {
    const aVal = (a as any)[sort.key!];
    const bVal = (b as any)[sort.key!];
    if (typeof aVal === 'string') return sort.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    if (typeof aVal === 'number') return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
    if (aVal instanceof Date) return sort.direction === 'asc' ? +aVal - +bVal : +bVal - +aVal;
    return 0;
  });
}

// Search utility
export function searchData<T>(data: T[], query: string, searchKeys?: (keyof T)[]): T[] {
  if (!query.trim()) return data;
  const q = query.toLowerCase();
  return data.filter(row => {
    const keys = searchKeys ?? Object.keys(row as object) as (keyof T)[];
    return keys.some(key => {
      const v = row[key];
      if (typeof v === 'string') return v.toLowerCase().includes(q);
      if (typeof v === 'number') return v.toString().includes(q);
      return false;
    });
  });
}

export function escapeRegex(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
```
