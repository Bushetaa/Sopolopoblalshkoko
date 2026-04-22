import { LucideIcon } from 'lucide-react';

export interface SubMenuItem {
  name: string;
  path: string;
  icon?: LucideIcon;
}

export interface MenuItem {
  name: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: 'count' | 'label';
  subItems?: SubMenuItem[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface SidebarState {
  isCollapsed: boolean;
  width: '64' | '16';
}

export interface LayoutState {
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  trend: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  sparklineData?: number[];
  tooltip?: string;
}

export interface TrafficDataPoint {
  time: string;
  requests: number;
  success: number;
  errors: number;
  p50: number;
  p95: number;
}

export interface RequestDistributionData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface ResponseTimeBucket {
  range: string;
  count: number;
  percentage: number;
  severity: 'normal' | 'warning' | 'critical';
}

export interface StatusCodeData {
  period: string;
  '2xx': number;
  '3xx': number;
  '4xx': number;
  '5xx': number;
}

export type KPICategory = 'availability' | 'performance' | 'traffic' | 'errors';
export type KPIStatus = 'healthy' | 'warning' | 'critical';

export interface KPIMetric {
  id: string;
  category: KPICategory;
  name: string;
  current: number;
  target: number;
  unit: string;
  status: KPIStatus;
  history: number[];
  lowerIsBetter: boolean;
}

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SUCCESS';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  method: HttpMethod;
  path: string;
  statusCode: number;
  latency: number;
  apiName: string;
  clientIp: string;
  requestId: string;
  message?: string;
}

export type Granularity = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface AnalyticsFilterState {
  dateRange: DateRange;
  granularity: Granularity;
}
