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
      <div className="bg-gray-900/20 border border-gray-800/50 rounded-2xl p-6 h-[350px] animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="w-32 h-6 bg-gray-800/50 rounded-lg" />
            <div className="w-48 h-3 bg-gray-800/50 rounded-full" />
          </div>
        </div>
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="w-full h-8 bg-gray-800/20 rounded-xl" />)}
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
    <div className="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 hover:border-blue-500/20 transition-all duration-700 group/latency relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full -ml-48 -mt-48 pointer-events-none group-hover/latency:bg-blue-600/10 transition-colors duration-1000" />
      
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-950 rounded-lg ring-1 ring-blue-500/30 shadow-2xl shadow-blue-500/20">
              <Zap className="h-4 w-4 text-blue-400" />
            </div>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em]">Profiling</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1.5">Latency Distribution</h3>
            <p className="text-[10px] text-gray-500 font-bold tracking-wide opacity-70">Request density by response time</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-950/40 px-4 py-3 rounded-2xl border border-white/5 backdrop-blur-xl">
          {[
            { label: 'Normal', color: '#3b82f6' },
            { label: 'Warning', color: '#f59e0b' },
            { label: 'Critical', color: '#ef4444' }
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 group/legend cursor-default">
              <div 
                className="w-1.5 h-1.5 rounded-full transition-transform group-hover/legend:scale-125" 
                style={{ 
                  backgroundColor: item.color,
                  boxShadow: `0 0 8px ${item.color}40`
                }} 
              />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest group-hover/legend:text-gray-300 transition-colors">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: -20, right: 80, bottom: 0 }} barSize={24}>
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
              tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 900 }}
              width={100}
            />
            <Tooltip content={<HistogramTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)', radius: 8 }} />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} background={{ fill: '#ffffff03', radius: 8 }}>
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
                        x={x + width + 8} 
                        y={y + 2} 
                        width={50} 
                        height={20} 
                        rx={6} 
                        fill="#ffffff05" 
                        className="group-hover/label:fill-white/10 transition-colors"
                      />
                      <text x={x + width + 15} y={y + 16} fill="#ffffff" fontSize={11} fontWeight={900} textAnchor="start" className="tabular-nums">
                        {value}%
                      </text>
                      <circle cx={x + width + 50} cy={y + 12} r={2} fill={getBarColor(data[props.index].severity)} className="animate-pulse" />
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
