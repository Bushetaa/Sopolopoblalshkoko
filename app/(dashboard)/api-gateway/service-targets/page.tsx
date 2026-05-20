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

  const handleCreate = async () => {
    if (!formData.service_id || !formData.url) return;
    setIsSaving(true);
    try { await apiClient.serviceTargets.create(formData); setIsModalOpen(false); setFormData({ url: 'http://', service_id: '', weight: 1 }); await fetchData(); }
    catch (error) { console.error("Failed to create target", error); }
    finally { setIsSaving(false); }
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
    <div className="space-y-4 max-w-7xl mx-auto pb-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold font-display text-gray-50 tracking-tight">Service Targets</h2>
            <p className="text-sm text-gray-400 mt-0.5">Manage upstream destinations and load distribution weights.</p>
          </div>
          <div className="hidden md:flex items-center gap-4 ml-2 pl-6 border-l border-gray-800">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-100">{targets.length}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Targets</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-100">{new Set(targets.map(t => t.service_id)).size}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Services</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <p className="text-xs font-semibold text-gray-400">Healthy</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 group"
        >
          <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center">
            <Plus className="w-3.5 h-3.5 text-white stroke-[3px]" />
          </div>
          <span className="text-sm">Create Target</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input placeholder="Search targets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9 bg-gray-900/50 border-gray-800 focus:ring-blue-500/30 rounded-lg text-sm" />
        </div>
        <Button variant="outline" size="sm" className="h-9 px-3 border-gray-800 hover:bg-gray-800 text-gray-400 rounded-lg"><Filter className="w-3.5 h-3.5 mr-1.5" />Filter</Button>
      </div>

      <div className="bg-gray-900/20 border border-gray-800/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/40 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Destination</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Weight</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {isLoading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse"><td colSpan={5} className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gray-800" /><div className="h-4 w-44 bg-gray-800 rounded" /></div></td></tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center">
                  <Target className="w-10 h-10 text-gray-700 mb-3 mx-auto" />
                  <h3 className="text-base font-bold text-gray-200">No targets found</h3>
                  <p className="text-gray-500 text-sm mt-1">{searchQuery ? `No matches for "${searchQuery}"` : "Create your first upstream target."}</p>
                </td></tr>
              ) : filtered.map((target) => (
                <tr key={target.id} className="group hover:bg-blue-500/[0.03] transition-colors duration-200">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                        <Target className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <span className="font-mono text-sm font-semibold text-gray-100 flex items-center gap-1">
                        {target.url}
                        <ArrowUpRight className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Link href={target.gatewayId ? `/api-gateway/${target.gatewayId}/services/${target.service_id}` : '#'} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-gray-800/40 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-transparent hover:border-blue-500/20">
                      <Server className="w-3 h-3" /><span className="text-xs font-semibold">{target.serviceName}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((target.weight || 1) * 10, 100)}%` }} />
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-400">{target.weight || 1}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className="bg-green-500/5 text-green-400 border-green-500/20 text-[10px] px-2 py-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Healthy
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><button disabled={isDeleting === target.id} className="p-1.5 text-gray-500 hover:text-gray-100 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50">{isDeleting === target.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}</button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 p-1 bg-gray-900 border-gray-800 text-gray-100 rounded-xl shadow-2xl">
                        <DropdownMenuItem onClick={() => target.gatewayId && router.push(`/api-gateway/${target.gatewayId}/services/${target.service_id}/edit`)} className="flex items-center gap-2 p-2 cursor-pointer rounded-lg hover:bg-blue-500/10 hover:text-blue-400 text-sm"><Edit className="w-3.5 h-3.5" />Edit Service</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-800" />
                        <DropdownMenuItem onClick={() => target.id && handleDelete(target.id)} className="flex items-center gap-2 p-2 cursor-pointer text-red-400 hover:bg-red-500/10 rounded-lg text-sm"><Trash className="w-3.5 h-3.5" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
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
