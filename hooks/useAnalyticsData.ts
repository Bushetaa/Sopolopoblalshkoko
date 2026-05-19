"use client";

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { AnalyticsFilterState, MetricCardData, TrafficDataPoint, RequestDistributionData, ResponseTimeBucket, StatusCodeData, KPIMetric } from '@/types/layout';
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { getKPIStatus } from '@/lib/analytics-utils';

export function useAnalyticsData(filters: AnalyticsFilterState) {
  const { data: metricsData = [], isLoading: isMetricsLoading } = useQuery({
    queryKey: ['hourly-metrics-mv', filters.dateRange.from.toISOString(), filters.dateRange.to.toISOString()],
    queryFn: () => apiClient.logs.getHourlyMetricsMV({
      from: filters.dateRange.from.toISOString(),
      to: filters.dateRange.to.toISOString()
    }),
    refetchInterval: 10000,
  });

  const { data: logsData = [], isLoading: isLogsLoading } = useQuery({
    queryKey: ['raw-logs', filters.dateRange.from.toISOString(), filters.dateRange.to.toISOString()],
    queryFn: () => apiClient.logs.getRequests({
      from: filters.dateRange.from.toISOString(),
      to: filters.dateRange.to.toISOString()
    }),
    refetchInterval: 10000,
  });

  const isLoading = isMetricsLoading || isLogsLoading;

  const trafficData = useMemo<TrafficDataPoint[]>(() => {
    if (!Array.isArray(metricsData) || !metricsData.length) return [];
    
    // Sort chronological for chart
    const sortedMetrics = [...metricsData].sort((a, b) => 
      new Date(a?.timestamp_hour || 0).getTime() - new Date(b?.timestamp_hour || 0).getTime()
    );

    // Group by granularity
    const groupedData: Record<string, TrafficDataPoint> = {};
    
    sortedMetrics.forEach(metric => {
      if (!metric?.timestamp_hour) return;
      
      const date = new Date(metric.timestamp_hour);
      let timeLabel = '';
      
      if (filters.granularity === 'hourly') {
        timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (filters.granularity === 'daily') {
        timeLabel = date.toLocaleDateString([], { month: 'short', day: '2-digit' });
      } else if (filters.granularity === 'weekly') {
        // Simple week grouping
        timeLabel = `Week ${Math.ceil(date.getDate() / 7)}`;
      } else {
        timeLabel = date.toLocaleDateString([], { month: 'short', year: '2-digit' });
      }
      
      if (!groupedData[timeLabel]) {
        groupedData[timeLabel] = {
          time: timeLabel,
          requests: 0,
          success: 0,
          errors: 0,
          p50: 0,
          p95: 0,
          _sumLatency: 0
        } as any;
      }
      
      const g = groupedData[timeLabel] as any;
      g.requests += (metric.total_requests || 0);
      g.errors += (metric.total_errors || 0);
      g.success += ((metric.total_requests || 0) - (metric.total_errors || 0));
      g._sumLatency += (metric.sum_latency_ms || 0);
      if ((metric.max_latency_ms || 0) > g.p95) {
        g.p95 = metric.max_latency_ms || 0;
      }
    });

    return Object.values(groupedData).map((g: any) => ({
      time: g.time,
      requests: g.requests,
      success: g.success,
      errors: g.errors,
      p50: g.requests > 0 ? Math.round(g._sumLatency / g.requests) : 0,
      p95: g.p95 || (g.requests > 0 ? Math.round(g._sumLatency / g.requests) * 1.5 : 0)
    }));
  }, [metricsData, filters.granularity]);

  const kpiCards = useMemo<MetricCardData[]>(() => {
    let totalReq = 0;
    let totalErr = 0;
    let totalSumLatency = 0;

    // For trend calculation, split data into two halves
    const half = Math.floor(metricsData.length / 2);
    let firstHalfReq = 0;
    let secondHalfReq = 0;

    if (Array.isArray(metricsData)) {
      metricsData.forEach((m, idx) => {
        const reqs = m?.total_requests || 0;
        totalReq += reqs;
        totalErr += (m?.total_errors || 0);
        totalSumLatency += (m?.sum_latency_ms || 0);

        if (idx < half) firstHalfReq += reqs;
        else secondHalfReq += reqs;
      });
    }

    const successRate = totalReq > 0 ? ((totalReq - totalErr) / totalReq * 100) : 100;
    const errorRate = totalReq > 0 ? (totalErr / totalReq * 100) : 0;
    const avgLatency = totalReq > 0 ? Math.round(totalSumLatency / totalReq) : 0;

    // Simple trend calculation
    const reqTrend = firstHalfReq > 0 ? ((secondHalfReq - firstHalfReq) / firstHalfReq * 100) : 0;

    const formatNumber = (num: number) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
      return num.toString();
    };

    return [
      {
        id: 'total-requests',
        title: 'Total Requests',
        value: formatNumber(totalReq),
        trend: { 
          value: Math.abs(Number(reqTrend.toFixed(1))), 
          direction: reqTrend >= 0 ? 'up' : 'down', 
          label: 'vs. previous period', 
          isPositive: reqTrend >= 0 
        },
        icon: Activity,
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-500/10',
        sparklineData: trafficData.map(t => t.requests),
      },
      {
        id: 'success-rate',
        title: 'Success Rate',
        value: successRate.toFixed(1),
        unit: '%',
        trend: { value: 0.1, direction: 'up', label: 'stable', isPositive: true },
        icon: CheckCircle,
        iconColor: 'text-green-400',
        iconBg: 'bg-green-500/10',
        sparklineData: trafficData.map(t => t.requests > 0 ? (t.success / t.requests * 100) : 100),
      },
      {
        id: 'avg-response',
        title: 'Avg Response Time',
        value: avgLatency.toString(),
        unit: 'ms',
        trend: { value: 2, direction: 'down', label: 'improving', isPositive: true },
        icon: Clock,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-500/10',
        sparklineData: trafficData.map(t => t.p50),
      },
      {
        id: 'error-rate',
        title: 'Error Rate',
        value: errorRate.toFixed(2),
        unit: '%',
        trend: { value: 0.01, direction: 'down', label: 'stable', isPositive: true },
        icon: AlertTriangle,
        iconColor: 'text-red-400',
        iconBg: 'bg-red-500/10',
        sparklineData: trafficData.map(t => t.requests > 0 ? (t.errors / t.requests * 100) : 0),
      }
    ];
  }, [metricsData, trafficData]);

  // REAL DATA FROM LOGS: Distribution by Request Mode
  const distributionData = useMemo<RequestDistributionData[]>(() => {
    if (!Array.isArray(logsData) || !logsData.length) {
      return [
        { name: 'REST', value: 0, percentage: 0, color: '#3b82f6' },
        { name: 'Aggregate', value: 0, percentage: 0, color: '#8b5cf6' },
        { name: 'WebSocket', value: 0, percentage: 0, color: '#f97316' },
      ];
    }

    const counts: Record<string, number> = {};
    logsData.forEach(log => {
      const mode = log.mode || 'REST';
      counts[mode] = (counts[mode] || 0) + 1;
    });

    const total = logsData.length;
    const colors = ['#3b82f6', '#8b5cf6', '#f97316', '#14b8a6', '#ef4444'];
    
    return Object.entries(counts).map(([name, value], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      percentage: Math.round((value / total) * 100),
      color: colors[index % colors.length],
    }));
  }, [logsData]);

  // REAL DATA FROM LOGS: Latency Histogram
  const histogramData = useMemo<ResponseTimeBucket[]>(() => {
    if (!Array.isArray(logsData) || !logsData.length) return [];

    const buckets = [
      { range: '0-50ms', min: 0, max: 50, count: 0, severity: 'normal' as const },
      { range: '50-100ms', min: 50, max: 100, count: 0, severity: 'normal' as const },
      { range: '100-200ms', min: 100, max: 200, count: 0, severity: 'normal' as const },
      { range: '200-500ms', min: 200, max: 500, count: 0, severity: 'warning' as const },
      { range: '>500ms', min: 500, max: Infinity, count: 0, severity: 'critical' as const },
    ];

    logsData.forEach(log => {
      const lat = log.latency_ms || 0;
      const bucket = buckets.find(b => lat >= b.min && lat < b.max);
      if (bucket) bucket.count++;
    });

    const total = logsData.length;
    return buckets.map(b => ({
      range: b.range,
      count: b.count,
      percentage: Math.round((b.count / total) * 100),
      severity: b.severity,
    }));
  }, [logsData]);

  const statusCodeData = useMemo<StatusCodeData[]>(() => {
    return trafficData.slice(-7).map(t => ({
      period: t.time,
      '2xx': t.success,
      '3xx': 0,
      '4xx': Math.floor(t.errors * 0.8),
      '5xx': Math.floor(t.errors * 0.2),
    }));
  }, [trafficData]);

  const slaMetrics = useMemo<KPIMetric[]>(() => {
    let totalReq = 0;
    let totalErr = 0;
    let maxLat = 0;
    let sumLat = 0;

    if (Array.isArray(metricsData)) {
      metricsData.forEach(m => {
        totalReq += (m?.total_requests || 0);
        totalErr += (m?.total_errors || 0);
        sumLat += (m?.sum_latency_ms || 0);
        if ((m?.max_latency_ms || 0) > maxLat) maxLat = m.max_latency_ms;
      });
    }

    const currentSuccessRate = totalReq > 0 ? ((totalReq - totalErr) / totalReq * 100) : 100;
    const currentErrorRate = totalReq > 0 ? (totalErr / totalReq * 100) : 0;
    const currentP95 = maxLat;
    const avgThroughput = totalReq / (metricsData.length || 1); // rough estimate per hour/period

    return [
      {
        id: 'uptime',
        category: 'availability',
        name: 'Success Rate',
        current: Number(currentSuccessRate.toFixed(2)),
        target: 99.9,
        unit: '%',
        status: getKPIStatus(currentSuccessRate, 99.9, false),
        history: trafficData.map(t => t.requests > 0 ? (t.success / t.requests * 100) : 100),
        lowerIsBetter: false
      },
      {
        id: 'p95-latency',
        category: 'performance',
        name: 'Peak Latency',
        current: currentP95,
        target: 500,
        unit: 'ms',
        status: getKPIStatus(currentP95, 500, true),
        history: trafficData.map(t => t.p95),
        lowerIsBetter: true
      },
      {
        id: 'error-rate-sla',
        category: 'errors',
        name: 'Error Rate',
        current: Number(currentErrorRate.toFixed(2)),
        target: 1.0,
        unit: '%',
        status: getKPIStatus(currentErrorRate, 1.0, true),
        history: trafficData.map(t => t.requests > 0 ? (t.errors / t.requests * 100) : 0),
        lowerIsBetter: true
      },
      {
        id: 'throughput',
        category: 'traffic',
        name: 'Throughput',
        current: Math.round(avgThroughput),
        target: 5000,
        unit: 'req/h',
        status: getKPIStatus(avgThroughput, 5000, false),
        history: trafficData.map(t => t.requests),
        lowerIsBetter: false
      }
    ];
  }, [metricsData, trafficData]);

  return {
    kpiCards,
    trafficData,
    distributionData,
    histogramData,
    statusCodeData,
    slaMetrics,
    isLoading
  };
}
