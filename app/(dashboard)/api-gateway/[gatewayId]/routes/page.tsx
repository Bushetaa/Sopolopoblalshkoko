"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { Route as RouteIcon, Plus, MoreVertical, GitMerge, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Routes
const mockRoutes = [
  { id: 'rt-1', path: '/api/v1/users', method: 'GET', serviceName: 'users-service', isAggregate: false },
  { id: 'rt-2', path: '/api/v1/dashboard', method: 'GET', serviceName: 'Multiple Services', isAggregate: true },
  { id: 'rt-3', path: '/api/v1/payments', method: 'POST', serviceName: 'payments-grpc', isAggregate: false },
];

export default function RoutesPage({ params }: { params: Promise<{ gatewayId: string }> }) {
  const { gatewayId } = use(params);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-display text-gray-50">Routes</h3>
          <p className="text-sm text-gray-400 mt-1">Map paths to your upstream services.</p>
        </div>
        <Link 
          href={`/api-gateway/${gatewayId}/routes/new`}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Route</span>
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Path</th>
              <th className="px-6 py-4 font-medium">Method</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Service(s)</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {mockRoutes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <RouteIcon className="w-12 h-12 text-gray-700 mb-3" />
                    <p className="text-base font-medium text-gray-300">No Routes Found</p>
                    <p className="mt-1">Add your first route to start proxying traffic.</p>
                  </div>
                </td>
              </tr>
            ) : (
              mockRoutes.map((rt) => (
                <tr key={rt.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${gatewayId}/routes/${rt.id}`} className="flex items-center gap-3">
                      <span className="font-mono text-gray-100 group-hover:text-blue-400 transition-colors">
                        {rt.path}
                      </span>
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
                  <td className="px-6 py-4 text-gray-400">
                    {rt.serviceName}
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
