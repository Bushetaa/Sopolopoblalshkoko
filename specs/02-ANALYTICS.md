# 📊 Spec 02 — Analytics (Core Feature 🔥)
## Sopo Platform | نظام التحليلات والمقاييس

> **Spec ID**: SOPO-SPEC-02  
> **Priority**: 🔴 Critical (Core Revenue Feature)  
> **Status**: 🟡 Partially Implemented  
> **Depends On**: Spec 01 (Layout System)  
> **Required By**: Spec 06 (Reports/Insights)  

---

## 🎯 Overview | نظرة عامة

صفحة Analytics هي القلب النابض للمنصة — تعرض تحليلات مفصلة وشاملة للـ API traffic والـ performance والـ health. تشمل KPI Cards تفاعلية، رسوم بيانية متعددة الأنواع (Line, Bar, Area, Pie)، ومؤشرات أداء حية. هذه الصفحة هي المرجع الرئيسي للفرق التقنية لفهم حالة المنصة.

---

## 🏗️ 1. Analytics Page Architecture

### 1.1 Page Layout Structure

```
ANALYTICS ENGINE PAGE
├── Page Header
│   ├── Title: "Analytics Engine"
│   ├── Date Range Picker (Global filter)
│   ├── Granularity Toggle: [Hourly | Daily | Weekly | Monthly]
│   └── Export Button
│
├── Section 1: KPI Stats Cards (4 cards)
│   ├── Total Requests
│   ├── Success Rate
│   ├── Avg Response Time
│   └── Error Rate
│
├── Section 2: Main Charts Row
│   ├── Traffic Overview Chart (Area/Line) — 2/3 width
│   └── Request Distribution (Pie Chart) — 1/3 width
│
├── Section 3: Secondary Charts Row
│   ├── Response Time Histogram (Bar Chart) — 1/2 width
│   └── Status Code Distribution (Stacked Bar) — 1/2 width
│
├── Section 4: API-Level Analytics
│   └── Top APIs Performance Table (with mini sparklines)
│
└── Section 5: Live Activity Feed
    └── Real-time log stream (last 50 events)
```

### 1.2 Tabs Structure

```
[Traffic] [Performance] [Errors] [Reports]
    ↓           ↓           ↓         ↓
Traffic     Response    Error     (Spec 06)
Analytics   Metrics     Analysis   Reports
```

---

## 📊 2. KPI Stats Cards

### 2.1 Card Variants & Data

```typescript
interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  trend: {
    value: number;          // e.g., 12.5
    direction: 'up' | 'down' | 'neutral';
    label: string;          // "vs. last period"
    isPositive: boolean;    // up in requests = positive; up in errors = negative
  };
  icon: LucideIcon;
  iconColor: string;        // Tailwind class: "text-blue-400"
  iconBg: string;           // Tailwind class: "bg-blue-500/10"
  sparklineData?: number[]; // Mini chart data (last 7 points)
  tooltip?: string;         // Explanatory tooltip on hover
}
```

### 2.2 The 4 Primary KPI Cards

#### Card 1: Total Requests
```typescript
{
  id: 'total-requests',
  title: 'Total Requests',
  value: '2.4M',
  trend: { value: 18.2, direction: 'up', label: 'vs. last week', isPositive: true },
  icon: Activity,
  iconColor: 'text-blue-400',
  iconBg: 'bg-blue-500/10',
  sparklineData: [120, 140, 135, 180, 160, 200, 240]
}
```

#### Card 2: Success Rate
```typescript
{
  id: 'success-rate',
  title: 'Success Rate',
  value: '99.2',
  unit: '%',
  trend: { value: 0.3, direction: 'up', label: 'vs. last week', isPositive: true },
  icon: CheckCircle,
  iconColor: 'text-green-400',
  iconBg: 'bg-green-500/10',
  sparklineData: [98.8, 99.0, 98.7, 99.1, 99.3, 99.2, 99.2]
}
```

