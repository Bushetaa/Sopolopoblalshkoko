"use client";

import { useState, useMemo, useCallback } from 'react';
import { 
  FilterState, 
  CategoryFilters, 
  FilterBarConfig 
} from '@/types/filters';
import { 
  DEFAULT_DATE_RANGE, 
  DATE_PRESETS, 
  DateRangeFilter, 
  DatePreset 
} from '@/lib/date-presets';
import { computeActiveFiltersCount, getActiveFilterChips } from '@/lib/filter-utils';

export function useFilters(config: FilterBarConfig) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: DEFAULT_DATE_RANGE,
    categories: {},
    search: '',
  });

  const setDateRange = useCallback((range: DateRangeFilter) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  }, []);

  const setDatePreset = useCallback((preset: DatePreset) => {
    const found = DATE_PRESETS.find(p => p.value === preset);
    if (found) {
      const range = found.getRange();
      setFilters(prev => ({
        ...prev,
        dateRange: {
          preset,
          startDate: range.start,
          endDate: range.end,
          granularity: prev.dateRange.granularity
        }
      }));
    }
  }, []);

  const setCategory = useCallback((key: keyof CategoryFilters, value: string | string[] | undefined) => {
    setFilters(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [key]: value
      }
    }));
  }, []);

  const toggleCategoryValue = useCallback((key: keyof CategoryFilters, value: string) => {
    setFilters(prev => {
      const current = prev.categories[key] as string[] || [];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      return {
        ...prev,
        categories: {
          ...prev.categories,
          [key]: next.length > 0 ? next : undefined
        }
      };
    });
  }, []);

  const clearCategory = useCallback((key: keyof CategoryFilters) => {
    setFilters(prev => {
      const nextCategories = { ...prev.categories };
      delete nextCategories[key];
      return { ...prev, categories: nextCategories };
    });
  }, []);

  const clearSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, search: '' }));
  }, []);

  const resetDateRange = useCallback(() => {
    setFilters(prev => ({ ...prev, dateRange: DEFAULT_DATE_RANGE }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      categories: {},
      search: '',
    }));
  }, []);

  const activeFiltersCount = useMemo(() => computeActiveFiltersCount(filters), [filters]);

  const filterChips = useMemo(() => getActiveFilterChips(filters, config, {
    removeCategoryValue: toggleCategoryValue,
    clearCategory,
    clearSearch,
    resetDateRange
  }), [filters, config, toggleCategoryValue, clearCategory, clearSearch, resetDateRange]);

  return {
    filters,
    setFilters,
    setDateRange,
    setDatePreset,
    setCategory,
    toggleCategoryValue,
    clearCategory,
    clearSearch,
    resetDateRange,
    clearAll,
    activeFiltersCount,
    filterChips
  };
}
