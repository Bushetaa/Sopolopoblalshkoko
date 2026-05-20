"use client";

import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricCardData } from '@/types/layout';
import { TREND_STYLES } from '@/lib/analytics-utils';

interface MetricCardProps {
  data: MetricCardData;
  isLoading?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function MetricCard({ data, isLoading, onClick, size = 'md' }: MetricCardProps) {
  const Icon = data.icon;
  const isUp = data.trend.direction === 'up';
  
  // Extract base color from Tailwind class (e.g., 'text-blue-400' -> 'blue')
  const baseColor = data.iconColor.split('-')[1] || 'blue';
  const colorMap: Record<string, string> = {
    blue: '#3b82f6',
    green: '#10b981',
    emerald: '#10b981',
    purple: '#8b5cf6',
    indigo: '#6366f1',
    red: '#ef4444',
    rose: '#f43f5e',
    amber: '#f59e0b',
  };
  const themeColor = colorMap[baseColor] || '#3b82f6';

  if (isLoading) {
    return (
      <div className="bg-gray-900/20 border border-gray-800/50 p-6 rounded-3xl animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 bg-gray-800/50 rounded-2xl" />
          <div className="w-16 h-6 bg-gray-800/50 rounded-full" />
        </div>
        <div className="space-y-3">
          <div className="w-24 h-4 bg-gray-800/30 rounded-full" />
          <div className="w-32 h-10 bg-gray-800/50 rounded-xl" />
        </div>
        <div className="mt-6 w-full h-12 bg-gray-800/20 rounded-2xl" />
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative group bg-gray-900/40 border border-gray-800/60 p-8 rounded-[2rem] hover:border-white/20 hover:bg-gray-900/60 transition-all duration-700 overflow-hidden cursor-pointer shadow-2xl",
        size === 'sm' && "p-5 rounded-[1.5rem]",
        size === 'lg' && "p-10 rounded-[2.5rem]"
      )}
    >
      {/* Interactive Background Glow */}
      <div 
        className="absolute -right-8 -top-8 w-40 h-40 blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none" 
        style={{ backgroundColor: themeColor }}
      />
      <div 
        className="absolute -left-8 -bottom-8 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none" 
        style={{ backgroundColor: themeColor }}
      />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative">
            <div 
              className="absolute inset-0 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-xl"
              style={{ backgroundColor: themeColor }}
            />
            <div className={cn(
              "relative p-3 rounded-xl ring-1 ring-white/10 shadow-2xl backdrop-blur-xl transition-all duration-500 group-hover:scale-110",
              data.iconBg, data.iconColor
            )}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-lg transition-transform group-hover:scale-105",
            isUp ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5" : 
                   "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5"
          )}>
            {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {data.trend.value}%
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-black text-gray-500 group-hover:text-gray-400 transition-colors uppercase tracking-[0.3em] block leading-none mb-1">
            {data.title}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white tracking-tighter group-hover:text-white transition-colors duration-500">
              {data.value}
            </span>
            {data.unit && <span className="text-xs font-black text-gray-600 uppercase tracking-widest">{data.unit}</span>}
          </div>
        </div>

        {/* Premium Sparkline */}
        {data.sparklineData && (
          <div className="h-14 w-full relative group/spark">
            <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover/spark:opacity-20 transition-opacity duration-700" />
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.sparklineData.map(v => ({ v }))}>
                <defs>
                  <linearGradient id={`gradient-${data.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={themeColor} stopOpacity={0.4}/>
                    <stop offset="100%" stopColor={themeColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="v" 
                  stroke={themeColor} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill={`url(#gradient-${data.id})`}
                  isAnimationActive={true}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        
        <div className="flex items-center gap-2 pt-2">
          <div className="w-1 h-1 rounded-full bg-gray-700" />
          <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest group-hover:text-gray-500 transition-colors">
            {data.trend.label}
          </p>
        </div>
      </div>
    </div>
  );
}
