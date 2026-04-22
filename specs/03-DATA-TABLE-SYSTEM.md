# 📋 Spec 03 — Data Table System
## Sopo Platform | نظام الجداول التفاعلية

> **Spec ID**: SOPO-SPEC-03  
> **Priority**: 🟠 High (Used across all pages)  
> **Status**: 🟡 Partially Implemented (basic tables exist)  
> **Depends On**: Spec 01 (Layout System)  
> **Required By**: Spec 04 (Filters), Spec 05 (Users), Spec 06 (Reports)  

---

## 🎯 Overview | نظرة عامة

نظام الجداول هو المكون الأكثر استخدامًا في المنصة. يُستخدم في صفحات API Manager، API Gateway، Workspaces، Rate Limiting، وUser Management. يجب أن يكون الجدول مرنًا وقابلًا لإعادة الاستخدام مع دعم كامل لـ Sorting، Pagination، Search، Selection، و Row Actions.

---

## 🏗️ 1. Data Table Architecture

### 1.1 Component Hierarchy

```
DataTable (Main Container)
├── TableToolbar
│   ├── SearchInput
│   ├── ColumnVisibilityToggle
│   ├── BulkActions (when rows selected)
│   └── ExtraActions (per-page custom buttons)
│
├── TableContainer (scrollable)
│   └── <table>
│       ├── TableHeader
│       │   └── TableRow → TableHead (sortable headers)
│       └── TableBody
│           ├── TableRow (data row) × N
│           │   ├── SelectionCheckbox
│           │   ├── DataCells × N
│           │   └── ActionCell (dropdown menu)
│           ├── EmptyState (when no data)
│           └── LoadingState (skeleton rows)
│
└── TableFooter
    ├── RowCount ("Showing 1–20 of 158 results")
    ├── RowsPerPage selector
    └── Pagination controls
```

### 1.2 Generic TypeScript Interface

```typescript
// Core DataTable component — generic and reusable
interface ColumnDef<T> {
  key: keyof T | string;          // Data key to display
  header: string;                 // Column header label
  width?: string;                 // Fixed width e.g., "120px"
  minWidth?: string;              // Minimum width
  sortable?: boolean;             // Enable sorting on this column
  filterable?: boolean;           // Enable filter on this column
  hidden?: boolean;               // Hidden by default (toggle-able)
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDef<T>[];
  
  // Pagination
  pageSize?: number;              // Default: 10
  pageSizeOptions?: number[];     // Default: [10, 20, 50, 100]
  
  // Search
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];       // Which fields to search in
  
  // Selection
  selectable?: boolean;           // Enable row selection
  onSelectionChange?: (selectedRows: T[]) => void;
  
  // Row Actions
  rowActions?: RowAction<T>[];
  
  // State
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
  
  // Callbacks
  onRowClick?: (row: T) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  
  // Styling
  className?: string;
  density?: 'compact' | 'default' | 'comfortable';
}

interface RowAction<T> {
  label: string;
  icon?: LucideIcon;
  variant?: 'default' | 'destructive';
  onClick: (row: T) => void;
  hidden?: (row: T) => boolean;   // Conditionally hide action
  disabled?: (row: T) => boolean; // Conditionally disable action
}
```

---

## 🔡 2. Column System

### 2.1 Standard Column Types

```typescript
// TEXT Column — simple string display
const textColumn: ColumnDef<API> = {
  key: 'name',
  header: 'API Name',
  sortable: true,
  render: (value) => (
    <span className="text-gray-50 font-medium">{value}</span>
  )
};

// BADGE Column — status/type with colored badge
const statusColumn: ColumnDef<API> = {
  key: 'status',
  header: 'Status',
  width: '100px',
  render: (value: API['status']) => (
    <StatusBadge status={value} />
  )
};

// NUMBER Column — numeric with formatting
const requestsColumn: ColumnDef<API> = {
  key: 'requests',
  header: 'Requests',
  align: 'right',
  sortable: true,
  render: (value) => (
    <span className="tabular-nums text-gray-300">{formatNumber(value)}</span>
  )
};

// DATE Column — formatted timestamp
const dateColumn: ColumnDef<API> = {
  key: 'lastUpdate',
  header: 'Last Updated',
  sortable: true,
  render: (value) => (
    <span className="text-gray-400 text-sm">{formatRelativeTime(value)}</span>
  )
};

// ACTIONS Column — row action menu
const actionsColumn: ColumnDef<API> = {
  key: '_actions',
  header: '',
  width: '48px',
  align: 'right',
  render: (_, row) => <RowActionsMenu row={row} actions={rowActions} />
};
```

