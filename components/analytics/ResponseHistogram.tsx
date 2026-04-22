"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { ResponseTimeBucket } from '@/types/layout';
import { Zap } from 'lucide-react';

interface ResponseHistogramProps {
  data: ResponseTimeBucket[];
  isLoading?: boolean;
}

const HistogramTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-950/90 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 min-w-[160px]">
        <p className="text-[10px] font-black text-gray-500 mb-2 border-b border-white/5 pb-2 uppercase tracking-[0.2em]">{data.range}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-black text-gray-400 uppercase">Volume</span>
            <span className="text-xs font-black text-white tabular-nums">{data.count} Req</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-black text-gray-400 uppercase">Density</span>
            <span className="text-xs font-black text-blue-400 tabular-nums">{data.percentage}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ResponseHistogram({ data, isLoading }: ResponseHistogramProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900/20 border border-gray-800/50 rounded-[2.5rem] p-10 h-[450px] animate-pulse">
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-3">
            <div className="w-48 h-8 bg-gray-800/50 rounded-xl" />
            <div className="w-64 h-4 bg-gray-800/50 rounded-full" />
          </div>
        </div>
        <div className="space-y-6">
          {[1,2,3,4,5].map(i => <div key={i} className="w-full h-10 bg-gray-800/20 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const getBarColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="bg-gray-900/40 border border-gray-800/60 rounded-[2.5rem] p-10 hover:border-blue-500/20 transition-all duration-700 group/latency relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -ml-64 -mt-64 pointer-events-none group-hover/latency:bg-blue-600/10 transition-colors duration-1000" />
      
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-950 rounded-xl ring-1 ring-blue-500/30 shadow-2xl shadow-blue-500/20">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Performance Profiling</span>
          </div>
          <div>
            <h3 className="text-4xl font-black text-white tracking-tighter leading-none mb-2">Latency Distribution</h3>
            <p className="text-sm text-gray-500 font-bold tracking-wide opacity-70">Request density across response time buckets</p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-gray-950/40 px-6 py-4 rounded-3xl border border-white/5 backdrop-blur-xl">
          {[
            { label: 'Normal', color: '#3b82f6' },
            { label: 'Warning', color: '#f59e0b' },
            { label: 'Critical', color: '#ef4444' }
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2.5 group/legend cursor-default">
              <div 
                className="w-2 h-2 rounded-full transition-transform group-hover/legend:scale-150" 
                style={{ 
                  backgroundColor: item.color,
                  boxShadow: `0 0 10px ${item.color}40`
                }} 
              />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover/legend:text-gray-300 transition-colors">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[340px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 100, bottom: 0 }} barSize={32}>
            <defs>
              <linearGradient id="barGradient-normal" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="barGradient-warning" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="barGradient-critical" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#f87171" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="range" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 900 }}
              width={100}
            />
            <Tooltip content={<HistogramTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)', radius: 12 }} />
            <Bar dataKey="count" radius={[0, 12, 12, 0]} background={{ fill: '#ffffff03', radius: 12 }}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#barGradient-${entry.severity || 'normal'})`}
                  className="hover:brightness-125 transition-all duration-500 cursor-pointer"
                />
              ))}
              <LabelList 
                dataKey="percentage" 
                position="right" 
                content={(props: any) => {
                  const { x, y, width, value } = props;
                  return (
                    <g className="group/label">
                      <rect 
                        x={x + width + 10} 
                        y={y + 4} 
                        width={65} 
                        height={24} 
                        rx={8} 
                        fill="#ffffff05" 
                        className="group-hover/label:fill-white/10 transition-colors"
                      />
                      <text x={x + width + 20} y={y + 20} fill="#ffffff" fontSize={14} fontWeight={900} textAnchor="start" className="tabular-nums">
                        {value}%
                      </text>
                      <circle cx={x + width + 68} cy={y + 16} r={3} fill={getBarColor(data[props.index].severity)} className="animate-pulse" />
                    </g>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
