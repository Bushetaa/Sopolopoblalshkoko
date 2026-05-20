"use client";

import React, { useState, use } from 'react';
import { FolderOpen, Plus, MoreVertical, Trash, Edit, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { apiClient, GatewayCollection } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';

export default function CollectionsPage({ params }: { params: Promise<{ gatewayId: string }> }) {
  const { gatewayId } = use(params);
  const [collections, setCollections] = useState<GatewayCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Create modal state
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const data = await apiClient.collections.getAll();
      setCollections(data.filter(c => c.gateway_id === gatewayId));
    } catch (error) {
      console.error('Failed to fetch collections', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (gatewayId) fetchData();
  }, [gatewayId]);

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast({ title: "Error", description: "Collection name is required", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.collections.create({
        name: newName,
        description: newDesc,
        is_active: true,
        gateway_id: gatewayId,
      });
      toast({ title: "Success", description: "Collection created successfully!" });
      setNewName('');
      setNewDesc('');
      setIsCreating(false);
      await fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create collection", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    setIsDeleting(id);
    try {
      await apiClient.collections.delete(id);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete collection", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black font-display text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <FolderOpen className="w-5 h-5 text-amber-400 stroke-[2.5px]" />
            </div>
            Service Collections
          </h3>
          <p className="text-[#94A3B8] font-medium text-xs mt-1.5 ml-1">
            Organize and group your services into logical containers for better management.
          </p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center justify-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95 group w-full sm:w-auto"
        >
          <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center">
            <Plus className="w-3.5 h-3.5 text-white stroke-[3.5px]" />
          </div>
          <span>Create Collection</span>
        </button>
      </div>

      {/* Create Collection Modal Style */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050810]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300">
            {/* Header - Wizard Style */}
            <div className="bg-gradient-to-br from-[#1E224F] via-[#141833] to-[#0B101B] px-8 py-6 border-b border-white/5 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                    <FolderOpen className="w-5 h-5 text-white stroke-[2.5px]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">New Collection</h2>
                    <p className="text-[#94A3B8] font-medium text-xs mt-0.5">Define a new logical grouping</p>
                  </div>
                </div>
                <button onClick={() => setIsCreating(false)} className="p-2 text-[#64748B] hover:text-white rounded-lg hover:bg-white/5 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Collection Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full h-12 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl px-4 text-sm text-white font-medium transition-all"
                  placeholder="e.g. Production-API, Auth-Services"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Description</label>
                <textarea
                  className="w-full bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl px-4 py-3 text-sm text-white font-medium transition-all h-24 resize-none"
                  placeholder="What is the purpose of this group?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              {/* Action Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-white/5">
                <button 
                  onClick={() => setIsCreating(false)} 
                  className="w-full sm:w-auto px-6 py-3 text-[#64748B] hover:text-white hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Discard
                </button>
                <button
                  disabled={isSubmitting || !newName}
                  onClick={handleCreate}
                  className="w-full sm:w-auto h-11 px-8 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 shadow-xl active:scale-95 flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin stroke-[3px]" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-white stroke-[3.5px]" />
                      Launch Collection
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* High-Density Table Section */}
      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#050810]/50 border-b border-white/5 text-[#64748B] uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-8 py-6">Collection Identity</th>
                <th className="px-8 py-6">Summary</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-[2rem] bg-amber-500/5 flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 rounded-[2rem] border border-amber-500/20 animate-ping" />
                        <FolderOpen className="w-10 h-10 text-amber-500/40" />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Syncing Logical Groups...</p>
                    </div>
                  </td>
                </tr>
              ) : collections.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-[2rem] bg-gray-900 flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                        <FolderOpen className="w-10 h-10 text-gray-800" />
                      </div>
                      <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No Collections Found</p>
                      <p className="text-xs text-[#475569] mt-3 max-w-[300px] mx-auto leading-relaxed font-medium">
                        Create your first logical container to organize your upstream services effectively.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                collections.map((col) => (
                  <tr key={col.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-white/5 flex items-center justify-center group-hover:border-amber-500/30 transition-all shadow-lg">
                          <FolderOpen className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-black text-white text-base group-hover:text-amber-400 transition-colors tracking-tight">
                            {col.name}
                          </span>
                          <span className="text-[9px] text-[#475569] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-amber-500" />
                            Logical Container
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-[#94A3B8] font-medium max-w-xs line-clamp-1 italic">
                        {col.description || 'No description provided'}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border transition-all",
                        col.is_active 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
                          : "bg-gray-800 text-gray-400 border-gray-700"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", col.is_active ? "bg-emerald-400 animate-pulse" : "bg-gray-500")} />
                        {col.is_active ? "Live" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === col.id} className="p-2.5 text-[#475569] hover:text-white hover:bg-white/5 rounded-xl transition-all disabled:opacity-50 group">
                            {isDeleting === col.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-5 h-5 group-hover:scale-110" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0B101B] border border-white/10 p-2 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] min-w-[180px] animate-in zoom-in-95 duration-200">
                          <DropdownMenuItem 
                            onClick={() => col.id && handleDelete(col.id)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg focus:bg-red-500/10 focus:text-red-400 transition-all cursor-pointer font-bold text-xs text-red-500"
                          >
                            <Trash className="w-4 h-4" />
                            Delete Collection
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
    </div>
  );
}
