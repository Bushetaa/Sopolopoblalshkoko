"use client";

import React from 'react';
import Link from 'next/link';
import { Plug, Power, MoreVertical, Edit, Trash, Loader2, Plus, Globe, Search, Filter, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient, GatewayPlugin, Gateway } from '@/lib/api-client';

interface EnhancedPlugin extends GatewayPlugin { gatewayName: string; scope: string; phase: string; }

export default function GlobalPluginsPage() {
  const router = useRouter();
  const [plugins, setPlugins] = React.useState<EnhancedPlugin[]>([]);
  const [gateways, setGateways] = React.useState<Gateway[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchData = async () => {
    try {
      const [fetchedPlugins, fetchedGateways] = await Promise.all([apiClient.gatewayPlugins.getAll(), apiClient.gateways.getAll()]);
      setGateways(fetchedGateways);
      setPlugins(fetchedPlugins.map(plugin => {
        const gw = fetchedGateways.find(g => g.id === plugin.gateway_id);
        let scope = 'Gateway';
        if (plugin.route_id) scope = 'Route';
        if (plugin.service_id) scope = 'Service';
        let phase = 'PreRouting';
        if (plugin.name.includes('auth') || plugin.name.includes('jwt')) phase = 'Authentication';
        if (plugin.name.includes('limit')) phase = 'RateLimiting';
        return { ...plugin, gatewayName: gw?.name || 'Unknown', scope, phase };
      }));
    } catch (error) { console.error('Failed to fetch plugins', error); }
    finally { setIsLoading(false); }
  };

  React.useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plugin?")) return;
    setIsDeleting(id);
    try { await apiClient.gatewayPlugins.delete(id); await fetchData(); }
    catch (error) { console.error("Failed to delete plugin", error); }
    finally { setIsDeleting(null); }
  };

  const filtered = plugins.filter(plg => plg.name.toLowerCase().includes(searchQuery.toLowerCase()) || plg.gatewayName.toLowerCase().includes(searchQuery.toLowerCase()) || plg.scope.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50 tracking-tight">All Plugins</h2>
          <p className="text-sm text-gray-400 mt-0.5">Extend gateways with auth, rate limiting, and traffic transformations.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-900/20 active:scale-95">
              <Plus className="w-4 h-4 mr-1.5" />Add Plugin
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5 bg-gray-900 border-gray-800 text-gray-100 rounded-xl shadow-2xl">
            <DropdownMenuLabel className="px-2.5 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Select Gateway</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800/50" />
            {gateways.length === 0 ? <div className="px-3 py-3 text-center text-xs text-gray-500">No gateways available</div> :
              gateways.map(gw => (
                <DropdownMenuItem key={gw.id} onClick={() => router.push(`/api-gateway/${gw.id}/plugins`)} className="flex items-center gap-2.5 p-2 cursor-pointer rounded-lg hover:bg-blue-500/10 hover:text-blue-400 text-sm">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />{gw.name}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input placeholder="Search plugins..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9 bg-gray-900/50 border-gray-800 focus:ring-blue-500/30 rounded-lg text-sm" />
        </div>
        <Button variant="outline" size="sm" className="h-9 px-3 border-gray-800 hover:bg-gray-800 text-gray-400 rounded-lg"><Filter className="w-3.5 h-3.5 mr-1.5" />Filter</Button>
        <div className="px-3 py-1.5 bg-gray-900/50 border border-gray-800 rounded-lg hidden sm:block">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Loaded: </span>
          <span className="text-xs font-bold text-blue-400">{plugins.length}</span>
        </div>
      </div>

      <div className="bg-gray-900/20 border border-gray-800/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/40 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Plugin</th>
                <th className="px-5 py-3">Phase</th>
                <th className="px-5 py-3 text-center">Scope</th>
                <th className="px-5 py-3">Gateway</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {isLoading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse"><td colSpan={6} className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gray-800" /><div className="h-4 w-36 bg-gray-800 rounded" /></div></td></tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center">
                  <Plug className="w-10 h-10 text-gray-700 mb-3 mx-auto" />
                  <h3 className="text-base font-bold text-gray-200">No plugins found</h3>
                  <p className="text-gray-500 text-sm mt-1">{searchQuery ? `No matches for "${searchQuery}"` : "Deploy plugins to extend gateway functionality."}</p>
                </td></tr>
              ) : filtered.map((plg) => (
                <tr key={plg.id} className="group hover:bg-blue-500/[0.03] transition-colors duration-200">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all border", plg.enabled ? "bg-blue-500/10 border-blue-500/20" : "bg-gray-800/50 border-gray-700/50")}>
                        <Plug className={cn("w-4 h-4", plg.enabled ? "text-blue-400" : "text-gray-600")} />
                      </div>
                      <span className="text-sm font-semibold text-gray-100 group-hover:text-blue-400 transition-colors capitalize">{plg.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="text-xs font-mono text-gray-400 bg-gray-800/40 px-1.5 py-0.5 rounded border border-gray-800/60">{plg.phase}</span></td>
                  <td className="px-5 py-3 text-center">
                    <Badge variant="outline" className={cn("font-bold text-[10px] px-2 py-0.5 rounded-md border", plg.scope === 'Gateway' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-purple-500/10 text-purple-400 border-purple-500/20")}>{plg.scope.toUpperCase()}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/api-gateway/${plg.gateway_id}/plugins`} className="text-gray-400 hover:text-blue-400 transition-colors text-xs flex items-center gap-1.5">
                      <Globe className="w-3 h-3" />{plg.gatewayName}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border", plg.enabled ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-gray-800/50 text-gray-500 border-gray-800")}>
                      {plg.enabled ? <ToggleRight className="w-3 h-3" /> : <Power className="w-3 h-3" />}
                      {plg.enabled ? "ON" : "OFF"}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><button disabled={isDeleting === plg.id} className="p-1.5 text-gray-500 hover:text-gray-100 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50">{isDeleting === plg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}</button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 p-1 bg-gray-900 border-gray-800 text-gray-100 rounded-xl shadow-2xl">
                        <DropdownMenuItem onClick={() => router.push(`/api-gateway/${plg.gateway_id}/plugins`)} className="flex items-center gap-2 p-2 cursor-pointer rounded-lg hover:bg-blue-500/10 hover:text-blue-400 text-sm"><Edit className="w-3.5 h-3.5" />Configure</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-800" />
                        <DropdownMenuItem onClick={() => plg.id && handleDelete(plg.id)} className="flex items-center gap-2 p-2 cursor-pointer text-red-400 hover:bg-red-500/10 rounded-lg text-sm"><Trash className="w-3.5 h-3.5" />Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
