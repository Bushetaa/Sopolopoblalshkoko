"use client";

import React from 'react';
import Link from 'next/link';
import { Target, Server, MoreVertical, Edit, Trash, Loader2, Plus, Search, Filter, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { apiClient, ServiceTarget, Service } from '@/lib/api-client';
import CreateTargetModal from '@/components/api-gateway/modals/CreateTargetModal';

interface EnhancedTarget extends ServiceTarget { serviceName: string; gatewayId: string; }

export default function GlobalServiceTargetsPage() {
  const router = useRouter();
  const [targets, setTargets] = React.useState<EnhancedTarget[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({ url: 'http://', service_id: '', weight: 1 });
  const [editingTargetId, setEditingTargetId] = React.useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [fetchedTargets, fetchedServices] = await Promise.all([apiClient.serviceTargets.getAll(), apiClient.services.getAll()]);
      setServices(fetchedServices);
      setTargets(fetchedTargets.map(target => {
        const svc = fetchedServices.find(s => s.id === target.service_id);
        return { ...target, serviceName: svc?.name || 'Unknown Service', gatewayId: svc?.gateway_id || '' };
      }));
    } catch (error) { console.error('Failed to fetch targets', error); }
    finally { setIsLoading(false); }
  };

  React.useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!formData.service_id || !formData.url) return;
    setIsSaving(true);
    try {
      if (editingTargetId) {
        await apiClient.serviceTargets.update(editingTargetId, {
          url: formData.url,
          weight: formData.weight,
          service_id: formData.service_id
        });
      } else {
        await apiClient.serviceTargets.create(formData);
      }
      setIsModalOpen(false);
      setEditingTargetId(null);
      setFormData({ url: 'http://', service_id: '', weight: 1 });
      await fetchData();
    } catch (error) {
      console.error("Failed to save target", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTargetId(null);
    setFormData({ url: 'http://', service_id: '', weight: 1 });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this target?")) return;
    setIsDeleting(id);
    try { await apiClient.serviceTargets.delete(id); await fetchData(); }
    catch (error) { console.error("Failed to delete target", error); }
    finally { setIsDeleting(null); }
  };

  const filtered = targets.filter(t => t.url.toLowerCase().includes(searchQuery.toLowerCase()) || t.serviceName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div>
            <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
              <div className="w-8 h-[2px] bg-blue-500" />
              Infrastructure Detail
            </div>
            <h2 className="text-3xl font-black font-display text-white tracking-tight">Service Targets</h2>
            <p className="text-[13px] text-[#64748B] mt-1.5 font-medium leading-relaxed">Manage upstream destinations and load distribution weights.</p>
          </div>
          <div className="hidden md:flex items-center gap-4 ml-2 pl-6 border-l border-white/5">
            <div className="text-center">
              <p className="text-lg font-black text-white">{targets.length}</p>
              <p className="text-[9px] text-[#64748B] font-black uppercase tracking-widest">Targets</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-white">{new Set(targets.map(t => t.service_id)).size}</p>
              <p className="text-[9px] text-[#64748B] font-black uppercase tracking-widest">Services</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Healthy</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            setEditingTargetId(null);
            setFormData({ url: 'http://', service_id: '', weight: 1 });
            setIsModalOpen(true);
          }} 
          className="flex items-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95 group"
        >
          <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">
            <Plus className="w-3 h-3 text-white stroke-[3px]" />
          </div>
          Create Target
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
          <Input 
            placeholder="Search targets..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="pl-11 h-11 bg-[#0B101B] border-white/5 focus:ring-blue-500/30 rounded-xl text-sm text-white placeholder:text-[#475569]" 
          />
        </div>
        <Button variant="outline" size="sm" className="h-11 px-5 border-white/5 bg-[#0B101B] hover:bg-white/5 text-[#64748B] hover:text-white rounded-xl transition-all font-black text-[10px] uppercase tracking-widest">
          <Filter className="w-3.5 h-3.5 mr-2" />
          Filter
        </Button>
      </div>

      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#050810]/80 border-b border-white/5 text-[#64748B] uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-7 py-5">Destination</th>
                <th className="px-7 py-5">Service</th>
                <th className="px-7 py-5">Weight</th>
                <th className="px-7 py-5">Status</th>
                <th className="px-7 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-7 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center mb-4 animate-pulse">
                        <Target className="w-8 h-8 text-blue-500/40" />
                      </div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">Synchronizing Infrastructure...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-7 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4">
                        <Target className="w-8 h-8 text-[#1E293B]" />
                      </div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">No Active Targets</p>
                      <p className="text-[10px] text-[#64748B] mt-2 font-medium uppercase tracking-wider">Start by creating a new upstream destination.</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((target) => (
                <tr key={target.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-7 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.1)] group-hover:border-blue-500/40 transition-all">
                        <Target className="w-4.5 h-4.5 text-blue-400 stroke-[2.5px]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-white tracking-tight group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                          {target.url}
                          <ArrowUpRight className="w-3 h-3 text-[#475569] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                        <span className="text-[9px] text-[#475569] font-black uppercase tracking-widest mt-0.5">Upstream Destination</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-7 py-5">
                    <Link 
                      href={target.gatewayId ? `/api-gateway/${target.gatewayId}/services/${target.service_id}` : '#'} 
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.03] text-[#94A3B8] hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-white/5 hover:border-blue-500/20 shadow-sm"
                    >
                      <Server className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">{target.serviceName}</span>
                    </Link>
                  </td>
                  <td className="px-7 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 bg-[#0F172A] rounded-full overflow-hidden border border-white/5 shadow-inner">
                        <div className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${Math.min((target.weight || 1) * 10, 100)}%` }} />
                      </div>
                      <span className="text-[10px] font-mono font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{target.weight || 1}</span>
                    </div>
                  </td>
                  <td className="px-7 py-5">
                    <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border transition-all bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Healthy
                    </span>
                  </td>
                  <td className="px-7 py-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button disabled={isDeleting === target.id} className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95 border border-transparent hover:border-white/5">
                          {isDeleting === target.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-[#0B101B] border-white/5 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                        <DropdownMenuItem 
                          onClick={() => {
                            setEditingTargetId(target.id!);
                            setFormData({
                              url: target.url,
                              service_id: target.service_id,
                              weight: target.weight || 1
                            });
                            setIsModalOpen(true);
                          }} 
                          className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-all py-3 px-4"
                        >
                          <Edit className="w-3.5 h-3.5 mr-3 text-blue-500" />
                          Modify Configuration
                        </DropdownMenuItem>
                        <div className="h-[1px] bg-white/5 my-1" />
                        <DropdownMenuItem 
                          onClick={() => target.id && handleDelete(target.id)} 
                          className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300 transition-all py-3 px-4"
                        >
                          <Trash className="w-3.5 h-3.5 mr-3" />
                          Terminate Target
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Target Modal */}
      <CreateTargetModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchData}
        services={services}
        isSaving={isSaving}
        formData={formData}
        setFormData={setFormData}
        handleCreate={handleSave}
        isEditMode={!!editingTargetId}
      />
    </div>
  );
}