#### Card 3: Avg Response Time
```typescript
{
  id: 'avg-response',
  title: 'Avg Response Time',
  value: '142',
  unit: 'ms',
  trend: { value: 8.5, direction: 'down', label: 'vs. last week', isPositive: true },
  icon: Clock,
  iconColor: 'text-purple-400',
  iconBg: 'bg-purple-500/10',
  sparklineData: [180, 165, 158, 150, 148, 145, 142]
}
```

#### Card 4: Error Rate
```typescript
{
  id: 'error-rate',
  title: 'Error Rate',
  value: '0.8',
  unit: '%',
  trend: { value: 2.1, direction: 'down', label: 'vs. last week', isPositive: true },
  icon: AlertTriangle,
  iconColor: 'text-red-400',
  iconBg: 'bg-red-500/10',
  sparklineData: [1.5, 1.2, 1.0, 0.9, 0.85, 0.82, 0.8]
}
```

### 2.3 MetricCard Component Spec

```tsx
// src/app/components/dashboard/MetricCard.tsx
interface MetricCardProps {
  data: MetricCardData;
  isLoading?: boolean;
  onClick?: () => void;           // Drilldown into detailed view
  size?: 'sm' | 'md' | 'lg';    // Card size variant
}

// Card Visual Layout:
// ┌────────────────────────────────┐
// │  [Icon]        [Trend Badge]  │
// │                               │
// │  Value   Unit                 │
// │  Title                        │
// │                               │
// │  [Mini Sparkline Chart]       │
// │  ─────────────────────────    │
// │  [Trend Info] vs. last week   │
// └────────────────────────────────┘
```

### 2.4 Trend Badge Styling Rules

```typescript
// Positive trend (good metric going up / bad metric going down)
const positiveTrendStyles = "bg-green-500/10 text-green-400 border border-green-500/20";

// Negative trend (bad direction)
const negativeTrendStyles = "bg-red-500/10 text-red-400 border border-red-500/20";

// Neutral (no change)
const neutralTrendStyles = "bg-gray-700/50 text-gray-400 border border-gray-700";

// Display format
const trendDisplay = `${trend.direction === 'up' ? '↑' : '↓'} ${trend.value}%`;
```

### 2.5 Sparkline Mini Chart

```tsx
// Mini inline chart using Recharts (no axes, no tooltips)
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={40}>
  <AreaChart data={sparklineData.map((v, i) => ({ value: v, index: i }))}>
    <defs>
      <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
        <stop offset="95%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
    <Area
      type="monotone"
      dataKey="value"
      stroke={color}
      strokeWidth={1.5}
      fill={`url(#gradient-${id})`}
      dot={false}
      isAnimationActive={false}
    />
  </AreaChart>
</ResponsiveContainer>
```

### 2.6 Loading Skeleton State

```tsx
// When data is loading, show animated skeleton
<div className="animate-pulse">
  <div className="h-4 bg-gray-800 rounded w-24 mb-2" />
  <div className="h-8 bg-gray-800 rounded w-32 mb-3" />
  <div className="h-10 bg-gray-800 rounded w-full" />
</div>
```

---

## 📈 3. Charts System

### 3.1 Chart Library Configuration

```typescript
// Using Recharts 2.x
// Default chart configuration for Sopo dark theme
const CHART_DEFAULTS = {
  colors: {
    blue: '#60A5FA',      // chart-1
    teal: '#2DD4BF',      // chart-2
    yellow: '#FBBF24',    // chart-3
    purple: '#A855F7',    // chart-4
    orange: '#FB923C',    // chart-5
    red: '#F87171',       // error color
    green: '#4ADE80',     // success color
  },
  grid: {
    stroke: '#1F2937',    // gray-800
    strokeDasharray: '3 3',
  },
  text: {
    fill: '#9CA3AF',      // gray-400
    fontSize: 12,
    fontFamily: 'inherit',
  },
  tooltip: {
    backgroundColor: '#111827',   // gray-900
    borderColor: '#374151',        // gray-700
    textColor: '#F9FAFB',          // gray-50
  }
};
```

### 3.2 Chart 1: Traffic Overview (Area Chart)

```typescript
// src/app/components/dashboard/TrafficChart.tsx

interface TrafficDataPoint {
  time: string;           // "00:00", "01:00", etc. (hourly) or "Mon", "Tue" (daily)
  requests: number;       // Total requests
  success: number;        // Successful requests
  errors: number;         // Failed requests
  p50: number;            // 50th percentile response time (ms)
  p95: number;            // 95th percentile response time (ms)
}

// Chart Features:
// - Two Y-axes: requests (left), response time (right)
// - Multiple series: total, success, errors
// - Brush component for zoom/pan
// - Interactive crosshair tooltip
// - Legend with toggleable series
```

```tsx
// Chart Structure
<ResponsiveContainer width="100%" height={320}>
  <ComposedChart data={trafficData}>
    <defs>
      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
      </linearGradient>
    </defs>
    
    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
    <XAxis dataKey="time" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} />
    <YAxis yAxisId="left" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} />
    <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
    
    <Tooltip content={<CustomTooltip />} />
    <Legend content={<CustomLegend />} />
    
    <Area
      yAxisId="left"
      type="monotone"
      dataKey="requests"
      stroke="#60A5FA"
      strokeWidth={2}
      fill="url(#colorRequests)"
    />
    <Line
      yAxisId="right"
      type="monotone"
      dataKey="p95"
      stroke="#A855F7"
      strokeWidth={1.5}
      dot={false}
      strokeDasharray="4 4"
    />
    
    <Brush dataKey="time" height={24} stroke="#374151" fill="#111827" />
  </ComposedChart>
