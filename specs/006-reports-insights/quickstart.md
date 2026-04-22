# Quickstart: Reports & Insights

## Page Entry Point

```tsx
// app/(dashboard)/analytics/reports/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { REPORT_TEMPLATES } from '@/lib/reports-mock';
import { ReportTemplateCard, InsightCard } from '@/components/reports';
import { runInsightRules } from '@/lib/insight-rules';

type Tab = 'overview' | 'my-reports' | 'scheduled' | 'insights';
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',    label: 'Overview' },
  { id: 'my-reports',  label: 'My Reports' },
  { id: 'scheduled',   label: 'Scheduled' },
  { id: 'insights',    label: 'Insights' },
];

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams.get('tab') as Tab) ?? 'overview';

  const setTab = (tab: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-800">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setTab(tab.id)}
            className={cn('px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === tab.id ? 'border-blue-400 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300')}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {REPORT_TEMPLATES.map(template => (
            <ReportTemplateCard key={template.id} template={template} onGenerate={handleGenerate} onSchedule={handleSchedule} />
          ))}
        </div>
      )}
      {/* ... other tabs */}
    </div>
  );
}
```

## CSV Export

```typescript
import { exportToCSV, exportToJSON } from '@/lib/export-utils';

// CSV
exportToCSV(trafficData, 'traffic-analysis');  // → traffic-analysis-2026-04-19.csv

// JSON (structured with metadata)
exportToJSON({
  metadata: { reportId: 'rpt_1', title: 'Traffic Analysis', generatedAt: new Date().toISOString(), dateRange: { start, end }, filters: {}, version: '1.0' },
  summary: { totalRequests: 2400000, errorRate: 1.2 },
  data: trafficData,
}, 'traffic-analysis');
```

## Insight Rules

```typescript
import { runInsightRules } from '@/lib/insight-rules';

const insights = runInsightRules(
  { errorRate: 3.5, p95ResponseTime: 620, rateLimitUtilization: 85, trafficGrowth: 30 },
  mockApis,
  mockUsers
);
// Returns array of triggered Insight objects
```
