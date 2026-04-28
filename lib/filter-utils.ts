import { FilterState, FilterChip, CategoryFilters, FilterBarConfig } from '@/types/filters';

export function computeActiveFiltersCount(filters: FilterState): number {
  let count = 0;
  if (filters.search) count++;
  if (filters.dateRange.preset !== '7d') count++; // Assuming 7d is default
  
  Object.values(filters.categories).forEach(val => {
    if (Array.isArray(val) && val.length > 0) count++;
    else if (typeof val === 'string' && val !== '') count++;
  });
  
  return count;
}

export function getActiveFilterChips(
  filters: FilterState, 
  config: FilterBarConfig,
  actions: {
    removeCategoryValue: (key: keyof CategoryFilters, value: string) => void;
    clearCategory: (key: keyof CategoryFilters) => void;
    clearSearch: () => void;
    resetDateRange: () => void;
  }
): FilterChip[] {
  const chips: FilterChip[] = [];

  // Search Chip
  if (filters.search) {
    chips.push({
      id: 'search',
      label: `Search: ${filters.search}`,
      category: 'search',
      value: filters.search,
      onRemove: actions.clearSearch
    });
  }

  // Category Chips
  config.categories?.forEach(cat => {
    const value = filters.categories[cat.key];
    if (Array.isArray(value)) {
      value.forEach(v => {
        const option = cat.options.find(o => o.value === v);
        chips.push({
          id: `${cat.key}-${v}`,
          label: `${cat.label}: ${option?.label ?? v}`,
          category: cat.key,
          value: v,
          color: option?.color,
          onRemove: () => actions.removeCategoryValue(cat.key, v)
        });
      });
    } else if (typeof value === 'string' && value !== '') {
      const option = cat.options.find(o => o.value === value);
      chips.push({
        id: `${cat.key}-${value}`,
        label: `${cat.label}: ${option?.label ?? value}`,
        category: cat.key,
        value: value,
        color: option?.color,
        onRemove: () => actions.clearCategory(cat.key)
      });
    }
  });

  return chips;
}