</ResponsiveContainer>
```

### 3.3 Chart 2: Request Distribution (Pie / Donut Chart)

```typescript
interface RequestDistributionData {
  name: string;           // "REST", "GraphQL", "gRPC", "WebSocket"
  value: number;          // Request count
  percentage: number;     // Calculated percentage
  color: string;          // Chart color
}

const distributionData: RequestDistributionData[] = [
  { name: 'REST', value: 1840000, percentage: 76.7, color: '#60A5FA' },
  { name: 'GraphQL', value: 320000, percentage: 13.3, color: '#A855F7' },
  { name: 'gRPC', value: 160000, percentage: 6.7, color: '#2DD4BF' },
  { name: 'WebSocket', value: 80000, percentage: 3.3, color: '#FBBF24' },
];
```

```tsx
// Donut Chart with center label
<PieChart>
  <Pie
    data={distributionData}
    cx="50%"
    cy="50%"
    innerRadius={60}        // Makes it a donut
    outerRadius={90}
    paddingAngle={3}
    dataKey="value"
  >
    {distributionData.map((entry, index) => (
      <Cell key={index} fill={entry.color} />
    ))}
    
    {/* Center Label */}
    <Label
      content={({ viewBox }) => (
        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
          <tspan fill="#F9FAFB" fontSize={20} fontWeight={600}>2.4M</tspan>
          <tspan x={viewBox.cx} dy={20} fill="#9CA3AF" fontSize={12}>Total</tspan>
        </text>
      )}
    />
  </Pie>
  <Tooltip content={<PieTooltip />} />
</PieChart>
```

### 3.4 Chart 3: Response Time Histogram (Bar Chart)

```typescript
interface ResponseTimeBucket {
  range: string;          // "0-50ms", "50-100ms", "100-200ms", ">200ms"
  count: number;          // Number of requests in this range
  percentage: number;
}

const histogramData: ResponseTimeBucket[] = [
  { range: '0-50ms', count: 480000, percentage: 20 },
  { range: '50-100ms', count: 720000, percentage: 30 },
  { range: '100-200ms', count: 840000, percentage: 35 },
  { range: '200-500ms', count: 288000, percentage: 12 },
  { range: '>500ms', count: 72000, percentage: 3 },
];
```

```tsx
// Horizontal Bar Chart (rotated for readability)
<BarChart data={histogramData} layout="vertical">
  <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
  <YAxis type="category" dataKey="range" tick={{ fill: '#9CA3AF', fontSize: 11 }} width={70} />
  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
    {histogramData.map((entry, index) => (
      <Cell
        key={index}
        fill={entry.range === '>500ms' ? '#F87171' :
              entry.range === '200-500ms' ? '#FBBF24' : '#60A5FA'}
      />
    ))}
    <LabelList dataKey="percentage" position="right" formatter={(v) => `${v}%`} />
  </Bar>