### 2.2 Column Visibility Control

```typescript
// Users can toggle column visibility
interface ColumnVisibility {
  [key: string]: boolean;
}

const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
  name: true,
  type: true,
  status: true,
  version: true,
  endpoints: true,
  lastUpdate: true,
  security: false,      // Hidden by default
  tags: false,          // Hidden by default
});
```

```tsx
// Column Visibility Dropdown
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm 
                       text-gray-400 bg-gray-900 border border-gray-800 
                       rounded-lg hover:bg-gray-800 transition-colors">
      <SlidersHorizontal className="h-4 w-4" />
      Columns
    </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700 w-48">
    {columns.map(col => (
      <DropdownMenuCheckboxItem
        key={col.key}
        checked={columnVisibility[col.key] ?? true}
        onCheckedChange={(checked) => 
          setColumnVisibility(prev => ({ ...prev, [col.key]: checked }))
        }
        className="text-gray-300"
      >
        {col.header}
      </DropdownMenuCheckboxItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 🔃 3. Sorting System

### 3.1 Sort State Management

```typescript
interface SortState {
  key: string | null;
  direction: 'asc' | 'desc';
}

const [sort, setSort] = useState<SortState>({ key: null, direction: 'asc' });

// Toggle sort direction
const handleSort = (columnKey: string) => {
  setSort(prev => ({
    key: columnKey,
    direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc'
  }));
};

// Apply sort to data
const sortedData = useMemo(() => {
  if (!sort.key) return data;
  
  return [...data].sort((a, b) => {
    const aVal = a[sort.key as keyof typeof a];
    const bVal = b[sort.key as keyof typeof b];
    
    if (typeof aVal === 'string') {
      return sort.direction === 'asc'
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal);
    }
    
    if (typeof aVal === 'number') {
      return sort.direction === 'asc'
        ? aVal - (bVal as number)
        : (bVal as number) - aVal;
    }
    
    return 0;
  });
}, [data, sort]);
```

### 3.2 Sortable Column Header Rendering

```tsx
const SortableHeader: React.FC<{
  column: ColumnDef<any>;
  sort: SortState;
  onSort: (key: string) => void;
}> = ({ column, sort, onSort }) => {
  const isSorted = sort.key === column.key;
  
  return (
    <th
      className={cn(
        "px-4 py-3 text-left",
        column.sortable && "cursor-pointer select-none group"
      )}
      onClick={() => column.sortable && onSort(column.key as string)}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider 
                         group-hover:text-gray-300 transition-colors">
          {column.header}
        </span>
        
        {column.sortable && (
          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
            {isSorted ? (
              sort.direction === 'asc'
                ? <ArrowUp className="h-3 w-3 text-blue-400" />
                : <ArrowDown className="h-3 w-3 text-blue-400" />
            ) : (
              <ArrowUpDown className="h-3 w-3 text-gray-600" />
            )}
          </div>
        )}
      </div>
    </th>
  );
};
```

---

## 🔢 4. Pagination System

### 4.1 Pagination State

```typescript
interface PaginationState {
  currentPage: number;    // 1-indexed
  pageSize: number;       // Rows per page
  totalItems: number;     // Total data count
}

const [pagination, setPagination] = useState<PaginationState>({
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
});

// Derived values
const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);
const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
const endIndex = Math.min(startIndex + pagination.pageSize, pagination.totalItems);

