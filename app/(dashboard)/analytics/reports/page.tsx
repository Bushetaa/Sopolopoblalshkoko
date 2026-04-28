'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
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

function ReportsContent() {
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
            <History className="h-3.5 w-3.5" />
          )}
          <span className="text-xs capitalize">{val}</span>
        </div>
      )
    }
  ];

  const myReportsActions: RowAction<CustomReport>[] = [
    {
      label: 'Download',
      icon: Download,
      onClick: (row) => toast.success('Starting download...')
    },
    {
      label: 'View Online',
      icon: ExternalLink,
      onClick: (row) => toast.info('Opening report viewer...')
    },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'destructive',
      onClick: (row) => setMyReports(prev => prev.filter(r => r.id !== row.id))
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Insights</h1>
          <p className="text-muted-foreground">
            Generate, schedule, and analyze your API performance reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <History className="h-4 w-4" />
            Export History
          </Button>
          <Button size="sm" className="h-9 gap-2" onClick={() => setIsBuilderModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Custom Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="bg-muted/50 p-1 border h-11">
          <TabsTrigger value="overview" className="gap-2 px-4">
            <LayoutGrid className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="schedules" className="gap-2 px-4">
            <Calendar className="h-4 w-4" />
            Schedules
          </TabsTrigger>
          <TabsTrigger value="my-reports" className="gap-2 px-4">
            <FileText className="h-4 w-4" />
            Generated Reports
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2 px-4">
            <Lightbulb className="h-4 w-4" />
            AI Insights
            {visibleInsights.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {visibleInsights.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tabs Content - Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REPORT_TEMPLATES.map(template => (
              <ReportTemplateCard 
                key={template.id}
                template={template}
                onSchedule={() => {
                  setSelectedTemplateForSchedule(template.id);
                  setIsScheduleModalOpen(true);
                }}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Key Insights
                </h3>
                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
              </div>
              <div className="space-y-4">
                {visibleInsights.slice(0, 3).map(insight => (
                  <InsightCard 
                    key={insight.id}
                    insight={insight}
                    onDismiss={handleDismissInsight}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Upcoming Schedules
                </h3>
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleTabChange('schedules')}>
                  Manage
                </Button>
              </div>
              <div className="border rounded-xl bg-card/50 overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Next 48 Hours
                  </p>
                </div>
                <div className="divide-y">
                  {schedules.filter(s => s.isActive).slice(0, 3).map(schedule => (
                    <div key={schedule.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{schedule.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">
                            {schedule.frequency} • Next: {new Date(schedule.nextRunAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tabs Content - Schedules */}
        <TabsContent value="schedules">
          <DataTable 
            data={schedules}
            columns={scheduleColumns}
            rowActions={scheduleActions}
            searchPlaceholder="Search schedules..."
          />
        </TabsContent>

        {/* Tabs Content - My Reports */}
        <TabsContent value="my-reports">
          <DataTable 
            data={myReports}
            columns={myReportsColumns}
            rowActions={myReportsActions}
            searchPlaceholder="Search generated reports..."
          />
        </TabsContent>

        {/* Tabs Content - Insights */}
        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleInsights.map(insight => (
              <InsightCard 
                key={insight.id}
                insight={insight}
                onDismiss={handleDismissInsight}
              />
            ))}
            {visibleInsights.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border rounded-xl border-dashed bg-muted/10">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">All clear!</h3>
                <p className="text-muted-foreground max-w-sm">
                  We haven't detected any new patterns or anomalies in your API traffic lately.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ScheduleReportModal 
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        initialTemplateId={selectedTemplateForSchedule}
        onScheduleCreated={(newSchedule) => {
          setSchedules(prev => [newSchedule, ...prev]);
          setIsScheduleModalOpen(false);
          toast.success('Report schedule created');
        }}
      />

      <ReportBuilderModal 
        isOpen={isBuilderModalOpen}
        onClose={() => setIsBuilderModalOpen(false)}
        onReportCreated={(newReport) => {
          setIsBuilderModalOpen(false);
          setPendingCustomReport(newReport);
        }}
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
          format={selectedReportForExport?.format || pendingCustomReport?.format || 'pdf'}
          onComplete={(size) => {
            if (pendingCustomReport) {
              const completed = {
                ...pendingCustomReport,
                status: 'generated' as const,
                fileSize: size
              };
              setMyReports(prev => [completed, ...prev]);
              setPendingCustomReport(null);
              toast.success('Custom report generated and added to your list.');
            } else {
              setSelectedReportForExport(null);
              toast.success('Export complete! Your file is ready.');
            }
          }}
        />
      )}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-pulse">
        <div className="h-20 bg-muted rounded-xl" />
        <div className="h-10 bg-muted rounded-lg w-1/2" />
        <div className="grid grid-cols-3 gap-6">
          <div className="h-64 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    }>
      <ReportsContent />
    </Suspense>
  );
}
