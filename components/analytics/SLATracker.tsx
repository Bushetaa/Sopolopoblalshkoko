"use client";

import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { KPIMetric } from '@/types/layout';
import { ShieldCheck, Activity } from 'lucide-react';

interface SLATrackerProps {
  metrics: KPIMetric[];
  isLoading?: boolean;
}

export default function SLATracker({ metrics, isLoading }: SLATrackerProps) {
  if (isLoading) {
    return (
      <div className="bg-[#0B101B]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 h-[400px] animate-pulse">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gray-800/50 rounded-2xl" />
          <div className="space-y-2">
            <div className="w-32 h-6 bg-gray-800/50 rounded-lg" />
            <div className="w-48 h-3 bg-gray-800/50 rounded-full" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-800/30 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B101B] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative group">
      {/* Top subtle gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Background ambient light */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            <ShieldCheck className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black font-display text-white tracking-tight">SLA Tracker</h3>
            <p className="text-sm text-[#64748B] font-medium mt-1">Compliance monitoring against predefined service goals</p>
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="w-full overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/5 bg-[#0F172A]/50">
              <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-[#64748B] w-1/4">Metric Name</th>
              <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-[#64748B] w-1/4">Status</th>
              <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-[#64748B] w-1/4">Performance vs Target</th>
              <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-[#64748B] w-1/4 text-right">30d Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {metrics.map((metric) => {
              const isHealthy = metric.status === 'healthy';
              const isWarning = metric.status === 'warning';
              
              const statusColor = isHealthy ? 'text-emerald-400' : isWarning ? 'text-amber-400' : 'text-rose-400';
              const statusBg = isHealthy ? 'bg-emerald-500/10 border-emerald-500/20' : isWarning ? 'bg-amber-500/10 border-amber-500/20' : 'bg-rose-500/10 border-rose-500/20';
              const statusGlow = isHealthy ? 'shadow-[0_0_15px_rgba(16,185,129,0.15)]' : isWarning ? 'shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'shadow-[0_0_15px_rgba(225,29,72,0.15)]';
              const chartColor = isHealthy ? '#10b981' : isWarning ? '#f59e0b' : '#ef4444';

              // Calculate progress percentage for visual bar
              const targetVal = parseFloat(metric.target.toString());
              const currentVal = parseFloat(metric.current.toString());
              let percent = 100;
              if (targetVal > 0) {
                if (metric.name.toLowerCase().includes('latency') || metric.name.toLowerCase().includes('error')) {
                  // Lower is better (e.g. latency)
                  // If current is 0, percent is 100%. If current == target, percent is 50%.
                  // If current > target, percent goes down towards 0.
                  percent = Math.max(0, Math.min(100, 100 - ((currentVal / targetVal) * 50)));
                  // Alternative simpler logic:
                  // percent = Math.max(5, Math.min(100, (targetVal / Math.max(0.1, currentVal)) * 100));
                } else {
                  // Higher is better (e.g. uptime)
                  percent = Math.max(0, Math.min(100, (currentVal / targetVal) * 100));
                }
              }

              return (
                <tr key={metric.id} className="group/row hover:bg-white/[0.02] transition-colors duration-300">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full ring-4 ring-opacity-20", 
                        isHealthy ? "bg-emerald-500 ring-emerald-500 shadow-[0_0_10px_#10b981]" : 
                        isWarning ? "bg-amber-500 ring-amber-500 shadow-[0_0_10px_#f59e0b]" : 
                        "bg-rose-500 ring-rose-500 shadow-[0_0_10px_#ef4444]"
                      )} />
                      <span className="font-bold text-gray-200 group-hover/row:text-white transition-colors">{metric.name}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className={cn("inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border backdrop-blur-md", statusBg, statusColor, statusGlow)}>
                      {metric.status}
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold text-white tabular-nums tracking-tight">{metric.current}{metric.unit}</span>
                        <span className="text-xs font-medium text-[#64748B]">/ {metric.target}{metric.unit}</span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full max-w-[160px] h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000 ease-out", isHealthy ? "bg-emerald-500" : isWarning ? "bg-amber-500" : "bg-rose-500")} 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="h-10 w-28 ml-auto opacity-70 group-hover/row:opacity-100 transition-opacity duration-300">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metric.history.map((v, i) => ({ v, i }))}>
                          <Line 
                            type="monotone" 
                            dataKey="v" 
                            stroke={chartColor} 
                            strokeWidth={2.5} 
                            dot={false}
                            isAnimationActive={true}
                            animationDuration={1500}
                          />
                          <YAxis domain={['dataMin', 'dataMax']} hide />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
