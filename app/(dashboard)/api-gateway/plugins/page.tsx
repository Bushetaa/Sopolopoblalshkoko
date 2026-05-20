"use client";

import React from 'react';
import Link from 'next/link';
import { Plug, Power, MoreVertical, Edit, Trash, Loader2, Plus, Globe, Activity } from 'lucide-react';
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
  const [editingPlugin, setEditingPlugin] = React.useState<EnhancedPlugin | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            <div className="w-8 h-[2px] bg-blue-500" />
            Middleware Registry
          </div>
          <h2 className="text-3xl font-black font-display text-white tracking-tight flex items-center gap-3">
            Global Plugins
          </h2>
          <p className="text-[13px] text-[#64748B] mt-1.5 font-medium leading-relaxed">
            A unified intelligence layer across all gateways, providing security, monitoring, and traffic orchestration.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95 group w-full md:w-auto">
              <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">
                <Plus className="w-3 h-3 text-white stroke-[3px]" />
              </div>
              <span>Register Plugin</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-[#0B101B] border-white/5 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
            <DropdownMenuLabel className="text-[9px] font-black text-[#475569] uppercase tracking-widest px-4 py-2">Select Target Gateway</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            {gateways.length === 0 ? (
              <DropdownMenuItem disabled className="text-[10px] font-black text-gray-500 uppercase tracking-widest py-3 px-4">No clusters available</DropdownMenuItem>
            ) : (
              gateways.map(gw => (
                <DropdownMenuItem key={gw.id} onClick={() => {
                  setSelectedGatewayId(gw.id!);
                  setIsCreateModalOpen(true);
                }} className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-all py-3 px-4">
                  <Globe className="w-3.5 h-3.5 mr-3 text-blue-400" />
                  {gw.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#050810]/80 border-b border-white/5 text-[#64748B] uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-7 py-5">Plugin Identity</th>
                <th className="px-7 py-5">Phase</th>
                <th className="px-7 py-5">Scope</th>
                <th className="px-7 py-5">Parent Cluster</th>
                <th className="px-7 py-5">Status</th>
                <th className="px-7 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-7 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center mb-4 animate-pulse">
                        <Plug className="w-8 h-8 text-blue-500/40" />
                      </div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">Compiling Middleware Topology...</p>
                    </div>
                  </td>
                </tr>
              ) : plugins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-7 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4">
                        <Plug className="w-8 h-8 text-[#1E293B]" />
                      </div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">No Plugins Found</p>
                      <p className="text-[10px] text-[#64748B] mt-2 font-medium uppercase tracking-wider">Enhance your infrastructure by registering a new plugin.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                plugins.map((plg) => (
                  <tr key={plg.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-7 py-5">
                      <Link href={`/api-gateway/${plg.gateway_id}/plugins`} className="flex items-center gap-4">
                        <div className={cn(
                          "w-9 h-9 rounded-xl border flex items-center justify-center transition-all shadow-lg group-hover:border-blue-500/40", 
                          plg.enabled 
                            ? "bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                            : "bg-white/5 border-white/5"
                        )}>
                          <Plug className={cn("w-4.5 h-4.5 stroke-[2.5px]", plg.enabled ? "text-blue-400" : "text-[#475569]")} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-white tracking-tight group-hover:text-blue-400 transition-colors capitalize">
                            {plg.name}
                          </span>
                          <span className="text-[9px] text-[#475569] font-black uppercase tracking-widest mt-0.5">Middleware Logic</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-7 py-5">
                      <span className="text-[#94A3B8] font-mono text-[10px] bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-lg uppercase tracking-wider tabular-nums">
                        {plg.phase}
                      </span>
                    </td>
                    <td className="px-7 py-5">
                      <span className={cn(
                        "inline-flex text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border transition-all",
                        plg.scope === 'Gateway'
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                          : "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                      )}>
                        {plg.scope}
                      </span>
                    </td>
                    <td className="px-7 py-5">
                      <Link href={`/api-gateway/${plg.gateway_id}/plugins`} className="flex items-center gap-2 group/gw">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover/gw:bg-blue-500 transition-colors" />
                        <span className="text-[11px] font-bold text-[#94A3B8] group-hover/gw:text-white transition-colors">
                          {plg.gatewayName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-7 py-5">
                      <span className={cn(
                        "inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border transition-all",
                        plg.enabled
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                          : "bg-white/5 text-[#475569] border-white/5"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", plg.enabled ? "bg-emerald-400 animate-pulse" : "bg-[#475569]")} />
                        {plg.enabled ? "Operational" : "Standby"}
                      </span>
                    </td>
                    <td className="px-7 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === plg.id} className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95 border border-transparent hover:border-white/5">
                            {isDeleting === plg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-[#0B101B] border-white/5 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                          <DropdownMenuItem 
                            onClick={() => {
                              setEditingPlugin(plg);
                              setSelectedGatewayId(plg.gateway_id || '');
                              setIsEditModalOpen(true);
                            }} 
                            className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-all py-3 px-4"
                          >
                            <Edit className="w-3.5 h-3.5 mr-3 text-blue-500" />
                            Manage Logic
                          </DropdownMenuItem>
                          <div className="h-[1px] bg-white/5 my-1" />
                          <DropdownMenuItem 
                            onClick={() => plg.id && handleDelete(plg.id)}
                            className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300 transition-all py-3 px-4"
                          >
                            <Trash className="w-3.5 h-3.5 mr-3" />
                            Terminate Plugin
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

      {selectedGatewayId && (
        <CreatePluginModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchData}
          gatewayId={selectedGatewayId}
        />
      )}

      {selectedGatewayId && editingPlugin && (
        <CreatePluginModal 
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setEditingPlugin(null); }}
          onSuccess={fetchData}
          gatewayId={selectedGatewayId}
          editingPlugin={editingPlugin}
          isEditMode={true}
        />
      )}
    </div>
  );
}
