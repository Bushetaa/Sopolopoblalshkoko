"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { Server, Plus, MoreVertical, Globe, Activity, Edit, Trash, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { apiClient, Service } from '@/lib/api-client';
import CreateServiceModal from '@/components/api-gateway/modals/CreateServiceModal';

interface EnhancedService extends Service {
  targetsCount: number;
}

export default function ServicesPage({ params }: { params: Promise<{ gatewayId: string }> }) {
  const router = useRouter();
  const { gatewayId } = use(params);
  const [services, setServices] = React.useState<EnhancedService[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const fetchData = async () => {
    try {
      const [fetchedServices, targets] = await Promise.all([
        apiClient.services.getAll(),
        apiClient.serviceTargets.getAll()
      ]);

      const gwServices = fetchedServices.filter(s => s.gateway_id === gatewayId);
      const formatted = gwServices.map(svc => {
        const tCount = targets.filter(t => t.service_id === svc.id).length;
        return {
          ...svc,
          targetsCount: tCount
        };
      });

      setServices(formatted);
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (gatewayId) {
      fetchData();
    }
  }, [gatewayId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setIsDeleting(id);
    try {
      await apiClient.services.delete(id);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete service", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-display text-gray-50">Services</h3>
          <p className="text-sm text-gray-400 mt-1">Manage upstream services and their routing policies.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Service Name</th>
              <th className="px-6 py-4 font-medium">Protocol</th>
              <th className="px-6 py-4 font-medium">LB Policy</th>
              <th className="px-6 py-4 font-medium">Targets</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Server className="w-12 h-12 text-gray-700 mb-3 animate-pulse" />
                    <p className="text-base font-medium text-gray-300">Loading Services...</p>
                  </div>
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Server className="w-12 h-12 text-gray-700 mb-3" />
                    <p className="text-base font-medium text-gray-300">No Services Found</p>
                    <p className="mt-1">Add your first upstream service.</p>
                  </div>
                </td>
              </tr>
            ) : (
              services.map((svc) => (
                <tr key={svc.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${gatewayId}/services/${svc.id}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-800 border border-gray-700 flex items-center justify-center">
                        <Server className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <span className="font-medium text-gray-100 group-hover:text-blue-400 transition-colors">
                        {svc.name}
                      </span>
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
                    <span className="text-gray-300 font-mono text-xs bg-gray-800 px-2 py-1 rounded">
                      {svc.lb_policy}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-gray-300 text-xs font-medium border border-gray-700">
                      {svc.targetsCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button disabled={isDeleting === svc.id} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors disabled:opacity-50">
                          {isDeleting === svc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => router.push(`/api-gateway/${gatewayId}/services/${svc.id}/edit`)} className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Service
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => svc.id && handleDelete(svc.id)}
                          className="cursor-pointer text-red-500 hover:text-red-400 hover:bg-red-500/10 focus:text-red-400 focus:bg-red-500/10"
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete Service
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
      
      <CreateServiceModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchData}
        gatewayId={gatewayId}
      />
    </div>
  );
}
