"use client";

import React from 'react';
import { useLiveLogs } from '@/hooks/useLiveLogs';
import { LOG_LEVEL_STYLES, STATUS_CODE_COLORS } from '@/lib/analytics-utils';
import { cn } from '@/lib/utils';
import { Play, Pause, Filter, ShieldAlert, Activity } from 'lucide-react';

export default function LiveLogFeed() {
  const { filteredLogs, isPaused, togglePause, levelFilter, setLevelFilter } = useLiveLogs();

  return (
    <div className="bg-[#0B101B] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col h-full shadow-2xl min-h-[600px] relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
      {/* Toolbar */}
      <div className="bg-[#050810]/80 px-6 py-5 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
              <ShieldAlert className="h-5 w-5 text-blue-400 stroke-[2.5px]" />
            </div>
            <div>
              <h3 className="font-black text-white tracking-tight text-sm">Live Traffic Logs</h3>
              <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                Real-time Stream
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-[#0F172A] p-1 rounded-xl border border-white/5">
            {['ALL', 'INFO', 'WARN', 'ERROR', 'SUCCESS'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl as any)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                  levelFilter === lvl 
                    ? "bg-[#2563EB] text-white shadow-lg" 
                    : "text-[#475569] hover:text-white hover:bg-white/5"
                )}
              >
                {lvl}
              </button>
            ))}
          </div>
          
          <button 
            onClick={togglePause}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl border transition-all active:scale-95 shadow-lg",
              isPaused 
                ? "bg-blue-600 border-blue-500 text-white shadow-blue-500/20" 
                : "bg-[#0F172A] border-white/5 text-[#64748B] hover:text-white hover:bg-white/5"
            )}
          >
            {isPaused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
          </button>
        </div>
      </div>

      {/* Header Labels */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#050810]/40 border-b border-white/5 text-[9px] font-black text-[#64748B] uppercase tracking-[0.2em]">
        <div className="col-span-1 text-center">Level</div>
        <div className="col-span-1 text-center">Method</div>
        <div className="col-span-3">Endpoint Path</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-center">Latency</div>
        <div className="col-span-2">API Service</div>
        <div className="col-span-3 text-right">Request ID</div>
      </div>

      {/* Log Entries */}
      <div className="flex-1 overflow-y-auto font-mono text-[11px] scrollbar-thin scrollbar-thumb-white/5">
        <div className="divide-y divide-white/5">
          {filteredLogs.map((log) => (
            <div key={log.id} className="grid grid-cols-12 gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-all group border-l-2 border-transparent hover:border-blue-500/40">
              <div className="col-span-1 flex justify-center">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                  LOG_LEVEL_STYLES[log.level]
                )}>
                  {log.level}
                </span>
              </div>
              <div className="col-span-1 flex justify-center">
                <span className={cn(
                  "font-black tracking-tighter text-[10px]",
                  log.method === 'GET' ? "text-emerald-400" : 
                  log.method === 'POST' ? "text-blue-400" : 
                  log.method === 'PUT' ? "text-yellow-400" : 
                  log.method === 'DELETE' ? "text-red-400" : "text-purple-400"
                )}>
                  {log.method}
                </span>
              </div>
              <div className="col-span-3 truncate text-gray-200 font-bold tracking-tight">
                {log.path}
              </div>
              <div className="col-span-1 flex justify-center">
                <span className={cn("font-black text-[10px] tabular-nums", STATUS_CODE_COLORS[log.statusCode] || "text-gray-400")}>
                  {log.statusCode}
                </span>
              </div>
              <div className="col-span-1 text-center text-[#475569] font-black text-[10px] tabular-nums">
                {log.latency}<span className="text-[8px] ml-0.5">ms</span>
              </div>
              <div className="col-span-2 text-[#94A3B8] font-black uppercase tracking-tighter truncate text-[10px]">
                {log.apiName}
              </div>
              <div className="col-span-3 text-right text-[#475569] group-hover:text-blue-400/50 transition-colors font-black tracking-[0.1em] text-[9px] uppercase">
                {log.requestId}
              </div>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="h-full flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center animate-pulse">
                  <Activity className="h-8 w-8 text-[#1E293B]" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#475569]">Waiting for incoming traffic...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Status */}
      <div className="px-6 py-4 bg-[#050810]/80 border-t border-white/5 flex items-center justify-between backdrop-blur-md">
        <div className="text-[9px] font-black text-[#475569] uppercase tracking-[0.2em] flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-blue-500" />
          Showing {filteredLogs.length} of 50 cached logs
        </div>
        <div className="text-[9px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-[#0F172A] border border-white/10 rounded text-white">Space</kbd>
          to {isPaused ? 'Resume' : 'Pause'}
        </div>
      </div>
    </div>
  );
}
