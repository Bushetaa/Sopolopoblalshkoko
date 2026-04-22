# Data Models: Analytics Engine

All models are derived from `../02-ANALYTICS.md`. This file contains TypeScript interfaces, complete mock data constants, design tokens, and visual state specifications ready for direct use in implementation.

---

## Core Data Interfaces

### KPI / Metric Card

```typescript
export interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  unit?: string;                  // "%" | "ms" | undefined
  trend: {
    value: number;                // e.g., 12.5
    direction: 'up' | 'down' | 'neutral';
    label: string;                // "vs. last week"
    isPositive: boolean;          // up in errors = false; down in response time = true
  };
  icon: LucideIcon;
  iconColor: string;              // e.g. "text-blue-400"
  iconBg: string;                 // e.g. "bg-blue-500/10"
  sparklineData?: number[];       // Last 7 data points for mini chart
  tooltip?: string;               // Hover explanation
}

export interface MetricCardProps {
  data: MetricCardData;
  isLoading?: boolean;
  onClick?: () => void;           // Drilldown handler
  size?: 'sm' | 'md' | 'lg';
}
```

---

### Traffic Chart

```typescript
export interface TrafficDataPoint {
  time: string;           // "00:00"–"23:00" (hourly) | "Mon"–"Sun" (daily)
  requests: number;       // Total requests
  success: number;        // Successful requests
  errors: number;         // Failed requests
  p50: number;            // 50th percentile response time (ms)
  p95: number;            // 95th percentile response time (ms)
}
```

---

### Request Distribution (Donut Chart)

```typescript
export interface RequestDistributionData {
  name: string;           // "REST" | "GraphQL" | "gRPC" | "WebSocket"
  value: number;          // Request count
  percentage: number;     // Calculated %
  color: string;          // Hex color for chart segment
}
```

---

### Response Time Histogram

```typescript
export interface ResponseTimeBucket {
  range: string;          // "0-50ms" | "50-100ms" | "100-200ms" | "200-500ms" | ">500ms"
  count: number;          // Requests in this bucket
  percentage: number;     // % of total
  severity: 'normal' | 'warning' | 'critical';  // Drives bar color
}
```

---

### Status Code Distribution

```typescript
export interface StatusCodeData {
  period: string;         // "Mon" | "Tue" | etc.
  '2xx': number;
  '3xx': number;
  '4xx': number;
  '5xx': number;
}
```

---

### SLA / KPI Metrics

```typescript
export type KPICategory = 'availability' | 'performance' | 'traffic' | 'errors';
export type KPIStatus = 'healthy' | 'warning' | 'critical';

export interface KPIMetric {
  id: string;
  category: KPICategory;
  name: string;
  current: number;
  target: number;                 // SLA target value
  unit: string;                   // "%", "ms", "req/s"
  status: KPIStatus;              // Auto-computed
  history: number[];              // Last 30 data points
  lowerIsBetter: boolean;         // Drives status computation direction
}

export const SLA_TARGETS = {
  uptime: 99.9,                   // 99.9% uptime SLA
  responseTime: 200,              // < 200ms p95 target
  errorRate: 1.0,                 // < 1% error rate
  throughput: 10000,              // 10k req/s throughput
} as const;
```

---

### Live Activity Log Feed

```typescript
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SUCCESS';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface LogEntry {
  id: string;
  timestamp: string;              // ISO string
  level: LogLevel;
  method: HttpMethod;
  path: string;                   // "/api/v1/users"
  statusCode: number;
  latency: number;                // ms
  apiName: string;
  clientIp: string;
  requestId: string;              // Short UUID (8 chars)
  message?: string;               // Error message, if applicable
}
```

---

### Global Analytics Filter State

```typescript
export type Granularity = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface AnalyticsFilterState {
  dateRange: DateRange;
  granularity: Granularity;
}
```

---

## Complete Mock Data Constants

### The 4 KPI Cards

```typescript
import {
  Activity, CheckCircle, Clock, AlertTriangle
} from 'lucide-react';

export const KPI_CARDS: MetricCardData[] = [
  {
    id: 'total-requests',
    title: 'Total Requests',
    value: '2.4M',
    trend: { value: 18.2, direction: 'up', label: 'vs. last week', isPositive: true },
    icon: Activity,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    sparklineData: [120, 140, 135, 180, 160, 200, 240],
  },
  {
    id: 'success-rate',
    title: 'Success Rate',
    value: '99.2',
    unit: '%',
    trend: { value: 0.3, direction: 'up', label: 'vs. last week', isPositive: true },
    icon: CheckCircle,
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/10',
    sparklineData: [98.8, 99.0, 98.7, 99.1, 99.3, 99.2, 99.2],
  },
  {
    id: 'avg-response',
    title: 'Avg Response Time',
    value: '142',
    unit: 'ms',
    trend: { value: 8.5, direction: 'down', label: 'vs. last week', isPositive: true },
    icon: Clock,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
    sparklineData: [180, 165, 158, 150, 148, 145, 142],
  },
  {
    id: 'error-rate',
    title: 'Error Rate',
    value: '0.8',
    unit: '%',
    trend: { value: 2.1, direction: 'down', label: 'vs. last week', isPositive: true },
    icon: AlertTriangle,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/10',
    sparklineData: [1.5, 1.2, 1.0, 0.9, 0.85, 0.82, 0.8],
  },
];
```

