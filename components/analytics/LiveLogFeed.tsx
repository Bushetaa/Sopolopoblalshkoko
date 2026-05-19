"use client";

import React from 'react';
import { useLiveLogs } from '@/hooks/useLiveLogs';
import { LOG_LEVEL_STYLES, STATUS_CODE_COLORS } from '@/lib/analytics-utils';
import { cn } from '@/lib/utils';
import { Play, Pause, Filter, ShieldAlert, Activity } from 'lucide-react';
import { AnalyticsFilterState } from '@/types/layout';

interface LiveLogFeedProps {
  filters?: AnalyticsFilterState;
}

export default function LiveLogFeed({ filters }: LiveLogFeedProps) {
  const { filteredLogs, isPaused, togglePause, levelFilter, setLevelFilter } = useLiveLogs(filters);

  return (
    <div className="bg-gray-950/50 border border-gray-800/80 rounded-2xl overflow-hidden flex flex-col h-full shadow-2xl min-h-[500px] backdrop-blur-xl group/feed">
      {/* Toolbar */}
      <div className="bg-gray-900/40 px-4 py-2.5 border-b border-gray-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full animate-pulse" />
              <div className="relative p-1.5 bg-blue-500/10 rounded-lg ring-1 ring-blue-500/20">
                <ShieldAlert className="h-3.5 w-3.5 text-blue-400" />
              </div>
            </div>
            <h3 className="text-xs font-black text-gray-100 uppercase tracking-widest">Traffic Feed</h3>
          </div>
          <div className="h-3 w-[1px] bg-gray-800" />
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "w-1 h-1 rounded-full transition-all duration-500",
              isPaused ? "bg-gray-600" : "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            )} />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
              {isPaused ? 'Paused' : 'Live'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-0.5 bg-gray-950/60 p-0.5 rounded-lg border border-gray-800/50 shadow-inner">
            {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl as any)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter transition-all duration-300",
                  levelFilter === lvl 
                    ? "bg-gray-800 text-blue-400 shadow-lg ring-1 ring-white/5" 
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
              "p-1.5 rounded-lg border transition-all duration-300 active:scale-90",
              isPaused 
                ? "bg-blue-600/20 border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                : "bg-gray-900/50 border-gray-800/50 text-gray-500 hover:text-white hover:border-gray-700"
            )}
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5 fill-current" />}
          </button>
        </div>
      </div>

      {/* Header Labels */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-900/10 border-b border-gray-800/40 text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">
        <div className="col-span-1.5 text-center">Severity</div>
        <div className="col-span-1.5 text-center">Verb</div>
        <div className="col-span-4">Resource Path</div>
        <div className="col-span-1 text-center">Code</div>
        <div className="col-span-1.5 text-center">Delay</div>
        <div className="col-span-2.5 text-right">Gateway</div>
      </div>

      {/* Log Entries */}
      <div className="flex-1 overflow-y-auto font-mono scrollbar-none hover:scrollbar-thin scrollbar-thumb-gray-800/50 scrollbar-track-transparent">
        <div className="divide-y divide-gray-800/30">
          {filteredLogs.map((log) => (
            <div 
              key={log.id} 
              className="grid grid-cols-12 gap-2 px-4 py-2.5 hover:bg-white/[0.02] transition-colors group/row items-center cursor-default"
            >
              <div className="col-span-1.5 flex justify-center">
                <span className={cn(
                  "px-1.5 py-0.5 rounded-[4px] text-[7px] font-black leading-none uppercase tracking-tighter border shadow-sm transition-transform group-hover/row:scale-105",
                  log.level === 'ERROR' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                  log.level === 'WARN' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                )}>
                  {log.level}
                </span>
              </div>
              <div className="col-span-1.5 flex justify-center">
                <span className={cn(
                  "font-black tracking-tight text-[9px] px-1.5 py-0.5 rounded-md bg-gray-900/50 border border-white/5",
                  log.method === 'GET' ? "text-emerald-500" : 
                  log.method === 'POST' ? "text-blue-500" : 
                  log.method === 'PUT' ? "text-amber-500" : 
                  log.method === 'DELETE' ? "text-rose-500" : "text-purple-500"
                )}>
                  {log.method}
                </span>
              </div>
              <div className="col-span-4 truncate text-gray-400 font-medium tracking-tight text-[10px] group-hover/row:text-gray-200 transition-colors">
                {log.path}
              </div>
              <div className="col-span-1 flex justify-center">
                <span className={cn(
                  "font-black text-[10px] tabular-nums", 
                  log.statusCode >= 500 ? "text-rose-500" :
                  log.statusCode >= 400 ? "text-amber-500" :
                  "text-emerald-500"
                )}>
                  {log.statusCode}
                </span>
              </div>
              <div className="col-span-1.5 text-center text-gray-500 font-bold text-[9px] tabular-nums group-hover/row:text-gray-400">
                {log.latency}ms
              </div>
              <div className="col-span-2.5 text-right">
                <span className="text-gray-600 font-black uppercase tracking-tighter text-[8px] bg-gray-900/30 px-1.5 py-0.5 rounded border border-white/5 group-hover/row:border-blue-500/20 group-hover/row:text-blue-400/80 transition-all truncate inline-block max-w-full">
                  {log.apiName}
                </span>
              </div>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-600 py-24">
              <div className="flex flex-col items-center gap-4 group/empty">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full group-hover/empty:bg-blue-500/10 transition-colors duration-700" />
                  <Activity className="h-10 w-10 opacity-20 group-hover/empty:opacity-40 transition-opacity duration-700 animate-pulse" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 group-hover/empty:text-gray-500 transition-colors">No Incoming Traffic</p>
                  <p className="text-[8px] font-bold text-gray-800 uppercase tracking-widest">Listening on port 8080...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Status */}
      <div className="px-4 py-2 bg-gray-900/40 border-t border-gray-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
            {filteredLogs.length} Records Buffered
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
             <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-[7px] text-gray-400 font-black">SPACE</kbd>
             <span className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">{isPaused ? 'Resume' : 'Pause'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
