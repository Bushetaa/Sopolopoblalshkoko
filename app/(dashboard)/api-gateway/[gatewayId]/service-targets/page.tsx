"use client";

import React, { use } from 'react';
import { Target, Server, Plus, MoreVertical, Edit, Trash, Loader2, Globe, Zap, Scale, Info, CheckCircle2, X, Network } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { apiClient, ServiceTarget, Service } from '@/lib/api-client';
import CreateTargetModal from '@/components/api-gateway/modals/CreateTargetModal';

interface EnhancedTarget extends ServiceTarget {
  serviceName: string;
}

export default function GatewayServiceTargetsPage({ params }: { params: Promise<{ gatewayId: string }> }) {
  const router = useRouter();
  const { gatewayId } = use(params);
  
  const [targets, setTargets] = React.useState<EnhancedTarget[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    url: 'http://',
    service_id: '',
    weight: 1
  });

  const fetchData = async () => {
    try {
      const [allTargets, allServices] = await Promise.all([
        apiClient.serviceTargets.getAll(),
        apiClient.services.getAll()
      ]);

      // Filter services by this gateway
      const gatewayServices = allServices.filter(s => s.gateway_id === gatewayId);
      setServices(gatewayServices);

      const gatewayServiceIds = new Set(gatewayServices.map(s => s.id));

      // Filter targets by services belonging to this gateway
      const filtered = allTargets
        .filter(target => gatewayServiceIds.has(target.service_id))
        .map(target => {
          const svc = gatewayServices.find(s => s.id === target.service_id);
          return {
            ...target,
            serviceName: svc?.name || 'Unknown'
          };
        });

      setTargets(filtered);
    } catch (error) {
      console.error('Failed to fetch targets', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (gatewayId) fetchData();
  }, [gatewayId]);

  const handleCreate = async () => {
    if (!formData.service_id || !formData.url) return;
    setIsSaving(true);
    try {
      await apiClient.serviceTargets.create(formData);
      setIsModalOpen(false);
      setFormData({ url: 'http://', service_id: '', weight: 1 });
      await fetchData();
    } catch (error) {
      console.error("Failed to create target", error);
    } finally {
      setIsSaving(false);
    }
  };

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black font-display text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
              <Target className="w-5 h-5 text-blue-400 stroke-[2.5px]" />
            </div>
            Upstream Targets
          </h3>
          <p className="text-[#94A3B8] font-medium text-xs mt-1.5 ml-1">
            Map physical instances and IP addresses to your service registry.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95 group w-full sm:w-auto"
        >
          <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center">
            <Plus className="w-3.5 h-3.5 text-white stroke-[3.5px]" />
          </div>
          <span>Register Target</span>
        </button>
      </div>

      {/* High-Density Table Section */}
      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#050810]/50 border-b border-white/5 text-[#64748B] uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-8 py-6">Physical Endpoint</th>
                <th className="px-8 py-6">Owner Service</th>
                <th className="px-8 py-6">Traffic Weight</th>
                <th className="px-8 py-6 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-[2rem] bg-blue-500/5 flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 rounded-[2rem] border border-blue-500/20 animate-ping" />
                        <Target className="w-10 h-10 text-blue-500/40" />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Probing Network Targets...</p>
                    </div>
                  </td>
                </tr>
              ) : targets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-[2rem] bg-gray-900 flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                        <Target className="w-10 h-10 text-gray-800" />
                      </div>
                      <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No Targets Identified</p>
                      <p className="text-xs text-[#475569] mt-3 max-w-[300px] mx-auto leading-relaxed font-medium">
                        Your services have no active upstream instances. Add a physical endpoint to start routing traffic.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                targets.map((target) => (
                  <tr key={target.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-white/5 flex items-center justify-center group-hover:border-blue-500/30 transition-all shadow-lg">
                          <Target className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-white font-black text-sm group-hover:text-blue-400 transition-colors tracking-tight">
                            {target.url}
                          </span>
                          <span className="text-[9px] text-[#475569] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-blue-500" />
                            Upstream instance
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 group/svc">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover/svc:border-purple-500/30 transition-all">
                          <Server className="w-4 h-4 text-[#475569] group-hover/svc:text-purple-400 transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-gray-200 uppercase tracking-tighter group-hover/svc:text-white transition-colors">{target.serviceName}</span>
                          <span className="text-[9px] font-bold text-[#475569] uppercase tracking-widest">Parent Service</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#0F172A] border border-white/5 flex items-center justify-center text-[10px] font-black text-blue-400 shadow-xl">
                          {target.weight || 1}
                        </div>
                        <span className="text-[10px] font-bold text-[#475569] uppercase tracking-widest">Weighting</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === target.id} className="p-2.5 text-[#475569] hover:text-white hover:bg-white/5 rounded-xl transition-all disabled:opacity-50 group">
                            {isDeleting === target.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-5 h-5 group-hover:scale-110" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0B101B] border border-white/10 p-2 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] min-w-[180px] animate-in zoom-in-95 duration-200">
                          <DropdownMenuItem 
                            onClick={() => router.push(`/api-gateway/${gatewayId}/services/${target.service_id}/edit`)} 
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg focus:bg-white/5 focus:text-white transition-all cursor-pointer font-bold text-xs text-gray-400"
                          >
                            <Edit className="w-4 h-4 text-blue-400" />
                            Edit Service
                          </DropdownMenuItem>
                          <div className="h-px bg-white/5 my-1" />
                          <DropdownMenuItem 
                            onClick={() => target.id && handleDelete(target.id)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg focus:bg-red-500/10 focus:text-red-400 transition-all cursor-pointer font-bold text-xs text-red-500"
                          >
                            <Trash className="w-4 h-4" />
                            Remove Target
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

      {/* Create Target Modal */}
      <CreateTargetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        services={services}
        isSaving={isSaving}
        formData={formData}
        setFormData={setFormData}
        handleCreate={handleCreate}
      />
    </div>
  );
}
