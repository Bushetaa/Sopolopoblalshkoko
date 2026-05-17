"use client";

import React from 'react';
import Link from 'next/link';
import { Target, Server, ExternalLink, MoreVertical, Edit, Trash, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { apiClient, ServiceTarget, Service } from '@/lib/api-client';

interface EnhancedTarget extends ServiceTarget {
  serviceName: string;
  gatewayId: string;
}

export default function GlobalServiceTargetsPage() {
  const router = useRouter();
  const [targets, setTargets] = React.useState<EnhancedTarget[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [fetchedTargets, fetchedServices] = await Promise.all([
        apiClient.serviceTargets.getAll(),
        apiClient.services.getAll()
      ]);

      const formatted = fetchedTargets.map(target => {
        const svc = fetchedServices.find(s => s.id === target.service_id);
        return {
          ...target,
          serviceName: svc?.name || 'Unknown Service',
          gatewayId: svc?.gateway_id || ''
        };
      });

      setTargets(formatted);
    } catch (error) {
      console.error('Failed to fetch targets', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this target?")) return;
    setIsDeleting(id);
    try {
      await apiClient.serviceTargets.delete(id);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete target", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50">Service Targets</h2>
          <p className="text-sm text-gray-400 mt-1">A global view of all upstream targets across your services.</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Target URL</th>
              <th className="px-6 py-4 font-medium">Parent Service</th>
              <th className="px-6 py-4 font-medium">Weight</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Target className="w-12 h-12 text-gray-700 mb-3 animate-pulse" />
                    <p className="text-base font-medium text-gray-300">Loading Targets...</p>
                  </div>
                </td>
              </tr>
            ) : targets.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Target className="w-12 h-12 text-gray-700 mb-3" />
                    <p className="text-base font-medium text-gray-300">No Targets Found</p>
                    <p className="mt-1">Add targets within your service configuration.</p>
                  </div>
                </td>
              </tr>
            ) : (
              targets.map((target) => (
                <tr key={target.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-800 border border-gray-700 flex items-center justify-center">
                        <Target className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm text-gray-100">{target.url}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={target.gatewayId ? `/api-gateway/${target.gatewayId}/services/${target.service_id}` : '#'}
                      className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Server className="w-3.5 h-3.5" />
                      {target.serviceName}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-gray-800 text-gray-300 text-xs font-mono border border-gray-700">
                      w:{target.weight || 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button disabled={isDeleting === target.id} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors disabled:opacity-50">
                          {isDeleting === target.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem 
                          onClick={() => target.gatewayId && router.push(`/api-gateway/${target.gatewayId}/services/${target.service_id}/edit`)} 
                          className="cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Parent Service
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => target.id && handleDelete(target.id)}
                          className="cursor-pointer text-red-500 hover:text-red-400 hover:bg-red-500/10 focus:text-red-400 focus:bg-red-500/10"
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete Target
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
