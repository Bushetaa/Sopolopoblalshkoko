# 📑 Spec 06 — Reports & Insights
## Sopo Platform | التقارير والرؤى التحليلية

> **Spec ID**: SOPO-SPEC-06  
> **Priority**: 🟡 Medium (Advanced Feature)  
> **Status**: 🔴 Not Implemented  
> **Depends On**: Spec 01 (Layout), Spec 02 (Analytics), Spec 03 (Tables), Spec 04 (Filters)  
> **Required By**: None (leaf feature, but feeds into executive dashboards)  

---

## 🎯 Overview | نظرة عامة

صفحة Reports & Insights هي قسم التقارير والتحليلات المتقدمة. تتيح للمستخدمين توليد تقارير مخصصة عن أداء APIs، تصدير البيانات بصيغ متعددة (PDF، CSV، JSON)، وجدولة تقارير دورية تُرسل عبر البريد الإلكتروني. كما تعرض Insights تلقائية مستخرجة من بيانات الأداء باستخدام منطق قواعد محدد مسبقًا.

---

## 🏗️ 1. Reports Page Architecture

### 1.1 Page Layout Structure

```
REPORTS & INSIGHTS PAGE (/analytics/reports)
├── Page Header
│   ├── Title: "Reports & Insights"
│   └── Actions: [New Report] [Schedule Report]
│
├── Tabs: [Overview] [My Reports] [Scheduled] [Insights]
│
├── Tab 1: Overview (Pre-built Reports Gallery)
│   ├── Featured Reports Grid
│   │   ├── API Performance Summary
│   │   ├── Traffic Analysis
│   │   ├── Error & Incident Report
│   │   ├── Gateway Health Check
│   │   ├── SLA Compliance Report
│   │   └── Rate Limiting Usage
│   └── Quick Export Section
│
├── Tab 2: My Reports (Custom Reports)
│   ├── Reports List (table/grid)
│   ├── Create New Report Button
│   └── Report Builder Modal
│
├── Tab 3: Scheduled Reports
│   ├── Active Schedules Table
│   ├── Create Schedule Modal
│   └── Schedule History
│
└── Tab 4: Insights (Auto-generated)
    ├── Insight Cards (anomalies, trends, recommendations)
    └── Insight Detail Drawer
```

---

## 📊 2. Pre-built Reports

### 2.1 Report Template Interface

```typescript
interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  metrics: string[];            // What metrics this report covers
  defaultDateRange: DatePreset;
  estimatedTime: string;        // "~2 min" to generate
  formats: ExportFormat[];      // Supported export formats
  preview?: string;             // Preview image URL
  isPremium?: boolean;          // Whether it requires premium plan
}

type ReportCategory = 'performance' | 'traffic' | 'errors' | 'security' | 'compliance' | 'billing';
type ExportFormat = 'pdf' | 'csv' | 'json' | 'excel' | 'png';
```

### 2.2 Pre-built Report Templates (6 templates)

