"use client";

import React from 'react';
import { FolderOpen, Plus, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock collections
const mockCollections = [
  { id: 'col-1', name: 'v1', description: 'Version 1 of the API', active: true },
  { id: 'col-2', name: 'auth', description: 'Authentication related endpoints', active: true },
  { id: 'col-3', name: 'billing', description: 'Stripe webhook and billing', active: false },
];

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-display text-gray-50">Collections</h3>
          <p className="text-sm text-gray-400 mt-1">Group your services logically. (Pro Mode only)</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
          <Plus className="w-4 h-4" />
          <span>Create Collection</span>
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {mockCollections.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-gray-700 mb-3" />
                    <p className="text-base font-medium text-gray-300">No Collections Found</p>
                    <p className="mt-1">Create your first collection to group your services.</p>
                  </div>
                </td>
              </tr>
            ) : (
              mockCollections.map((col) => (
                <tr key={col.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-gray-100">
                    {col.name}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {col.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border",
                      col.active 
                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                        : "bg-gray-800 text-gray-400 border-gray-700"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", col.active ? "bg-green-400" : "bg-gray-500")} />
                      {col.active ? "Active" : "Inactive"}
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
