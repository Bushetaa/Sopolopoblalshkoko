import { 
  BarChart3, 
  Activity, 
  AlertCircle, 
  ShieldCheck, 
  FileCheck, 
  Clock, 
  FileJson, 
  FileSpreadsheet, 
  FileText,
  FileCode,
  LucideIcon
} from 'lucide-react';

export type ExportFormat = 'pdf' | 'csv' | 'json' | 'excel';

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Performance' | 'Traffic' | 'Security' | 'Compliance';
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  metrics: string[];
  defaultDateRange: string;
  estimatedTime: string;
  formats: ExportFormat[];
  isPremium?: boolean;
}

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'api-performance',
    title: 'API Performance Summary',
    description: 'Detailed analysis of response times, latency percentiles, and throughput across all endpoints.',
    category: 'Performance',
    icon: Activity,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    metrics: ['Latency (P99)', 'Avg Response Time', 'Throughput', 'Cache Hit Rate', 'Error Rate'],
    defaultDateRange: 'Last 7 Days',
    estimatedTime: '2-4 mins',
    formats: ['pdf', 'csv', 'json', 'excel'],
    isPremium: false,
  },
  {
    id: 'traffic-analysis',
    title: 'Traffic & Usage Analysis',
    description: 'Geographic distribution, top consumers, and peak usage periods for your API ecosystem.',
    category: 'Traffic',
    icon: BarChart3,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/10',
    metrics: ['Total Requests', 'Unique Consumers', 'Geo Distribution', 'Top Endpoints'],
    defaultDateRange: 'Last 30 Days',
    estimatedTime: '3-5 mins',
    formats: ['pdf', 'csv', 'json', 'excel'],
    isPremium: false,
  },
  {
    id: 'error-incident',
    title: 'Error & Incident Report',
    description: 'Breakdown of 4xx and 5xx errors, stack traces distribution, and incident response times.',
    category: 'Performance',
    icon: AlertCircle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-500/10',
    metrics: ['Error Count', 'Success Rate', 'Mean Time to Recovery', 'Top Error Codes'],
    defaultDateRange: 'Last 24 Hours',
    estimatedTime: '1-2 mins',
    formats: ['pdf', 'csv', 'json'],
    isPremium: false,
  },
  {
    id: 'gateway-health',
    title: 'Gateway Infrastructure Health',
    description: 'Resource utilization, node health, and infrastructure costs across all regions.',
    category: 'Performance',
    icon: ShieldCheck,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-500/10',
    metrics: ['CPU Usage', 'Memory Load', 'Node Availability', 'Infrastructure Cost'],
    defaultDateRange: 'Last 7 Days',
    estimatedTime: '2-3 mins',
    formats: ['pdf', 'csv', 'json'],
    isPremium: true,
  },
  {
    id: 'sla-compliance',
    title: 'SLA & Compliance Audit',
    description: 'Verification of uptime SLAs and compliance with security policies across environments.',
    category: 'Compliance',
    icon: FileCheck,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    metrics: ['Uptime %', 'SLA Breaches', 'Policy Violations', 'Audit Score'],
    defaultDateRange: 'Last Quarter',
    estimatedTime: '5-8 mins',
    formats: ['pdf', 'excel'],
    isPremium: true,
  },
  {
    id: 'rate-limiting',
    title: 'Rate Limiting & Quota Usage',
    description: 'Analysis of throttled requests and consumer quota consumption trends.',
    category: 'Traffic',
    icon: Clock,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-500/10',
    metrics: ['Throttled Requests', 'Quota Usage %', 'Top Throttled Consumers'],
    defaultDateRange: 'Last 7 Days',
    estimatedTime: '2-3 mins',
    formats: ['pdf', 'csv', 'json'],
    isPremium: false,
  },
];

export interface ScheduledReport {
  id: string;
  name: string;
  templateId: string;
  format: ExportFormat;
  frequency: 'daily' | 'weekly' | 'monthly';
  deliveryEmails: string[];
  nextRunAt: string;
  isActive: boolean;
  runCount: number;
}

export interface CustomReport {
  id: string;
  name: string;
  type: string;
  dateRange: string;
  granularity: string;
  metrics: string[];
  createdAt: string;
  status: 'processing' | 'generated' | 'failed';
  fileSize: string;
  format: ExportFormat;
}

export const MOCK_SCHEDULES: ScheduledReport[] = [
  {
    id: 'sch-1',
    name: 'Weekly Performance Audit',
    templateId: 'api-performance',
    format: 'pdf',
    frequency: 'weekly',
    deliveryEmails: ['admin@sopo.io', 'ops@sopo.io'],
    nextRunAt: '2026-04-27T09:00:00Z',
    isActive: true,
    runCount: 12,
  },
  {
    id: 'sch-2',
    name: 'Daily Error Summary',
    templateId: 'error-incident',
    format: 'csv',
    frequency: 'daily',
    deliveryEmails: ['dev-team@sopo.io'],
    nextRunAt: '2026-04-26T00:00:00Z',
    isActive: false,
    runCount: 45,
  },
];

export const EXPORT_FORMAT_INFO = {
  pdf: { label: 'PDF Document', icon: FileText, description: 'Best for presentations and offline reading' },
  csv: { label: 'CSV Spreadsheet', icon: FileSpreadsheet, description: 'Raw data for Excel or Google Sheets' },
  json: { label: 'JSON Data', icon: FileJson, description: 'Machine-readable structured data' },
  excel: { label: 'Excel (XLSX)', icon: FileSpreadsheet, description: 'Rich spreadsheet with charts and formatting' },
};
