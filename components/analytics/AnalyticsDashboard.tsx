"use client";

import React, { useState, useEffect } from 'react';
import { Info, Clock } from 'lucide-react';
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
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportStatus, setReportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateCooldown = () => {
      const lastSentStr = localStorage.getItem('sopo_report_last_sent');
      if (lastSentStr) {
        const lastSent = parseInt(lastSentStr, 10);
        const diff = Date.now() - lastSent;
        const cooldown = 24 * 60 * 60 * 1000;
        if (diff < cooldown) {
          return cooldown - diff;
        }
      }
      return 0;
    };

    setCooldownTimeLeft(calculateCooldown());

    const interval = setInterval(() => {
      setCooldownTimeLeft(calculateCooldown());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeLeft = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

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
          <div className="flex flex-wrap xl:flex-nowrap items-end gap-3">
            <div className="flex flex-col gap-1.5 items-start xl:items-center">
              <span className="text-[8px] text-[#64748B] uppercase tracking-widest font-black flex items-center gap-1.5">
                <Info className="w-3 h-3 text-blue-400" /> 1 Free Daily Report
              </span>
              <button
                onClick={async () => {
                  if (cooldownTimeLeft > 0) return;
                  setIsReportLoading(true);
                  setReportStatus('idle');
                  try {
                    const token = typeof window !== 'undefined' ? localStorage.getItem('sopo_access_token') : null;
                    const res = await fetch(process.env.NEXT_PUBLIC_REPORT_WEBHOOK_URL!, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                      },
                      body: JSON.stringify({ timestamp: new Date().toISOString() }),
                    });
                    if (res.ok) {
                      localStorage.setItem('sopo_report_last_sent', Date.now().toString());
                      setCooldownTimeLeft(24 * 60 * 60 * 1000);
                      setReportStatus('success');
                      setTimeout(() => setReportStatus('idle'), 8000);
                    } else {
                      setReportStatus('error');
                      setTimeout(() => setReportStatus('idle'), 4000);
                    }
                  } catch {
                    setReportStatus('error');
                    setTimeout(() => setReportStatus('idle'), 4000);
                  } finally {
                    setIsReportLoading(false);
                  }
                }}
                disabled={isReportLoading || cooldownTimeLeft > 0}
                className={`flex items-center justify-center whitespace-nowrap min-w-[260px] gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                  reportStatus === 'success'
                    ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                    : cooldownTimeLeft > 0
                    ? 'bg-white/5 text-[#94A3B8] shadow-none cursor-not-allowed border border-white/5'
                    : reportStatus === 'error'
                    ? 'bg-red-500 text-white shadow-red-500/25'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/25'
                }`}
              >
                {isReportLoading ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating Report...</>
                ) : reportStatus === 'success' ? (
                  <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Report sent — Check your email</>
                ) : cooldownTimeLeft > 0 ? (
                  <><Clock className="w-3.5 h-3.5 text-blue-400" /> Available in {formatTimeLeft(cooldownTimeLeft)}</>
                ) : reportStatus === 'error' ? (
                  <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg> Failed</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Get Report</>
                )}
              </button>
            </div>
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
            size="compact"
          />
        ))}
      </div>

      {/* Dashboard Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Main Analytics Area (2/3 Width) */}
        <div className="xl:col-span-2 space-y-6">
          <TrafficChart data={trafficData} isLoading={isLoading} />
          <StatusCodeChart data={statusCodeData} isLoading={isLoading} />
          <ResponseHistogram data={histogramData} isLoading={isLoading} />
        </div>

        {/* Side Metrics Area (1/3 Width) */}
        <div className="space-y-6 xl:sticky xl:top-6">
          <RequestDistributionChart data={distributionData} isLoading={isLoading} />
          <SLATracker metrics={slaMetrics} isLoading={isLoading} />
        </div>
      </div>

      {/* Live Logs Section (100% Width) */}
      <div className="grid grid-cols-1 gap-6">
        <LiveLogFeed />
      </div>
    </div>
  );
}
