# Component API Contracts: Data Table System

## DataTable<T>

```typescript
function DataTable<T extends { id: string }>(props: DataTableProps<T>): JSX.Element
```

**Props**: See `data-model.md` `DataTableProps<T>` — all fields documented.

**Key behaviors**:
- Data pipeline: `data → searchData() → sortData() → paginate slice`
- Resets to page 1 when `searchQuery` or `sort` changes
- Column visibility initialized from `ColumnDef.hidden` defaults

## TableToolbar

```typescript
interface TableToolbarProps<T> {
  searchValue: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  columns: ColumnDef<T>[];
  columnVisibility: ColumnVisibility;
  onColumnVisibilityChange: (key: string, visible: boolean) => void;
  selectedRows: Set<string>;
  onBulkExport: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}
```

## TableHeader

```typescript
interface TableHeaderProps<T> {
  columns: ColumnDef<T>[];
  sort: SortState;
  onSort: (key: string) => void;
  selectable: boolean;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  onSelectAll: (checked: boolean) => void;
  columnVisibility: ColumnVisibility;
}
```

## TableFooter / TablePagination

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  startIndex: number;
  endIndex: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
```

## RowActionsMenu

```typescript
interface RowActionsMenuProps<T> {
  row: T;
  actions: RowAction<T>[];
}
// Trigger: MoreHorizontal, opacity-0 → visible via parent group-hover
```

## HighlightText

```typescript
function HighlightText({ text, query }: { text: string; query: string }): JSX.Element
// Returns fragments with matched parts in <mark className="bg-yellow-400/20 text-yellow-300 rounded px-0.5">
```

## StatusBadge

```typescript
function StatusBadge({ status }: { status: EntityStatus }): JSX.Element
// EntityStatus = 'active' | 'inactive' | 'maintenance' | 'deprecated' | 'error'
// Active status has animate-ping dot
```
