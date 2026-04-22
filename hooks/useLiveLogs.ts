"use client";

import { useState, useEffect, useMemo } from 'react';
import { generateLogEntry } from '@/lib/analytics-utils';
import { LogEntry, LogLevel } from '@/types/layout';

export function useLiveLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'ALL'>('ALL');

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setLogs(prev => {
        const newEntry = generateLogEntry();
        return [newEntry, ...prev].slice(0, 50);
      });
    }, Math.random() * 1200 + 800); // 800ms - 2000ms

    return () => clearInterval(interval);
  }, [isPaused]);

  const filteredLogs = useMemo(() => {
    if (levelFilter === 'ALL') return logs;
    return logs.filter(log => log.level === levelFilter);
  }, [logs, levelFilter]);

  return {
    logs,
    filteredLogs,
    isPaused,
    togglePause: () => setIsPaused(prev => !prev),
    levelFilter,
    setLevelFilter,
  };
}
