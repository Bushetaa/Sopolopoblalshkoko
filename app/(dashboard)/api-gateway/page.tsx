"use client";

import React from 'react';
import Link from 'next/link';
import { Plus, Globe, MoreVertical, Server, Zap, Edit, Trash, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { apiClient, Gateway } from '@/lib/api-client';
import WizardModal from '@/components/api-gateway/WizardModal';
import CreateGatewayModal from '@/components/api-gateway/modals/CreateGatewayModal';

export default function ApiGatewayPage() {
  const router = useRouter();
  const [gateways, setGateways] = React.useState<Gateway[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [isManualCreateOpen, setIsManualCreateOpen] = React.useState(false);

  const fetchGateways = async () => {
      try {
        const data = await apiClient.gateways.getAll();
        setGateways(data);
      } catch (error) {
        console.error('Failed to fetch gateways', error);
      } finally {
        setIsLoading(false);
      }
    };

  React.useEffect(() => {
    fetchGateways();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gateway?")) return;
    setIsDeleting(id);
    try {
      await apiClient.gateways.delete(id);
      await fetchGateways();
    } catch (error) {
      console.error("Failed to delete gateway", error);
    } finally {
      setIsDeleting(null);
    }
  };
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50">API Gateways</h2>
          <p className="text-sm text-gray-400 mt-1">Manage your entry points, routing, and traffic policies.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsManualCreateOpen(true)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-100 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-700"
          >
            <Plus className="w-4 h-4" />
            <span>Manual Create</span>
          </button>
          <button 
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
          >
            <Zap className="w-4 h-4 text-yellow-300" />
            <span>Create with Wizard</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Gateway Name</th>
              <th className="px-6 py-4 font-medium">Mode</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Created At</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Globe className="w-12 h-12 text-gray-700 mb-3 animate-pulse" />
                    <p className="text-base font-medium text-gray-300">Loading Gateways...</p>
                  </div>
                </td>
              </tr>
            ) : gateways.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Globe className="w-12 h-12 text-gray-700 mb-3" />
                    <p className="text-base font-medium text-gray-300">No Gateways Found</p>
                    <p className="mt-1">Create your first gateway to start managing traffic.</p>
                  </div>
                </td>
              </tr>
            ) : (
              gateways.map((gw) => (
                <tr key={gw.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${gw.id}/services`} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="font-medium text-gray-100 group-hover:text-blue-400 transition-colors">
                        {gw.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {gw.mode === 'pro' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
                          <Server className="w-3 h-3" /> PRO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-gray-800 text-gray-300 border border-gray-700 px-2 py-0.5 rounded-full">
                          <Zap className="w-3 h-3" /> SINGLE
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border",
                      gw.is_active 
                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                        : "bg-gray-800 text-gray-400 border-gray-700"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", gw.is_active ? "bg-green-400" : "bg-gray-500")} />
                      {gw.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {gw.created_at || 'Just now'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button disabled={isDeleting === gw.id} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors disabled:opacity-50">
                          {isDeleting === gw.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => router.push(`/api-gateway/${gw.id}/edit`)} className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Gateway
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => gw.id && handleDelete(gw.id)}
                          className="cursor-pointer text-red-500 hover:text-red-400 hover:bg-red-500/10 focus:text-red-400 focus:bg-red-500/10"
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete Gateway
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

      <WizardModal 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        onSuccess={fetchGateways} 
      />

      <CreateGatewayModal 
        isOpen={isManualCreateOpen}
        onClose={() => setIsManualCreateOpen(false)}
        onSuccess={fetchGateways}
      />
    </div>
  );
}
