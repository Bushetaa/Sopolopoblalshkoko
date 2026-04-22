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
      <div className="bg-gray-900/20 border border-gray-800/50 rounded-[2.5rem] p-10 h-[500px] animate-pulse">
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-3">
            <div className="w-40 h-8 bg-gray-800/50 rounded-xl" />
            <div className="w-64 h-4 bg-gray-800/50 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-gray-800/20 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/40 border border-gray-800/60 rounded-[2.5rem] p-10 hover:border-blue-500/20 transition-all duration-700 group/sla relative overflow-hidden shadow-2xl">
      {/* Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none group-hover/sla:bg-blue-600/15 transition-colors duration-1000" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative flex items-center justify-between mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-950 rounded-xl ring-1 ring-blue-500/30 shadow-2xl shadow-blue-500/20">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Service Level Indicators</span>
          </div>
          <div>
            <h3 className="text-4xl font-black text-white tracking-tighter leading-none mb-2">SLA Tracker</h3>
            <p className="text-sm text-gray-500 font-bold tracking-wide opacity-70">Compliance monitoring against predefined service goals</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {metrics.map((metric) => (
          <div 
            key={metric.id} 
            className="p-8 rounded-[2rem] bg-gray-950/40 border border-white/5 hover:border-white/10 hover:bg-gray-950/60 transition-all duration-500 group/item relative overflow-hidden"
          >
            {/* Status Background Glow */}
            <div className={cn(
              "absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -mr-16 -mt-16 opacity-20 transition-opacity group-hover/item:opacity-40",
              metric.status === 'healthy' ? "bg-emerald-500" : 
              metric.status === 'warning' ? "bg-amber-500" : "bg-rose-500"
            )} />

            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{metric.name}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white tracking-tighter">
                      {metric.current}{metric.unit}
                    </span>
                    <div className={cn(
                      "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border backdrop-blur-md",
                      metric.status === 'healthy' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                      metric.status === 'warning' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                      "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    )}>
                      {metric.status}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Performance Goal</span>
                  <span className="text-sm font-black text-gray-400 tabular-nums">
                    Target: {metric.target}{metric.unit}
                  </span>
                </div>
                
                <div className="h-12 w-32 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metric.history.map(v => ({ v }))}>
                      <defs>
                        <linearGradient id={`sparkline-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={
                            metric.status === 'healthy' ? '#10b981' : 
                            metric.status === 'warning' ? '#f59e0b' : '#ef4444'
                          } stopOpacity={0.2} />
                          <stop offset="100%" stopColor={
                            metric.status === 'healthy' ? '#10b981' : 
                            metric.status === 'warning' ? '#f59e0b' : '#ef4444'
                          } stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Line 
                        type="monotone" 
                        dataKey="v" 
                        stroke={
                          metric.status === 'healthy' ? '#10b981' : 
                          metric.status === 'warning' ? '#f59e0b' : '#ef4444'
                        } 
                        strokeWidth={3} 
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
        ))}
      </div>
    </div>
  );
}
