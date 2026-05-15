"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FolderOpen, Plus, MoreVertical, Globe, Server, Edit, Trash, Loader2 } from 'lucide-react';
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
  const [allGateways, setAllGateways] = useState<Gateway[]>([]);
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
        setAllGateways(gateways);
        
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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50">Collections</h2>
          <p className="text-sm text-gray-400 mt-1">Logical groupings of services within your Pro-mode gateways.</p>
        </div>
        {allGateways.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
                <Plus className="w-4 h-4" />
                <span>Create Collection</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {allGateways.map(gw => (
                <DropdownMenuItem key={gw.id} onClick={() => handleOpenCreate(gw.id!)} className="cursor-pointer">
                  <Globe className="w-4 h-4 mr-2 text-blue-400" />
                  {gw.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Collection Name</th>
              <th className="px-6 py-4 font-medium">Gateway</th>
              <th className="px-6 py-4 font-medium">Services</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-gray-700 mb-3 animate-pulse" />
                    <p className="text-base font-medium text-gray-300">Loading Collections...</p>
                  </div>
                </td>
              </tr>
            ) : groupedCollections.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-gray-700 mb-3" />
                    <p className="text-base font-medium text-gray-300">No Collections Found</p>
                    <p className="mt-1">Create your first collection to organize services.</p>
                  </div>
                </td>
              </tr>
            ) : (
              groupedCollections.flatMap((gw) =>
                gw.collections.map((col) => (
                  <tr key={col.id} className="hover:bg-gray-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-800 border border-gray-700 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                          <FolderOpen className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-100 group-hover:text-blue-400 transition-colors">{col.name}</span>
                          {col.description && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{col.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/api-gateway/${gw.gatewayId}/services`} className="text-gray-400 hover:text-blue-400 transition-colors text-xs flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        {gw.gatewayName}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-gray-400">
                        <Server className="w-3.5 h-3.5 text-gray-500" />
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-gray-300 text-xs font-medium border border-gray-700">{col.servicesCount}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border",
                        col.is_active
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-gray-800 text-gray-400 border-gray-700"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", col.is_active ? "bg-green-400" : "bg-gray-500")} />
                        {col.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === col.id} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors disabled:opacity-50">
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
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>

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
