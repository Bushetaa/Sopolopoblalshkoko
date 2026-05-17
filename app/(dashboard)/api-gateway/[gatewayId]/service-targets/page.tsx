"use client";

import React, { use } from 'react';
import { Target, Server, Plus, MoreVertical, Edit, Trash, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { apiClient, ServiceTarget, Service } from '@/lib/api-client';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-display text-gray-50">Service Targets</h3>
          <p className="text-sm text-gray-400 mt-1">Manage upstream targets for this gateway's services.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target</span>
        </Button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Target URL</th>
              <th className="px-6 py-4 font-medium">Service</th>
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
                    <p className="mt-1">Add a target to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              targets.map((target) => (
                <tr key={target.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      <span className="font-mono text-sm text-gray-100">{target.url}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Server className="w-3.5 h-3.5" />
                      {target.serviceName}
                    </span>
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
                          onClick={() => router.push(`/api-gateway/${gatewayId}/services/${target.service_id}/edit`)} 
                          className="cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Service
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

      {/* Create Target Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>Create New Service Target</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Target URL</label>
              <Input 
                placeholder="http://localhost:8080" 
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="bg-gray-950 border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Target Service</label>
              <Select 
                value={formData.service_id} 
                onValueChange={(val) => setFormData({ ...formData, service_id: val })}
              >
                <SelectTrigger className="bg-gray-950 border-gray-800">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800 text-gray-100">
                  {services.map(svc => (
                    <SelectItem key={svc.id} value={svc.id!}>{svc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Weight</label>
              <Input 
                type="number" 
                min="1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 1 })}
                className="bg-gray-950 border-gray-800"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-gray-400">Cancel</Button>
            <Button 
              onClick={handleCreate} 
              disabled={isSaving || !formData.service_id || !formData.url}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Target"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
