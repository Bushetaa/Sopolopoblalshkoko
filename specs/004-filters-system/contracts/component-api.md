# Component API Contracts: Filters System

## DateRangePicker

```typescript
interface DateRangePickerProps {
  value: DateRangeFilter;
  onChange: (range: DateRangeFilter) => void;
  align?: 'left' | 'right';
  size?: 'sm' | 'md';
  disabled?: boolean;
}
```

## MultiSelectFilter

```typescript
interface MultiSelectFilterProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  searchable?: boolean;
  maxHeight?: number;
}
```

## ToggleFilter

```typescript
interface ToggleFilterProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  variant?: 'buttons' | 'tabs';
}
```

## StatusFilter

```typescript
interface StatusFilterProps {
  statuses: string[];
  selectedStatuses: string[];
  onChange: (statuses: string[]) => void;
}
```

## FilterChips

```typescript
interface FilterChipsProps {
  chips: FilterChip[];
  onClearAll: () => void;
}
// Returns null when chips.length === 0
```

## FilterBar

```typescript
interface FilterBarProps {
  filters: FilterState;
  config: FilterBarConfig;
  onFiltersChange: (filters: FilterState) => void;
}
// Renders: search | date range | category filters | count badge + clear | extraActions
// FilterChips rendered below the bar
```

## useFilters Hook

```typescript
function useFilters(initialFilters?: Partial<FilterState>): {
  filters: FilterState;
  setDateRange: (range: DateRangeFilter) => void;
  setDatePreset: (preset: DatePreset) => void;
  setCategory: (category: keyof CategoryFilters, values: string[]) => void;
  toggleCategoryValue: (category: keyof CategoryFilters, value: string) => void;
  clearAll: () => void;        // Does NOT reset dateRange
  activeFiltersCount: number;  // Computed
  filterChips: FilterChip[];   // Computed
}
```
