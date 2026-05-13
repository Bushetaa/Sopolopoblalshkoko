"use client";

import React from 'react';
import Link from 'next/link';
import { Route as RouteIcon, GitMerge, Link as LinkIcon, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock: all routes across all gateways
const mockRoutes = [
  { id: 'rt-1', path: '/api/v1/users', method: 'GET', serviceName: 'users-service', isAggregate: false, gatewayId: 'gw-1', gatewayName: 'Main E-Commerce' },
  { id: 'rt-2', path: '/api/v1/dashboard', method: 'GET', serviceName: 'Multiple Services', isAggregate: true, gatewayId: 'gw-1', gatewayName: 'Main E-Commerce' },
  { id: 'rt-3', path: '/api/v1/payments', method: 'POST', serviceName: 'payments-grpc', isAggregate: false, gatewayId: 'gw-1', gatewayName: 'Main E-Commerce' },
  { id: 'rt-4', path: '/internal/health', method: 'GET', serviceName: 'auth-service', isAggregate: false, gatewayId: 'gw-2', gatewayName: 'Internal Tools' },
];

export default function GlobalRoutesPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold font-display text-gray-50">All Routes</h2>
        <p className="text-sm text-gray-400 mt-1">A global view of routes across all your gateways.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Path</th>
              <th className="px-6 py-4 font-medium">Method</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Service(s)</th>
              <th className="px-6 py-4 font-medium">Gateway</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {mockRoutes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <RouteIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-base font-medium text-gray-300">No Routes Found</p>
                </td>
              </tr>
            ) : (
              mockRoutes.map((rt) => (
                <tr key={rt.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${rt.gatewayId}/routes/${rt.id}`} className="font-mono text-gray-100 group-hover:text-blue-400 transition-colors">
                      {rt.path}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex font-mono text-xs font-bold px-2 py-1 rounded border",
                      rt.method === 'GET' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      rt.method === 'POST' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    )}>
                      {rt.method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {rt.isAggregate ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                        <GitMerge className="w-3.5 h-3.5" /> Aggregate
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700">
                        <LinkIcon className="w-3.5 h-3.5" /> Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{rt.serviceName}</td>
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${rt.gatewayId}/routes`} className="text-gray-400 hover:text-blue-400 transition-colors text-xs">
                      {rt.gatewayName}
                    </Link>
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
