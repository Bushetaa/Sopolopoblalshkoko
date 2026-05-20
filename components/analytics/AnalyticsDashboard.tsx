"use client";

import React, { useState } from 'react';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { AnalyticsFilterState } from '@/types/layout';
import MetricCard from '@/components/dashboard/MetricCard';
import GranularityToggle from '@/components/analytics/GranularityToggle';
import DateRangePicker from '@/components/analytics/DateRangePicker';
import TrafficChart from '@/components/dashboard/TrafficChart';
import RequestDistributionChart from '@/components/analytics/PieChart';
import ResponseHistogram from '@/components/analytics/ResponseHistogram';
import StatusCodeChart from '@/components/analytics/StatusCodeChart';
import SLATracker from '@/components/analytics/SLATracker';
import LiveLogFeed from '@/components/analytics/LiveLogFeed';
import { subDays } from 'date-fns';

export default function AnalyticsDashboard() {
  const [filters, setFilters] = useState<AnalyticsFilterState>({
    dateRange: {
      from: subDays(new Date(), 7),
      to: new Date(),
    },
    granularity: 'hourly',
  });

  const { kpiCards, trafficData, distributionData, histogramData, statusCodeData, slaMetrics, isLoading } = useAnalyticsData(filters);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-blue-400 font-medium uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Analytics Engine
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-50 tracking-tight">Platform Insights</h2>
          <div className="flex flex-wrap items-center gap-3">
            <GranularityToggle 
              value={filters.granularity} 
              onChange={(g) => setFilters(f => ({ ...f, granularity: g }))} 
            />
            <DateRangePicker 
              value={filters.dateRange} 
              onChange={(r) => setFilters(f => ({ ...f, dateRange: r }))} 
            />
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <MetricCard 
            key={card.id} 
            data={card} 
            isLoading={isLoading} 
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TrafficChart data={trafficData} isLoading={isLoading} />
        </div>
        <div>
          <RequestDistributionChart data={distributionData} isLoading={isLoading} />
        </div>
      </div>

      {/* SLA & Status Codes */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <StatusCodeChart data={statusCodeData} isLoading={isLoading} />
        </div>
        <div>
          <SLATracker metrics={slaMetrics} isLoading={isLoading} />
        </div>
      </div>

      {/* Histogram Section */}
      <div className="grid grid-cols-1 gap-6">
        <ResponseHistogram data={histogramData} isLoading={isLoading} />
      </div>

      {/* Live Logs Section */}
      <div className="grid grid-cols-1 gap-6">
        <LiveLogFeed />
      </div>
    </div>
  );
}
