"use client";

import React from 'react';
import Link from 'next/link';
import { Plug, Power, MoreVertical, Edit, Trash, Loader2, Plus, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { apiClient, GatewayPlugin, Gateway } from '@/lib/api-client';
import CreatePluginModal from '@/components/api-gateway/modals/CreatePluginModal';

interface EnhancedPlugin extends GatewayPlugin {
  gatewayName: string;
  scope: string;
  phase: string;
}

export default function GlobalPluginsPage() {
  const router = useRouter();
  const [plugins, setPlugins] = React.useState<EnhancedPlugin[]>([]);
  const [gateways, setGateways] = React.useState<Gateway[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedGatewayId, setSelectedGatewayId] = React.useState<string>('');

  const fetchData = async () => {
      try {
        const [fetchedPlugins, fetchedGateways] = await Promise.all([
          apiClient.gatewayPlugins.getAll(),
          apiClient.gateways.getAll()
        ]);

        setGateways(fetchedGateways);

        const formatted = fetchedPlugins.map(plugin => {
          const gw = fetchedGateways.find(g => g.id === plugin.gateway_id);
          
          let scope = 'Gateway';
          if (plugin.route_id) scope = 'Route';
          if (plugin.service_id) scope = 'Service';

          // Basic phase mapping based on typical plugin names
          let phase = 'PreRouting';
          if (plugin.name.includes('auth') || plugin.name.includes('jwt')) phase = 'Authentication';
          if (plugin.name.includes('limit')) phase = 'RateLimiting';

          return {
            ...plugin,
            gatewayName: gw?.name || 'Unknown',
            scope,
            phase
          };
        });

        setPlugins(formatted);
      } catch (error) {
        console.error('Failed to fetch plugins', error);
      } finally {
        setIsLoading(false);
      }
    };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plugin?")) return;
    setIsDeleting(id);
    try {
      await apiClient.gatewayPlugins.delete(id);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete plugin", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50">All Plugins</h2>
          <p className="text-sm text-gray-400 mt-1">A global view of plugins across all your gateways and routes.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
              <Plus className="w-4 h-4" />
              <span>Add Plugin</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Select a Gateway</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {gateways.length === 0 ? (
              <DropdownMenuItem disabled className="text-gray-500">No gateways available</DropdownMenuItem>
            ) : (
              gateways.map(gw => (
                <DropdownMenuItem key={gw.id} onClick={() => {
                  setSelectedGatewayId(gw.id!);
                  setIsCreateModalOpen(true);
                }} className="cursor-pointer">
                  <Globe className="w-4 h-4 mr-2 text-blue-400" />
                  {gw.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Plugin</th>
              <th className="px-6 py-4 font-medium">Phase</th>
              <th className="px-6 py-4 font-medium">Scope</th>
              <th className="px-6 py-4 font-medium">Gateway</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <Plug className="w-12 h-12 text-gray-700 mx-auto mb-3 animate-pulse" />
                  <p className="text-base font-medium text-gray-300">Loading Plugins...</p>
                </td>
              </tr>
            ) : plugins.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <Plug className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-base font-medium text-gray-300">No Plugins Found</p>
                </td>
              </tr>
            ) : (
              plugins.map((plg) => (
                <tr key={plg.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${plg.gateway_id}/plugins`} className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded flex items-center justify-center", plg.enabled ? "bg-blue-500/10 border border-blue-500/20" : "bg-gray-800 border border-gray-700")}>
                        <Plug className={cn("w-4 h-4", plg.enabled ? "text-blue-400" : "text-gray-500")} />
                      </div>
                      <span className="font-medium text-gray-100 group-hover:text-blue-400 transition-colors capitalize">{plg.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300 font-mono text-xs bg-gray-800 px-2 py-1 rounded">{plg.phase}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border",
                      plg.scope === 'Gateway'
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    )}>
                      {plg.scope}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${plg.gateway_id}/plugins`} className="text-gray-400 hover:text-blue-400 transition-colors text-xs">
                      {plg.gatewayName}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border",
                      plg.enabled
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-gray-800 text-gray-400 border-gray-700"
                    )}>
                      <Power className="w-3 h-3" />
                      {plg.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button disabled={isDeleting === plg.id} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors disabled:opacity-50">
                          {isDeleting === plg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => router.push(`/api-gateway/${plg.gateway_id}/plugins`)} className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Manage Plugin
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => plg.id && handleDelete(plg.id)}
                          className="cursor-pointer text-red-500 hover:text-red-400 hover:bg-red-500/10 focus:text-red-400 focus:bg-red-500/10"
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete Plugin
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

      {selectedGatewayId && (
        <CreatePluginModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchData}
          gatewayId={selectedGatewayId}
        />
      )}
    </div>
  );
}