### Request Distribution Data

```typescript
export const DISTRIBUTION_DATA: RequestDistributionData[] = [
  { name: 'REST',      value: 1840000, percentage: 76.7, color: '#60A5FA' },
  { name: 'GraphQL',   value: 320000,  percentage: 13.3, color: '#A855F7' },
  { name: 'gRPC',      value: 160000,  percentage: 6.7,  color: '#2DD4BF' },
  { name: 'WebSocket', value: 80000,   percentage: 3.3,  color: '#FBBF24' },
];
```

### Response Time Histogram

```typescript
export const HISTOGRAM_DATA: ResponseTimeBucket[] = [
  { range: '0-50ms',    count: 480000, percentage: 20, severity: 'normal' },
  { range: '50-100ms',  count: 720000, percentage: 30, severity: 'normal' },
  { range: '100-200ms', count: 840000, percentage: 35, severity: 'normal' },
  { range: '200-500ms', count: 288000, percentage: 12, severity: 'warning' },
  { range: '>500ms',    count: 72000,  percentage: 3,  severity: 'critical' },
];
```

### SLA KPI Metrics

```typescript
export const SLA_METRICS: KPIMetric[] = [
  {
    id: 'uptime',
    category: 'availability',
    name: 'Uptime',
    current: 99.95,
    target: SLA_TARGETS.uptime,
    unit: '%',
    status: 'healthy',
    lowerIsBetter: false,
    history: Array.from({ length: 30 }, () => 99.8 + Math.random() * 0.2),
  },
  {
    id: 'response-time',
    category: 'performance',
    name: 'p95 Response Time',
    current: 142,
    target: SLA_TARGETS.responseTime,
    unit: 'ms',
    status: 'healthy',
    lowerIsBetter: true,
    history: Array.from({ length: 30 }, () => 120 + Math.random() * 60),
  },
  {
    id: 'error-rate',
    category: 'errors',
    name: 'Error Rate',
    current: 0.8,
    target: SLA_TARGETS.errorRate,
    unit: '%',
    status: 'healthy',
    lowerIsBetter: true,
    history: Array.from({ length: 30 }, () => 0.5 + Math.random() * 0.8),
  },
  {
    id: 'throughput',
    category: 'traffic',
    name: 'Throughput',
    current: 8750,
    target: SLA_TARGETS.throughput,
    unit: 'req/s',
    status: 'warning',
    lowerIsBetter: false,
    history: Array.from({ length: 30 }, () => 7000 + Math.random() * 3000),
  },
];
```

---

## Chart Design Tokens

```css
/* Analytics page chart color palette */
--chart-requests: #60A5FA;    /* Blue    — total requests */
--chart-success:  #4ADE80;    /* Green   — successful */
--chart-errors:   #F87171;    /* Red     — errors */
--chart-p95:      #A855F7;    /* Purple  — response time */
--chart-warning:  #FBBF24;    /* Yellow  — warnings / 3xx */
--chart-teal:     #2DD4BF;    /* Teal    — gRPC / chart-2 */
--chart-orange:   #FB923C;    /* Orange  — 4xx */

/* Recharts shared config */
--chart-grid-stroke:   #1F2937;   /* gray-800 */
--chart-text-fill:     #9CA3AF;   /* gray-400 */
--chart-tooltip-bg:    #111827;   /* gray-900 */
--chart-tooltip-border:#374151;   /* gray-700 */
```

## SLA Badge Visual States

```typescript
export const STATUS_STYLES: Record<KPIStatus, string> = {
  healthy:  'text-green-400  bg-green-500/10  border border-green-500/20',
  warning:  'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20',
  critical: 'text-red-400    bg-red-500/10    border border-red-500/20',
};
```

## Log Level Color Coding

```typescript
export const LOG_LEVEL_STYLES: Record<LogLevel, string> = {
  SUCCESS: 'text-green-400',
  INFO:    'text-blue-400',
  WARN:    'text-yellow-400',
  ERROR:   'text-red-400',
  DEBUG:   'text-gray-500',
};

export const STATUS_CODE_COLORS = {
  '2xx': 'text-green-400',
  '3xx': 'text-yellow-400',
  '4xx': 'text-orange-400',
  '5xx': 'text-red-400',
} as const;
```

## Trend Badge Styling

```typescript
export const TREND_STYLES = {
  positive: 'bg-green-500/10 text-green-400 border border-green-500/20',
  negative: 'bg-red-500/10   text-red-400   border border-red-500/20',
  neutral:  'bg-gray-700/50  text-gray-400  border border-gray-700',
} as const;
```
