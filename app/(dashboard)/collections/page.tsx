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
    <div className="space-y-8 max-w-7xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50">Collections</h2>
          <p className="text-sm text-gray-400 mt-1">Logical groupings of services within your Pro-mode gateways.</p>
        </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
                <Plus className="w-4 h-4" />
                <span>Create Collection</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {gateways.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">No Pro-mode gateways</div>
              ) : (
                gateways.map(gw => (
                  <DropdownMenuItem key={gw.id} onClick={() => handleOpenCreate(gw.id!)} className="flex items-center gap-3 p-3 cursor-pointer rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400 transition-all group/item">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{gw.name}</span>
                      <span className="text-[10px] text-gray-500 group-hover/item:text-indigo-300/60 font-mono tracking-tighter truncate max-w-[120px]">{gw.id}</span>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      {/* Control Center Toolbar */}
      <div className="flex flex-col lg:flex-row items-center gap-4 bg-gray-950/50 p-4 rounded-2xl border border-gray-800/40">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            placeholder="Search collections by name or parent gateway..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-gray-900/50 border-gray-800 focus:ring-blue-500/30 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Button variant="outline" className="h-11 px-4 border-gray-800 hover:bg-gray-800 text-gray-300 rounded-xl flex-1 lg:flex-none">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl hidden lg:block">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Groups: </span>
            <span className="text-sm font-bold text-blue-400 ml-1">{collections.length}</span>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-gray-900/20 border border-gray-800/60 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/40 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-8 py-5">Collection Identity</th>
                <th className="px-8 py-5">Parent Gateway</th>
                <th className="px-8 py-5 text-center">Service Count</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-800" />
                        <div className="space-y-2">
                          <div className="h-4 w-48 bg-gray-800 rounded" />
                          <div className="h-3 w-32 bg-gray-800 rounded" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredCollections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
                      <div className="w-20 h-20 rounded-3xl bg-gray-800/30 flex items-center justify-center mb-6 border border-gray-800/50">
                        <FolderOpen className="w-10 h-10 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-200">No collections found</h3>
                      <p className="text-gray-500 text-sm mt-2 text-balance">
                        {searchQuery ? `No matches found for "${searchQuery}"` : "Logical groupings for your services. Start by creating a domain-driven collection."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCollections.map((col) => (
                  <tr key={col.id} className="group hover:bg-blue-500/[0.02] transition-all duration-300">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300">
                          <FolderOpen className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-100 group-hover:text-blue-400 transition-colors tracking-tight font-mono">
                            {col.name}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium line-clamp-1 max-w-[200px]">
                            {col.description || 'Logical service grouping'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Link href={`/api-gateway/${col.gateway_id}/collections`} className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                        <Globe className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{col.gatewayName}</span>
                      </Link>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-gray-800 text-indigo-400 text-[10px] font-black border border-gray-700 shadow-inner">
                          {col.servicesCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex justify-center">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full border transition-all duration-300",
                          col.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                            : "bg-gray-800/50 text-gray-500 border-gray-800"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            col.is_active ? "bg-emerald-400 animate-pulse" : "bg-gray-600"
                          )} />
                          {col.is_active ? "ACTIVE" : "DORMANT"}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === col.id} className="p-2 text-gray-500 hover:text-gray-100 hover:bg-gray-800 rounded-xl transition-all disabled:opacity-50">
                            {isDeleting === col.id ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> : <MoreVertical className="w-5 h-5" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-1 bg-gray-900 border-gray-800 text-gray-100 rounded-xl shadow-2xl backdrop-blur-xl">
                          <DropdownMenuItem onClick={() => handleOpenEdit(col.gateway_id!, col)} className="flex items-center gap-2 p-2.5 cursor-pointer rounded-lg hover:bg-blue-500/10 hover:text-blue-400 transition-all">
                            <Edit className="w-4 h-4" />
                            <span className="font-medium text-sm">Modify Collection</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-800" />
                          <DropdownMenuItem 
                            onClick={() => col.id && handleDelete(col.id)}
                            className="flex items-center gap-2 p-2.5 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash className="w-4 h-4" />
                            <span className="font-medium text-sm">Terminate Collection</span>
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
        <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-md rounded-3xl p-6 overflow-hidden shadow-2xl shadow-indigo-500/10">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Create Collection' : 'Edit Collection'}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {dialogMode === 'create' ? 'Add a new collection to organize your services.' : 'Modify the collection details.'}
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
