# Data Models: Filters System

## Core Interfaces

```typescript
export type DatePreset = 'today' | 'yesterday' | '7d' | '14d' | '30d' | '90d' | '6m' | '1y';
export type Granularity = 'hour' | 'day' | 'week' | 'month';

export interface DateRangeFilter {
  preset: DatePreset | 'custom';
  startDate: Date | null;
  endDate: Date | null;
  granularity: Granularity;
}

export interface CategoryFilters {
  apiType?: string[];
  apiStatus?: string[];
  protocol?: string[];
  gatewayStatus?: string[];
  authType?: string[];
  environment?: string[];
  statusCode?: string[];
  role?: string[];
  userStatus?: string[];
}

export interface FilterState {
  dateRange: DateRangeFilter;
  categories: CategoryFilters;
  search: string;
}

export interface FilterChip {
  id: string;
  label: string;
  category: string;
  value: string;
  color?: string;
  onRemove: () => void;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
  color?: string;
  icon?: LucideIcon;
}

export interface FilterBarConfig {
  showDateRange?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  categories?: {
    key: keyof CategoryFilters;
    label: string;
    options: FilterOption[];
    type: 'single' | 'multi' | 'toggle';
  }[];
  extraActions?: React.ReactNode;
}
```

## Date Presets Constant

```typescript
import { startOfDay, endOfDay, subDays, subMonths, startOfMonth, startOfYear } from 'date-fns';

export const DATE_PRESETS = [
  { label: 'Today',        value: 'today',     getRange: () => ({ start: startOfDay(new Date()),         end: endOfDay(new Date()) }) },
  { label: 'Yesterday',   value: 'yesterday', getRange: () => { const y = subDays(new Date(), 1); return { start: startOfDay(y), end: endOfDay(y) }; } },
  { label: 'Last 7 days', value: '7d',        getRange: () => ({ start: startOfDay(subDays(new Date(), 6)), end: endOfDay(new Date()) }) },
  { label: 'Last 14 days',value: '14d',       getRange: () => ({ start: startOfDay(subDays(new Date(), 13)),end: endOfDay(new Date()) }) },
  { label: 'Last 30 days',value: '30d',       getRange: () => ({ start: startOfDay(subDays(new Date(), 29)),end: endOfDay(new Date()) }) },
  { label: 'Last 90 days',value: '90d',       getRange: () => ({ start: startOfDay(subDays(new Date(), 89)),end: endOfDay(new Date()) }) },
  { label: 'Last 6 months',value:'6m',        getRange: () => ({ start: startOfMonth(subMonths(new Date(), 5)), end: endOfDay(new Date()) }) },
  { label: 'Last year',   value: '1y',        getRange: () => ({ start: startOfYear(new Date()), end: endOfDay(new Date()) }) },
] as const;

export const DEFAULT_DATE_RANGE: DateRangeFilter = {
  preset: '7d',
  startDate: startOfDay(subDays(new Date(), 6)),
  endDate: endOfDay(new Date()),
  granularity: 'day',
};

export function getAutoGranularity(range: { startDate: Date | null; endDate: Date | null }): Granularity {
  if (!range.startDate || !range.endDate) return 'day';
  const days = Math.abs((+range.endDate - +range.startDate) / 86400000);
  if (days <= 1) return 'hour';
  if (days <= 14) return 'day';
  if (days <= 90) return 'week';
  return 'month';
}

export function getPresetLabel(filter: DateRangeFilter): string {
  if (filter.preset !== 'custom') return DATE_PRESETS.find(p => p.value === filter.preset)?.label ?? 'Custom';
  if (!filter.startDate || !filter.endDate) return 'Custom range';
  return `${format(filter.startDate, 'MMM d')} – ${format(filter.endDate, 'MMM d, yyyy')}`;
}
```

## Page Filter Configs

```typescript
export const API_MANAGER_FILTERS: FilterBarConfig = {
  showSearch: true,
  searchPlaceholder: 'Search APIs by name, tag...',
  categories: [
    { key: 'apiType',   label: 'Type',   type: 'multi',   options: [{ label:'REST',value:'REST',count:4 },{ label:'GraphQL',value:'GraphQL',count:1 },{ label:'gRPC',value:'gRPC',count:2 },{ label:'WebSocket',value:'WebSocket',count:1 },{ label:'SOAP',value:'SOAP',count:1 }] },
    { key: 'apiStatus', label: 'Status', type: 'toggle',  options: [{ label:'Active',value:'active',color:'#4ADE80' },{ label:'Maintenance',value:'maintenance',color:'#FBBF24' },{ label:'Deprecated',value:'deprecated',color:'#FB923C' }] },
  ],
};

export const ANALYTICS_FILTERS: FilterBarConfig = {
  showDateRange: true,
  categories: [
    { key: 'environment', label: 'Environment', type: 'single', options: [{ label:'All',value:'' },{ label:'Production',value:'production' },{ label:'Staging',value:'staging' },{ label:'Development',value:'development' }] },
    { key: 'statusCode',  label: 'Status Code', type: 'toggle', options: [{ label:'2xx',value:'2xx',color:'#4ADE80' },{ label:'4xx',value:'4xx',color:'#FB923C' },{ label:'5xx',value:'5xx',color:'#F87171' }] },
  ],
};

export const USERS_FILTERS: FilterBarConfig = {
  showSearch: true,
  searchPlaceholder: 'Search by name, email...',
  categories: [
    { key: 'role',       label: 'Role',   type: 'multi',  options: [{ label:'Admin',value:'admin' },{ label:'Developer',value:'developer' },{ label:'Viewer',value:'viewer' },{ label:'Billing',value:'billing' }] },
    { key: 'userStatus', label: 'Status', type: 'toggle', options: [{ label:'Active',value:'active',color:'#4ADE80' },{ label:'Inactive',value:'inactive',color:'#6B7280' },{ label:'Pending',value:'pending',color:'#FBBF24' }] },
  ],
};
```
