# 🔽 Spec 04 — Filters System
## Sopo Platform | نظام الفلترة والتصفية

> **Spec ID**: SOPO-SPEC-04  
> **Priority**: 🟠 High (Enhances all data views)  
> **Status**: 🔴 Not Implemented (Basic inline filters exist only)  
> **Depends On**: Spec 01 (Layout), Spec 03 (Data Tables)  
> **Required By**: Spec 02 (Analytics), Spec 03 (Tables), Spec 06 (Reports)  

---

## 🎯 Overview | نظرة عامة

نظام الفلترة هو المكون المسؤول عن تصفية البيانات عبر جميع صفحات المنصة. يشمل **Date Range Picker** للتحديد الزمني، **Category Filters** للفلترة متعددة القيم، **Quick Filters** للفلترة السريعة، و**Filter Chips** لعرض الفلاتر النشطة مع إمكانية إزالتها. يجب أن يكون الفلتر مكونًا مستقلًا قابلًا للاستخدام في أي صفحة.

---

## 🏗️ 1. Filters System Architecture

### 1.1 Filter Types Overview

```
FILTER SYSTEM
├── 1. Date Range Filter
│   ├── Preset Ranges (Today, 7D, 30D, 90D, Custom)
│   ├── Calendar Date Picker (Custom)
│   └── Time Zone Support
│
├── 2. Category Filters
│   ├── Single Select (Dropdown)
│   ├── Multi Select (Checkboxes)
│   ├── Toggle Buttons (Quick filters)
│   └── Search-in-Filter (for long lists)
│
├── 3. Range Filters
│   ├── Numeric Range (min/max input)
│   └── Slider Range
│
├── 4. Status Filter (special case)
│   └── Status badge toggles
│
└── 5. Filter State Management
    ├── Active Filter Chips (display + remove)
    ├── Filter Count Badge
    ├── Clear All Filters
    └── Filter Persistence (localStorage)
```

### 1.2 Global Filter State Interface

```typescript
interface FilterState {
  dateRange: DateRangeFilter;
  categories: CategoryFilters;
  search: string;
  activeFiltersCount: number;     // Computed
}

interface DateRangeFilter {
  preset: DatePreset | 'custom';
  startDate: Date | null;
  endDate: Date | null;
  granularity: 'hour' | 'day' | 'week' | 'month';
}

interface CategoryFilters {
  // API Manager
  apiType?: string[];             // 'REST', 'GraphQL', 'gRPC', etc.
  apiStatus?: string[];           // 'active', 'maintenance', 'deprecated'
  
  // API Gateway
  protocol?: string[];            // 'HTTP', 'HTTPS', 'gRPC'
  gatewayStatus?: string[];       // 'active', 'inactive'
  authType?: string[];            // 'None', 'API Key', 'OAuth 2.0'
  
  // Analytics
  environment?: string[];         // 'production', 'staging', 'dev'
  statusCode?: string[];          // '2xx', '3xx', '4xx', '5xx'
  
  // Users
  role?: string[];                // 'admin', 'developer', 'viewer'
  userStatus?: string[];          // 'active', 'inactive', 'pending'
}

type DatePreset = 'today' | 'yesterday' | '7d' | '14d' | '30d' | '90d' | '6m' | '1y';
```

---

## 📅 2. Date Range Picker

### 2.1 Component Structure

```
DateRangePicker
├── Trigger Button
│   ├── Calendar Icon
│   ├── Selected Range Label ("Last 7 days" / "Jan 1 – Jan 31, 2024")
│   └── Dropdown Chevron
│
└── Dropdown Panel
    ├── Preset Options (left column)
    │   ├── Today
    │   ├── Yesterday
    │   ├── Last 7 days ← Default
    │   ├── Last 14 days
    │   ├── Last 30 days
    │   ├── Last 90 days
    │   ├── Last 6 months
    │   ├── Last year
    │   └── Custom range...
    │
    └── Calendar (right column, shown for "Custom")
        ├── Month navigation (← Month Year →)
        ├── Day grid (S M T W T F S)
        ├── Range highlight (start → end)
        └── Apply / Cancel buttons
```

### 2.2 Date Preset Configuration