// Paginated data slice
const paginatedData = sortedFilteredData.slice(startIndex, endIndex);
```

### 4.2 Pagination UI Component

```tsx
// Table footer pagination
const TablePagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange
}) => {
  
  // Smart page numbers: [1] ... [4] [5] [6] ... [20]
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };
  
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
      
      {/* Left: Row count info */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">
          Showing <span className="text-gray-300 font-medium">{startIndex + 1}–{endIndex}</span> of{' '}
          <span className="text-gray-300 font-medium">{totalItems}</span> results
        </span>
        
        {/* Rows per page selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-600">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-gray-900 border border-gray-800 rounded-md px-2 py-0.5 
                       text-sm text-gray-300 focus:outline-none focus:border-blue-500/50"
          >
            {[10, 20, 50, 100].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Right: Page navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 
                     hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 
                     hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        {getPageNumbers().map((page, i) => (
          page === '...'
            ? <span key={`dots-${i}`} className="px-2 text-gray-600">...</span>
            : <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "w-8 h-8 rounded-md text-sm transition-all",
                  currentPage === page
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                )}
              >
                {page}
              </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 
                     hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 
                     hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
```

---

## 🔍 5. Search System

### 5.1 Search Implementation

```typescript
const [searchQuery, setSearchQuery] = useState('');

// Multi-field search with debounce
const filteredData = useMemo(() => {
  if (!searchQuery.trim()) return data;
  
  const query = searchQuery.toLowerCase();
  
  return data.filter(row => {
    // Search in specified keys or all string fields
    const searchableKeys = searchKeys ?? Object.keys(row) as (keyof T)[];
    
    return searchableKeys.some(key => {
      const value = row[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(query);
      }
      if (typeof value === 'number') {
        return value.toString().includes(query);
      }
      return false;
    });
  });
}, [data, searchQuery, searchKeys]);
```

### 5.2 Search Input Component

```tsx
const TableSearch: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
}> = ({ value, onChange, placeholder = "Search...", resultCount }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        bg-gray-900 border border-gray-800 rounded-lg
        pl-9 pr-9 py-2 text-sm text-gray-300
        placeholder:text-gray-600
        focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20
        w-72 transition-all duration-150
      "
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 
                   text-gray-500 hover:text-gray-300 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);
```

### 5.3 Search Highlight

```tsx
// Highlight matching text in search results
const HighlightText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'gi'));
  
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-yellow-400/20 text-yellow-300 rounded px-0.5">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  );
};
```

---

## ☑️ 6. Row Selection System

### 6.1 Selection State

```typescript
const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

// Select all on current page
const handleSelectAll = (checked: boolean) => {
  if (checked) {
    setSelectedRows(new Set(paginatedData.map(row => row.id)));
  } else {
    setSelectedRows(new Set());
  }
};

// Toggle single row
const handleSelectRow = (id: string, checked: boolean) => {
  setSelectedRows(prev => {
    const next = new Set(prev);
    checked ? next.add(id) : next.delete(id);
    return next;
  });
};

// Derived states
const isAllSelected = paginatedData.length > 0 && 
                      paginatedData.every(row => selectedRows.has(row.id));
const isPartiallySelected = paginatedData.some(row => selectedRows.has(row.id)) && !isAllSelected;
```

### 6.2 Bulk Actions Bar

```tsx
// Appears when rows are selected
{selectedRows.size > 0 && (
  <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-500/10 border-b border-blue-500/20">
    <span className="text-sm text-blue-400 font-medium">
      {selectedRows.size} row{selectedRows.size > 1 ? 's' : ''} selected
    </span>
    
    <div className="h-4 w-px bg-blue-500/20" />
    
    {/* Bulk action buttons */}
    <button className="text-sm text-gray-400 hover:text-gray-200 transition-colors flex items-center gap-1.5">
      <Download className="h-3.5 w-3.5" />
      Export Selected
    </button>
    
    <button className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5">
      <Trash2 className="h-3.5 w-3.5" />
      Delete Selected
    </button>
    
    <button
      className="ml-auto text-sm text-gray-500 hover:text-gray-300 transition-colors"
      onClick={() => setSelectedRows(new Set())}
    >
      Clear selection
    </button>
  </div>
)}
```

---

## 🔲 7. Row Actions Menu

### 7.1 Dropdown Actions

```tsx
const RowActionsMenu: React.FC<{ row: T; actions: RowAction<T>[] }> = ({ row, actions }) => {
  const visibleActions = actions.filter(a => !a.hidden?.(row));
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 rounded-md text-gray-600 hover:text-gray-300 
                           hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700 min-w-[160px]">
        {visibleActions.map((action, i) => (
          <DropdownMenuItem
            key={i}
            onClick={() => action.onClick(row)}
            disabled={action.disabled?.(row)}
            className={cn(
              "flex items-center gap-2 text-sm cursor-pointer",
              action.variant === 'destructive' 
                ? "text-red-400 focus:text-red-300 focus:bg-red-500/10"
                : "text-gray-300 focus:text-gray-50 focus:bg-gray-800"
            )}
          >
            {action.icon && <action.icon className="h-3.5 w-3.5" />}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

### 7.2 Standard Row Actions Per Entity

```typescript
// API Manager row actions
const API_ROW_ACTIONS: RowAction<API>[] = [
  { label: 'View Details', icon: Eye, onClick: (row) => navigate(`/api-manager/${row.id}`) },
  { label: 'Edit API', icon: Pencil, onClick: (row) => openEditModal(row) },
  { label: 'Add to Collection', icon: FolderPlus, onClick: (row) => openCollectionModal(row) },
  { label: 'View Docs', icon: FileText, onClick: (row) => openDocs(row) },
  { label: 'Delete API', icon: Trash2, variant: 'destructive', onClick: (row) => confirmDelete(row) },
];

// Gateway row actions
const GATEWAY_ROW_ACTIONS: RowAction<Gateway>[] = [
  { label: 'View Details', icon: Eye, onClick: (row) => openDetails(row) },
  { label: 'Edit Gateway', icon: Pencil, onClick: (row) => openEditModal(row) },
  { label: 'Toggle Status', icon: Power, onClick: (row) => toggleStatus(row) },
  { label: 'View Logs', icon: Terminal, onClick: (row) => openLogs(row) },
  { label: 'Delete Gateway', icon: Trash2, variant: 'destructive', onClick: (row) => confirmDelete(row) },
];
```

---

## 🎨 8. Table Styling System

### 8.1 Table Container

```tsx
<div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
  {/* Toolbar */}
  <TableToolbar />
  
  {/* Table with horizontal scroll */}
  <div className="overflow-x-auto">
    <table className="w-full min-w-[640px]">
      <thead className="bg-gray-950/50 border-b border-gray-800">
        {/* Headers */}
      </thead>
      <tbody className="divide-y divide-gray-800/50">
        {/* Data rows */}
      </tbody>
    </table>
  </div>
  
  {/* Footer / Pagination */}
  <TablePagination />
</div>
```

### 8.2 Row Styling

```tsx
// Standard data row
<tr
  className={cn(
    "group transition-colors duration-100",
    "hover:bg-gray-800/40",                    // Hover state
    selectedRows.has(row.id) && "bg-blue-500/5",  // Selected state
    onRowClick && "cursor-pointer",             // Clickable cursor
  )}
  onClick={() => onRowClick?.(row)}
>
```

### 8.3 Cell Types Styling

```css
/* Standard data cell */
.table-cell-default {
  @apply px-4 py-3 text-sm text-gray-300;
}

/* Primary cell (e.g., name) */
.table-cell-primary {
  @apply px-4 py-3 text-sm text-gray-50 font-medium;
}

/* Secondary cell (e.g., version, date) */
.table-cell-secondary {
  @apply px-4 py-3 text-sm text-gray-500;
}

/* Numeric cell (right-aligned) */
.table-cell-number {
  @apply px-4 py-3 text-sm text-gray-300 text-right tabular-nums;
}
```

### 8.4 Status Badge Component

```tsx
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'maintenance' | 'deprecated' | 'error';
}

const STATUS_CONFIG = {
  active:      { label: 'Active',      dot: 'bg-green-400',  bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20' },
  inactive:    { label: 'Inactive',    dot: 'bg-gray-400',   bg: 'bg-gray-700/50',   text: 'text-gray-400',   border: 'border-gray-700' },
  maintenance: { label: 'Maintenance', dot: 'bg-yellow-400', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  deprecated:  { label: 'Deprecated',  dot: 'bg-orange-400', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  error:       { label: 'Error',       dot: 'bg-red-400',    bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
      config.bg, config.text, config.border
    )}>
      {/* Animated dot for 'active' */}
      <span className="relative flex h-1.5 w-1.5">
        {status === 'active' && (
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", config.dot)} />
        )}
        <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", config.dot)} />
      </span>
      {config.label}
    </span>
  );
};
```

---

## 📱 9. Density Modes

```typescript
// Table density configuration
const DENSITY_CONFIG = {
  compact: {
    rowPadding: 'py-2',         // 8px vertical
    headerPadding: 'py-2',
    fontSize: 'text-xs',
  },
  default: {
    rowPadding: 'py-3',         // 12px vertical
    headerPadding: 'py-3',
    fontSize: 'text-sm',
  },
  comfortable: {
    rowPadding: 'py-4',         // 16px vertical
    headerPadding: 'py-4',
    fontSize: 'text-sm',
  },
};
```

---

## 🔲 10. Empty & Loading States

### 10.1 Empty State

```tsx
const TableEmptyState: React.FC<{
  message?: string;
  icon?: LucideIcon;
  action?: { label: string; onClick: () => void };
}> = ({ message = "No data found", icon: Icon = Database, action }) => (
  <tr>
    <td colSpan={999} className="py-16 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="p-4 bg-gray-800/50 rounded-full">
          <Icon className="h-8 w-8 text-gray-600" />
        </div>
        <p className="text-gray-500 text-sm">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 
                       rounded-lg text-sm hover:bg-blue-500/20 transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </td>
  </tr>
);
```

### 10.2 Loading Skeleton Rows

```tsx
const TableLoadingRows: React.FC<{ count?: number; columns?: number }> = ({
  count = 5,
  columns = 6,
}) => (
  <>
    {Array.from({ length: count }).map((_, rowIdx) => (
      <tr key={rowIdx} className="border-b border-gray-800/50">
        {Array.from({ length: columns }).map((_, colIdx) => (
          <td key={colIdx} className="px-4 py-3">
            <div
              className="h-4 bg-gray-800 rounded animate-pulse"
              style={{ width: `${60 + Math.random() * 40}%` }}
            />
          </td>
        ))}
      </tr>
    ))}
  </>
);
```

---

## 🧪 11. Acceptance Criteria

### 11.1 Table Rendering ✅
- [ ] Table renders with all specified columns
- [ ] Horizontal scroll activates when content overflows
- [ ] Column widths are respected
- [ ] Minimum row height: 48px (touch-friendly)

### 11.2 Sorting ✅
- [ ] Click on sortable column header sorts data ascending
- [ ] Click again on same header sorts descending
- [ ] Sort indicator icon shows correct direction
- [ ] Non-sortable headers have no click cursor
- [ ] Sort persists through pagination navigation

### 11.3 Pagination ✅
- [ ] Shows correct "Showing X–Y of Z results" text
- [ ] Page navigation buttons work correctly
- [ ] First/Last page buttons are disabled appropriately
- [ ] Page size selector changes rows displayed
- [ ] Changing page size resets to page 1
- [ ] Smart pagination ellipsis renders correctly

### 11.4 Search ✅
- [ ] Search filters data in real-time (or with debounce ≤300ms)
- [ ] Search resets pagination to page 1
- [ ] Clear button appears when search has text
- [ ] Empty state shows when no results match
- [ ] Search is case-insensitive

### 11.5 Selection ✅
- [ ] Checkbox in header selects/deselects all visible rows
- [ ] Individual row checkboxes work independently
- [ ] Indeterminate state shows when partial selection
- [ ] Bulk actions bar appears when rows selected
- [ ] Selected count is accurate

### 11.6 Row Actions ✅
- [ ] Actions menu appears on hover
- [ ] Destructive actions styled in red
- [ ] Disabled actions are unclickable
- [ ] Menu closes after action selected
- [ ] Menu positioned correctly near screen edges

---

## 📁 12. Files to Create / Modify

| File Path                                              | Action | Notes                               |
|--------------------------------------------------------|--------|-------------------------------------|
| `src/app/components/table/DataTable.tsx`               | Create | Main generic table component        |
| `src/app/components/table/TableToolbar.tsx`            | Create | Search + column visibility + actions |
| `src/app/components/table/TablePagination.tsx`         | Create | Pagination controls                 |
| `src/app/components/table/TableEmptyState.tsx`         | Create | Empty / no-results state            |
| `src/app/components/table/TableLoadingSkeleton.tsx`    | Create | Animated skeleton rows              |
| `src/app/components/table/StatusBadge.tsx`             | Create | Reusable status badge               |
| `src/app/components/table/RowActionsMenu.tsx`          | Create | Row actions dropdown                |
| `src/app/hooks/useTable.ts`                            | Create | Custom hook for table state         |
| `src/app/pages/ApiManager.tsx`                         | Modify | Use new DataTable component         |
| `src/app/pages/ApiGateway.tsx`                         | Modify | Use new DataTable component         |
| `src/app/components/dashboard/ActiveAPIsTable.tsx`     | Modify | Refactor to use DataTable           |

---

*Spec Version: 1.0.0 | Last Updated: April 2026 | Owner: Sopo Platform Team*
