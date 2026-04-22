# Component API Contracts: Reports & Insights

## ReportTemplateCard

```typescript
interface ReportTemplateCardProps {
  template: ReportTemplate;
  onGenerate: (template: ReportTemplate, format: ExportFormat) => void;
  onSchedule: (template: ReportTemplate) => void;
}
// Renders: icon + title + desc + ≤3 metric tags + overflow + time + ExportDropdown + Schedule btn
```

## ExportDropdown

```typescript
interface ExportDropdownProps {
  formats: ExportFormat[];
  onExport: (format: ExportFormat) => void;
  label?: string;   // Default: 'Export'
  size?: 'sm' | 'md';
}
// Excel → toast("coming soon"); PDF → opens progress modal only (no real download)
```

## ExportProgressModal

```typescript
interface ExportProgressModalProps {
  job: ExportJob;
  onClose: () => void;
  onDownload: (url: string) => void;
}
// States: processing (spinner + bar) | complete (green ✓ + Download btn) | failed (red ✗ + error)
// Progress simulated via setInterval: +[3-8]% every 150ms
```

## InsightCard

```typescript
interface InsightCardProps {
  insight: Insight;
  onDismiss: (id: string) => void;
}
// Left border color by severity; metric display if present; dismiss button; action link button
```

## ScheduleReportModal

```typescript
interface ScheduleReportModalProps {
  onClose: () => void;
  onCreated: (schedule: ScheduledReport) => void;
  initialTemplate?: ReportTemplate;
}
```

## ReportBuilderModal

```typescript
interface ReportBuilderModalProps {
  onClose: () => void;
  onGenerated: (report: CustomReport) => void;
}
// 3 steps: type → date range → metrics; Generate triggers ExportProgressModal
```

## Export Utilities

```typescript
// lib/export-utils.ts
function exportToCSV(data: Record<string, any>[], filename: string): void
// Creates .csv Blob, downloads timestamped file

function exportToJSON(data: JSONExportStructure, filename: string): void
// Creates .json Blob, downloads timestamped file
```

## Insight Rules

```typescript
// lib/insight-rules.ts
interface InsightRule {
  id: string;
  name: string;
  check: (metrics: any, apis?: any[], users?: any[]) => boolean;
  generate: (metrics: any, apis?: any[], users?: any[]) => Omit<Insight, 'id' | 'generatedAt' | 'isDismissed'>;
}

function runInsightRules(
  metrics: { errorRate: number; p95ResponseTime: number; rateLimitUtilization: number; trafficGrowth: number },
  apis: any[],
  users: any[]
): Insight[]
```
