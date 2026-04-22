"use client";

import { useState, useEffect, useMemo } from 'react';
import { AnalyticsFilterState, MetricCardData, TrafficDataPoint, RequestDistributionData, ResponseTimeBucket, StatusCodeData, KPIMetric } from '@/types/layout';
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { getKPIStatus } from '@/lib/analytics-utils';

export function useAnalyticsData(filters: AnalyticsFilterState) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const kpiCards = useMemo<MetricCardData[]>(() => [
    {
      id: 'total-requests',
      title: 'Total Requests',
      value: '2.4M',
      trend: { value: 18.2, direction: 'up', label: 'vs. last week', isPositive: true },
      icon: Activity,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      sparklineData: [120, 140, 135, 180, 160, 200, 240],
    },
    {
      id: 'success-rate',
      title: 'Success Rate',
      value: '99.2',
      unit: '%',
      trend: { value: 0.3, direction: 'up', label: 'vs. last week', isPositive: true },
      icon: CheckCircle,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/10',
      sparklineData: [98.8, 99.0, 98.7, 99.1, 99.3, 99.2, 99.2],
    },
    {
      id: 'avg-response',
      title: 'Avg Response Time',
      value: '142',
      unit: 'ms',
      trend: { value: 8.5, direction: 'down', label: 'vs. last week', isPositive: true },
      icon: Clock,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
      sparklineData: [155, 150, 148, 145, 142, 140, 142],
    },
    {
      id: 'error-rate',
      title: 'Error Rate',
      value: '0.08',
      unit: '%',
      trend: { value: 12.4, direction: 'up', label: 'vs. last week', isPositive: false },
      icon: AlertTriangle,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/10',
      sparklineData: [0.05, 0.06, 0.04, 0.07, 0.08, 0.09, 0.08],
    }
  ], []);

  const trafficData = useMemo<TrafficDataPoint[]>(() => {
    const data: TrafficDataPoint[] = [];
    const count = filters.granularity === 'hourly' ? 24 : 7;
    for (let i = 0; i < count; i++) {
      data.push({
        time: filters.granularity === 'hourly' ? `${i.toString().padStart(2, '0')}:00` : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        requests: Math.floor(Math.random() * 50000) + 10000,
        success: Math.floor(Math.random() * 45000) + 5000,
        errors: Math.floor(Math.random() * 2000),
        p50: Math.floor(Math.random() * 100) + 50,
        p95: Math.floor(Math.random() * 200) + 100,
      });
    }
    return data;
  }, [filters.granularity]);

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
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      period: day,
      '2xx': Math.floor(Math.random() * 1000) + 500,
      '3xx': Math.floor(Math.random() * 200) + 50,
      '4xx': Math.floor(Math.random() * 100) + 20,
      '5xx': Math.floor(Math.random() * 50) + 10,
    }));
  }, []);

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
