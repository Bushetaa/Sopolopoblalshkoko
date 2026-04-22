"use client";

import React from 'react';
import { 
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Brush, Cell
} from 'recharts';
import { Activity } from 'lucide-react';
import { TrafficDataPoint } from '@/types/layout';

interface TrafficChartProps {
  data: TrafficDataPoint[];
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl ring-1 ring-white/5 min-w-[150px]">
        <p className="text-xs font-bold text-gray-400 mb-2 border-b border-gray-800 pb-1 uppercase tracking-wider">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-bold text-gray-500 uppercase">{entry.name}</span>
              </div>
              <span className="text-xs font-bold text-gray-200">
                {entry.name === 'Latency' ? `${entry.value}ms` : `${(entry.value / 1000).toFixed(1)}k`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function TrafficChart({ data, isLoading }: TrafficChartProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse w-full">
          <div className="w-full h-8 bg-gray-800 rounded-lg mb-8" />
          <div className="w-full h-48 bg-gray-800/50 rounded-lg" />
          <div className="flex justify-between w-full mt-4">
            {[1,2,3,4,5].map(i => <div key={i} className="w-12 h-4 bg-gray-800 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/40 border border-gray-800/60 rounded-[2rem] p-8 hover:border-blue-500/30 hover:bg-gray-900/60 transition-all duration-500 group/chart relative overflow-hidden shadow-2xl">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />
      
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
            <div className="relative p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-2xl ring-1 ring-white/10 group-hover/chart:ring-blue-500/40 transition-all duration-500 shadow-inner">
              <Activity className="h-7 w-7 text-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-50 tracking-tight leading-none mb-2">Traffic Overview</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 rounded-full border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Live Engine</span>
              </div>
              <p className="text-xs text-gray-500 font-bold tracking-wide">Global request volume & performance</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-950/40 p-2 rounded-2xl border border-gray-800/50 backdrop-blur-md shadow-inner">
          <div className="flex items-center gap-3 px-4 py-2 bg-blue-600/10 rounded-xl border border-blue-500/20 shadow-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
            <span className="text-[11px] font-black text-blue-100 uppercase tracking-widest">Requests</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500/40" />
            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest group-hover/chart:text-gray-400">Latency</span>
          </div>
        </div>
      </div>

      <div className="h-[320px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <filter id="shadow" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="0" dy="4" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#1f2937" opacity={0.5} />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 800 }}
              dy={15}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 800 }}
              tickFormatter={(v) => `${v/1000}k`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6366f1', fontSize: 11, fontWeight: 800, opacity: 0.7 }}
              tickFormatter={(v) => `${v}ms`}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="requests" 
              name="Requests"
              stroke="#3b82f6" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#requestsGradient)" 
              animationDuration={2000}
              filter="url(#shadow)"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="p95" 
              name="Latency"
              stroke="#6366f1" 
              strokeWidth={3}
              strokeDasharray="6 6"
              dot={false}
              activeDot={{ r: 6, fill: '#6366f1', strokeWidth: 0 }}
              animationDuration={2500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Modern Control Bar */}
      <div className="mt-12 flex items-center justify-between border-t border-gray-800/50 pt-6">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Peak Volume</span>
            <span className="text-lg font-bold text-gray-200 tracking-tighter">98.4k <span className="text-[10px] text-gray-500">req/s</span></span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Avg Latency</span>
            <span className="text-lg font-bold text-indigo-400 tracking-tighter">142 <span className="text-[10px] text-gray-500">ms</span></span>
          </div>
        </div>
        
        <div className="h-10 px-6 bg-gray-950/60 rounded-full border border-gray-800 flex items-center gap-4 group/brush cursor-pointer hover:border-blue-500/30 transition-all">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest group-hover/brush:text-blue-400 transition-colors">Real-time Stream Active</span>
        </div>
      </div>
    </div>
  );
}