```typescript
const DATE_PRESETS: {
  label: string;
  value: DatePreset;
  getRange: () => { start: Date; end: Date };
}[] = [
  {
    label: 'Today',
    value: 'today',
    getRange: () => {
      const now = new Date();
      return { start: startOfDay(now), end: endOfDay(now) };
    }
  },
  {
    label: 'Yesterday',
    value: 'yesterday',
    getRange: () => {
      const yesterday = subDays(new Date(), 1);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
    }
  },
  {
    label: 'Last 7 days',
    value: '7d',
    getRange: () => ({
      start: startOfDay(subDays(new Date(), 6)),
      end: endOfDay(new Date())
    })
  },
  {
    label: 'Last 14 days',
    value: '14d',
    getRange: () => ({
      start: startOfDay(subDays(new Date(), 13)),
      end: endOfDay(new Date())
    })
  },
  {
    label: 'Last 30 days',
    value: '30d',
    getRange: () => ({
      start: startOfDay(subDays(new Date(), 29)),
      end: endOfDay(new Date())
    })
  },
  {
    label: 'Last 90 days',
    value: '90d',
    getRange: () => ({
      start: startOfDay(subDays(new Date(), 89)),
      end: endOfDay(new Date())
    })
  },
  {
    label: 'Last 6 months',
    value: '6m',
    getRange: () => ({
      start: startOfMonth(subMonths(new Date(), 5)),
      end: endOfDay(new Date())
    })
  },
  {
    label: 'Last year',
    value: '1y',
    getRange: () => ({
      start: startOfYear(subYears(new Date(), 0)),
      end: endOfDay(new Date())
    })
  },
];
```

### 2.3 Date Range Picker UI Spec

```tsx
interface DateRangePickerProps {
  value: DateRangeFilter;
  onChange: (range: DateRangeFilter) => void;
  align?: 'left' | 'right';     // Dropdown alignment
  size?: 'sm' | 'md';
  disabled?: boolean;
}

// Trigger button styling
<button className={cn(
  "flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-800",
  "rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:border-gray-700",
  "transition-all duration-150",
  isOpen && "border-blue-500/50 bg-gray-800"
)}>
  <CalendarDays className="h-4 w-4 text-gray-500" />
  <span>{getPresetLabel(value)}</span>
  <ChevronDown className={cn("h-3.5 w-3.5 text-gray-500 transition-transform", isOpen && "rotate-180")} />
</button>
```

### 2.4 Custom Calendar Implementation

```typescript
// Use the existing ui/calendar.tsx (Radix-based)
// Or implement custom two-month range calendar

interface CalendarState {
  viewMonth: Date;          // Currently displayed month
  hoverDate: Date | null;   // Date being hovered (for range preview)
  selecting: 'start' | 'end' | null;  // Which end of range being selected
}

// Range selection flow:
// 1. Click first date → sets startDate, mode = 'end'
// 2. Hover over dates → shows preview range
// 3. Click second date → sets endDate, closes calendar
// 4. If second date < first date → swap them
```

### 2.5 Granularity Selector

```typescript
// Auto-select granularity based on date range, or allow manual override
const getAutoGranularity = (range: DateRangeFilter): Granularity => {
  const days = differenceInDays(range.endDate!, range.startDate!);
  
  if (days <= 1) return 'hour';
  if (days <= 14) return 'day';
  if (days <= 90) return 'week';
  return 'month';
};

// Granularity toggle buttons
const GRANULARITY_OPTIONS = [
  { label: 'Hourly', value: 'hour', maxDays: 3 },
  { label: 'Daily', value: 'day', maxDays: 90 },
  { label: 'Weekly', value: 'week', maxDays: 365 },
  { label: 'Monthly', value: 'month', maxDays: Infinity },
];
```

---

## 🏷️ 3. Category Filters

### 3.1 Single-Select Dropdown Filter

```tsx
interface SingleSelectFilterProps {
  label: string;
  options: { label: string; value: string; count?: number }[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

// Used for: Protocol, Granularity, Environment
<select className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 
                   text-sm text-gray-300 focus:outline-none focus:border-blue-500/50
                   appearance-none cursor-pointer">
  <option value="">All Protocols</option>
  <option value="HTTPS">HTTPS</option>
  <option value="HTTP">HTTP</option>
  <option value="gRPC">gRPC</option>
</select>
```

### 3.2 Multi-Select Checkbox Filter

