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
      <div className="bg-gray-900/20 border border-gray-800/50 rounded-2xl p-6 h-[350px] animate-pulse">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-2">
            <div className="w-24 h-3 bg-gray-800/50 rounded-full" />
            <div className="w-40 h-8 bg-gray-800/50 rounded-xl" />
          </div>
        </div>
        <div className="h-48 bg-gray-800/20 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 hover:border-emerald-500/30 hover:bg-gray-900/60 transition-all duration-700 group/status relative overflow-hidden shadow-2xl h-full flex flex-col">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-600/5 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none group-hover/status:bg-emerald-600/10 transition-colors duration-1000" />
      
      <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full animate-pulse" />
              <div className="relative p-2 bg-gray-950 rounded-lg ring-1 ring-emerald-500/30 shadow-2xl shadow-emerald-500/20">
                <Activity className="h-4 w-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] block leading-none mb-1">Integrity</span>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-widest">Monitoring</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1.5">Status Codes</h3>
            <p className="text-[10px] text-gray-500 font-bold tracking-wide max-w-xs opacity-70">HTTP response distribution</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 bg-gray-950/40 p-2 rounded-2xl border border-white/5 backdrop-blur-2xl shadow-2xl">
          {[
            { label: '2xx', color: '#10b981' },
            { label: '3xx', color: '#f59e0b' },
            { label: '4xx', color: '#f97316' },
            { label: '5xx', color: '#ef4444' }
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl transition-all cursor-default group/label border border-transparent hover:border-white/5">
              <div 
                className="w-1.5 h-1.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,1)] transition-transform group-hover/label:scale-125" 
                style={{ 
                  backgroundColor: item.color,
                  boxShadow: `0 0 8px ${item.color}60`
                }} 
              />
              <span className="text-[10px] font-black text-gray-400 group-hover/label:text-white transition-colors uppercase tracking-tighter">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[240px] w-full relative">
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
            </defs>
            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#374151" opacity={0.15} />
            <XAxis 
              dataKey="period" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 9, fontWeight: 900 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 9, fontWeight: 900 }}
              dx={-5}
            />
            <Tooltip 
              content={<StatusCodeTooltip />} 
              cursor={{ fill: 'rgba(255,255,255,0.02)', radius: 8 }} 
              animationDuration={300}
            />
            <Bar dataKey="2xx" name="2xx" stackId="a" fill="url(#grad-2xx)" barSize={32} />
            <Bar dataKey="3xx" name="3xx" stackId="a" fill="url(#grad-3xx)" />
            <Bar dataKey="4xx" name="4xx" stackId="a" fill="url(#grad-4xx)" />
            <Bar dataKey="5xx" name="5xx" stackId="a" fill="url(#grad-5xx)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
