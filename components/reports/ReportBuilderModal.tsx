'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Settings2, 
  BarChart, 
  Layers, 
  Calendar,
  Check,
  FileText
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CustomReport } from '@/lib/reports-mock';
import { toast } from 'sonner';

interface ReportBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated: (report: CustomReport) => void;
}

const STEPS = [
  { id: 'type', title: 'Report Type', description: 'Choose the core dataset' },
  { id: 'config', title: 'Configuration', description: 'Set date range & granularity' },
  { id: 'metrics', title: 'Metrics', description: 'Select specific data points' }
];

const METRICS_OPTIONS = [
  'Response Time (Avg)', 'Latency P99', 'Success Rate', 'Error Count', 
  'Total Requests', 'Unique Consumers', 'Throughput', 'Cache Hit Ratio',
  'CPU Usage', 'Memory Utilization', 'Bandwidth'
];

export function ReportBuilderModal({ isOpen, onClose, onReportCreated }: ReportBuilderModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [reportType, setReportType] = useState('performance');
  const [dateRange, setDateRange] = useState('7d');
  const [granularity, setGranularity] = useState('hourly');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['Response Time (Avg)', 'Success Rate']);
  const [reportName, setReportName] = useState('');

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric) 
        : [...prev, metric]
    );
  };

  const handleGenerate = () => {
    if (!reportName) {
      toast.error('Please give your report a name');
      return;
    }

    const newReport: CustomReport = {
      id: `rep-${Math.random().toString(36).substr(2, 9)}`,
      name: reportName,
      type: reportType,
      dateRange,
      granularity,
      metrics: selectedMetrics,
      createdAt: new Date().toISOString(),
      status: 'processing',
      fileSize: '0 KB',
      format: 'pdf'
    };

    onReportCreated(newReport);
    onClose();
    
    // Reset
    setCurrentStep(0);
    setReportName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Settings2 className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Step {currentStep + 1} of 3</span>
          </div>
          <DialogTitle>{STEPS[currentStep].title}</DialogTitle>
          <DialogDescription>
            {STEPS[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 min-h-[300px]">
          {currentStep === 0 && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Report Name</Label>
                <Input 
                  placeholder="e.g., Monthly API Audit - April 2026" 
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>
              <div className="grid gap-2 mt-2">
                <Label>Dataset Category</Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'performance', title: 'API Performance', desc: 'Latency, errors, and throughput metrics', icon: BarChart },
                    { id: 'traffic', title: 'Traffic & Usage', desc: 'Consumer behavior and volume analysis', icon: Layers },
                    { id: 'infrastructure', title: 'Infrastructure', desc: 'Resource utilization and health', icon: FileText },
                  ].map((type) => (
                    <div 
                      key={type.id}
                      onClick={() => setReportType(type.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        reportType === type.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border bg-card hover:border-border/80'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${reportType === type.id ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                        <type.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{type.title}</div>
                        <div className="text-xs text-muted-foreground">{type.desc}</div>
                      </div>
                      {reportType === type.id && <Check className="h-5 w-5 text-primary" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label>Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                    <SelectItem value="custom">Custom Range...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Data Granularity</Label>
                <Select value={granularity} onValueChange={setGranularity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5m">5 Minutes</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 flex gap-3">
                <Calendar className="h-5 w-5 text-blue-500 shrink-0" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  Note: Choosing a longer date range with high granularity may increase the report generation time.
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid gap-4">
              <Label>Select Metrics to Include</Label>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {METRICS_OPTIONS.map((metric) => (
                  <div key={metric} className="flex items-center space-x-2">
                    <Checkbox 
                      id={metric} 
                      checked={selectedMetrics.includes(metric)}
                      onCheckedChange={() => toggleMetric(metric)}
                    />
                    <label 
                      htmlFor={metric}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {metric}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border pt-4">
          <div className="flex justify-between w-full">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext} className="gap-2">
              {currentStep === STEPS.length - 1 ? 'Generate Report' : 'Next Step'}
              {currentStep < STEPS.length - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
