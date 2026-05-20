"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FolderOpen, Plus, MoreVertical, Globe, ChevronRight, Server, Edit, Trash, Loader2, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CollectionForm, CollectionFormValues } from '@/components/collections/CollectionForm';

import { apiClient, Gateway, GatewayCollection, Service } from '@/lib/api-client';

interface EnhancedCollection extends GatewayCollection {
  servicesCount: number;
  gatewayName: string;
}

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<EnhancedCollection[]>([]);
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedGatewayId, setSelectedGatewayId] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<GatewayCollection | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [allGateways, allCollections, allServices] = await Promise.all([
        apiClient.gateways.getAll(),
        apiClient.collections.getAll(),
        apiClient.services.getAll()
      ]);

      const proGateways = allGateways.filter(gw => gw.mode === 'pro');
      setGateways(proGateways);

      const proGatewayIds = new Set(proGateways.map(g => g.id));
      
      const formatted = allCollections
        .filter(c => proGatewayIds.has(c.gateway_id))
        .map(c => {
          const gw = proGateways.find(g => g.id === c.gateway_id);
          return {
            ...c,
            gatewayName: gw?.name || 'Unknown',
            servicesCount: allServices.filter(s => s.collection_id === c.id).length
          };
        });

      setCollections(formatted);
    } catch (error) {
      console.error('Failed to fetch collections data', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = (gatewayId: string) => {
    setSelectedGatewayId(gatewayId);
    setSelectedCollection(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (gatewayId: string, collection: GatewayCollection) => {
    setSelectedGatewayId(gatewayId);
    setSelectedCollection(collection);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: CollectionFormValues) => {
    if (!selectedGatewayId) return;

    try {
      if (dialogMode === 'create') {
        await apiClient.collections.create({
          ...data,
          gateway_id: selectedGatewayId
        });
      } else if (dialogMode === 'edit' && selectedCollection?.id) {
        await apiClient.collections.update(selectedCollection.id, {
          ...data,
          gateway_id: selectedGatewayId
        });
      }
      setIsDialogOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Failed to save collection", error);
    }
  };

  const handleDelete = async (collectionId: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    setIsDeleting(collectionId);
    try {
      await apiClient.collections.delete(collectionId);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete collection", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredCollections = collections.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.gatewayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            <div className="w-8 h-[2px] bg-blue-500" />
            Collection Management
          </div>
          <h2 className="text-3xl font-black font-display text-white tracking-tight">Collections</h2>
          <p className="text-[13px] text-[#64748B] mt-1.5 font-medium">Logical groupings of services within your Pro-mode gateways.</p>
        </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95 group">
                <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-white stroke-[3px]" />
                </div>
                Create Collection
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#0B101B] border-white/5 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-[#64748B] px-4 py-2">Select a Gateway</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              {gateways.length === 0 ? (
                <DropdownMenuItem disabled className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider px-4 py-3">No Pro-mode gateways</DropdownMenuItem>
              ) : (
                gateways.map(gw => (
                  <DropdownMenuItem key={gw.id} onClick={() => handleOpenCreate(gw.id!)} className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-all py-3 px-4">
                    <Globe className="w-3.5 h-3.5 mr-3 text-blue-400" />
                    {gw.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      {/* Control Center Toolbar */}
      <div className="flex flex-col lg:flex-row items-center gap-4 bg-[#0B101B] p-4 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -z-10" />
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
          <Input 
            placeholder="Search collections by name or parent gateway..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 bg-white/[0.03] border-white/5 focus:border-blue-500/50 focus:ring-0 text-white rounded-xl text-[13px] font-medium placeholder:text-[#475569] transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Button variant="outline" className="h-12 px-6 border-white/5 bg-white/[0.03] hover:bg-white/10 text-[#94A3B8] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex-1 lg:flex-none">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <div className="px-5 py-3 bg-[#050810] border border-white/5 rounded-xl hidden lg:flex items-center gap-3">
            <span className="text-[9px] font-black text-[#475569] uppercase tracking-[0.2em]">Active Groups</span>
            <div className="w-[1px] h-3 bg-white/10" />
            <span className="text-sm font-black text-blue-400 tabular-nums">{collections.length}</span>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#050810]/80 border-b border-white/5 text-[#64748B] uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-7 py-5">Collection Identity</th>
                <th className="px-7 py-5">Parent Gateway</th>
                <th className="px-7 py-5 text-center">Service Count</th>
                <th className="px-7 py-5 text-center">Status</th>
                <th className="px-7 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-7 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5" />
                        <div className="space-y-2">
                          <div className="h-4 w-48 bg-white/5 rounded" />
                          <div className="h-3 w-32 bg-white/5 rounded" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredCollections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-7 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4">
                        <FolderOpen className="w-8 h-8 text-[#1E293B]" />
                      </div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">No Collections Found</p>
                      <p className="text-[10px] text-[#64748B] mt-2 font-medium uppercase tracking-wider max-w-xs mx-auto">
                        {searchQuery ? `No matches found for "${searchQuery}"` : "Logical groupings for your services. Start by creating a domain-driven collection."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCollections.map((col) => (
                  <tr key={col.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-7 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-gray-800/50 border border-white/5 flex items-center justify-center group-hover:border-blue-500/40 transition-all shadow-inner">
                          <FolderOpen className="w-4.5 h-4.5 text-[#64748B] group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                            {col.name}
                          </span>
                          <span className="text-[9px] text-[#475569] font-black uppercase tracking-widest mt-0.5">
                            {col.description || 'Logical service grouping'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-7 py-5">
                      <Link href={`/api-gateway/${col.gateway_id}/collections`} className="flex items-center gap-2 group/gw">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover/gw:bg-blue-500 transition-colors" />
                        <span className="text-[11px] font-bold text-[#94A3B8] group-hover/gw:text-white transition-colors">
                          {col.gatewayName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-7 py-5 text-center">
                      <div className="flex justify-center">
                        <div className="w-7 h-7 rounded-lg bg-[#0F172A] border border-white/5 flex items-center justify-center text-[10px] font-black text-blue-400 shadow-xl">
                          {col.servicesCount}
                        </div>
                      </div>
                    </td>
                    <td className="px-7 py-5 text-center">
                      <div className="flex justify-center">
                        <div className={cn(
                          "inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border transition-all duration-300",
                          col.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                            : "bg-white/5 text-[#475569] border-white/5"
                        )}>
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            col.is_active ? "bg-emerald-400 animate-pulse" : "bg-[#475569]"
                          )} />
                          {col.is_active ? "Active" : "Dormant"}
                        </div>
                      </div>
                    </td>
                    <td className="px-7 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === col.id} className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95 border border-transparent hover:border-white/5">
                            {isDeleting === col.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-[#0B101B] border-white/5 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                          <DropdownMenuItem onClick={() => handleOpenEdit(col.gateway_id!, col)} className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-all py-3 px-4">
                            <Edit className="w-3.5 h-3.5 mr-3 text-blue-500" />
                            Modify Configuration
                          </DropdownMenuItem>
                          <div className="h-[1px] bg-white/5 my-1" />
                          <DropdownMenuItem 
                            onClick={() => col.id && handleDelete(col.id)}
                            className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300 transition-all py-3 px-4"
                          >
                            <Trash className="w-3.5 h-3.5 mr-3" />
                            Terminate Collection
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

      {/* Dialog for Create/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0B101B] border-white/5 text-white max-w-md rounded-[2.5rem] p-8 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -z-10" />
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
              <div className="w-8 h-[2px] bg-blue-500" />
              Configuration
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight">{dialogMode === 'create' ? 'Create Collection' : 'Edit Collection'}</DialogTitle>
            <DialogDescription className="text-[13px] text-[#64748B] mt-1.5 font-medium">
              {dialogMode === 'create' ? 'Add a new collection to organize your services.' : 'Modify the collection details and operational state.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <CollectionForm
              initialValues={selectedCollection ? {
                name: selectedCollection.name,
                description: selectedCollection.description || "",
                is_active: selectedCollection.is_active
              } : undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
              onDelete={dialogMode === 'edit' ? () => selectedCollection?.id && handleDelete(selectedCollection.id) : undefined}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
