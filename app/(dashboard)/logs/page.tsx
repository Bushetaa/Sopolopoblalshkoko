"use client";

import React, { useState } from 'react';
import { ScrollText, Search, Filter, RefreshCw, ChevronDown, AlertCircle, CheckCircle2, Clock, Globe, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock log entries
const mockLogs = [
  { id: '1', timestamp: '2026-05-13 13:45:21', method: 'GET', path: '/api/v1/users', status: 200, latency: '12ms', gateway: 'Main E-Commerce', ip: '192.168.1.45' },
  { id: '2', timestamp: '2026-05-13 13:45:19', method: 'POST', path: '/api/v1/payments', status: 201, latency: '89ms', gateway: 'Main E-Commerce', ip: '10.0.0.12' },
  { id: '3', timestamp: '2026-05-13 13:45:18', method: 'GET', path: '/api/v1/products', status: 200, latency: '23ms', gateway: 'Main E-Commerce', ip: '192.168.1.45' },
  { id: '4', timestamp: '2026-05-13 13:45:15', method: 'GET', path: '/internal/health', status: 200, latency: '2ms', gateway: 'Internal Tools', ip: '127.0.0.1' },
  { id: '5', timestamp: '2026-05-13 13:45:12', method: 'POST', path: '/api/v1/auth/login', status: 401, latency: '45ms', gateway: 'Main E-Commerce', ip: '203.0.113.50' },
  { id: '6', timestamp: '2026-05-13 13:45:10', method: 'DELETE', path: '/api/v1/users/42', status: 403, latency: '8ms', gateway: 'Main E-Commerce', ip: '203.0.113.50' },
  { id: '7', timestamp: '2026-05-13 13:45:08', method: 'GET', path: '/api/v1/orders', status: 500, latency: '1200ms', gateway: 'Main E-Commerce', ip: '10.0.0.12' },
  { id: '8', timestamp: '2026-05-13 13:45:05', method: 'PUT', path: '/api/v1/users/15', status: 200, latency: '34ms', gateway: 'Main E-Commerce', ip: '192.168.1.100' },
  { id: '9', timestamp: '2026-05-13 13:45:02', method: 'GET', path: '/api/v1/dashboard/stats', status: 200, latency: '156ms', gateway: 'Legacy API', ip: '10.0.0.45' },
  { id: '10', timestamp: '2026-05-13 13:44:58', method: 'POST', path: '/api/v1/webhooks', status: 502, latency: '5000ms', gateway: 'Main E-Commerce', ip: '10.0.0.12' },
];

const getStatusColor = (status: number) => {
  if (status >= 500) return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-500' };
  if (status >= 400) return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', dot: 'bg-yellow-500' };
  if (status >= 300) return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-400' };
  return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500' };
};

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'POST': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    case 'PUT': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'DELETE': return 'text-red-400 bg-red-500/10 border-red-500/20';
    case 'PATCH': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    default: return 'text-gray-400 bg-gray-800 border-gray-700';
  }
};

export default function LogsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLive, setIsLive] = useState(true);

  const filteredLogs = mockLogs.filter(log => {
    if (search && !log.path.toLowerCase().includes(search.toLowerCase()) && !log.gateway.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter === '2xx' && (log.status < 200 || log.status >= 300)) return false;
    if (statusFilter === '4xx' && (log.status < 400 || log.status >= 500)) return false;
    if (statusFilter === '5xx' && log.status < 500) return false;
    return true;
  });

  // Stats
  const total = mockLogs.length;
  const success = mockLogs.filter(l => l.status >= 200 && l.status < 300).length;
  const clientErr = mockLogs.filter(l => l.status >= 400 && l.status < 500).length;
  const serverErr = mockLogs.filter(l => l.status >= 500).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50 flex items-center gap-3">
            <ScrollText className="w-6 h-6 text-blue-400" />
            Gateway Request Logs
          </h2>
          <p className="text-sm text-gray-400 mt-1">Real-time view of all requests passing through your gateways.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
              isLive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full", isLive ? "bg-emerald-400 animate-pulse" : "bg-gray-500")} />
            {isLive ? "Live" : "Paused"}
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors border border-gray-800">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Total Requests</div>
          <div className="text-2xl font-bold text-gray-100">{total}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-emerald-500 uppercase tracking-wider font-medium mb-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 2xx Success</div>
          <div className="text-2xl font-bold text-emerald-400">{success}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-yellow-500 uppercase tracking-wider font-medium mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> 4xx Client</div>
          <div className="text-2xl font-bold text-yellow-400">{clientErr}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-red-500 uppercase tracking-wider font-medium mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> 5xx Server</div>
          <div className="text-2xl font-bold text-red-400">{serverErr}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by path or gateway..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {['all', '2xx', '4xx', '5xx'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                statusFilter === f
                  ? "bg-gray-800 text-gray-100"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              {f === 'all' ? 'All' : f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-500 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-3 font-medium">Timestamp</th>
              <th className="px-5 py-3 font-medium">Method</th>
              <th className="px-5 py-3 font-medium">Path</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Latency</th>
              <th className="px-5 py-3 font-medium">Gateway</th>
              <th className="px-5 py-3 font-medium">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <ScrollText className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="font-medium text-gray-300">No logs match your filters</p>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const statusColor = getStatusColor(log.status);
                const latencyMs = parseInt(log.latency);
                const isSlowRequest = latencyMs > 1000;

                return (
                  <tr key={log.id} className="hover:bg-gray-800/20 transition-colors group">
                    <td className="px-5 py-3">
                      <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gray-600" />
                        {log.timestamp.split(' ')[1]}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn("inline-flex font-mono text-[10px] font-bold px-2 py-0.5 rounded border", getMethodColor(log.method))}>
                        {log.method}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-[12px] text-gray-200 group-hover:text-blue-400 transition-colors">{log.path}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md border", statusColor.bg, statusColor.text, statusColor.border)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", statusColor.dot)} />
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn("text-[11px] font-mono", isSlowRequest ? "text-red-400 font-bold" : "text-gray-400")}>
                        {log.latency}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] text-gray-500">{log.gateway}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] font-mono text-gray-600">{log.ip}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
