'use client';

import React from 'react';
import { Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReportTemplate } from '@/lib/reports-mock';
import { ExportDropdown } from './ExportDropdown';

interface ReportTemplateCardProps {
  template: ReportTemplate;
  onSchedule?: (template: ReportTemplate) => void;
}

export function ReportTemplateCard({ template, onSchedule }: ReportTemplateCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col hover:border-border/80 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${template.iconBg} group-hover:scale-110 transition-transform`}>
          <template.icon className={`h-6 w-6 ${template.iconColor}`} />
        </div>
        {template.isPremium && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
            Premium
          </span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
          {template.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {template.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-6">
          {template.metrics.slice(0, 3).map((metric, i) => (
            <span 
              key={i} 
              className="px-2 py-0.5 rounded bg-secondary/50 text-[10px] font-medium text-secondary-foreground border border-border/50"
            >
              {metric}
            </span>
          ))}
          {template.metrics.length > 3 && (
            <span className="px-2 py-0.5 rounded bg-secondary/50 text-[10px] font-medium text-secondary-foreground border border-border/50">
              +{template.metrics.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
        <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 opacity-60" />
          Est. {template.estimatedTime}
        </span>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            onClick={() => onSchedule?.(template)}
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <ExportDropdown template={template} />
        </div>
      </div>
    </div>
  );
}
