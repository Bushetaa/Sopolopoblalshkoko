# Quickstart: Filters System

## Basic Usage (API Manager Page)

```tsx
import { FilterBar } from '@/components/filters';
import { useFilters } from '@/hooks/useFilters';
import { API_MANAGER_FILTERS } from '@/lib/filter-configs';

export default function APIManagerPage() {
  const { filters, ...filterActions } = useFilters();

  const filteredData = useMemo(() => {
    return applyFilters(apis, filters); // your filtering logic
  }, [apis, filters]);

  return (
    <div className="space-y-4">
      <FilterBar
        config={API_MANAGER_FILTERS}
        filters={filters}
        onFiltersChange={filterActions.setFilters}
        extraActions={<button className="btn-primary">Add API</button>}
      />
      <DataTable data={filteredData} columns={columns} />
    </div>
  );
}
```

## DateRangePicker Standalone

```tsx
import { DateRangePicker } from '@/components/filters';
import { useFilters } from '@/hooks/useFilters';

const { filters, setDateRange } = useFilters();

<DateRangePicker
  value={filters.dateRange}
  onChange={setDateRange}
  align="right"
/>
```

## useFilters Hook

```tsx
const {
  filters,              // Current FilterState
  setDatePreset,        // setDatePreset('30d') — auto-computes dates + granularity
  setCategory,          // setCategory('apiType', ['REST', 'GraphQL'])
  toggleCategoryValue,  // toggleCategoryValue('apiStatus', 'active')
  clearAll,             // Resets categories + search (NOT dateRange)
  activeFiltersCount,   // Number (computed)
  filterChips,          // FilterChip[] (computed, for <FilterChips>)
} = useFilters();
```
