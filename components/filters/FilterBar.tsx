"use client";

import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { FilterState, FilterBarConfig, CategoryFilters } from '@/types/filters';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import DateRangePicker from './DateRangePicker';
import MultiSelectFilter from './MultiSelectFilter';
import ToggleFilter from './ToggleFilter';
import FilterChips from './FilterChips';
import { FilterChip } from '@/types/filters';

interface FilterBarProps {
  config: FilterBarConfig;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  activeFiltersCount: number;
  filterChips: FilterChip[];
  onClearAll: () => void;
  onToggleCategory: (key: keyof CategoryFilters, value: string) => void;
  onSetCategory: (key: keyof CategoryFilters, value: string | string[] | undefined) => void;
  onClearCategory: (key: keyof CategoryFilters) => void;
}

export default function FilterBar({
  config,
  filters,
  onFiltersChange,
  activeFiltersCount,
  filterChips,
  onClearAll,
  onToggleCategory,
  onSetCategory,
  onClearCategory
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-900/40 border border-gray-800 rounded-2xl backdrop-blur-md shadow-2xl relative overflow-hidden group">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-500/10 transition-all duration-700" />
        
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Search Input */}
          {config.showSearch && (
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder={config.searchPlaceholder || "Search..."}
                value={filters.search}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                className="pl-10 pr-10 h-10 bg-gray-950 border-gray-800 text-gray-200 placeholder:text-gray-600 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 rounded-xl"
              />
              {filters.search && (
                <button
                  onClick={() => onFiltersChange({ ...filters, search: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {config.showSearch && config.showDateRange && (
            <div className="hidden md:block w-px h-6 bg-gray-800 mx-1" />
          )}

          {/* Date Range Picker */}
          {config.showDateRange && (
            <DateRangePicker
              value={filters.dateRange}
              onChange={(range) => onFiltersChange({ ...filters, dateRange: range })}
            />
          )}

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {config.categories?.map((cat) => (
              <React.Fragment key={cat.key}>
                {cat.type === 'multi' ? (
                  <MultiSelectFilter
                    label={cat.label}
                    options={cat.options}
                    value={filters.categories[cat.key] as string[]}
                    onChange={(val) => onSetCategory(cat.key, val)}
                  />
                ) : cat.type === 'toggle' ? (
                  <ToggleFilter
                    label={cat.label}
                    options={cat.options}
                    value={filters.categories[cat.key] as string[]}
                    onChange={(val) => onSetCategory(cat.key, val)}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{cat.label}</span>
                    {(() => {
                      const categoryValue = filters.categories[cat.key];
                      const selectValue = Array.isArray(categoryValue) ? "" : (categoryValue ?? "");

                      return (
                    <select
                      value={selectValue}
                      onChange={(e) => onSetCategory(cat.key, e.target.value || undefined)}
                      className="h-9 px-3 bg-gray-950 border border-gray-800 rounded-xl text-xs font-bold text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                    >
                      {cat.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                      );
                    })()}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Extra Actions & Active Filters Badge */}
        <div className="flex items-center gap-3 md:ml-auto">
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <Filter className="h-3 w-3 text-blue-400" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{activeFiltersCount} Active</span>
            </div>
          )}
          {config.extraActions}
        </div>
      </div>

      {/* Filter Chips */}
      <FilterChips chips={filterChips} onClearAll={onClearAll} />
    </div>
  );
}