</BarChart>
```

### 3.5 Chart 4: Status Code Distribution (Stacked Bar)

```typescript
interface StatusCodeData {
  period: string;         // "Mon", "Tue", etc.
  '2xx': number;          // Success responses
  '3xx': number;          // Redirects
  '4xx': number;          // Client errors
  '5xx': number;          // Server errors
}
```

```tsx
// Stacked Bar with color coding
<BarChart data={statusCodeData}>
  <Bar dataKey="2xx" stackId="a" fill="#4ADE80" />
  <Bar dataKey="3xx" stackId="a" fill="#FBBF24" />
  <Bar dataKey="4xx" stackId="a" fill="#FB923C" />
  <Bar dataKey="5xx" stackId="a" fill="#F87171" radius={[4, 4, 0, 0]} />
</BarChart>
```

### 3.6 Custom Tooltip Component

```tsx
const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl min-w-[160px]">
      <p className="text-gray-400 text-xs mb-2 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-400">{entry.name}</span>
          </div>
          <span className="text-gray-50 font-medium tabular-nums">
            {formatValue(entry.value, entry.name)}
          </span>
        </div>
      ))}
    </div>
  );
};
```

---

## 📉 4. KPIs — Key Performance Indicators

### 4.1 Primary KPIs Dashboard

```typescript
interface KPIMetric {
  id: string;
  category: 'availability' | 'performance' | 'traffic' | 'errors';
  name: string;
  current: number;
  target: number;            // SLA target
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  history: number[];         // Last 30 data points
}

const SLA_TARGETS = {
  uptime: 99.9,              // 99.9% uptime SLA
  responseTime: 200,         // < 200ms p95 target
  errorRate: 1.0,            // < 1% error rate
  throughput: 10000,         // 10k req/s throughput
};
```

### 4.2 SLA Status Indicators

```typescript
// Status determination logic
const getKPIStatus = (current: number, target: number, metric: string): string => {
  const ratio = current / target;
  
  if (metric === 'responseTime' || metric === 'errorRate') {
    // Lower is better
    if (ratio < 0.8) return 'healthy';
    if (ratio < 1.0) return 'warning';
    return 'critical';
  } else {
    // Higher is better
    if (ratio > 0.99) return 'healthy';
    if (ratio > 0.95) return 'warning';
    return 'critical';
  }
};

// Visual status colors
const STATUS_STYLES = {
  healthy: 'text-green-400 bg-green-500/10',
  warning: 'text-yellow-400 bg-yellow-500/10',
  critical: 'text-red-400 bg-red-500/10',
};
```

### 4.3 KPI Progress Bar Component

```tsx
// Visual SLA compliance bar
interface KPIProgressBarProps {
  current: number;
  target: number;
  status: 'healthy' | 'warning' | 'critical';
}

<div className="relative h-1.5 bg-gray-800 rounded-full overflow-hidden">
  <div
    className={cn(
      "h-full rounded-full transition-all duration-500",
      status === 'healthy' ? 'bg-green-400' :
      status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
    )}
    style={{ width: `${Math.min((current / target) * 100, 100)}%` }}
  />
  {/* Target marker */}
  <div className="absolute top-0 right-0 w-0.5 h-full bg-gray-600" />
</div>
```

---

## 📱 5. Real-time & Live Data

### 5.1 Live Terminal Logs

```typescript
// src/app/components/dashboard/LiveLogs.tsx
interface LogEntry {
  id: string;
  timestamp: string;          // "2024-01-15 14:23:45.123"
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SUCCESS';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;               // "/api/v1/users"
  statusCode: number;         // 200, 404, 500, etc.
  latency: number;            // ms
  apiName: string;            // "User Auth Service"
  clientIp: string;           // "192.168.1.xxx"
  requestId: string;          // UUID
  message?: string;           // Error message if applicable
}
```

### 5.2 Log Level Color Coding

```typescript
const LOG_LEVEL_STYLES = {
  SUCCESS: 'text-green-400',
  INFO:    'text-blue-400',
  WARN:    'text-yellow-400',
  ERROR:   'text-red-400',
  DEBUG:   'text-gray-500',
};

