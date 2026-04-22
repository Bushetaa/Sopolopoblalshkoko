# Quickstart: Analytics Engine

> **Prerequisite**: The Layout System (Spec 001) must be implemented first. The Analytics page renders inside `app/(dashboard)/analytics/page.tsx`.

## 1. Page Entry Point

Create the main Analytics page at `app/(dashboard)/analytics/page.tsx`:

```tsx
// app/(dashboard)/analytics/page.tsx
'use client';

import { useState } from 'react';
import { subDays } from 'date-fns';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { TrafficChart } from '@/components/dashboard/TrafficChart';
import { LiveLogs } from '@/components/dashboard/LiveLogs';
import { RequestDistributionChart } from '@/components/analytics/PieChart';
import { ResponseHistogram } from '@/components/analytics/ResponseHistogram';
import { StatusCodeChart } from '@/components/analytics/StatusCodeChart';
import { KPICard } from '@/components/analytics/KPICard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import type { AnalyticsFilterState, Granularity } from '@/specs/002-analytics/data-model';

export default function AnalyticsPage() {
  const [filterState, setFilterState] = useState<AnalyticsFilterState>({
    dateRange: { from: subDays(new Date(), 7), to: new Date() },
    granularity: 'hourly',
  });

  const {
    trafficData, distributionData, histogramData,
    statusCodeData, kpiCards, slaMetrics, isLoading,
  } = useAnalyticsData(filterState);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header with filters */}
      <PageHeader filterState={filterState} onFilterChange={setFilterState} />

      {/* Section 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(card => (
          <MetricCard key={card.id} data={card} isLoading={isLoading} />
        ))}
      </div>

      {/* Section 2: Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <TrafficChart data={trafficData} granularity={filterState.granularity} isLoading={isLoading} />
        </div>
        <div className="xl:col-span-1">
          <RequestDistributionChart data={distributionData} isLoading={isLoading} />
        </div>
      </div>

      {/* Section 3: Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ResponseHistogram data={histogramData} isLoading={isLoading} />
        <StatusCodeChart data={statusCodeData} isLoading={isLoading} />
      </div>

      {/* Section 4: SLA KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {slaMetrics.map(metric => (
          <KPICard key={metric.id} metric={metric} isLoading={isLoading} />
        ))}
      </div>

      {/* Section 5: Live Activity Feed */}
      <LiveLogs />
    </div>
  );
}
```

## 2. Key Import Aliases

```typescript
// ✅ Correct (project uses @/ alias pointing to repo root)
import { MetricCard } from '@/components/dashboard/MetricCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

// ❌ Wrong (no src/ folder)
import { MetricCard } from '@/src/app/components/dashboard/MetricCard';
```

## 3. Standard Chart Card Wrapper

All charts share this container pattern:

```tsx
<div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-sm font-medium text-gray-50">Chart Title</h3>
      <p className="text-xs text-gray-500 mt-0.5">Subtitle / time context</p>
    </div>
    {/* Optional: timeframe selector or fullscreen button */}
  </div>
  <div className="h-[320px]">
    <ResponsiveContainer width="100%" height="100%">
      {/* Recharts component */}
    </ResponsiveContainer>
  </div>
</div>
```

## 4. Granularity Toggle

```tsx
const GRANULARITY_OPTIONS: { id: Granularity; label: string }[] = [
  { id: 'hourly',  label: 'Hourly' },
  { id: 'daily',   label: 'Daily' },
  { id: 'weekly',  label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

<div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
  {GRANULARITY_OPTIONS.map(opt => (
    <button
      key={opt.id}
      className={cn(
        "px-4 py-1.5 rounded-md text-sm transition-all duration-150",
        filterState.granularity === opt.id
          ? "bg-gray-800 text-gray-50 font-medium shadow-sm"
          : "text-gray-500 hover:text-gray-300"
      )}
      onClick={() => setFilterState(prev => ({ ...prev, granularity: opt.id }))}
    >
      {opt.label}
    </button>
  ))}
</div>
```
