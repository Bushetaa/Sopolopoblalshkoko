'use client';

import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileJson,
  ChevronDown
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EXPORT_FORMAT_INFO, ExportFormat, ReportTemplate } from '@/lib/reports-mock';
import { ExportProgressModal } from './ExportProgressModal';

interface ExportDropdownProps {
  template: ReportTemplate;
}

export function ExportDropdown({ template }: ExportDropdownProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormatSelect = (format: ExportFormat) => {
    if (format === 'excel') {
      toast.info('Excel export coming soon', {
        description: 'We are working on bringing rich Excel formatting to your reports.'
      });
      return;
    }

    if (format === 'pdf') {
      // PDF is simulated in v1
      setSelectedFormat('pdf');
      setIsModalOpen(true);
      return;
    }

    setSelectedFormat(format);
    setIsModalOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-2">
            <Download className="h-3.5 w-3.5" />
            Export
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Select Export Format</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {template.formats.map((format) => {
            const info = EXPORT_FORMAT_INFO[format];
            const Icon = info.icon;
            
            return (
              <DropdownMenuItem 
                key={format} 
                onClick={() => handleFormatSelect(format)}
                className="flex flex-col items-start gap-0.5 py-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{info.label}</span>
                </div>
                <span className="text-[10px] text-muted-foreground pl-6">
                  {info.description}
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedFormat && (
        <ExportProgressModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          template={template}
          format={selectedFormat}
        />
      )}
    </>
  );
}
