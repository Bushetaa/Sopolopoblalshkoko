"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FolderOpen, Plus, MoreVertical, Globe, ChevronRight, Server, Edit, Trash, Loader2 } from 'lucide-react';
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
} from "@/components/ui/dropdown-menu";
import { CollectionForm, CollectionFormValues } from '@/components/collections/CollectionForm';

import { apiClient, Gateway, GatewayCollection } from '@/lib/api-client';

interface GroupedCollections {
  gatewayId: string;
  gatewayName: string;
  gatewayMode: string;
  collections: (GatewayCollection & { servicesCount: number })[];
}

export default function CollectionsPage() {
  const [groupedCollections, setGroupedCollections] = useState<GroupedCollections[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedGatewayId, setSelectedGatewayId] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<GatewayCollection | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchData = async () => {
      try {
        const [gateways, collections, services] = await Promise.all([
          apiClient.gateways.getAll(),
          apiClient.collections.getAll(),
          apiClient.services.getAll()
        ]);

        const proGateways = gateways.filter(gw => gw.mode === 'pro');
        
        const grouped = proGateways.map(gw => {
          const gwCollections = collections.filter(c => c.gateway_id === gw.id);
          return {
            gatewayId: gw.id || '',
            gatewayName: gw.name,
            gatewayMode: gw.mode || 'pro',
            collections: gwCollections.map(c => ({
              ...c,
              servicesCount: services.filter(s => s.collection_id === c.id).length
            }))
          };
        });

        setGroupedCollections(grouped);
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
  };

  const handleDelete = async (collectionId: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    setIsDeleting(collectionId);
    try {
      await apiClient.collections.delete(collectionId);
      if (isDialogOpen) setIsDialogOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete collection", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50">Collections</h2>
          <p className="text-sm text-gray-400 mt-1">Logical groupings of services within your Pro-mode gateways.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-700 mx-auto mb-3 animate-pulse" />
          <p className="text-base font-medium text-gray-300">Loading Collections...</p>
        </div>
      ) : groupedCollections.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-base font-medium text-gray-300">No Collections Found</p>
          <p className="text-sm text-gray-500 mt-1">Collections are available in Pro-mode gateways only.</p>
        </div>
      ) : (
        groupedCollections.map((gw) => (
          <div key={gw.gatewayId} className="space-y-4">
            {/* Gateway Header */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-100">{gw.gatewayName}</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
                  PRO
                </span>
              </div>
              <div className="flex-1" />
              <Link
                href={`/api-gateway/${gw.gatewayId}/collections`}
                className="text-xs text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                Manage <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gw.collections.map((col) => (
                <Link
                  key={col.id}
                  href={`/api-gateway/${gw.gatewayId}/collections`}
                  className={cn(
                    "bg-gray-900 border rounded-xl p-5 transition-all hover:border-gray-600 group",
                    col.active ? "border-gray-800" : "border-gray-800 opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                      <FolderOpen className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md border",
                        col.is_active
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-gray-800 text-gray-500 border-gray-700"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", col.is_active ? "bg-green-400" : "bg-gray-500")} />
                        {col.is_active ? "Active" : "Inactive"}
                      </span>
                      
                      {/* Stop propagation on click to avoid triggering link */}
                      <div onClick={(e) => e.preventDefault()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button disabled={isDeleting === col.id} className="p-1 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors disabled:opacity-50">
                              {isDeleting === col.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => handleOpenEdit(gw.gatewayId, col)} className="cursor-pointer">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => col.id && handleDelete(col.id)}
                              className="cursor-pointer text-red-500 hover:text-red-400 hover:bg-red-500/10 focus:text-red-400 focus:bg-red-500/10"
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-100 group-hover:text-blue-400 transition-colors font-mono">{col.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{col.description}</p>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-800">
                    <Server className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-400">{col.servicesCount} services</span>
                  </div>
                </Link>
              ))}

              {/* Add Collection Card */}
              <button 
                onClick={() => handleOpenCreate(gw.gatewayId)}
                className="bg-gray-950 border border-dashed border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-blue-400 hover:border-blue-500/30 transition-all min-h-[160px]"
              >
                <Plus className="w-8 h-8" />
                <span className="text-sm font-medium">Add Collection</span>
              </button>
            </div>
          </div>
        ))
      )}

      {/* Collection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-950 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-display text-gray-100 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-400" />
              {dialogMode === 'create' ? 'Create Collection' : 'Edit Collection'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {dialogMode === 'create' 
                ? 'Add a new collection to organize your routes and services.' 
                : 'Update the settings for this collection.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
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
