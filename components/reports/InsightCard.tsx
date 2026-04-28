'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  ShieldAlert,
  Zap,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Insight } from '@/lib/insight-rules';

interface InsightCardProps {
  insight: Insight;
  onDismiss: (id: string) => void;
}

const SEVERITY_CONFIG = {
  critical: {
    border: 'border-l-red-500',
    badge: 'bg-red-500/10 text-red-500',
    icon: AlertCircle
  },
  warning: {
    border: 'border-l-amber-500',
    badge: 'bg-amber-500/10 text-amber-500',
    icon: AlertCircle
  },
  info: {
    border: 'border-l-blue-500',
    badge: 'bg-blue-500/10 text-blue-500',
    icon: Info
  },
  success: {
    border: 'border-l-green-500',
    badge: 'bg-green-500/10 text-green-500',
    icon: CheckCircle2
  }
};

const TYPE_ICONS = {
  anomaly: AlertCircle,
  degradation: TrendingDown,
  improvement: TrendingUp,
  threshold: Zap,
  recommendation: Info,
  security: ShieldAlert,
  cost: DollarSign
};

export function InsightCard({ insight, onDismiss }: InsightCardProps) {
  const router = useRouter();
  const severity = SEVERITY_CONFIG[insight.severity];
  const TypeIcon = TYPE_ICONS[insight.type];

  return (
    <div className={`bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group border-l-4 ${severity.border}`}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${severity.badge}`}>
            {insight.severity}
          </span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <TypeIcon className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{insight.type}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {insight.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-2xl">
          {insight.summary}
        </p>

        <div className="bg-secondary/20 rounded-lg p-3 mb-6 border border-border/40">
          <p className="text-xs text-muted-foreground leading-relaxed italic">
            <span className="font-semibold not-italic text-foreground mr-1">Recommendation:</span>
            {insight.recommendation}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {insight.actionLabel && insight.actionPath && (
            <Button 
              variant="default" 
              size="sm" 
              className="gap-2"
              onClick={() => router.push(insight.actionPath!)}
            >
              {insight.actionLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onDismiss(insight.id)}
          >
            Dismiss
          </Button>
        </div>
      </div>

      {insight.metric && (
        <div className="w-full md:w-52 p-5 rounded-xl bg-secondary/30 flex flex-col items-center justify-center border border-border/50 group-hover:bg-secondary/40 transition-colors">
          <span className="text-[11px] font-medium text-muted-foreground mb-2 uppercase tracking-tight">
            {insight.metric.label}
          </span>
          <div className="text-4xl font-bold flex items-baseline gap-1 tabular-nums">
            {insight.metric.value}
            <span className="text-sm font-normal text-muted-foreground uppercase">{insight.metric.unit}</span>
          </div>
          {insight.metric.change !== undefined && (
            <div className={`flex items-center gap-1 text-xs mt-3 font-bold px-2 py-0.5 rounded-full ${
              insight.metric.trend === 'up' 
                ? (insight.type === 'degradation' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500')
                : (insight.type === 'improvement' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500')
            }`}>
              {insight.metric.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(insight.metric.change)}%
            </div>
          )}
        </div>
      )}
    </div>
  );
}
