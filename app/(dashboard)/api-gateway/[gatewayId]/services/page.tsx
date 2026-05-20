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
  const [editingService, setEditingService] = React.useState<EnhancedService | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black font-display text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <Server className="w-5 h-5 text-purple-400 stroke-[2.5px]" />
            </div>
            Upstream Services
          </h3>
          <p className="text-[#94A3B8] font-medium text-xs mt-1.5 ml-1">
            Manage your physical backends and their traffic distribution policies.
          </p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95 group w-full sm:w-auto"
        >
          <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center">
            <Plus className="w-3.5 h-3.5 text-white stroke-[3.5px]" />
          </div>
          <span>Add New Service</span>
        </button>
      </div>

      {/* High-Density Table Section */}
      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#050810]/50 border-b border-white/5 text-[#64748B] uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-8 py-6">Service Identity</th>
                <th className="px-8 py-6">Protocol</th>
                <th className="px-8 py-6">Distribution</th>
                <th className="px-8 py-6">Availability</th>
                <th className="px-8 py-6 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-[2rem] bg-purple-500/5 flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 rounded-[2rem] border border-purple-500/20 animate-ping" />
                        <Server className="w-10 h-10 text-purple-500/40" />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Syncing Upstream Cluster...</p>
                    </div>
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-[2rem] bg-gray-900 flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                        <Server className="w-10 h-10 text-gray-800" />
                      </div>
                      <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No Services Detected</p>
                      <p className="text-xs text-[#475569] mt-3 max-w-[300px] mx-auto leading-relaxed font-medium">
                        You haven't defined any upstream services yet. Start by connecting your first physical backend.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-8 py-6">
                      <Link href={`/api-gateway/${gatewayId}/services/${svc.id}`} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-white/5 flex items-center justify-center group-hover:border-purple-500/30 transition-all shadow-lg group-hover:shadow-purple-500/5">
                          <Server className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-black text-white text-base group-hover:text-purple-400 transition-colors tracking-tight">
                            {svc.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-[#475569] font-mono uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">ID: {svc.id?.substring(0, 8)}</span>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border transition-all",
                        svc.protocol === 'grpc' 
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.05)]"
                      )}>
                        {svc.protocol === 'grpc' ? <Activity className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                        {svc.protocol}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64748B] flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-blue-500" />
                          {svc.lb_policy.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(svc.targetsCount, 3))].map((_, i) => (
                            <div key={i} className="w-7 h-7 rounded-lg bg-[#0F172A] border-2 border-[#0B101B] flex items-center justify-center text-[9px] font-black text-emerald-400 shadow-xl">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-white leading-none">{svc.targetsCount} Nodes</span>
                          <span className="text-[9px] font-bold text-[#475569] uppercase tracking-widest mt-0.5">Operational</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === svc.id} className="p-2.5 text-[#475569] hover:text-white hover:bg-white/5 rounded-xl transition-all disabled:opacity-50 group">
                            {isDeleting === svc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-5 h-5 group-hover:scale-110" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0B101B] border border-white/10 p-2 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] min-w-[180px] animate-in zoom-in-95 duration-200">
                          <DropdownMenuItem 
                            onClick={() => {
                              setEditingService(svc);
                              setIsEditModalOpen(true);
                            }} 
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg focus:bg-white/5 focus:text-white transition-all cursor-pointer font-bold text-xs text-gray-400"
                          >
                            <Edit className="w-4 h-4 text-blue-400" />
                            Edit Configuration
                          </DropdownMenuItem>
                          <div className="h-px bg-white/5 my-1" />
                          <DropdownMenuItem 
                            onClick={() => svc.id && handleDelete(svc.id)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg focus:bg-red-500/10 focus:text-red-400 transition-all cursor-pointer font-bold text-xs text-red-500"
                          >
                            <Trash className="w-4 h-4" />
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
      
      <CreateServiceModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchData}
        gatewayId={gatewayId}
      />

      {editingService && (
        <CreateServiceModal 
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setEditingService(null); }}
          onSuccess={fetchData}
          gatewayId={gatewayId}
          editingService={editingService}
          isEditMode={true}
        />
      )}
    </div>
  );
}