```typescript
const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'rpt_api_performance',
    title: 'API Performance Summary',
    description: 'Complete overview of API response times, throughput, and SLA compliance across all endpoints.',
    category: 'performance',
    icon: Gauge,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    metrics: ['Response Time (p50, p95, p99)', 'Throughput (req/s)', 'SLA Compliance %', 'Uptime %'],
    defaultDateRange: '30d',
    estimatedTime: '~30s',
    formats: ['pdf', 'csv', 'json'],
  },
  {
    id: 'rpt_traffic_analysis',
    title: 'Traffic Analysis',
    description: 'Detailed breakdown of request patterns, peak hours, geographic distribution, and client types.',
    category: 'traffic',
    icon: Activity,
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/10',
    metrics: ['Total Requests', 'Unique Clients', 'Peak Hours', 'Request Distribution by Type'],
    defaultDateRange: '7d',
    estimatedTime: '~20s',
    formats: ['pdf', 'csv', 'excel'],
  },
  {
    id: 'rpt_error_incidents',
    title: 'Error & Incident Report',
    description: 'Comprehensive log of all 4xx and 5xx errors with root cause analysis and affected endpoints.',
    category: 'errors',
    icon: AlertTriangle,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/10',
    metrics: ['Error Rate %', 'Error Count by Type', 'Affected Endpoints', 'MTTR (Mean Time to Resolve)'],
    defaultDateRange: '7d',
    estimatedTime: '~45s',
    formats: ['pdf', 'csv', 'json'],
  },
  {
    id: 'rpt_gateway_health',
    title: 'Gateway Health Check',
    description: 'Status and performance metrics for all API Gateways including routing efficiency and rate limiting stats.',
    category: 'performance',
    icon: Server,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
    metrics: ['Gateway Uptime', 'Request Routing Efficiency', 'Rate Limit Hits', 'Authentication Failures'],
    defaultDateRange: '30d',
    estimatedTime: '~25s',
    formats: ['pdf', 'csv'],
  },
  {
    id: 'rpt_sla_compliance',
    title: 'SLA Compliance Report',
    description: 'Month-over-month SLA tracking with breach incidents, credits owed, and compliance trends.',
    category: 'compliance',
    icon: ShieldCheck,
    iconColor: 'text-teal-400',
    iconBg: 'bg-teal-500/10',
    metrics: ['Uptime SLA %', 'Response Time SLA', 'SLA Breaches Count', 'Downtime Duration'],
    defaultDateRange: '90d',
    estimatedTime: '~1 min',
    formats: ['pdf', 'excel'],
    isPremium: false,
  },
  {
    id: 'rpt_rate_limiting',
    title: 'Rate Limiting Usage',
    description: 'Analysis of rate limit policies, throttled requests by API and client, and policy recommendations.',
    category: 'security',
    icon: Zap,
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-500/10',
    metrics: ['Throttled Requests', 'Rate Limit Hits by API', 'Top Throttled Clients', 'Policy Recommendations'],
    defaultDateRange: '7d',
    estimatedTime: '~15s',
    formats: ['pdf', 'csv', 'json'],
  },
];
```

### 2.3 Report Card Component

```tsx
const ReportTemplateCard: React.FC<{
  template: ReportTemplate;
  onGenerate: (template: ReportTemplate, format: ExportFormat) => void;
  onSchedule: (template: ReportTemplate) => void;
}> = ({ template, onGenerate, onSchedule }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 
                  transition-all duration-150 group flex flex-col">
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className={cn("p-2.5 rounded-lg", template.iconBg)}>
        <template.icon className={cn("h-5 w-5", template.iconColor)} />
      </div>
      
      {template.isPremium && (
        <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 
                         px-2 py-0.5 rounded-full">
          Premium
        </span>
      )}
    </div>
    
    {/* Content */}
    <h3 className="text-sm font-semibold text-gray-50 mb-1.5 group-hover:text-white transition-colors">
      {template.title}
    </h3>
    <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">
      {template.description}
    </p>
    
    {/* Metrics tags */}
    <div className="flex flex-wrap gap-1 mb-4">
      {template.metrics.slice(0, 3).map((metric, i) => (
        <span key={i} className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded">
          {metric}
        </span>
      ))}
      {template.metrics.length > 3 && (
        <span className="text-xs text-gray-600">+{template.metrics.length - 3} more</span>
      )}
    </div>
    
    {/* Footer */}
    <div className="flex items-center justify-between pt-3 border-t border-gray-800">
      <span className="text-xs text-gray-600">
        <Clock className="h-3 w-3 inline mr-1" />
        {template.estimatedTime}
      </span>
      
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onSchedule(template)}
          className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 
                     rounded-md transition-all"
          title="Schedule report"
        >
          <CalendarClock className="h-4 w-4" />
        </button>
        
        <ExportDropdown
          formats={template.formats}
          onExport={(format) => onGenerate(template, format)}
        />
      </div>
    </div>
  </div>
);
```

---

## 📤 3. Export System

