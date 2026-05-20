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
  const [editingService, setEditingService] = React.useState<EnhancedService | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

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
    <div className="space-y-8 max-w-6xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            <div className="w-8 h-[2px] bg-blue-500" />
            Service Management
          </div>
          <h2 className="text-3xl font-black font-display text-white tracking-tight">All Services</h2>
          <p className="text-[13px] text-[#64748B] mt-1.5 font-medium">A global view of services across all your gateways.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95 group">
              <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">
                <Plus className="w-3 h-3 text-white stroke-[3px]" />
              </div>
              Create Service
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#0B101B] border-white/5 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-[#64748B] px-4 py-2">Select a Gateway</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            {gateways.length === 0 ? (
              <DropdownMenuItem disabled className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider px-4 py-3">No gateways available</DropdownMenuItem>
            ) : (
              gateways.map(gw => (
                <DropdownMenuItem key={gw.id} onClick={() => {
                  setSelectedGatewayId(gw.id!);
                  setIsCreateModalOpen(true);
                }} className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-all py-3 px-4">
                  <Globe className="w-3.5 h-3.5 mr-3 text-blue-400" />
                  {gw.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#050810]/80 border-b border-white/5 text-[#64748B] uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-7 py-5">Service Topology</th>
                <th className="px-7 py-5">Parent Gateway</th>
                <th className="px-7 py-5">Protocol</th>
                <th className="px-7 py-5">LB Strategy</th>
                <th className="px-7 py-5">Nodes</th>
                <th className="px-7 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-7 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center mb-4 animate-pulse">
                        <Server className="w-8 h-8 text-blue-500/40" />
                      </div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">Synchronizing Services...</p>
                    </div>
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-7 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4">
                        <Server className="w-8 h-8 text-[#1E293B]" />
                      </div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">No Active Services</p>
                      <p className="text-[10px] text-[#64748B] mt-2 font-medium uppercase tracking-wider">Start by creating a new service for your gateway.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-7 py-5">
                      <Link href={`/api-gateway/${svc.gateway_id}/services/${svc.id}`} className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-gray-800/50 border border-white/5 flex items-center justify-center group-hover:border-blue-500/40 transition-all shadow-inner">
                          <Server className="w-4.5 h-4.5 text-[#64748B] group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                            {svc.name}
                          </span>
                          <span className="text-[9px] text-[#475569] font-black uppercase tracking-widest mt-0.5">Application Service</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-7 py-5">
                      <Link href={`/api-gateway/${svc.gateway_id}/services`} className="flex items-center gap-2 group/gw">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover/gw:bg-blue-500 transition-colors" />
                        <span className="text-[11px] font-bold text-[#94A3B8] group-hover/gw:text-white transition-colors">
                          {svc.gatewayName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-7 py-5">
                      <span className={cn(
                        "inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border",
                        svc.protocol === 'grpc'
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      )}>
                        {svc.protocol === 'grpc' ? <Activity className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                        {svc.protocol}
                      </span>
                    </td>
                    <td className="px-7 py-5">
                      <span className="text-[#94A3B8] font-mono text-[10px] bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-lg uppercase tracking-wider tabular-nums">
                        {svc.lb_policy.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-7 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#0F172A] border border-white/5 flex items-center justify-center text-[10px] font-black text-blue-400 shadow-xl">
                          {svc.targetsCount}
                        </div>
                        <span className="text-[8px] text-[#475569] font-black uppercase tracking-widest">Active</span>
                      </div>
                    </td>
                    <td className="px-7 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === svc.id} className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95 border border-transparent hover:border-white/5">
                            {isDeleting === svc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-[#0B101B] border-white/5 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                          <DropdownMenuItem 
                            onClick={() => {
                              setEditingService(svc);
                              setSelectedGatewayId(svc.gateway_id);
                              setIsEditModalOpen(true);
                            }} 
                            className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-all py-3 px-4"
                          >
                            <Edit className="w-3.5 h-3.5 mr-3 text-blue-500" />
                            Modify Configuration
                          </DropdownMenuItem>
                          <div className="h-[1px] bg-white/5 my-1" />
                          <DropdownMenuItem 
                            onClick={() => svc.id && handleDelete(svc.id)}
                            className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300 transition-all py-3 px-4"
                          >
                            <Trash className="w-3.5 h-3.5 mr-3" />
                            Terminate Service
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

      {selectedGatewayId && (
        <CreateServiceModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchData}
          gatewayId={selectedGatewayId}
        />
      )}

      {selectedGatewayId && editingService && (
        <CreateServiceModal 
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setEditingService(null); }}
          onSuccess={fetchData}
          gatewayId={selectedGatewayId}
          editingService={editingService}
          isEditMode={true}
        />
      )}
    </div>
  );
}
