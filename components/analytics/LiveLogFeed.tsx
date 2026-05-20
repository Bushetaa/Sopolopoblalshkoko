"use client";

import React from 'react';
import { useLiveLogs } from '@/hooks/useLiveLogs';
import { LOG_LEVEL_STYLES, STATUS_CODE_COLORS } from '@/lib/analytics-utils';
import { cn } from '@/lib/utils';
import { Play, Pause, Filter, ShieldAlert, Activity } from 'lucide-react';

export default function LiveLogFeed() {
  const { filteredLogs, isPaused, togglePause, levelFilter, setLevelFilter } = useLiveLogs();

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-2xl min-h-[600px]">
      {/* Toolbar */}
      <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <ShieldAlert className="h-4 w-4 text-blue-400" />
            </div>
            <h3 className="font-bold text-gray-50 tracking-tight">Live Traffic Logs</h3>
          </div>
          <div className="h-4 w-[1px] bg-gray-800" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Connected</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-lg border border-gray-800">
            {['ALL', 'INFO', 'WARN', 'ERROR', 'SUCCESS'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl as any)}
                className={cn(
                  "px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter transition-all",
                  levelFilter === lvl 
                    ? "bg-gray-800 text-blue-400 shadow-sm" 
                    : "text-gray-600 hover:text-gray-400"
                )}
              >
                {lvl}
              </button>
            ))}
          </div>
          
          <button 
            onClick={togglePause}
            className={cn(
              "p-2 rounded-lg border transition-all",
              isPaused 
                ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
            )}
          >
            {isPaused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
          </button>
        </div>
      </div>

      {/* Header Labels */}
      <div className="grid grid-cols-12 gap-4 px-6 py-2 bg-gray-900/20 border-b border-gray-800 text-[9px] font-black text-gray-600 uppercase tracking-widest">
        <div className="col-span-1 text-center">Level</div>
        <div className="col-span-1 text-center">Method</div>
        <div className="col-span-3">Endpoint Path</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-center">Latency</div>
        <div className="col-span-2">API Service</div>
        <div className="col-span-3 text-right">Request ID</div>
      </div>

      {/* Log Entries */}
      <div className="flex-1 overflow-y-auto font-mono text-[11px] scrollbar-thin scrollbar-thumb-gray-800">
        <div className="divide-y divide-gray-800/50">
          {filteredLogs.map((log) => (
            <div key={log.id} className="grid grid-cols-12 gap-4 px-6 py-2.5 hover:bg-gray-800/30 transition-colors group">
              <div className="col-span-1 flex justify-center">
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[9px] font-black",
                  LOG_LEVEL_STYLES[log.level]
                )}>
                  {log.level}
                </span>
              </div>
              <div className="col-span-1 flex justify-center">
                <span className={cn(
                  "font-black tracking-tighter",
                  log.method === 'GET' ? "text-green-500" : 
                  log.method === 'POST' ? "text-blue-500" : 
                  log.method === 'PUT' ? "text-yellow-500" : 
                  log.method === 'DELETE' ? "text-red-500" : "text-purple-500"
                )}>
                  {log.method}
                </span>
              </div>
              <div className="col-span-3 truncate text-gray-300 font-medium">
                {log.path}
              </div>
              <div className="col-span-1 flex justify-center">
                <span className={cn("font-black", STATUS_CODE_COLORS[log.statusCode] || "text-gray-400")}>
                  {log.statusCode}
                </span>
              </div>
              <div className="col-span-1 text-center text-gray-500 font-bold">
                {log.latency}ms
              </div>
              <div className="col-span-2 text-gray-400 font-semibold truncate">
                {log.apiName}
              </div>
              <div className="col-span-3 text-right text-gray-600 group-hover:text-blue-500/50 transition-colors font-bold tracking-tighter uppercase">
                {log.requestId}
              </div>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-600 py-20">
              <div className="flex flex-col items-center gap-3">
                <Activity className="h-10 w-10 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">Waiting for incoming traffic...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Status */}
      <div className="px-6 py-2 bg-gray-900/50 border-t border-gray-800 flex items-center justify-between">
        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
          Showing {filteredLogs.length} of 50 cached logs
        </div>
        <div className="text-[10px] font-bold text-gray-500 italic">
          Press Space to {isPaused ? 'Resume' : 'Pause'}
        </div>
      </div>
    </div>
  );
}