### 3.1 Export Configuration

```typescript
interface ExportConfig {
  format: ExportFormat;
  template?: ReportTemplate;
  customReport?: CustomReport;
  dateRange: DateRangeFilter;
  filters: CategoryFilters;
  columns?: string[];           // For CSV: which columns to include
  includeCharts?: boolean;      // For PDF: include visual charts
  pageOrientation?: 'portrait' | 'landscape';  // PDF only
}

interface ExportJob {
  id: string;
  status: 'queued' | 'processing' | 'complete' | 'failed';
  progress: number;             // 0-100
  config: ExportConfig;
  downloadUrl?: string;         // Available when complete
  createdAt: Date;
  completedAt?: Date;
  fileSize?: number;            // bytes
  error?: string;
}
```

### 3.2 Export Format Specifications

```typescript
// Format details and limitations
const EXPORT_FORMATS: Record<ExportFormat, FormatConfig> = {
  pdf: {
    label: 'PDF Report',
    icon: FileText,
    color: 'text-red-400',
    description: 'Formatted report with charts and visualizations',
    mimeType: 'application/pdf',
    extension: '.pdf',
    supportsCharts: true,
    maxRows: null,              // No row limit for PDF
  },
  csv: {
    label: 'CSV Data',
    icon: Table2,
    color: 'text-green-400',
    description: 'Raw data export, ideal for spreadsheets and data processing',
    mimeType: 'text/csv',
    extension: '.csv',
    supportsCharts: false,
    maxRows: 100000,
  },
  excel: {
    label: 'Excel Workbook',
    icon: FileSpreadsheet,
    color: 'text-teal-400',
    description: 'Multi-sheet Excel workbook with formatted tables',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: '.xlsx',
    supportsCharts: false,
    maxRows: 1048576,
  },
  json: {
    label: 'JSON Data',
    icon: Braces,
    color: 'text-blue-400',
    description: 'Structured JSON for programmatic processing and API integration',
    mimeType: 'application/json',
    extension: '.json',
    supportsCharts: false,
    maxRows: null,
  },
  png: {
    label: 'PNG Chart',
    icon: Image,
    color: 'text-purple-400',
    description: 'Export chart as high-resolution image',
    mimeType: 'image/png',
    extension: '.png',
    supportsCharts: true,
    maxRows: null,
  },
};
```

### 3.3 Export Dropdown Button

```tsx
const ExportDropdown: React.FC<{
  formats: ExportFormat[];
  onExport: (format: ExportFormat, options?: ExportOptions) => void;
  label?: string;
  size?: 'sm' | 'md';
}> = ({ formats, onExport, label = 'Export', size = 'md' }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className={cn(
        "flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg",
        "transition-all duration-150 font-medium",
        size === 'sm' ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"
      )}>
        <Download className={cn(size === 'sm' ? "h-3.5 w-3.5" : "h-4 w-4")} />
        {label}
        <ChevronDown className={cn(size === 'sm' ? "h-3 w-3" : "h-3.5 w-3.5", "opacity-70")} />
      </button>
    </DropdownMenuTrigger>
    
    <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700 w-48">
      <DropdownMenuLabel className="text-xs text-gray-500">Export As</DropdownMenuLabel>
      <DropdownMenuSeparator className="bg-gray-800" />
      
      {formats.map(format => {
        const config = EXPORT_FORMATS[format];
        return (
          <DropdownMenuItem
            key={format}
            onClick={() => onExport(format)}
            className="flex items-center gap-2.5 text-gray-300 focus:bg-gray-800 cursor-pointer"
          >
            <config.icon className={cn("h-4 w-4", config.color)} />
            <div>
              <div className="text-sm">{config.label}</div>
              <div className="text-xs text-gray-600">{config.description.split(',')[0]}</div>
            </div>
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuContent>
  </DropdownMenu>
);
```

### 3.4 Export Progress Modal

