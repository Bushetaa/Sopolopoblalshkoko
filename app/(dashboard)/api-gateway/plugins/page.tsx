"use client";

import React from 'react';
import Link from 'next/link';
import { Plug, Power, MoreVertical, Edit, Trash, Loader2, Plus, Globe, Search, Filter, ShieldCheck, Zap, ToggleRight, Box } from 'lucide-react';
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { apiClient, GatewayPlugin, Gateway } from '@/lib/api-client';

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
  const [searchQuery, setSearchQuery] = React.useState('');

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

  const filteredPlugins = plugins.filter(plg => 
    plg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plg.gatewayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plg.scope.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header Section - Consistent Size */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/60 to-blue-900/10 border border-gray-800/60 rounded-3xl p-8 backdrop-blur-md">
        <div className="absolute top-[-20%] right-[-10%] opacity-10 blur-3xl">
          <Plug className="w-96 h-96 text-blue-500" />
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.2em]">
              <div className="w-6 h-[2px] bg-blue-500" />
              Module Extensions
            </div>
            <h2 className="text-4xl font-extrabold font-display text-gray-50 tracking-tight leading-tight">
              All Plugins
            </h2>
            <p className="text-gray-400 max-w-2xl text-sm leading-relaxed font-medium">
              A global view of plugins across all your gateways and routes. Extend gateway functionality with authentication, rate limiting, and custom traffic transformations.
            </p>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 bg-gray-950/50 border border-gray-800 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-bold text-gray-300">Policy Enforcement Active</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-950/50 border border-gray-800 px-3 py-1.5 rounded-xl">
                <Box className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[10px] font-bold text-gray-300">Modular Extensions</span>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="group relative h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95 overflow-hidden border border-blue-400/20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90 duration-500" />
                <span>Add Plugin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 bg-gray-900 border-gray-800 text-gray-100 rounded-2xl shadow-2xl backdrop-blur-xl">
              <DropdownMenuLabel className="px-3 py-2 text-xs font-black text-gray-500 uppercase tracking-widest">Select Infrastructure</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800/50" />
              {gateways.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-gray-500">No gateways available</div>
              ) : (
                gateways.map(gw => (
                  <DropdownMenuItem key={gw.id} onClick={() => router.push(`/api-gateway/${gw.id}/plugins`)} className="flex items-center gap-3 p-3 cursor-pointer rounded-xl hover:bg-blue-500/10 hover:text-blue-400 transition-all group/item">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{gw.name}</span>
                      <span className="text-[10px] text-gray-500 group-hover/item:text-blue-300/60">Global Cluster</span>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-center gap-4 bg-gray-950/50 p-4 rounded-2xl border border-gray-800/40">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            placeholder="Search plugins by name, scope or gateway..." 
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
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Loaded Plugins: </span>
            <span className="text-sm font-bold text-blue-400 ml-1">{plugins.length}</span>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-gray-900/20 border border-gray-800/60 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/40 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-8 py-5">Plugin Module</th>
                <th className="px-8 py-5">Execution Phase</th>
                <th className="px-8 py-5 text-center">Scope</th>
                <th className="px-8 py-5">Host Gateway</th>
                <th className="px-8 py-5 text-center">Runtime Status</th>
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-6">
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
              ) : filteredPlugins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
                      <div className="w-20 h-20 rounded-3xl bg-gray-800/30 flex items-center justify-center mb-6 border border-gray-800/50">
                        <Plug className="w-10 h-10 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-200">No plugins found</h3>
                      <p className="text-gray-500 text-sm mt-2 text-balance">
                        {searchQuery ? `No matches found for "${searchQuery}"` : "Enhance your gateway by deploying security or traffic management plugins."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPlugins.map((plg) => (
                  <tr key={plg.id} className="group hover:bg-blue-500/[0.02] transition-all duration-300">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border",
                          plg.enabled 
                            ? "bg-blue-500/10 border-blue-500/20 group-hover:scale-110 shadow-sm shadow-blue-500/10" 
                            : "bg-gray-800/50 border-gray-700/50"
                        )}>
                          <Plug className={cn("w-5 h-5 transition-colors", plg.enabled ? "text-blue-400" : "text-gray-600")} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-100 group-hover:text-blue-400 transition-colors tracking-tight capitalize">
                            {plg.name}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">Gateway Extension Module</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-mono font-bold text-gray-400 bg-gray-800/40 px-2 py-1 rounded-lg border border-gray-800/60">
                        {plg.phase}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex justify-center">
                        <Badge variant="outline" className={cn(
                          "font-black text-[10px] px-2 py-0.5 rounded-lg border",
                          plg.scope === 'Gateway'
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        )}>
                          {plg.scope.toUpperCase()}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Link href={`/api-gateway/${plg.gateway_id}/plugins`} className="text-gray-400 hover:text-blue-400 transition-colors text-xs flex items-center gap-1.5 font-medium">
                        <Globe className="w-3.5 h-3.5" />
                        {plg.gatewayName}
                      </Link>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex justify-center">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full border transition-all duration-300",
                          plg.enabled
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-gray-800/50 text-gray-500 border-gray-800"
                        )}>
                          {plg.enabled ? <ToggleRight className="w-3.5 h-3.5" /> : <Power className="w-3 h-3" />}
                          {plg.enabled ? "ACTIVE" : "OFF"}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === plg.id} className="p-2 text-gray-500 hover:text-gray-100 hover:bg-gray-800 rounded-xl transition-all disabled:opacity-50">
                            {isDeleting === plg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-5 h-5" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-1 bg-gray-900 border-gray-800 text-gray-100 rounded-xl shadow-2xl backdrop-blur-xl">
                          <DropdownMenuItem onClick={() => router.push(`/api-gateway/${plg.gateway_id}/plugins`)} className="flex items-center gap-2 p-2.5 cursor-pointer rounded-lg hover:bg-blue-500/10 hover:text-blue-400 transition-all">
                            <Edit className="w-4 h-4" />
                            <span className="font-medium text-sm">Configure Module</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-800" />
                          <DropdownMenuItem 
                            onClick={() => plg.id && handleDelete(plg.id)}
                            className="flex items-center gap-2 p-2.5 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash className="w-4 h-4" />
                            <span className="font-medium text-sm">Remove Extension</span>
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