```tsx
interface MultiSelectFilterProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  searchable?: boolean;         // For long option lists
  maxHeight?: number;           // Dropdown max height
}

interface FilterOption {
  label: string;
  value: string;
  count?: number;               // Show result count next to option
  color?: string;               // Color dot for status/type options
  icon?: LucideIcon;
}

// Multi-select dropdown panel
<div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-2 w-56">
  {/* Search within filter (if searchable) */}
  {searchable && (
    <div className="px-1 pb-1.5">
      <input placeholder="Search..." className="w-full bg-gray-800 rounded-md px-2.5 py-1.5 text-xs text-gray-300" />
    </div>
  )}
  
  {/* Options list */}
  <div className="space-y-0.5 max-h-60 overflow-y-auto">
    {options.map(option => (
      <label key={option.value} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-800 cursor-pointer group">
        <input
          type="checkbox"
          checked={selectedValues.includes(option.value)}
          onChange={(e) => handleToggle(option.value, e.target.checked)}
          className="rounded border-gray-700 bg-gray-800 text-blue-500"
        />
        {option.color && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: option.color }} />}
        <span className="flex-1 text-sm text-gray-300">{option.label}</span>
        {option.count !== undefined && (
          <span className="text-xs text-gray-600 tabular-nums">{option.count}</span>
        )}
      </label>
    ))}
  </div>
  
  {/* Footer actions */}
  {selectedValues.length > 0 && (
    <div className="pt-1.5 mt-1.5 border-t border-gray-800">
      <button onClick={() => onChange([])} className="text-xs text-gray-500 hover:text-gray-300 px-2">
        Clear ({selectedValues.length})
      </button>
    </div>
  )}
</div>
```

### 3.3 Toggle Button Group Filter

```tsx
// Used for: API Type, Status (small option sets)
interface ToggleFilterProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  variant?: 'buttons' | 'tabs';
}

// Button group toggle
<div className="flex items-center gap-1 p-1 bg-gray-900 border border-gray-800 rounded-lg">
  {options.map(option => (
    <button
      key={option.value}
      onClick={() => handleToggle(option.value)}
      className={cn(
        "px-3 py-1 rounded-md text-xs font-medium transition-all duration-150",
        selectedValues.includes(option.value)
          ? "bg-gray-700 text-gray-50 shadow-sm"
          : "text-gray-500 hover:text-gray-300"
      )}
    >
      {option.label}
    </button>
  ))}
</div>
```

### 3.4 Status Filter (Special Component)

```tsx
// Status filters as colored badge toggles
const StatusFilter: React.FC<{
  statuses: string[];
  selectedStatuses: string[];
  onChange: (statuses: string[]) => void;
}> = ({ statuses, selectedStatuses, onChange }) => (
  <div className="flex items-center gap-2 flex-wrap">
    <span className="text-xs text-gray-500">Status:</span>
    {statuses.map(status => {
      const config = STATUS_CONFIG[status];
      const isActive = selectedStatuses.includes(status);
      
      return (
        <button
          key={status}
          onClick={() => handleToggle(status)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
            isActive
              ? cn(config.bg, config.text, config.border, "opacity-100")
              : "bg-transparent text-gray-600 border-gray-800 hover:border-gray-700"
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full", isActive ? config.dot : "bg-gray-700")} />
          {config.label}
        </button>
      );
    })}
  </div>
);
```

---

## 🏷️ 4. Filter Chips (Active Filters Display)

### 4.1 Filter Chip Component

```typescript
interface FilterChip {
  id: string;
  label: string;          // "Status: Active"
  category: string;       // "status"
  value: string;          // "active"
  color?: string;         // Optional color dot
  onRemove: () => void;
}
```

```tsx
// Filter chips container (appears below main filters when filters are active)
const FilterChips: React.FC<{
  chips: FilterChip[];
  onClearAll: () => void;
}> = ({ chips, onClearAll }) => {
  if (chips.length === 0) return null;
  
  return (
    <div className="flex items-center gap-2 flex-wrap py-2">
      <span className="text-xs text-gray-500">Filtered by:</span>
      
      {chips.map(chip => (
        <div
          key={chip.id}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 
                     border border-blue-500/20 rounded-full text-xs text-blue-300"
        >
          {chip.color && (
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: chip.color }} />
          )}
          <span className="font-medium">{chip.label}</span>
          <button
            onClick={chip.onRemove}
            className="ml-0.5 hover:text-white transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      
      {chips.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
};
```

### 4.2 Computing Active Filter Chips

