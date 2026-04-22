# Quickstart: Data Table System

## Basic Usage

```tsx
import { DataTable, ColumnDef, RowAction } from '@/components/data-table';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface API { id: string; name: string; status: 'active' | 'inactive'; requests: number; }

const columns: ColumnDef<API>[] = [
  { key: 'name',     header: 'API Name', sortable: true, render: v => <span className="text-gray-50 font-medium">{v}</span> },
  { key: 'status',   header: 'Status',   width: '100px',  render: v => <StatusBadge status={v} /> },
  { key: 'requests', header: 'Requests', align: 'right', sortable: true, render: v => <span className="tabular-nums text-gray-300">{v.toLocaleString()}</span> },
];

const rowActions: RowAction<API>[] = [
  { label: 'View Details', icon: Eye, onClick: row => router.push(`/api/${row.id}`) },
  { label: 'Delete',       icon: Trash2, variant: 'destructive', onClick: row => confirmDelete(row), hidden: row => row.status === 'active' },
];

export default function APIManagerPage() {
  const router = useRouter();

  return (
    <DataTable<API>
      data={apis}
      columns={columns}
      rowActions={rowActions}
      searchPlaceholder="Search APIs..."
      searchKeys={['name']}
      selectable
      density="default"
      isLoading={isLoading}
      emptyMessage="No APIs found"
      onRowClick={row => router.push(`/api/${row.id}`)}
    />
  );
}
```

## StatusBadge Standalone

```tsx
import { StatusBadge } from '@/components/shared/StatusBadge';
<StatusBadge status="active" />        // Green with animate-ping dot
<StatusBadge status="maintenance" />   // Yellow
<StatusBadge status="deprecated" />    // Orange
<StatusBadge status="error" />         // Red
<StatusBadge status="inactive" />      // Gray
```
