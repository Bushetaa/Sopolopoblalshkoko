"use client";

import React, { useState, use } from 'react';
import { FolderOpen, Plus, MoreVertical, Trash, Edit, Loader2 } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-display text-gray-50">Collections</h3>
          <p className="text-sm text-gray-400 mt-1">Group your services logically. (Pro Mode only)</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create Collection</span>
        </button>
      </div>

      {/* Create Collection Floating Card */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-50">Create Collection</h2>
                  <p className="text-xs text-gray-400">Group related services together</p>
                </div>
              </div>
              <button onClick={() => setIsCreating(false)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Collection Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. v1, auth, billing"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                <textarea
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500 h-20 resize-none"
                  placeholder="Brief description of this collection..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-3">
              <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-lg font-medium transition-colors">
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleCreate}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {isSubmitting ? "Creating..." : "Create Collection"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-gray-700 mb-3 animate-pulse" />
                    <p className="text-base font-medium text-gray-300">Loading Collections...</p>
                  </div>
                </td>
              </tr>
            ) : collections.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-gray-700 mb-3" />
                    <p className="text-base font-medium text-gray-300">No Collections Found</p>
                    <p className="mt-1">Create your first collection to group your services.</p>
                  </div>
                </td>
              </tr>
            ) : (
              collections.map((col) => (
                <tr key={col.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-800 border border-gray-700 flex items-center justify-center">
                        <FolderOpen className="w-4 h-4 text-gray-400 group-hover:text-amber-400 transition-colors" />
                      </div>
                      <span className="font-medium text-gray-100 group-hover:text-amber-400 transition-colors">{col.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {col.description || '-'}
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
                        <DropdownMenuItem 
                          onClick={() => col.id && handleDelete(col.id)}
                          className="cursor-pointer text-red-500 hover:text-red-400 hover:bg-red-500/10 focus:text-red-400 focus:bg-red-500/10"
                        >
                          <Trash className="w-4 h-4 mr-2" />
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
  );
}