```typescript
const getActiveFilterChips = (filters: FilterState): FilterChip[] => {
  const chips: FilterChip[] = [];
  
  // Date range chip
  if (filters.dateRange.preset !== '7d') {  // '7d' is default, don't show chip
    chips.push({
      id: 'date-range',
      label: `Date: ${getPresetLabel(filters.dateRange)}`,
      category: 'dateRange',
      value: filters.dateRange.preset,
      onRemove: () => setDateRange(DEFAULT_DATE_RANGE),
    });
  }
  
  // Category filter chips
  filters.categories.apiStatus?.forEach(status => {
    chips.push({
      id: `status-${status}`,
      label: `Status: ${capitalize(status)}`,
      category: 'apiStatus',
      value: status,
      color: STATUS_CONFIG[status]?.dotColor,
      onRemove: () => removeCategory('apiStatus', status),
    });
  });
  
  filters.categories.apiType?.forEach(type => {
    chips.push({
      id: `type-${type}`,
      label: `Type: ${type}`,
      category: 'apiType',
      value: type,
      onRemove: () => removeCategory('apiType', type),
    });
  });
  
  // ... other category chips
  
  return chips;
};
```

---

## 🔧 5. Filter State Management Hook

### 5.1 useFilters Hook

```typescript
// src/app/hooks/useFilters.ts
function useFilters(initialFilters?: Partial<FilterState>) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      preset: '7d',
      startDate: subDays(new Date(), 6),
      endDate: new Date(),
      granularity: 'day',
    },
    categories: {},
    search: '',
    ...initialFilters,
  });
  
  // Date range actions
  const setDateRange = useCallback((range: DateRangeFilter) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  }, []);
  
  const setDatePreset = useCallback((preset: DatePreset) => {
    const presetConfig = DATE_PRESETS.find(p => p.value === preset);
    if (!presetConfig) return;
    
    const { start, end } = presetConfig.getRange();
    setFilters(prev => ({
      ...prev,
      dateRange: {
        preset,
        startDate: start,
        endDate: end,
        granularity: getAutoGranularity({ startDate: start, endDate: end }),
      }
    }));
  }, []);
  
  // Category filter actions
  const setCategory = useCallback((
    category: keyof CategoryFilters,
    values: string[]
  ) => {
    setFilters(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: values.length > 0 ? values : undefined,
      }
    }));
  }, []);
  
  const toggleCategoryValue = useCallback((
    category: keyof CategoryFilters,
    value: string
  ) => {
    setFilters(prev => {
      const current = prev.categories[category] ?? [];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      return {
        ...prev,
        categories: {
          ...prev.categories,
          [category]: next.length > 0 ? next : undefined,
        }
      };
    });
  }, []);
  
  const clearAll = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      categories: {},
      search: '',
    }));
  }, []);
  
  // Computed values
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.dateRange.preset !== '7d') count++;
    Object.values(filters.categories).forEach(v => {
      if (v && v.length > 0) count += v.length;
    });
    if (filters.search) count++;
    return count;
  }, [filters]);
  
  const filterChips = useMemo(
    () => getActiveFilterChips(filters, { setDateRange, setCategory }),
    [filters]
  );
  
  return {
    filters,
    setDateRange,
    setDatePreset,
    setCategory,
    toggleCategoryValue,
    clearAll,
    activeFiltersCount,
    filterChips,
  };
}
```

---

## 🗂️ 6. Filter Bar Component

### 6.1 FilterBar Layout

```tsx
// Toolbar-style filter bar that appears above data tables
interface FilterBarProps {
  filters: FilterState;
  filterConfig: FilterBarConfig;    // What filters to show on this page
  onFiltersChange: (filters: FilterState) => void;
}

interface FilterBarConfig {
  showDateRange?: boolean;
  showSearch?: boolean;
  categories?: {
    key: keyof CategoryFilters;
    label: string;
    options: FilterOption[];
    type: 'single' | 'multi' | 'toggle';
  }[];
  extraActions?: React.ReactNode;   // Page-specific actions (e.g., "Add API" button)
}

// Filter bar layout
<div className="flex items-center gap-3 flex-wrap">
  {/* Search (leftmost) */}
  {showSearch && <TableSearch />}
  
  {/* Separator */}
  <div className="h-5 w-px bg-gray-800" />
  
  {/* Date Range */}
  {showDateRange && <DateRangePicker />}
  
  {/* Category Filters */}
  {categories?.map(cat => (
    <CategoryFilter key={cat.key} config={cat} />
  ))}
  
  {/* Active filter count badge */}
  {activeFiltersCount > 0 && (
    <div className="flex items-center gap-2">
      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
        {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
      </span>
      <button onClick={clearAll} className="text-xs text-gray-500 hover:text-gray-300">
        Clear all
      </button>
    </div>
  )}
  
  {/* Extra actions pushed to right */}
  <div className="ml-auto flex items-center gap-2">
    {extraActions}
  </div>
</div>
```

