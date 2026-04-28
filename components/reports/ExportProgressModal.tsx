'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Download, 
  X 
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
import { Progress } from '@/components/ui/progress';
import { exportToCSV, exportToJSON } from '@/lib/export-utils';
import { ExportFormat, ReportTemplate } from '@/lib/reports-mock';

interface ExportProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  template?: ReportTemplate;
  title?: string;
  subtitle?: string;
  format: ExportFormat;
  onComplete?: (fileSize: string) => void;
}

export function ExportProgressModal({ 
  isOpen, 
  onClose, 
  template, 
  title,
  subtitle,
  format,
  onComplete
}: ExportProgressModalProps) {
  const [status, setStatus] = useState<'processing' | 'complete' | 'failed'>('processing');
  const [progress, setProgress] = useState(0);
  const [fileSize, setFileSize] = useState('');

  const displayTitle = title || template?.title || 'Report';
  const displaySubtitle = subtitle || (template ? `${template.title} • ${format.toUpperCase()} Format` : `${format.toUpperCase()} Format`);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setStatus('processing');
      setProgress(0);
      return;
    }

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('complete');
          const size = `${(Math.random() * 2 + 0.5).toFixed(1)} MB`;
          setFileSize(size);
          onComplete?.(size);
          return 100;
        }
        // Random increment between 3% and 8%
        const increment = Math.floor(Math.random() * 6) + 3;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  const handleDownload = () => {
    // In a real app, this would use actual data fetched from API
    const metrics = template?.metrics || ['Metric 1', 'Metric 2'];
    const mockData = [
      { id: 1, metric: metrics[0], value: 100, timestamp: new Date().toISOString() },
      { id: 2, metric: metrics[1], value: 200, timestamp: new Date().toISOString() },
    ];

    if (format === 'csv') {
      exportToCSV(mockData, template?.id || 'custom-report');
    } else if (format === 'json') {
      exportToJSON(mockData, template?.id || 'custom-report');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {status === 'processing' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
            {status === 'complete' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {status === 'failed' && <XCircle className="h-5 w-5 text-red-500" />}
            {status === 'processing' ? 'Generating Report...' : 
             status === 'complete' ? 'Report Ready!' : 'Export Failed'}
          </DialogTitle>
          <DialogDescription>
            {displaySubtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {status === 'processing' ? (
            <div className="space-y-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Gathering metrics...</span>
                <span>{progress}%</span>
              </div>
            </div>
          ) : status === 'complete' ? (
            <div className="flex flex-col items-center justify-center py-4 bg-secondary/20 rounded-lg border border-border/50">
              <Download className="h-10 w-10 text-primary mb-2 opacity-50" />
              <span className="text-sm font-medium">Your report is ready for download</span>
              <span className="text-xs text-muted-foreground mt-1">File size: {fileSize}</span>
            </div>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
              An error occurred while generating the report. Please try again or contact support.
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between flex items-center">
          <Button variant="ghost" size="sm" onClick={onClose}>
            {status === 'processing' ? 'Cancel' : 'Close'}
          </Button>
          {status === 'complete' && (
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
