"use client";

import React from 'react';
import Link from 'next/link';
import { Plug, Power, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock: all plugins across all gateways
const mockPlugins = [
  { id: 'plg-1', name: 'ratelimit', enabled: true, scope: 'Gateway', gatewayId: 'gw-1', gatewayName: 'Main E-Commerce', phase: 'RateLimiting' },
  { id: 'plg-2', name: 'cors', enabled: true, scope: 'Gateway', gatewayId: 'gw-1', gatewayName: 'Main E-Commerce', phase: 'PreRouting' },
  { id: 'plg-3', name: 'jwt', enabled: true, scope: 'Route', gatewayId: 'gw-1', gatewayName: 'Main E-Commerce', phase: 'Authentication' },
  { id: 'plg-4', name: 'apikey', enabled: false, scope: 'Gateway', gatewayId: 'gw-2', gatewayName: 'Internal Tools', phase: 'Authentication' },
];

export default function GlobalPluginsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold font-display text-gray-50">All Plugins</h2>
        <p className="text-sm text-gray-400 mt-1">A global view of plugins across all your gateways and routes.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Plugin</th>
              <th className="px-6 py-4 font-medium">Phase</th>
              <th className="px-6 py-4 font-medium">Scope</th>
              <th className="px-6 py-4 font-medium">Gateway</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {mockPlugins.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <Plug className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-base font-medium text-gray-300">No Plugins Found</p>
                </td>
              </tr>
            ) : (
              mockPlugins.map((plg) => (
                <tr key={plg.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${plg.gatewayId}/plugins`} className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded flex items-center justify-center", plg.enabled ? "bg-blue-500/10 border border-blue-500/20" : "bg-gray-800 border border-gray-700")}>
                        <Plug className={cn("w-4 h-4", plg.enabled ? "text-blue-400" : "text-gray-500")} />
                      </div>
                      <span className="font-medium text-gray-100 group-hover:text-blue-400 transition-colors capitalize">{plg.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300 font-mono text-xs bg-gray-800 px-2 py-1 rounded">{plg.phase}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border",
                      plg.scope === 'Gateway'
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    )}>
                      {plg.scope}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${plg.gatewayId}/plugins`} className="text-gray-400 hover:text-blue-400 transition-colors text-xs">
                      {plg.gatewayName}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border",
                      plg.enabled
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-gray-800 text-gray-400 border-gray-700"
                    )}>
                      <Power className="w-3 h-3" />
                      {plg.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