---

## 📋 7. Filter Configuration Per Page

### 7.1 API Manager Page Filters

```typescript
const API_MANAGER_FILTERS: FilterBarConfig = {
  showSearch: true,
  searchPlaceholder: "Search APIs by name, tag...",
  searchKeys: ['name', 'version', 'tags', 'security'],
  
  categories: [
    {
      key: 'apiType',
      label: 'Type',
      type: 'multi',
      options: [
        { label: 'REST', value: 'REST', count: 4 },
        { label: 'GraphQL', value: 'GraphQL', count: 1 },
        { label: 'gRPC', value: 'gRPC', count: 2 },
        { label: 'WebSocket', value: 'WebSocket', count: 1 },
        { label: 'SOAP', value: 'SOAP', count: 1 },
      ]
    },
    {
      key: 'apiStatus',
      label: 'Status',
      type: 'toggle',
      options: [
        { label: 'Active', value: 'active', color: '#4ADE80' },
        { label: 'Maintenance', value: 'maintenance', color: '#FBBF24' },
        { label: 'Deprecated', value: 'deprecated', color: '#FB923C' },
      ]
    },
  ],
  
  extraActions: (
    <button className="btn-primary">
      <Plus className="h-4 w-4" />
      Add API
    </button>
  )
};
```

### 7.2 API Gateway Page Filters

```typescript
const GATEWAY_FILTERS: FilterBarConfig = {
  showSearch: true,
  searchPlaceholder: "Search gateways...",
  
  categories: [
    {
      key: 'gatewayStatus',
      label: 'Status',
      type: 'toggle',
      options: [
        { label: 'Active', value: 'active', color: '#4ADE80' },
        { label: 'Inactive', value: 'inactive', color: '#9CA3AF' },
      ]
    },
    {
      key: 'protocol',
      label: 'Protocol',
      type: 'multi',
      options: [
        { label: 'HTTPS', value: 'HTTPS' },
        { label: 'HTTP', value: 'HTTP' },
        { label: 'gRPC', value: 'gRPC' },
      ]
    },
    {
      key: 'authType',
      label: 'Auth',
      type: 'multi',
      options: [
        { label: 'OAuth 2.0', value: 'OAuth 2.0' },
        { label: 'API Key', value: 'API Key' },
        { label: 'None', value: 'None' },
      ]
    },
  ]
};
```

### 7.3 Analytics Page Filters

```typescript
const ANALYTICS_FILTERS: FilterBarConfig = {
  showDateRange: true,
  
  categories: [
    {
      key: 'environment',
      label: 'Environment',
      type: 'single',
      options: [
        { label: 'All Environments', value: '' },
        { label: 'Production', value: 'production' },
        { label: 'Staging', value: 'staging' },
        { label: 'Development', value: 'development' },
      ]
    },
    {
      key: 'statusCode',
      label: 'Status Code',
      type: 'toggle',
      options: [
        { label: '2xx', value: '2xx', color: '#4ADE80' },
        { label: '4xx', value: '4xx', color: '#FB923C' },
        { label: '5xx', value: '5xx', color: '#F87171' },
      ]
    },
  ]
};
```

---

## 💾 8. Filter Persistence

### 8.1 LocalStorage Persistence

```typescript
// Save filters to localStorage per page
const FILTER_STORAGE_KEY = (page: string) => `sopo_filters_${page}`;

// Save on change
useEffect(() => {
  localStorage.setItem(
    FILTER_STORAGE_KEY(pageName),
    JSON.stringify(filters)
  );
}, [filters, pageName]);

// Load on mount
const getSavedFilters = (pageName: string): Partial<FilterState> | null => {
  try {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY(pageName));
    if (!saved) return null;
    
    const parsed = JSON.parse(saved);
    
    // Restore Date objects from ISO strings
    if (parsed.dateRange) {
      parsed.dateRange.startDate = parsed.dateRange.startDate 
        ? new Date(parsed.dateRange.startDate) 
        : null;
      parsed.dateRange.endDate = parsed.dateRange.endDate 
        ? new Date(parsed.dateRange.endDate) 
        : null;
    }
    
    return parsed;
  } catch {
    return null;
  }
};
```

---

## 🎨 9. Filter Design Tokens

### 9.1 Filter Component Colors

