"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FolderOpen, Plus, MoreVertical, Globe, ChevronRight, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock collections grouped by gateway
const mockCollections = [
  {
    gatewayId: 'gw-1',
    gatewayName: 'Main E-Commerce',
    gatewayMode: 'pro',
    collections: [
      { id: 'col-1', name: 'v1', description: 'Version 1 of the API', active: true, servicesCount: 4 },
      { id: 'col-2', name: 'auth', description: 'Authentication related endpoints', active: true, servicesCount: 2 },
      { id: 'col-3', name: 'billing', description: 'Stripe webhook and billing', active: false, servicesCount: 1 },
    ]
  },
  {
    gatewayId: 'gw-3',
    gatewayName: 'Legacy API',
    gatewayMode: 'pro',
    collections: [
      { id: 'col-4', name: 'legacy-v0', description: 'Deprecated v0 endpoints', active: false, servicesCount: 3 },
    ]
  }
];

export default function CollectionsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50">Collections</h2>
          <p className="text-sm text-gray-400 mt-1">Logical groupings of services within your Pro-mode gateways.</p>
        </div>
      </div>

      {mockCollections.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-base font-medium text-gray-300">No Collections Found</p>
          <p className="text-sm text-gray-500 mt-1">Collections are available in Pro-mode gateways only.</p>
        </div>
      ) : (
        mockCollections.map((gw) => (
          <div key={gw.gatewayId} className="space-y-4">
            {/* Gateway Header */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-100">{gw.gatewayName}</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
                  PRO
                </span>
              </div>
              <div className="flex-1" />
              <Link
                href={`/api-gateway/${gw.gatewayId}/collections`}
                className="text-xs text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                Manage <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gw.collections.map((col) => (
                <Link
                  key={col.id}
                  href={`/api-gateway/${gw.gatewayId}/collections`}
                  className={cn(
                    "bg-gray-900 border rounded-xl p-5 transition-all hover:border-gray-600 group",
                    col.active ? "border-gray-800" : "border-gray-800 opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                      <FolderOpen className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md border",
                      col.active
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-gray-800 text-gray-500 border-gray-700"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", col.active ? "bg-green-400" : "bg-gray-500")} />
                      {col.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-100 group-hover:text-blue-400 transition-colors font-mono">{col.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{col.description}</p>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-800">
                    <Server className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-400">{col.servicesCount} services</span>
                  </div>
                </Link>
              ))}

              {/* Add Collection Card */}
              <button className="bg-gray-950 border border-dashed border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-blue-400 hover:border-blue-500/30 transition-all min-h-[160px]">
                <Plus className="w-8 h-8" />
                <span className="text-sm font-medium">Add Collection</span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
