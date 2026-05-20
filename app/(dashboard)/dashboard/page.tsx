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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-blue-400 font-medium uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Live Platform Status
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-50 tracking-tight">System Overview</h2>
          <Link 
            href="/api-gateway/new"
            className="group relative flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95 overflow-hidden border border-blue-400/20 hover:border-blue-400/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <Globe className="h-5 w-5 transition-transform group-hover:rotate-12 duration-500 text-blue-200" />
            <span>Deploy New Gateway</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <MetricCard key={card.id} data={card} isLoading={isLoading} />
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
