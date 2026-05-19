"use client";

import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { KPIMetric } from '@/types/layout';
import { ShieldCheck } from 'lucide-react';

interface SLATrackerProps {
  metrics: KPIMetric[];
  isLoading?: boolean;
}

export default function SLATracker({ metrics, isLoading }: SLATrackerProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900/20 border border-gray-800/50 rounded-2xl p-6 h-[400px] animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="w-32 h-6 bg-gray-800/50 rounded-xl" />
            <div className="w-48 h-3 bg-gray-800/50 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-800/20 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 hover:border-blue-500/20 transition-all duration-700 group/sla relative overflow-hidden shadow-2xl h-full flex flex-col">
      {/* Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none group-hover/sla:bg-blue-600/15 transition-colors duration-1000" />
      
      <div className="relative flex items-center justify-between mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-950 rounded-lg ring-1 ring-blue-500/30 shadow-2xl shadow-blue-500/20">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
            </div>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em]">Compliance Monitoring</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1.5">SLA Tracker</h3>
            <p className="text-[10px] text-gray-500 font-bold tracking-wide opacity-70">Real-time performance benchmarks</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">System Stable</span>
          <span className="text-[8px] text-gray-600 font-bold uppercase">Updated 10s ago</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative flex-1">
        {metrics.map((metric) => {
          const isHealthy = metric.status === 'healthy';
          const isWarning = metric.status === 'warning';
          
          // Calculate progress towards target
          let progress = 0;
          if (metric.lowerIsBetter) {
            progress = Math.max(0, Math.min(100, (metric.target / (metric.current || 1)) * 100));
          } else {
            progress = Math.max(0, Math.min(100, (metric.current / (metric.target || 1)) * 100));
          }

          return (
            <div 
              key={metric.id} 
              className="p-5 rounded-2xl bg-gray-950/40 border border-white/5 hover:border-white/10 hover:bg-gray-950/60 transition-all duration-500 group/item relative overflow-hidden flex flex-col justify-between"
            >
              {/* Status Background Glow */}
              <div className={cn(
                "absolute top-0 right-0 w-24 h-24 blur-[40px] rounded-full -mr-12 -mt-12 opacity-10 transition-opacity group-hover/item:opacity-30",
                isHealthy ? "bg-emerald-500" : 
                isWarning ? "bg-amber-500" : "bg-rose-500"
              )} />

              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">{metric.name}</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-white tracking-tight">
                        {metric.current}{metric.unit}
                      </span>
                      <div className={cn(
                        "px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border backdrop-blur-md transition-all group-hover/item:scale-105",
                        isHealthy ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                        isWarning ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                        "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      )}>
                        {metric.status}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-gray-600">
                      <span>Efficiency</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1 w-full bg-gray-800/50 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000 ease-out",
                          isHealthy ? "bg-emerald-500" : 
                          isWarning ? "bg-amber-500" : "bg-rose-500"
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 pt-1">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Benchmark</span>
                      <span className="text-[10px] font-black text-gray-400 tabular-nums">
                        {metric.target}{metric.unit}
                      </span>
                    </div>
                    
                    <div className="h-8 w-20 flex-shrink-0 opacity-60 group-hover/item:opacity-100 transition-opacity">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metric.history.map(v => ({ v }))}>
                          <Line 
                            type="monotone" 
                            dataKey="v" 
                            stroke={
                              isHealthy ? '#10b981' : 
                              isWarning ? '#f59e0b' : '#ef4444'
                            } 
                            strokeWidth={2} 
                            dot={false}
                            isAnimationActive={true}
                            animationDuration={1500}
                          />
                          <YAxis domain={['dataMin', 'dataMax']} hide />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