const STATUS_CODE_COLORS = {
  '2xx': 'text-green-400',
  '3xx': 'text-yellow-400',
  '4xx': 'text-orange-400',
  '5xx': 'text-red-400',
};
```

### 5.3 Mock Data Generation (Simulated Real-time)

```typescript
// Generate a random log entry every 800-2000ms
const generateLogEntry = (): LogEntry => {
  const apis = ['User Auth', 'Product API', 'Payment', 'Analytics'];
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  const paths = ['/api/v1/users', '/api/v1/products', '/api/v2/auth', '/api/v1/payments'];
  const statuses = [200, 200, 200, 201, 204, 400, 401, 404, 500];
  
  const statusCode = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    level: statusCode >= 500 ? 'ERROR' : statusCode >= 400 ? 'WARN' : 'SUCCESS',
    method: methods[Math.floor(Math.random() * methods.length)] as any,
    path: paths[Math.floor(Math.random() * paths.length)],
    statusCode,
    latency: Math.floor(Math.random() * 300) + 20,
    apiName: apis[Math.floor(Math.random() * apis.length)],
    clientIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    requestId: crypto.randomUUID().slice(0, 8),
  };
};

// In component:
useEffect(() => {
  const interval = setInterval(() => {
    const newLog = generateLogEntry();
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
  }, Math.random() * 1200 + 800);
  
  return () => clearInterval(interval);
}, []);
```

---

## 🔢 6. Mock Data Specification

### 6.1 Traffic Time Series Data (24 hours)

```typescript
// Generate 24 hourly data points
const generateTrafficData = (): TrafficDataPoint[] => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0') + ':00';
    const baseRequests = 50000 + Math.sin(i * Math.PI / 12) * 30000;
    const requests = Math.floor(baseRequests + Math.random() * 5000);
    const errorRate = 0.005 + Math.random() * 0.015;
    
    return {
      time: hour,
      requests,
      success: Math.floor(requests * (1 - errorRate)),
      errors: Math.floor(requests * errorRate),
      p50: Math.floor(80 + Math.random() * 60),
      p95: Math.floor(150 + Math.random() * 100),
    };
  });
};
```

### 6.2 Analytics Sub-Pages Data

```typescript
// Traffic sub-page: 30-day trend
// Performance sub-page: Response time percentiles (p50, p75, p90, p95, p99)
// Reports sub-page: See Spec 06

// Performance data structure
interface PerformanceMetrics {
  apiId: string;
  apiName: string;
  p50: number;              // 50th percentile (median)
  p75: number;
  p90: number;
  p95: number;              // Key SLA metric
  p99: number;
  maxLatency: number;
  requestCount: number;
  errorCount: number;
}
```

---

## 🎨 7. Design Specifications

### 7.1 Analytics Page Colors

```css
/* Chart accent colors */
--chart-requests: #60A5FA;      /* Blue: total requests */
--chart-success: #4ADE80;       /* Green: successful */
--chart-errors: #F87171;        /* Red: errors */
--chart-p95: #A855F7;           /* Purple: response time */
--chart-warning: #FBBF24;       /* Yellow: warnings */

/* Card icon backgrounds */
--card-blue: bg-blue-500/10;
--card-green: bg-green-500/10;
--card-purple: bg-purple-500/10;
--card-red: bg-red-500/10;
```

### 7.2 Chart Container Card Styling

```tsx
// Standard chart card wrapper
<div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
  {/* Chart Header */}
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-sm font-medium text-gray-50">Traffic Overview</h3>
      <p className="text-xs text-gray-500 mt-0.5">Requests per hour, last 24h</p>
    </div>
    {/* Chart actions: timeframe selector, fullscreen, etc. */}
  </div>
  
  {/* Chart */}
  <div className="h-[320px]">
    <ResponsiveContainer width="100%" height="100%">
      {/* Recharts component */}
    </ResponsiveContainer>
  </div>
