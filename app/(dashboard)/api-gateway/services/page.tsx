"use client";

import React from 'react';
import Link from 'next/link';
import { Server, Globe, Activity, MoreVertical, Edit, Trash, Loader2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { apiClient, Service, Gateway } from '@/lib/api-client';
import CreateServiceModal from '@/components/api-gateway/modals/CreateServiceModal';

interface EnhancedService extends Service {
  gatewayName: string;
  targetsCount: number;
}

export default function GlobalServicesPage() {
  const router = useRouter();
  const [services, setServices] = React.useState<EnhancedService[]>([]);
  const [gateways, setGateways] = React.useState<Gateway[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedGatewayId, setSelectedGatewayId] = React.useState<string>('');

  const fetchData = async () => {
      try {
        const [fetchedServices, fetchedGateways, targets] = await Promise.all([
          apiClient.services.getAll(),
          apiClient.gateways.getAll(),
          apiClient.serviceTargets.getAll()
        ]);

        setGateways(fetchedGateways);

        const formatted = fetchedServices.map(svc => {
          const gw = fetchedGateways.find(g => g.id === svc.gateway_id);
          const tCount = targets.filter(t => t.service_id === svc.id).length;
          return {
            ...svc,
            gatewayName: gw?.name || 'Unknown',
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
    fetchData();
  }, []);

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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50">All Services</h2>
          <p className="text-sm text-gray-400 mt-1">A global view of services across all your gateways.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
              <Plus className="w-4 h-4" />
              <span>Create Service</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Select a Gateway</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {gateways.length === 0 ? (
              <DropdownMenuItem disabled className="text-gray-500">No gateways available</DropdownMenuItem>
            ) : (
              gateways.map(gw => (
                <DropdownMenuItem key={gw.id} onClick={() => {
                  setSelectedGatewayId(gw.id!);
                  setIsCreateModalOpen(true);
                }} className="cursor-pointer">
                  <Globe className="w-4 h-4 mr-2 text-blue-400" />
                  {gw.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <Server className="w-12 h-12 text-gray-700 mx-auto mb-3 animate-pulse" />
                  <p className="text-base font-medium text-gray-300">Loading Services...</p>
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <Server className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-base font-medium text-gray-300">No Services Found</p>
                </td>
              </tr>
            ) : (
              services.map((svc) => (
                <tr key={svc.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${svc.gateway_id}/services/${svc.id}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-800 border border-gray-700 flex items-center justify-center">
                        <Server className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <span className="font-medium text-gray-100 group-hover:text-blue-400 transition-colors">{svc.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${svc.gateway_id}/services`} className="text-gray-400 hover:text-blue-400 transition-colors text-xs">
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
                    <span className="text-gray-300 font-mono text-xs bg-gray-800 px-2 py-1 rounded">{svc.lb_policy}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-gray-300 text-xs font-medium border border-gray-700">{svc.targetsCount}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button disabled={isDeleting === svc.id} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors disabled:opacity-50">
                          {isDeleting === svc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => router.push(`/api-gateway/${svc.gateway_id}/services/${svc.id}/edit`)} className="cursor-pointer">
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

      {selectedGatewayId && (
        <CreateServiceModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchData}
          gatewayId={selectedGatewayId}
        />
      )}
    </div>
  );
}
