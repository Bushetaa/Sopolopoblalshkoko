"use client";

import React from 'react';
import Link from 'next/link';
import { Server, Globe, Activity, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock: all services across all gateways
const mockServices = [
  { id: 'svc-1', name: 'users-service', protocol: 'http', lbPolicy: 'round_robin', targetsCount: 3, gatewayId: 'gw-1', gatewayName: 'Main E-Commerce' },
  { id: 'svc-2', name: 'payments-grpc', protocol: 'grpc', lbPolicy: 'least_connections', targetsCount: 2, gatewayId: 'gw-1', gatewayName: 'Main E-Commerce' },
  { id: 'svc-3', name: 'auth-service', protocol: 'http', lbPolicy: 'round_robin', targetsCount: 1, gatewayId: 'gw-2', gatewayName: 'Internal Tools' },
];

export default function GlobalServicesPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold font-display text-gray-50">All Services</h2>
        <p className="text-sm text-gray-400 mt-1">A global view of services across all your gateways.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Service Name</th>
              <th className="px-6 py-4 font-medium">Gateway</th>
              <th className="px-6 py-4 font-medium">Protocol</th>
              <th className="px-6 py-4 font-medium">LB Policy</th>
              <th className="px-6 py-4 font-medium">Targets</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {mockServices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <Server className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-base font-medium text-gray-300">No Services Found</p>
                </td>
              </tr>
            ) : (
              mockServices.map((svc) => (
                <tr key={svc.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${svc.gatewayId}/services/${svc.id}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-800 border border-gray-700 flex items-center justify-center">
                        <Server className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <span className="font-medium text-gray-100 group-hover:text-blue-400 transition-colors">{svc.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${svc.gatewayId}/services`} className="text-gray-400 hover:text-blue-400 transition-colors text-xs">
                      {svc.gatewayName}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border",
                      svc.protocol === 'grpc'
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    )}>
                      {svc.protocol === 'grpc' ? <Activity className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                      {svc.protocol}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300 font-mono text-xs bg-gray-800 px-2 py-1 rounded">{svc.lbPolicy}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-gray-300 text-xs font-medium border border-gray-700">{svc.targetsCount}</span>
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