</div>
```

### 7.3 Analytics Tabs Styling

```tsx
// Tab navigation for analytics sub-sections
<div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
  {tabs.map(tab => (
    <button
      key={tab.id}
      className={cn(
        "px-4 py-1.5 rounded-md text-sm transition-all duration-150",
        activeTab === tab.id
          ? "bg-gray-800 text-gray-50 font-medium shadow-sm"
          : "text-gray-500 hover:text-gray-300"
      )}
      onClick={() => setActiveTab(tab.id)}
    >
      {tab.label}
    </button>
  ))}
</div>
```

---

## 🧪 8. Acceptance Criteria

### 8.1 Stats Cards ✅ Requirements
- [ ] 4 KPI cards render with correct data
- [ ] Trend badges show correct color (green/red) based on metric direction
- [ ] Sparkline charts render without errors
- [ ] Cards are responsive (2x2 grid on tablet, 4x1 on desktop)
- [ ] Loading skeletons show during data fetch
- [ ] Click on card navigates to detailed view

### 8.2 Charts ✅ Requirements
- [ ] Traffic Area Chart renders with correct data
- [ ] Chart responds to date range filter changes
- [ ] Tooltips display formatted values with units
- [ ] Chart legend toggles series visibility on click
- [ ] Brush/zoom component works on Traffic chart
- [ ] Pie chart shows correct percentages
- [ ] All charts are responsive (use ResponsiveContainer)
- [ ] Charts animate on initial render
- [ ] No `defaultProps` console warnings

### 8.3 KPIs ✅ Requirements
- [ ] SLA status indicators update correctly
- [ ] Progress bars reflect current vs. target
- [ ] Color coding matches status (green/yellow/red)
- [ ] KPI data refreshes every 30 seconds (simulated)

### 8.4 Live Logs ✅ Requirements
- [ ] New log entries appear every 1-2 seconds
- [ ] Maximum 50 entries displayed (oldest removed)
- [ ] Color coding by log level
- [ ] Pause/Resume button works
- [ ] Filter by log level works
- [ ] Auto-scroll to newest entry (with manual scroll override)

---

## 📁 9. Files to Create / Modify

| File Path                                            | Action | Notes                                  |
|------------------------------------------------------|--------|----------------------------------------|
| `src/app/pages/Analytics.tsx`                        | Modify | Add tabs, sections, and sub-pages      |
| `src/app/components/dashboard/MetricCard.tsx`        | Modify | Add sparkline, click handler, skeleton |
| `src/app/components/dashboard/TrafficChart.tsx`      | Modify | Add Brush, dual Y-axis, custom tooltip |
| `src/app/components/dashboard/LiveLogs.tsx`          | Modify | Add filter, pause/resume               |
| `src/app/components/analytics/PieChart.tsx`          | Create | Request distribution donut chart       |
| `src/app/components/analytics/ResponseHistogram.tsx` | Create | Response time distribution bar chart   |
| `src/app/components/analytics/StatusCodeChart.tsx`   | Create | Stacked status code bar chart          |
| `src/app/components/analytics/KPICard.tsx`           | Create | SLA KPI card with progress bar         |
| `src/app/components/analytics/TopAPIsTable.tsx`      | Create | API-level performance table            |
| `src/app/hooks/useAnalyticsData.ts`                  | Create | Analytics data generation hook         |

---

## 🔗 10. Dependencies on Other Specs

| Spec                  | Dependency Type | Notes                                          |
|-----------------------|-----------------|------------------------------------------------|
| Spec 01 — Layout      | Hard            | Renders inside Layout content area             |
| Spec 04 — Filters     | Hard            | Date range picker for analytics time filter    |
| Spec 06 — Reports     | Soft            | Reports tab in Analytics uses Reports spec     |

---

*Spec Version: 1.0.0 | Last Updated: April 2026 | Owner: Sopo Platform Team*
