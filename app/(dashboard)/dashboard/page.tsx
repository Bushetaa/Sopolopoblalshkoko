"use client";

import React from 'react';
import { Plus, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import MetricCard from '@/components/dashboard/MetricCard';
import TrafficChart from '@/components/dashboard/TrafficChart';
import LiveLogFeed from '@/components/analytics/LiveLogFeed';
import { subDays } from 'date-fns';
import Link from 'next/link';

export default function DashboardPage() {
  const [filters] = React.useState({
    dateRange: { from: subDays(new Date(), 7), to: new Date() },
    granularity: 'hourly' as const,
  });

  const { kpiCards, trafficData, isLoading } = useAnalyticsData(filters);

  return (
    <div className="space-y-10 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* High-density Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            <div className="w-8 h-[2px] bg-blue-500" />
            Control Center
          </div>
          <h2 className="text-3xl font-black font-display text-white tracking-tight">System Overview</h2>
          <p className="text-[13px] text-[#64748B] mt-1.5 font-medium leading-relaxed">Real-time intelligence and operational metrics for your infrastructure.</p>
        </div>
        <Link 
          href="/api-gateway/new"
          className="group relative flex items-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-lg shadow-blue-500/25 active:scale-95 overflow-hidden border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center">
            <Globe className="h-3.5 w-3.5 text-white transition-transform group-hover:rotate-12 duration-500" />
          </div>
          <span>Deploy New Gateway</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <MetricCard key={card.id} data={card} isLoading={isLoading} size="compact" />
        ))}
      </div>

      {/* Charts & Logs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrafficChart data={trafficData} isLoading={isLoading} />
        </div>
        <div className="h-full">
          <LiveLogFeed />
        </div>
      </div>
    </div>
  );
}
