# Component API Contracts: Analytics Engine

Derived from `../02-ANALYTICS.md` and `../spec.md`. Defines the public component surface (props, emitted events, constraints) for all Analytics Engine components.

---

## Page Components

### `<AnalyticsPage />` — `app/(dashboard)/analytics/page.tsx`

```typescript
// No props — top-level page component
// Owns: AnalyticsFilterState (dateRange + granularity)
// Renders: PageHeader, KPI grid, Charts grid, SLA section, LiveFeed
```

**Internal state**:
```typescript
const [filterState, setFilterState] = useState<AnalyticsFilterState>({
  dateRange: { from: subDays(new Date(), 7), to: new Date() },
  granularity: 'hourly',
});
const [activeTab, setActiveTab] = useState<'traffic' | 'performance' | 'errors'>('traffic');
```

---

## Dashboard-Level Components

### `<MetricCard />` — `components/dashboard/MetricCard.tsx`

```typescript
interface MetricCardProps {
  data: MetricCardData;
  isLoading?: boolean;     // default: false → shows skeleton when true
  onClick?: () => void;    // Drilldown navigation handler
  size?: 'sm' | 'md' | 'lg';  // default: 'md'
}
```

**Layout**:
```
┌────────────────────────────────┐
│  [Icon bg]        [Trend Badge]│
│                                │
│  Value  Unit                   │
│  Title                         │
│                                │
│  [Mini Sparkline — 40px high]  │
│  ─────────────────────────     │
│  ↑ 18.2% vs. last week         │
└────────────────────────────────┘
```

**Constraints**:
- Skeleton replaces all content when `isLoading=true` using `animate-pulse`
- Trend badge color driven by `data.trend.isPositive`, NOT `data.trend.direction`
- Sparkline uses Recharts `<AreaChart>` with no axes, no tooltip, `h-[40px]`

---

### `<TrafficChart />` — `components/dashboard/TrafficChart.tsx`

```typescript
interface TrafficChartProps {
  data: TrafficDataPoint[];
  isLoading?: boolean;
  granularity: Granularity;   // Controls X-axis label format
}
```

**Features**:
- `ComposedChart` with `Area` (requests) + `Line` (p95, dashed, secondary Y-axis)
- `<Brush>` component: `height={24}`, `stroke="#374151"`, `fill="#111827"`
- `<CartesianGrid>` vertical lines hidden
- Custom `<Tooltip>` showing requests + errors + p95 at crosshair
- Legend: clicking a series hides/shows it
- Height: `h-[320px]`

---

### `<LiveLogs />` — `components/dashboard/LiveLogs.tsx`

```typescript
interface LiveLogsProps {
  maxEntries?: number;      // default: 50
  updateInterval?: [number, number];  // default: [800, 2000] ms range
}
```

**Internal state (via `useLiveLogs` hook)**:
```typescript
const [logs, setLogs] = useState<LogEntry[]>([]);
const [isPaused, setIsPaused] = useState(false);
const [levelFilter, setLevelFilter] = useState<LogLevel | 'ALL'>('ALL');
const [autoScroll, setAutoScroll] = useState(true);
```

**Constraints**:
- Max 50 entries always (`[newEntry, ...prev].slice(0, 50)`)
- Auto-scroll pauses when user scrolls up; resumes on scroll-to-bottom
- Pause/Resume button label mirrors `isPaused` state

---

## Analytics-Specific Components

### `<RequestDistributionChart />` — `components/analytics/PieChart.tsx`

```typescript
interface RequestDistributionChartProps {
  data: RequestDistributionData[];
  isLoading?: boolean;
}
```

**Rendering**: `<PieChart>` → `<Pie innerRadius={60} outerRadius={90} paddingAngle={3}>` with center label showing total + "Total". Custom `<Tooltip>` showing name, count, percentage.

---

### `<ResponseHistogram />` — `components/analytics/ResponseHistogram.tsx`

```typescript
interface ResponseHistogramProps {
  data: ResponseTimeBucket[];
  isLoading?: boolean;
}
```

**Rendering**: `<BarChart layout="vertical">` — horizontal bars, `YAxis` shows range labels, `XAxis` shows counts, `<LabelList>` shows `percentage%` on right. Colors per `severity`: normal=blue, warning=amber, critical=red.

---

### `<StatusCodeChart />` — `components/analytics/StatusCodeChart.tsx`

```typescript
interface StatusCodeChartProps {
  data: StatusCodeData[];
  isLoading?: boolean;
}
```

**Rendering**: `<BarChart>` stacked bars — 4 `<Bar>` components with `stackId="a"`: green (2xx), amber (3xx), orange (4xx), red (5xx). Top bar has `radius={[4, 4, 0, 0]}`.

---

### `<KPICard />` — `components/analytics/KPICard.tsx`

```typescript
interface KPICardProps {
  metric: KPIMetric;
  isLoading?: boolean;
}
```

**Rendering**:
```
┌──────────────────────────────────────┐
│ [Category icon]  Name       [Status] │
│ Current: 142ms   Target: 200ms       │
│ ████████████░░░░░░░  71%             │
└──────────────────────────────────────┘
```
Progress bar width = `Math.min((current / target) * 100, 100)%`, capped at 100%.  
Status computated via `getKPIStatus(current, target, lowerIsBetter)`.

---

## Hooks Contracts

### `useAnalyticsData(filter: AnalyticsFilterState)`

```typescript
export function useAnalyticsData(filter: AnalyticsFilterState): {
  trafficData: TrafficDataPoint[];
  distributionData: RequestDistributionData[];
  histogramData: ResponseTimeBucket[];
  statusCodeData: StatusCodeData[];
  kpiCards: MetricCardData[];
  slaMetrics: KPIMetric[];
  isLoading: boolean;
}
// Regenerates data when filter changes (useMemo on granularity + dateRange)
// Simulates 500ms loading delay on filter change
```

### `useLiveLogs(options?)`

```typescript
export function useLiveLogs(options?: {
  maxEntries?: number;           // default: 50
  intervalRange?: [number, number];  // default: [800, 2000]
}): {
  logs: LogEntry[];
  isPaused: boolean;
  togglePause: () => void;
  levelFilter: LogLevel | 'ALL';
  setLevelFilter: (level: LogLevel | 'ALL') => void;
  filteredLogs: LogEntry[];      // logs filtered by levelFilter
}
// Cleans interval on unmount
```

---

## Shared Chart Utility

### `getKPIStatus`

```typescript
export function getKPIStatus(
  current: number,
  target: number,
  lowerIsBetter: boolean
): KPIStatus {
  const ratio = current / target;
  if (lowerIsBetter) {
    if (ratio < 0.8) return 'healthy';
    if (ratio < 1.0) return 'warning';
    return 'critical';
  } else {
    if (ratio > 0.99) return 'healthy';
    if (ratio > 0.95) return 'warning';
    return 'critical';
  }
}
```

### `generateLogEntry`

```typescript
export function generateLogEntry(): LogEntry {
  // Returns a randomized LogEntry for the live feed simulation
  // Derives level from statusCode: >= 500 → ERROR, >= 400 → WARN, else SUCCESS
}
```
