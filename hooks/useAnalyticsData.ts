"use client";

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { AnalyticsFilterState, MetricCardData, TrafficDataPoint, RequestDistributionData, ResponseTimeBucket, StatusCodeData, KPIMetric } from '@/types/layout';
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { getKPIStatus } from '@/lib/analytics-utils';

export function useAnalyticsData(filters: AnalyticsFilterState) {
  const { data: metricsData = [], isLoading } = useQuery({
    queryKey: ['hourly-metrics-mv'],
    queryFn: () => apiClient.logs.getHourlyMetricsMV(),
    refetchInterval: 10000, // refresh every 10 seconds
  });

  const trafficData = useMemo<TrafficDataPoint[]>(() => {
    if (!Array.isArray(metricsData) || !metricsData.length) return [];
    
    // Sort chronological for chart
    const sortedMetrics = [...metricsData].sort((a, b) => 
      new Date(a?.timestamp_hour || 0).getTime() - new Date(b?.timestamp_hour || 0).getTime()
    );

    // Group by hour
    const groupedByHour: Record<string, TrafficDataPoint> = {};
    
    sortedMetrics.forEach(metric => {
      if (!metric?.timestamp_hour) return;
      
      const timeLabel = new Date(metric.timestamp_hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (!groupedByHour[timeLabel]) {
        groupedByHour[timeLabel] = {
          time: timeLabel,
          requests: 0,
          success: 0,
          errors: 0,
          p50: 0,
          p95: 0,
          _sumLatency: 0
        } as any;
      }
      
      const g = groupedByHour[timeLabel] as any;
      g.requests += (metric.total_requests || 0);
      g.errors += (metric.total_errors || 0);
      g.success += ((metric.total_requests || 0) - (metric.total_errors || 0));
      g._sumLatency += (metric.sum_latency_ms || 0);
      if ((metric.max_latency_ms || 0) > g.p95) {
        g.p95 = metric.max_latency_ms || 0;
      }
    });

    return Object.values(groupedByHour).map((g: any) => ({
      time: g.time,
      requests: g.requests,
      success: g.success,
      errors: g.errors,
      p50: g.requests > 0 ? Math.round(g._sumLatency / g.requests) : 0,
      p95: g.p95 || (g.requests > 0 ? Math.round(g._sumLatency / g.requests) * 1.5 : 0)
    }));
  }, [metricsData]);

  const kpiCards = useMemo<MetricCardData[]>(() => {
    let totalReq = 0;
    let totalErr = 0;
    let totalSumLatency = 0;

    if (Array.isArray(metricsData)) {
      metricsData.forEach(m => {
        totalReq += (m?.total_requests || 0);
        totalErr += (m?.total_errors || 0);
        totalSumLatency += (m?.sum_latency_ms || 0);
      });
    }

    const successRate = totalReq > 0 ? ((totalReq - totalErr) / totalReq * 100) : 100;
    const errorRate = totalReq > 0 ? (totalErr / totalReq * 100) : 0;
    const avgLatency = totalReq > 0 ? Math.round(totalSumLatency / totalReq) : 0;

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
        trend: { value: 0, direction: 'up', label: 'vs. last 24h', isPositive: true },
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
        trend: { value: 0, direction: 'up', label: 'vs. last 24h', isPositive: true },
        icon: CheckCircle,
        iconColor: 'text-green-400',
        iconBg: 'bg-green-500/10',
        sparklineData: trafficData.map(t => t.success > 0 ? (t.success / t.requests * 100) : 100),
      },
      {
        id: 'avg-response',
        title: 'Avg Response Time',
        value: avgLatency.toString(),
        unit: 'ms',
        trend: { value: 0, direction: 'down', label: 'vs. last 24h', isPositive: true },
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
        trend: { value: 0, direction: 'up', label: 'vs. last 24h', isPositive: false },
        icon: AlertTriangle,
        iconColor: 'text-red-400',
        iconBg: 'bg-red-500/10',
        sparklineData: trafficData.map(t => t.requests > 0 ? (t.errors / t.requests * 100) : 0),
      }
    ];
  }, [metricsData, trafficData]);

  // Keeping mock data for charts not yet supported by backend schema
  const distributionData = useMemo<RequestDistributionData[]>(() => [
    { name: 'REST', value: 1450000, percentage: 60, color: '#3b82f6' },
    { name: 'GraphQL', value: 600000, percentage: 25, color: '#8b5cf6' },
    { name: 'gRPC', value: 240000, percentage: 10, color: '#14b8a6' },
    { name: 'WebSocket', value: 110000, percentage: 5, color: '#f97316' },
  ], []);

  const histogramData = useMemo<ResponseTimeBucket[]>(() => [
    { range: '0-50ms', count: 850, percentage: 35, severity: 'normal' },
    { range: '50-100ms', count: 600, percentage: 25, severity: 'normal' },
    { range: '100-200ms', count: 480, percentage: 20, severity: 'normal' },
    { range: '200-500ms', count: 320, percentage: 13, severity: 'warning' },
    { range: '>500ms', count: 150, percentage: 7, severity: 'critical' },
  ], []);

  const statusCodeData = useMemo<StatusCodeData[]>(() => {
    return trafficData.slice(-7).map(t => ({
      period: t.time,
      '2xx': t.success,
      '3xx': 0,
      '4xx': Math.floor(t.errors * 0.8),
      '5xx': Math.floor(t.errors * 0.2),
    }));
  }, [trafficData]);

  const slaMetrics = useMemo<KPIMetric[]>(() => [
    {
      id: 'uptime',
      category: 'availability',
      name: 'Uptime',
      current: 99.98,
      target: 99.9,
      unit: '%',
      status: getKPIStatus(99.98, 99.9, false),
      history: Array.from({ length: 30 }, () => Math.random() * 0.1 + 99.9),
      lowerIsBetter: false
    },
    {
      id: 'p95-latency',
      category: 'performance',
      name: 'p95 Latency',
      current: 185,
      target: 200,
      unit: 'ms',
      status: getKPIStatus(185, 200, true),
      history: Array.from({ length: 30 }, () => Math.random() * 50 + 150),
      lowerIsBetter: true
    },
    {
      id: 'error-rate-sla',
      category: 'errors',
      name: 'Error Rate',
      current: 0.08,
      target: 1.0,
      unit: '%',
      status: getKPIStatus(0.08, 1.0, true),
      history: Array.from({ length: 30 }, () => Math.random() * 0.2),
      lowerIsBetter: true
    },
    {
      id: 'throughput',
      category: 'traffic',
      name: 'Throughput',
      current: 8750,
      target: 10000,
      unit: 'req/s',
      status: getKPIStatus(8750, 10000, false),
      history: Array.from({ length: 30 }, () => Math.random() * 2000 + 7000),
      lowerIsBetter: false
    }
  ], []);

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
