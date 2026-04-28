import { startOfDay, endOfDay, subDays, subMonths, startOfMonth, startOfYear, format } from 'date-fns';

export type DatePreset = 'today' | 'yesterday' | '7d' | '14d' | '30d' | '90d' | '6m' | '1y';
export type Granularity = 'hour' | 'day' | 'week' | 'month';

export interface DateRangeFilter {
  preset: DatePreset | 'custom';
  startDate: Date | null;
  endDate: Date | null;
  granularity: Granularity;
}

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