```tsx
// Shows when generating a report (simulated progress)
const ExportProgressModal: React.FC<{
  job: ExportJob;
  onClose: () => void;
  onDownload: (url: string) => void;
}> = ({ job, onClose, onDownload }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm w-full">
    <div className="flex items-center gap-3 mb-4">
      {job.status === 'processing' && (
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
        </div>
      )}
      {job.status === 'complete' && (
        <div className="p-2 bg-green-500/10 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-400" />
        </div>
      )}
      {job.status === 'failed' && (
        <div className="p-2 bg-red-500/10 rounded-lg">
          <XCircle className="h-5 w-5 text-red-400" />
        </div>
      )}
      
      <div>
        <h3 className="text-sm font-semibold text-gray-50">
          {job.status === 'processing' ? 'Generating Report...' :
           job.status === 'complete' ? 'Report Ready!' : 'Export Failed'}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {job.status === 'processing' ? 'This may take a moment' :
           job.status === 'complete' ? `${formatFileSize(job.fileSize!)} • Ready to download` :
           job.error ?? 'An error occurred'}
        </p>
      </div>
    </div>
    
    {/* Progress Bar */}
    {job.status === 'processing' && (
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Collecting data...</span>
          <span>{job.progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${job.progress}%` }}
          />
        </div>
      </div>
    )}
    
    {/* Actions */}
    <div className="flex gap-2">
      {job.status === 'complete' && (
        <button
          onClick={() => onDownload(job.downloadUrl!)}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 
                     text-white rounded-lg py-2 text-sm font-medium transition-colors"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      )}
      <button
        onClick={onClose}
        className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg py-2 
                   text-sm transition-colors"
      >
        {job.status === 'complete' ? 'Close' : 'Cancel'}
      </button>
    </div>
  </div>
);
```

### 3.5 CSV Export Implementation

```typescript
// Client-side CSV generation
const exportToCSV = (data: Record<string, any>[], filename: string): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
```

### 3.6 JSON Export Implementation

```typescript
const exportToJSON = (data: any, filename: string): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// JSON export structure
interface JSONExportStructure {
  metadata: {
    reportId: string;
    title: string;
    generatedAt: string;    // ISO timestamp
    dateRange: { start: string; end: string };
    filters: Record<string, any>;
    version: '1.0';
  };
  summary: Record<string, number | string>;
  data: Record<string, any>[];
  charts?: {
    type: string;
    title: string;
    data: any[];
  }[];
}
```

---

## 🗓️ 4. Scheduled Reports

### 4.1 Schedule Interface

```typescript
interface ScheduledReport {
  id: string;
  name: string;                 // "Weekly Performance Summary"
  templateId: string;           // Which report template
  format: ExportFormat;
  
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number;         // 0-6 (for weekly: 0=Sunday)
    dayOfMonth?: number;        // 1-31 (for monthly)
    time: string;               // "09:00" (HH:mm)
    timezone: string;           // "America/New_York"
  };
  
  delivery: {
    method: 'email' | 'webhook' | 'both';
    emails?: string[];          // Recipients
    webhookUrl?: string;
  };
  
  dateRange: 'last_day' | 'last_week' | 'last_month' | 'last_quarter';
  filters?: CategoryFilters;
  
  isActive: boolean;
  lastRunAt?: Date;
  nextRunAt: Date;
  runCount: number;
  createdBy: string;            // User ID
  createdAt: Date;
}
```

### 4.2 Schedule Table Columns

```typescript
const SCHEDULE_COLUMNS: ColumnDef<ScheduledReport>[] = [
  {
    key: 'name',
    header: 'Report Name',
    render: (_, row) => (
      <div>
        <span className="text-sm font-medium text-gray-50">{row.name}</span>
        <span className="block text-xs text-gray-500 mt-0.5">
          {REPORT_TEMPLATES.find(t => t.id === row.templateId)?.title}
        </span>
      </div>
    )
  },
  {
    key: 'schedule',
    header: 'Frequency',
    render: (_, row) => (
      <span className="text-sm text-gray-300">
        {formatSchedule(row.schedule)}
      </span>
    )
  },
  {
    key: 'delivery',
    header: 'Delivery',
    render: (_, row) => (
      <div className="flex items-center gap-1.5">
        {row.delivery.method === 'email' || row.delivery.method === 'both'
          ? <Mail className="h-3.5 w-3.5 text-gray-500" />
          : null}
        {row.delivery.method === 'webhook' || row.delivery.method === 'both'
          ? <Webhook className="h-3.5 w-3.5 text-gray-500" />
          : null}
        <span className="text-xs text-gray-400">
          {row.delivery.emails?.length ?? 0} recipients
        </span>
      </div>
    )
  },
  {
    key: 'nextRunAt',
    header: 'Next Run',
    sortable: true,
    render: (value) => <span className="text-sm text-gray-300">{formatDateTime(value)}</span>
  },
  {
    key: 'isActive',
    header: 'Status',
    render: (value, row) => (
      <div className="flex items-center gap-2">
        <Switch checked={value} onCheckedChange={(v) => toggleSchedule(row.id, v)} />
        <span className={cn("text-xs", value ? "text-green-400" : "text-gray-500")}>
          {value ? 'Active' : 'Paused'}
        </span>
      </div>
    )
  },
];
```

### 4.3 Create Schedule Modal

```
CREATE SCHEDULE MODAL
├── Report Selection
│   └── Dropdown to select from pre-built templates
│
├── Schedule Name* (input)
│
├── Frequency Settings
│   ├── [Daily] [Weekly] [Monthly] toggle
│   ├── Day of week (if weekly)
│   ├── Day of month (if monthly)
│   └── Time (time picker) + Timezone
│
├── Date Range for Report
│   └── [Last Day] [Last Week] [Last Month] [Last Quarter]
│
├── Delivery Settings
│   ├── Format: [PDF] [CSV] [Excel] [JSON]
│   ├── Email Recipients (tag input)
│   └── Webhook URL (optional)
│
└── Actions
    ├── [Cancel]
    └── [Create Schedule]
