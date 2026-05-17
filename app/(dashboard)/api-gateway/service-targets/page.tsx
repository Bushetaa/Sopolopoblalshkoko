"use client";

import React from 'react';
import Link from 'next/link';
import { Target, Server, ExternalLink, MoreVertical, Edit, Trash, Loader2, Plus, Search, Filter, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { apiClient, ServiceTarget, Service } from '@/lib/api-client';

interface EnhancedTarget extends ServiceTarget {
  serviceName: string;
  gatewayId: string;
}

export default function GlobalServiceTargetsPage() {
  const router = useRouter();
  const [targets, setTargets] = React.useState<EnhancedTarget[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  
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
      const [fetchedTargets, fetchedServices] = await Promise.all([
        apiClient.serviceTargets.getAll(),
        apiClient.services.getAll()
      ]);

      setServices(fetchedServices);

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

  const filteredTargets = targets.filter(t => 
    t.url.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden bg-gray-900/40 border border-gray-800/60 rounded-3xl p-8 backdrop-blur-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Target className="w-32 h-32 text-blue-500 rotate-12" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase tracking-[0.2em]">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Upstream Management
            </div>
            <h2 className="text-4xl font-extrabold font-display text-gray-50 tracking-tight">Service Targets</h2>
            <p className="text-gray-400 max-w-xl text-sm leading-relaxed">
              Global command center for your upstream destinations. Monitor and manage all backend target URLs and their load distribution weights across services.
            </p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="group relative h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95 overflow-hidden border border-blue-400/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90 duration-500" />
            <span>Create Target</span>
          </Button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-800/50">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Total Targets</p>
            <p className="text-2xl font-bold text-gray-100">{targets.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Active Services</p>
            <p className="text-2xl font-bold text-gray-100">{new Set(targets.map(t => t.service_id)).size}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Health Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-sm font-bold text-gray-300">Optimal</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Syncing</p>
            <p className="text-sm font-bold text-blue-400">Live Updates</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-950/50 p-4 rounded-2xl border border-gray-800/40">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            placeholder="Search targets by URL or service name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-gray-900/50 border-gray-800 focus:ring-blue-500/30 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="h-11 px-4 border-gray-800 hover:bg-gray-800 text-gray-300 rounded-xl flex-1 sm:flex-none">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-gray-900/20 border border-gray-800/60 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/40 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-8 py-5">Target Destination</th>
                <th className="px-8 py-5">Upstream Service</th>
                <th className="px-8 py-5">Load Weight</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-800 animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 w-48 bg-gray-800 animate-pulse rounded" />
                          <div className="h-3 w-32 bg-gray-800 animate-pulse rounded" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredTargets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
                      <div className="w-20 h-20 rounded-3xl bg-gray-800/30 flex items-center justify-center mb-6">
                        <Target className="w-10 h-10 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-200">No targets found</h3>
                      <p className="text-gray-500 text-sm mt-2">
                        {searchQuery ? `No matches for "${searchQuery}"` : "Get started by creating your first upstream target destination."}
                      </p>
                      {searchQuery && (
                        <Button 
                          variant="link" 
                          onClick={() => setSearchQuery('')}
                          className="mt-2 text-blue-400"
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTargets.map((target) => (
                  <tr key={target.id} className="group hover:bg-blue-500/[0.02] transition-colors duration-300">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300 shadow-sm">
                          <Target className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-semibold text-gray-100 flex items-center gap-1.5">
                            {target.url}
                            <ArrowUpRight className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">Internal Backend Endpoint</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Link 
                        href={target.gatewayId ? `/api-gateway/${target.gatewayId}/services/${target.service_id}` : '#'}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/40 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-transparent hover:border-blue-500/20"
                      >
                        <Server className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{target.serviceName}</span>
                      </Link>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-[60px] h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-500" 
                            style={{ width: `${Math.min((target.weight || 1) * 10, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-gray-400">
                          {target.weight || 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Badge variant="outline" className="bg-green-500/5 text-green-400 border-green-500/20 text-[10px] px-2 py-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Healthy
                      </Badge>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === target.id} className="p-2 text-gray-500 hover:text-gray-100 hover:bg-gray-800 rounded-xl transition-all disabled:opacity-50">
                            {isDeleting === target.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-5 h-5" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-1 bg-gray-900 border-gray-800 text-gray-100 rounded-xl shadow-2xl">
                          <DropdownMenuItem 
                            onClick={() => target.gatewayId && router.push(`/api-gateway/${target.gatewayId}/services/${target.service_id}/edit`)} 
                            className="flex items-center gap-2 p-2.5 cursor-pointer rounded-lg hover:bg-blue-500/10 hover:text-blue-400"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="font-medium text-sm">Edit Parent Service</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-800" />
                          <DropdownMenuItem 
                            onClick={() => target.id && handleDelete(target.id)}
                            className="flex items-center gap-2 p-2.5 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash className="w-4 h-4" />
                            <span className="font-medium text-sm">Delete Destination</span>
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

      {/* Modern Create Target Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-md rounded-3xl p-0 overflow-hidden shadow-2xl shadow-blue-500/10">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-6 border-b border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                New Target
              </DialogTitle>
              <DialogDescription className="text-gray-400 mt-2">
                Configure a new upstream destination for your backend traffic.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Destination URL</label>
              <Input 
                placeholder="https://api.internal.service:8080" 
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="h-12 bg-gray-950 border-gray-800 focus:ring-blue-500/30 rounded-xl font-mono text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Assign to Service</label>
              <Select 
                value={formData.service_id} 
                onValueChange={(val) => setFormData({ ...formData, service_id: val })}
              >
                <SelectTrigger className="h-12 bg-gray-950 border-gray-800 rounded-xl text-sm font-medium">
                  <SelectValue placeholder="Select target service" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800 text-gray-100 rounded-xl">
                  {services.map(svc => (
                    <SelectItem key={svc.id} value={svc.id!} className="rounded-lg my-1">
                      <div className="flex items-center gap-2">
                        <Server className="w-3 h-3 text-blue-400" />
                        {svc.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Traffic Weight (1-100)</label>
              <div className="flex gap-4">
                <Input 
                  type="number" 
                  min="1"
                  max="100"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 1 })}
                  className="h-12 w-24 bg-gray-950 border-gray-800 focus:ring-blue-500/30 rounded-xl text-center font-bold"
                />
                <div className="flex-1 flex items-center px-4 bg-gray-950 border border-gray-800 rounded-xl text-[10px] text-gray-500 font-medium">
                  Higher weight sends more traffic to this destination.
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gray-950/50 border-t border-gray-800 flex gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setIsModalOpen(false)} 
              className="flex-1 h-12 rounded-xl text-gray-400 hover:bg-gray-800 font-bold"
            >
              Discard
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={isSaving || !formData.service_id || !formData.url}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy Target"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
