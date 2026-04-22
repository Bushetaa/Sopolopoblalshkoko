"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusCodeData } from '@/types/layout';
import { Activity } from 'lucide-react';

interface StatusCodeChartProps {
  data: StatusCodeData[];
  isLoading?: boolean;
}

const StatusCodeTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-950/90 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 min-w-[140px]">
        <p className="text-[10px] font-black text-gray-500 mb-3 border-b border-white/5 pb-2 uppercase tracking-[0.2em]">{label}</p>
        <div className="space-y-2.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 group/item">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
                  style={{ 
                    backgroundColor: entry.color,
                    boxShadow: `0 0 12px ${entry.color}40`
                  }} 
                />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter group-hover/item:text-gray-200 transition-colors">{entry.name}</span>
              </div>
              <span className="text-xs font-black text-gray-100 tabular-nums">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function StatusCodeChart({ data, isLoading }: StatusCodeChartProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900/20 border border-gray-800/50 rounded-[2.5rem] p-10 h-[450px] animate-pulse">
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-3">
            <div className="w-32 h-4 bg-gray-800/50 rounded-full" />
            <div className="w-48 h-10 bg-gray-800/50 rounded-xl" />
          </div>
          <div className="w-40 h-12 bg-gray-800/50 rounded-2xl" />
        </div>
        <div className="h-64 bg-gray-800/20 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900/40 border border-gray-800/60 rounded-[2.5rem] p-10 hover:border-emerald-500/30 hover:bg-gray-900/60 transition-all duration-700 group/status relative overflow-hidden shadow-2xl">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 blur-[120px] rounded-full -mr-80 -mt-80 pointer-events-none group-hover/status:bg-emerald-600/10 transition-colors duration-1000" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none group-hover/status:bg-blue-600/10 transition-colors duration-1000" />
      
      <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full animate-pulse" />
              <div className="relative p-2.5 bg-gray-950 rounded-xl ring-1 ring-emerald-500/30 shadow-2xl shadow-emerald-500/20">
                <Activity className="h-4 w-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] block leading-none mb-1">Response Integrity</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">Live Monitoring</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-4xl font-black text-white tracking-tighter leading-none mb-2">Status Codes</h3>
            <p className="text-sm text-gray-500 font-bold tracking-wide max-w-xs opacity-70">Real-time HTTP response distribution across the gateway infrastructure</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-950/40 p-2.5 rounded-[1.5rem] border border-white/5 backdrop-blur-2xl shadow-2xl">
          {[
            { label: '2xx', color: '#10b981', desc: 'Success' },
            { label: '3xx', color: '#f59e0b', desc: 'Redirect' },
            { label: '4xx', color: '#f97316', desc: 'Client' },
            { label: '5xx', color: '#ef4444', desc: 'Server' }
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center gap-1.5 px-4 py-2 hover:bg-white/5 rounded-xl transition-all cursor-default group/label border border-transparent hover:border-white/5">
              <div className="flex items-center gap-2">
                <div 
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,1)] transition-transform group-hover/label:scale-150" 
                  style={{ 
                    backgroundColor: item.color,
                    boxShadow: `0 0 10px ${item.color}60`
                  }} 
                />
                <span className="text-xs font-black text-gray-400 group-hover/label:text-white transition-colors uppercase tracking-tighter">{item.label}</span>
              </div>
              <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest opacity-0 group-hover/label:opacity-100 transition-opacity transform -translate-y-1 group-hover/label:translate-y-0">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[320px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barGap={0}>
            <defs>
              {[
                { id: '2xx', color: '#10b981' },
                { id: '3xx', color: '#f59e0b' },
                { id: '4xx', color: '#f97316' },
                { id: '5xx', color: '#ef4444' }
              ].map(grad => (
                <linearGradient key={grad.id} id={`grad-${grad.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={grad.color} stopOpacity={0.8}/>
                  <stop offset="60%" stopColor={grad.color} stopOpacity={0.3}/>
                  <stop offset="100%" stopColor={grad.color} stopOpacity={0.05}/>
                </linearGradient>
              ))}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="12 12" vertical={false} stroke="#374151" opacity={0.15} />
            <XAxis 
              dataKey="period" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 900 }}
              dy={20}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 900 }}
              dx={-10}
            />
            <Tooltip 
              content={<StatusCodeTooltip />} 
              cursor={{ fill: 'rgba(255,255,255,0.02)', radius: 12 }} 
              animationDuration={300}
            />
            <Bar dataKey="2xx" name="2xx" stackId="a" fill="url(#grad-2xx)" barSize={45} />
            <Bar dataKey="3xx" name="3xx" stackId="a" fill="url(#grad-3xx)" />
            <Bar dataKey="4xx" name="4xx" stackId="a" fill="url(#grad-4xx)" />
            <Bar dataKey="5xx" name="5xx" stackId="a" fill="url(#grad-5xx)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
