import { LucideIcon } from 'lucide-react';
import { DatePreset, Granularity, DateRangeFilter } from '@/lib/date-presets';

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

export interface AnalyticsFilterState {
  dateRange: {
    from: Date;
    to: Date;
  };
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly';
}