```css
/* Filter trigger button */
.filter-trigger {
  background: theme('colors.gray.900');
  border: 1px solid theme('colors.gray.800');
  border-radius: theme('borderRadius.lg');
  color: theme('colors.gray.300');
}

.filter-trigger:hover {
  background: theme('colors.gray.800');
  border-color: theme('colors.gray.700');
}

.filter-trigger[data-active="true"] {
  border-color: rgb(59 130 246 / 0.5);   /* blue-500/50 */
  color: theme('colors.blue.400');
}

/* Active filter chip */
.filter-chip {
  background: rgb(59 130 246 / 0.1);     /* blue-500/10 */
  border: 1px solid rgb(59 130 246 / 0.2); /* blue-500/20 */
  color: theme('colors.blue.300');
}

/* Dropdown panel */
.filter-dropdown {
  background: theme('colors.gray.900');
  border: 1px solid theme('colors.gray.700');
  border-radius: theme('borderRadius.xl');
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}
```

### 9.2 Date Range Preset Styling

```tsx
// Preset option button
<button className={cn(
  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
  selectedPreset === preset.value
    ? "bg-blue-500/10 text-blue-400 font-medium"
    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
)}>
  {preset.label}
  {selectedPreset === preset.value && (
    <Check className="h-3.5 w-3.5 ml-auto inline" />
  )}
</button>
```

---

## 🧪 10. Acceptance Criteria

### 10.1 Date Range Picker ✅
- [ ] Opens dropdown on click
- [ ] Shows 8 preset options
- [ ] Selecting preset updates date range immediately
- [ ] Custom range shows calendar picker
- [ ] Calendar highlights selected range
- [ ] Date validation: end date cannot be before start date
- [ ] Granularity auto-selects based on range
- [ ] Trigger button shows current selection label
- [ ] Closes on outside click

### 10.2 Category Filters ✅
- [ ] Multi-select shows checked state for selected options
- [ ] Clicking option toggles its selection
- [ ] Result counts show next to options (where applicable)
- [ ] Search within filter works (for long lists)
- [ ] "Clear" action inside dropdown removes that filter
- [ ] Toggle buttons show active state clearly

### 10.3 Filter Chips ✅
- [ ] Chips appear when any filter is active
- [ ] Removing chip updates filter state
- [ ] "Clear all" removes all non-default filters
- [ ] Chips don't appear for default filter values
- [ ] Chips are scrollable horizontally on mobile

### 10.4 Filter State ✅
- [ ] Filters persist across page refreshes (localStorage)
- [ ] Changing filters resets pagination to page 1
- [ ] Filter count badge shows correct number
- [ ] Clear all resets all filters to defaults
- [ ] URL updates to reflect filter state (optional/advanced)

---

## 📁 11. Files to Create / Modify

| File Path                                              | Action | Notes                                    |
|--------------------------------------------------------|--------|------------------------------------------|
| `src/app/components/filters/FilterBar.tsx`             | Create | Main filter bar container                |
| `src/app/components/filters/DateRangePicker.tsx`       | Create | Date range with presets + calendar       |
| `src/app/components/filters/CategoryFilter.tsx`        | Create | Multi/single select filter dropdown      |
| `src/app/components/filters/StatusFilter.tsx`          | Create | Status badge toggle filter               |
| `src/app/components/filters/FilterChips.tsx`           | Create | Active filter chips display              |
| `src/app/components/filters/ToggleFilter.tsx`          | Create | Toggle button group filter               |
| `src/app/hooks/useFilters.ts`                          | Create | Filter state management hook             |
| `src/app/types/filters.ts`                             | Create | TypeScript types for filter system       |
| `src/app/pages/ApiManager.tsx`                         | Modify | Integrate new FilterBar                  |
| `src/app/pages/ApiGateway.tsx`                         | Modify | Integrate new FilterBar                  |
| `src/app/pages/Analytics.tsx`                          | Modify | Integrate DateRangePicker + status filter |

---

## 🔗 12. Dependencies on Other Specs

| Spec                  | Dependency Type | Notes                                      |
|-----------------------|-----------------|--------------------------------------------|
| Spec 01 — Layout      | Hard            | Filters render inside layout content area  |
| Spec 03 — Tables      | Hard            | Filters drive table data filtering         |
| Spec 02 — Analytics   | Hard            | Date range filter controls chart data      |
| Spec 06 — Reports     | Soft            | Reports use date range from this spec      |

---

*Spec Version: 1.0.0 | Last Updated: April 2026 | Owner: Sopo Platform Team*
