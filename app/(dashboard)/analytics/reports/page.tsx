'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  FileText, 
  Plus, 
  History, 
  Calendar, 
  Lightbulb, 
  LayoutGrid,
  Search,
  Download,
  ShieldCheck,
  Play,
  Settings2,
  Trash2,
  Mail,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  REPORT_TEMPLATES, 
  MOCK_SCHEDULES, 
  ScheduledReport,
  ReportTemplate,
  CustomReport
} from '@/lib/reports-mock';
import { runInsightRules, Insight } from '@/lib/insight-rules';
import { 
  ReportTemplateCard, 
  InsightCard, 
  ScheduleReportModal,
  ReportBuilderModal,
  ExportProgressModal
} from '@/components/reports';
import { DataTable } from '@/components/data-table';
import { ColumnDef, RowAction } from '@/lib/table-utils';
import { toast } from 'sonner';

export default function ReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  
  // State
  const [insights, setInsights] = useState<Insight[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<ScheduledReport[]>(MOCK_SCHEDULES);
  const [myReports, setMyReports] = useState<CustomReport[]>([]);
  
  // Modal states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);
  const [selectedTemplateForSchedule, setSelectedTemplateForSchedule] = useState<string | undefined>();
  const [selectedReportForExport, setSelectedReportForExport] = useState<{template: ReportTemplate, format: any} | null>(null);
  const [pendingCustomReport, setPendingCustomReport] = useState<CustomReport | null>(null);

  useEffect(() => {
    const results = runInsightRules({});
    setInsights(results);
  }, []);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.push(`/analytics/reports?${params.toString()}`);
  };

  const handleDismissInsight = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
  };

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
    const schedule = schedules.find(s => s.id === id);
    if (schedule) {
      toast.info(`Schedule ${schedule.isActive ? 'paused' : 'resumed'}`);
    }
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast.success('Schedule deleted');
  };

  const handleRunScheduleNow = (schedule: ScheduledReport) => {
    const template = REPORT_TEMPLATES.find(t => t.id === schedule.templateId);
    if (template) {
      setSelectedReportForExport({ template, format: schedule.format });
    }
  };

  const visibleInsights = insights.filter(i => !dismissedIds.includes(i.id));

  // Columns for Schedules Table
  const scheduleColumns: ColumnDef<ScheduledReport>[] = [
    {
      key: 'name',
      header: 'Schedule Name',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-medium">{val}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {REPORT_TEMPLATES.find(t => t.id === row.templateId)?.title || 'Template'}
          </span>
        </div>
      )
    },
    {
      key: 'frequency',
      header: 'Frequency',
      render: (val) => <span className="capitalize">{val}</span>
    },
    {
      key: 'deliveryEmails',
      header: 'Delivery',
      render: (val: string[]) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          <span className="text-xs">{val.length} recipients</span>
        </div>
      )
    },
    {
      key: 'nextRunAt',
      header: 'Next Run',
      render: (val) => <span className="text-xs font-mono">{new Date(val).toLocaleDateString()}</span>
    },
    {
      key: 'isActive',
      header: 'Active',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <Switch 
            checked={val} 
            onCheckedChange={() => toggleSchedule(row.id)}
          />
          <span className={`text-[10px] font-bold uppercase ${val ? 'text-green-500' : 'text-muted-foreground'}`}>
            {val ? 'Active' : 'Paused'}
          </span>
        </div>
      )
    }
  ];

  const scheduleActions: RowAction<ScheduledReport>[] = [
    {
      label: 'Run Now',
      icon: Play,
      onClick: (row) => handleRunScheduleNow(row)
    },
    {
      label: 'Edit Schedule',
      icon: Settings2,
      onClick: (row) => toast.info('Edit schedule coming soon')
    },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'destructive',
      onClick: (row) => handleDeleteSchedule(row.id)
    }
  ];

  // Columns for My Reports Table
  const myReportsColumns: ColumnDef<CustomReport>[] = [
    {
      key: 'name',
      header: 'Report Name',
      render: (val) => <span className="font-medium">{val}</span>
    },
    {
      key: 'dateRange',
      header: 'Range',
      render: (val) => <span className="text-xs uppercase text-muted-foreground">{val}</span>
    },
    {
      key: 'createdAt',
      header: 'Generated',
      render: (val) => <span className="text-xs">{new Date(val).toLocaleDateString()}</span>
    },
    {
      key: 'fileSize',
      header: 'Size',
      render: (val) => <span className="text-xs text-muted-foreground">{val}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => (
        <div className={`flex items-center gap-1.5 ${val === 'generated' ? 'text-green-500' : val === 'failed' ? 'text-red-500' : 'text-blue-500'}`}>
          {val === 'generated' ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : val === 'failed' ? (
            <Trash2 className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5 animate-pulse" />
          )}
          <span className="text-[10px] font-bold uppercase">
            {val === 'generated' ? 'Ready' : val === 'failed' ? 'Failed' : 'Processing'}
          </span>
        </div>
      )
    }
  ];

  const myReportsActions: RowAction<CustomReport>[] = [
    {
      label: 'Download',
      icon: Download,
      onClick: (row) => toast.success(`Downloading ${row.name}...`)
    },
    {
      label: 'View Online',
      icon: ExternalLink,
      onClick: (row) => toast.info('Online viewer coming soon')
    },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'destructive',
      onClick: (row) => setMyReports(prev => prev.filter(r => r.id !== row.id))
    }
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Insights</h1>
          <p className="text-muted-foreground">
            Generate, schedule, and analyze reports across your API ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'scheduled' && (
            <Button className="gap-2" onClick={() => setIsScheduleModalOpen(true)}>
              <Calendar className="h-4 w-4" />
              Schedule Report
            </Button>
          )}
          {activeTab === 'my-reports' && (
            <Button className="gap-2" onClick={() => setIsBuilderModalOpen(true)}>
              <Plus className="h-4 w-4" />
              New Custom Report
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex items-center justify-between border-b border-border/40 pb-px mb-6">
          <TabsList className="bg-transparent h-auto p-0 gap-6 rounded-none border-b-0">
            <TabsTrigger 
              value="overview" 
              className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="my-reports" 
              className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium"
            >
              <History className="h-4 w-4 mr-2" />
              My Reports
            </TabsTrigger>
            <TabsTrigger 
              value="scheduled" 
              className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Scheduled
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Insights
              {visibleInsights.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  {visibleInsights.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {activeTab === 'overview' && (
            <div className="relative w-full max-w-sm hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="pl-9 bg-background/50"
              />
            </div>
          )}
        </div>

        <TabsContent value="overview" className="mt-0 border-0 p-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {REPORT_TEMPLATES.map((template) => (
              <ReportTemplateCard 
                key={template.id} 
                template={template} 
                onSchedule={(t) => {
                  setSelectedTemplateForSchedule(t.id);
                  setIsScheduleModalOpen(true);
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-reports" className="mt-0 border-0 p-0 outline-none">
          {myReports.length > 0 ? (
            <DataTable 
              data={myReports} 
              columns={myReportsColumns}
              rowActions={myReportsActions}
              searchPlaceholder="Search custom reports..."
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-card/30 border border-dashed border-border rounded-xl">
              <div className="p-4 rounded-full bg-secondary/30 mb-4">
                <History className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No custom reports yet</h3>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                Create a custom report to combine metrics, filters, and date ranges tailored to your specific needs.
              </p>
              <Button className="gap-2" onClick={() => setIsBuilderModalOpen(true)}>
                <Plus className="h-4 w-4" />
                Create your first report
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="mt-0 border-0 p-0 outline-none">
          <DataTable 
            data={schedules} 
            columns={scheduleColumns}
            rowActions={scheduleActions}
            searchPlaceholder="Search schedules..."
          />
        </TabsContent>

        <TabsContent value="insights" className="mt-0 border-0 p-0 outline-none">
          <div className="grid grid-cols-1 gap-6">
            {visibleInsights.length > 0 ? (
              visibleInsights.map((insight) => (
                <InsightCard 
                  key={insight.id} 
                  insight={insight} 
                  onDismiss={handleDismissInsight} 
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-card/30 border border-dashed border-border rounded-xl">
                <div className="p-4 rounded-full bg-green-500/10 mb-4">
                  <ShieldCheck className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-medium mb-1">All systems healthy</h3>
                <p className="text-sm text-muted-foreground text-center">
                  No automated insights or anomalies detected at this time.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ScheduleReportModal 
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedTemplateForSchedule(undefined);
        }}
        onScheduleCreated={(newSchedule) => setSchedules(prev => [newSchedule, ...prev])}
        initialTemplateId={selectedTemplateForSchedule}
      />

      <ReportBuilderModal 
        isOpen={isBuilderModalOpen}
        onClose={() => setIsBuilderModalOpen(false)}
        onReportCreated={(newReport) => setPendingCustomReport(newReport)}
      />

      {(selectedReportForExport || pendingCustomReport) && (
        <ExportProgressModal 
          isOpen={!!selectedReportForExport || !!pendingCustomReport}
          onClose={() => {
            setSelectedReportForExport(null);
            setPendingCustomReport(null);
          }}
          template={selectedReportForExport?.template}
          title={pendingCustomReport?.name}
          subtitle={pendingCustomReport ? `${pendingCustomReport.name} • PDF Format` : undefined}
          format={selectedReportForExport?.format || 'pdf'}
          onComplete={(size) => {
            if (pendingCustomReport) {
              setMyReports(prev => [{
                ...pendingCustomReport, 
                fileSize: size,
                status: 'generated'
              }, ...prev]);
              toast.success('Custom report generated successfully');
            }
          }}
        />
      )}
    </div>
  );
}