```

---

## 💡 5. Auto-Generated Insights

### 5.1 Insight Interface

```typescript
interface Insight {
  id: string;
  type: InsightType;
  severity: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  summary: string;              // One-line summary
  detail: string;               // Full explanation
  metric?: {
    name: string;
    currentValue: number | string;
    previousValue?: number | string;
    unit?: string;
    change?: number;            // Percentage change
  };
  affectedEntities?: {
    type: 'api' | 'gateway' | 'endpoint';
    id: string;
    name: string;
  }[];
  recommendation?: string;      // Actionable recommendation
  actionLabel?: string;         // "View API" | "Configure Rate Limit"
  actionPath?: string;          // Navigation path
  generatedAt: Date;
  expiresAt?: Date;
  isDismissed: boolean;
}

type InsightType =
  | 'anomaly'           // Unusual traffic pattern
  | 'degradation'       // Performance degrading
  | 'improvement'       // Metric improved
  | 'threshold'         // Approaching limit
  | 'recommendation'    // Best practice suggestion
  | 'security'          // Security-related finding
  | 'cost';             // Cost optimization
```

### 5.2 Insight Generation Rules

```typescript
// These rules run against the mock data to generate insights
const INSIGHT_RULES: InsightRule[] = [
  {
    id: 'high-error-rate',
    name: 'High Error Rate Detected',
    check: (metrics) => metrics.errorRate > 2,
    generate: (metrics) => ({
      type: 'anomaly',
      severity: 'critical',
      title: 'High Error Rate Detected',
      summary: `Error rate is ${metrics.errorRate.toFixed(1)}% — above 2% threshold`,
      detail: `Your platform is experiencing an elevated error rate of ${metrics.errorRate.toFixed(1)}%, which exceeds the recommended threshold of 2%. This may indicate backend issues or misconfigured APIs.`,
      metric: {
        name: 'Error Rate',
        currentValue: metrics.errorRate,
        unit: '%',
        change: metrics.errorRateChange,
      },
      recommendation: 'Check your server logs and recent deployments. Consider enabling circuit breakers on affected gateways.',
      actionLabel: 'View Error Logs',
      actionPath: '/analytics/errors',
    })
  },
  
  {
    id: 'response-time-spike',
    name: 'Response Time Spike',
    check: (metrics) => metrics.p95ResponseTime > 500,
    generate: (metrics) => ({
      type: 'degradation',
      severity: 'warning',
      title: 'Response Time Degradation',
      summary: `P95 response time is ${metrics.p95ResponseTime}ms — above 500ms SLA`,
      detail: `The 95th percentile response time has risen to ${metrics.p95ResponseTime}ms, exceeding your SLA target of 500ms. This affects approximately 5% of all requests.`,
      recommendation: 'Consider implementing caching layers or scaling your backend services.',
      actionLabel: 'View Performance',
      actionPath: '/analytics/performance',
    })
  },
  
  {
    id: 'rate-limit-approaching',
    name: 'Rate Limit Threshold',
    check: (metrics) => metrics.rateLimitUtilization > 80,
    generate: (metrics) => ({
      type: 'threshold',
      severity: 'warning',
      title: 'Approaching Rate Limit',
      summary: `Rate limiting at ${metrics.rateLimitUtilization}% of configured limit`,
      recommendation: 'Consider increasing rate limits or implementing request queuing.',
    })
  },
  
  {
    id: 'traffic-growth',
    name: 'Significant Traffic Growth',
    check: (metrics) => metrics.trafficGrowth > 25,
    generate: (metrics) => ({
      type: 'improvement',
      severity: 'info',
      title: 'Traffic Growth Detected',
      summary: `Traffic increased by ${metrics.trafficGrowth}% compared to last period`,
      recommendation: 'Monitor your infrastructure capacity to ensure it can handle continued growth.',
    })
  },
  
  {
    id: 'deprecated-api-traffic',
    name: 'Deprecated API Still Receiving Traffic',
    check: (apis) => apis.some(a => a.status === 'deprecated' && a.requestsToday > 0),
    generate: (apis) => ({
      type: 'recommendation',
      severity: 'warning',
      title: 'Deprecated APIs Receiving Traffic',
      summary: `${apis.filter(a => a.status === 'deprecated').length} deprecated API(s) still active`,
      recommendation: 'Notify API consumers to migrate to newer versions before sunset date.',
    })
  },
  
  {
    id: 'mfa-security',
    name: 'Low MFA Adoption',
    check: (users) => (users.filter(u => u.mfaEnabled).length / users.length) < 0.6,
    generate: (users) => ({
      type: 'security',
      severity: 'warning',
      title: 'Low MFA Adoption',
      summary: 'Less than 60% of team members have MFA enabled',
      recommendation: 'Enable "Require MFA" in Security settings to enforce two-factor authentication for all users.',
      actionLabel: 'Security Settings',
      actionPath: '/settings/security',
    })
  },
];
```

### 5.3 Insight Card Component

```tsx
const InsightCard: React.FC<{
  insight: Insight;
  onDismiss: (id: string) => void;
  onAction?: (insight: Insight) => void;
}> = ({ insight, onDismiss, onAction }) => {
  const severityConfig = {
    critical: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'text-red-400', badge: 'bg-red-500' },
    warning:  { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: 'text-yellow-400', badge: 'bg-yellow-500' },
    info:     { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400', badge: 'bg-blue-500' },
    success:  { bg: 'bg-green-500/10', border: 'border-green-500/20', icon: 'text-green-400', badge: 'bg-green-500' },
  };
  
  const typeIcons = {
    anomaly:        AlertTriangle,
    degradation:    TrendingDown,
    improvement:    TrendingUp,
    threshold:      Gauge,
    recommendation: Lightbulb,
    security:       ShieldAlert,
    cost:           DollarSign,
  };
  
  const TypeIcon = typeIcons[insight.type];
  const styles = severityConfig[insight.severity];
  
  return (
    <div className={cn(
      "relative bg-gray-900 border rounded-xl p-4 transition-all",
      styles.border,
    )}>
      {/* Severity indicator bar */}
      <div className={cn("absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full", styles.badge)} />
      
      <div className="pl-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className={cn("p-1.5 rounded-lg", styles.bg)}>
              <TypeIcon className={cn("h-3.5 w-3.5", styles.icon)} />
            </div>
            <h4 className="text-sm font-semibold text-gray-50">{insight.title}</h4>
          </div>
          
          <button
            onClick={() => onDismiss(insight.id)}
            className="text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0 mt-0.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Summary */}
        <p className="text-xs text-gray-400 mb-2 leading-relaxed">{insight.summary}</p>
        
        {/* Metric delta */}
        {insight.metric && insight.metric.change !== undefined && (
          <div className="flex items-center gap-1.5 mb-2">
            {insight.metric.change > 0
              ? <TrendingUp className="h-3.5 w-3.5 text-red-400" />
              : <TrendingDown className="h-3.5 w-3.5 text-green-400" />
            }
            <span className={cn(
              "text-xs font-medium",
              insight.metric.change > 0 ? "text-red-400" : "text-green-400"
            )}>
              {Math.abs(insight.metric.change)}% {insight.metric.change > 0 ? 'increase' : 'decrease'}
            </span>
          </div>
        )}
        
        {/* Recommendation */}
        {insight.recommendation && (
          <div className="bg-gray-800/50 rounded-lg px-3 py-2 mb-3">
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="text-gray-300 font-medium">Recommendation: </span>
              {insight.recommendation}
            </p>
          </div>
        )}
        
        {/* Action button */}
        {insight.actionLabel && (
          <button
            onClick={() => onAction?.(insight)}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
          >
            {insight.actionLabel}
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
      
      {/* Timestamp */}
      <span className="absolute bottom-3 right-4 text-xs text-gray-700">
        {formatRelativeTime(insight.generatedAt)}
      </span>
    </div>
  );
};
```

---

## 📊 6. Summaries Section

### 6.1 Quick Summary Cards

```typescript
interface SummaryData {
  totalReports: number;             // Total reports generated
  reportsThisMonth: number;         // Reports generated this month
  totalExports: number;             // Total export operations
  scheduledActive: number;          // Active scheduled reports
  lastExportAt: Date | null;        // Last export timestamp
  mostExportedFormat: ExportFormat; // Most used format
  insightsCount: number;            // Active (non-dismissed) insights
  criticalInsights: number;         // Critical severity insights
}
```

### 6.2 Summary Display

```tsx
// Summary stats row above reports gallery
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  <SummaryCard
    title="Reports Generated"
    value={summary.totalReports}
    subtitle="All time"
    icon={FileBarChart}
    iconColor="text-blue-400"
    iconBg="bg-blue-500/10"
  />
  <SummaryCard
    title="Total Exports"
    value={summary.totalExports}
    subtitle="All formats"
    icon={Download}
    iconColor="text-green-400"
    iconBg="bg-green-500/10"
  />
  <SummaryCard
    title="Scheduled Reports"
    value={summary.scheduledActive}
    subtitle="Active schedules"
    icon={CalendarClock}
    iconColor="text-purple-400"
    iconBg="bg-purple-500/10"
  />
  <SummaryCard
    title="Active Insights"
    value={summary.insightsCount}
    subtitle={`${summary.criticalInsights} critical`}
    icon={Lightbulb}
    iconColor="text-yellow-400"
    iconBg="bg-yellow-500/10"
    alert={summary.criticalInsights > 0}
  />
</div>
```

---

## 🎨 7. Design Specifications

### 7.1 Reports Page Color Coding

```css
/* Insight severity colors */
--insight-critical: #F87171;      /* Red */
--insight-warning: #FBBF24;       /* Yellow */
--insight-info: #60A5FA;          /* Blue */
--insight-success: #4ADE80;       /* Green */

/* Insight type indicators */
--type-anomaly: #F87171;
--type-degradation: #FB923C;
--type-improvement: #4ADE80;
--type-threshold: #FBBF24;
--type-recommendation: #A855F7;
--type-security: #F43F5E;
--type-cost: #10B981;
```

### 7.2 Report Generation Progress States

```
State 1: Idle → "Generate" button available
State 2: Queued → Spinner, "Preparing..."
State 3: Processing → Progress bar with percentage + status text
State 4: Complete → Green check, download button + file size
State 5: Failed → Red X, error message + retry button
```

---

## 🧪 8. Acceptance Criteria

### 8.1 Pre-built Reports ✅
- [ ] 6 report template cards render in grid (2 cols mobile, 3 cols desktop)
- [ ] Each card shows title, description, metrics tags, and estimated time
- [ ] Export dropdown shows correct format options per template
- [ ] Progress modal shows during simulated generation (2-5 seconds)
- [ ] Download triggers after completion
- [ ] Schedule button opens schedule modal

### 8.2 Export System ✅
- [ ] CSV export generates correctly formatted file
- [ ] JSON export generates valid JSON with metadata
- [ ] File downloads automatically on completion
- [ ] Filename includes report name and date
- [ ] Export handles empty data gracefully

### 8.3 Scheduled Reports ✅
- [ ] Schedule table shows active schedules
- [ ] Toggle switch pauses/resumes schedule
- [ ] Create schedule modal validates required fields
- [ ] "Next Run" shows correct datetime based on frequency
- [ ] Delete schedule shows confirmation dialog

### 8.4 Insights ✅
- [ ] 3-6 insights generate on page load from mock data
- [ ] Each insight shows severity indicator bar
- [ ] Dismiss button removes insight from view
- [ ] Action button navigates to relevant page
- [ ] Critical insights shown first (by severity)
- [ ] Empty state shows when all insights dismissed
- [ ] Insights filter by type works

---

## 📁 9. Files to Create / Modify

| File Path                                              | Action | Notes                                   |
|--------------------------------------------------------|--------|-----------------------------------------|
| `src/app/pages/Reports.tsx`                            | Create | Main reports page with tabs             |
| `src/app/components/reports/ReportTemplateCard.tsx`    | Create | Pre-built report card                   |
| `src/app/components/reports/ExportDropdown.tsx`        | Create | Format selection dropdown               |
| `src/app/components/reports/ExportProgressModal.tsx`   | Create | Generation progress modal               |
| `src/app/components/reports/ScheduledReportsTable.tsx` | Create | Scheduled reports management table      |
| `src/app/components/reports/CreateScheduleModal.tsx`   | Create | Schedule creation form modal            |
| `src/app/components/reports/InsightCard.tsx`           | Create | Auto-generated insight card             |
| `src/app/components/reports/InsightsFeed.tsx`          | Create | List of insight cards with filters      |
| `src/app/components/reports/SummaryCards.tsx`          | Create | Quick summary stats row                 |
| `src/app/utils/export.ts`                              | Create | CSV/JSON export utility functions       |
| `src/app/utils/insights.ts`                            | Create | Insight generation rules and logic      |
| `src/app/hooks/useInsights.ts`                         | Create | Insights state management hook          |
| `src/app/pages/Analytics.tsx`                          | Modify | Add Reports tab pointing to Reports page|

---

## 🔗 10. Dependencies on Other Specs

| Spec                  | Dependency Type | Notes                                      |
|-----------------------|-----------------|--------------------------------------------|
| Spec 01 — Layout      | Hard            | Reports page uses standard layout          |
| Spec 02 — Analytics   | Hard            | Report data comes from analytics data      |
| Spec 03 — Tables      | Hard            | Scheduled reports use DataTable            |
| Spec 04 — Filters     | Soft            | Date range picker used for report config   |

---

*Spec Version: 1.0.0 | Last Updated: April 2026 | Owner: Sopo Platform Team*
