"use client";

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { LogLevel } from '@/types/layout';

const getLogLevel = (statusCode: number): LogLevel => {
  if (statusCode >= 500) return 'ERROR';
  if (statusCode >= 400) return 'WARN';
  if (statusCode >= 200 && statusCode < 300) return 'SUCCESS';
  return 'INFO';
};

export function useLiveLogs() {
  const [isPaused, setIsPaused] = useState(false);
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'ALL'>('ALL');

  const { data: requestLogs = [], isLoading, error } = useQuery({
    queryKey: ['gateway-logs'],
    queryFn: () => apiClient.logs.getRequests(),
    refetchInterval: isPaused ? false : 3000,
  });

  const mappedLogs = useMemo(() => {
    if (!Array.isArray(requestLogs)) return [];
    return requestLogs.map(log => ({
      id: log?.request_id || Math.random().toString(),
      timestamp: log?.timestamp || new Date().toISOString(),
      level: getLogLevel(log?.status_code || 200),
      method: log?.method || 'UNKNOWN',
      path: log?.path || '/',
      statusCode: log?.status_code || 200,
      latency: log?.latency_ms || 0,
      apiName: log?.slug || log?.upstream_name || 'API Gateway',
      requestId: log?.request_id ? log.request_id.split('-')[0] : 'N/A',
    }));
  }, [requestLogs]);

  const filteredLogs = useMemo(() => {
    if (levelFilter === 'ALL') return mappedLogs;
    return mappedLogs.filter(log => log.level === levelFilter);
  }, [mappedLogs, levelFilter]);

  return {
    logs: mappedLogs,
    filteredLogs,
    isPaused,
    togglePause: () => setIsPaused(prev => !prev),
    levelFilter,
    setLevelFilter,
    isLoading,
    error
  };
}
