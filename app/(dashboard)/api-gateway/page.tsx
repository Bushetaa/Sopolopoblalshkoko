"use client";

import React from 'react';
import Link from 'next/link';
import { Plus, Globe, MoreVertical, Server, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for gateways
const mockGateways = [
  { id: 'gw-1', name: 'Main E-Commerce', mode: 'pro', active: true, createdAt: '2026-05-01' },
  { id: 'gw-2', name: 'Internal Tools', mode: 'single', active: true, createdAt: '2026-05-10' },
  { id: 'gw-3', name: 'Legacy API', mode: 'pro', active: false, createdAt: '2026-04-15' },
];

export default function ApiGatewayPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50">API Gateways</h2>
          <p className="text-sm text-gray-400 mt-1">Manage your entry points, routing, and traffic policies.</p>
        </div>
        <Link 
          href="/api-gateway/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create Gateway</span>
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Gateway Name</th>
              <th className="px-6 py-4 font-medium">Mode</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Created At</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {mockGateways.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Globe className="w-12 h-12 text-gray-700 mb-3" />
                    <p className="text-base font-medium text-gray-300">No Gateways Found</p>
                    <p className="mt-1">Create your first gateway to start managing traffic.</p>
                  </div>
                </td>
              </tr>
            ) : (
              mockGateways.map((gw) => (
                <tr key={gw.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${gw.id}/services`} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="font-medium text-gray-100 group-hover:text-blue-400 transition-colors">
                        {gw.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {gw.mode === 'pro' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
                          <Server className="w-3 h-3" /> PRO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-gray-800 text-gray-300 border border-gray-700 px-2 py-0.5 rounded-full">
                          <Zap className="w-3 h-3" /> SINGLE
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border",
                      gw.active 
                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                        : "bg-gray-800 text-gray-400 border-gray-700"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", gw.active ? "bg-green-400" : "bg-gray-500")} />
                      {gw.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {gw.createdAt}
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
