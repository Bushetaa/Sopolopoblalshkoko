"use client";

import React from 'react';
import Link from 'next/link';
import { Route as RouteIcon, GitMerge, Link as LinkIcon, MoreVertical, Edit, Trash, Loader2, Plus, Globe, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient, GatewayRoute, Gateway } from '@/lib/api-client';

interface EnhancedRoute extends GatewayRoute { gatewayName: string; serviceName: string; }

export default function GlobalRoutesPage() {
  const router = useRouter();
  const [routes, setRoutes] = React.useState<EnhancedRoute[]>([]);
  const [gateways, setGateways] = React.useState<Gateway[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchData = async () => {
    try {
      const [fetchedRoutes, fetchedGateways, services] = await Promise.all([
        apiClient.gatewayRoutes.getAll(), apiClient.gateways.getAll(), apiClient.services.getAll()
      ]);
      setGateways(fetchedGateways);
      setRoutes(fetchedRoutes.map(route => ({
        ...route,
        gatewayName: fetchedGateways.find(g => g.id === route.gateway_id)?.name || 'Unknown',
        serviceName: services.find(s => s.id === route.service_id)?.name || 'Unknown'
      })));
    } catch (error) { console.error('Failed to fetch routes', error); }
    finally { setIsLoading(false); }
  };

  React.useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this route?")) return;
    setIsDeleting(id);
    try { await apiClient.gatewayRoutes.delete(id); await fetchData(); }
    catch (error) { console.error("Failed to delete route", error); }
    finally { setIsDeleting(null); }
  };

  const filtered = routes.filter(rt => rt.path.toLowerCase().includes(searchQuery.toLowerCase()) || rt.gatewayName.toLowerCase().includes(searchQuery.toLowerCase()) || rt.serviceName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50 tracking-tight">All Routes</h2>
          <p className="text-sm text-gray-400 mt-0.5">Define path-based routing, HTTP methods, and aggregate endpoints.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-900/20 active:scale-95">
              <Plus className="w-4 h-4 mr-1.5" />Create Route
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5 bg-gray-900 border-gray-800 text-gray-100 rounded-xl shadow-2xl">
            <DropdownMenuLabel className="px-2.5 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Target Gateway</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800/50" />
            {gateways.length === 0 ? <div className="px-3 py-3 text-center text-xs text-gray-500">No gateways available</div> :
              gateways.map(gw => (
                <DropdownMenuItem key={gw.id} onClick={() => router.push(`/api-gateway/${gw.id}/routes/new`)} className="flex items-center gap-2.5 p-2 cursor-pointer rounded-lg hover:bg-blue-500/10 hover:text-blue-400 text-sm">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />{gw.name}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input placeholder="Search routes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9 bg-gray-900/50 border-gray-800 focus:ring-blue-500/30 rounded-lg text-sm" />
        </div>
        <Button variant="outline" size="sm" className="h-9 px-3 border-gray-800 hover:bg-gray-800 text-gray-400 rounded-lg"><Filter className="w-3.5 h-3.5 mr-1.5" />Filter</Button>
        <div className="px-3 py-1.5 bg-gray-900/50 border border-gray-800 rounded-lg hidden sm:block">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Routes: </span>
          <span className="text-xs font-bold text-blue-400">{routes.length}</span>
        </div>
      </div>

      <div className="bg-gray-900/20 border border-gray-800/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/40 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Path</th>
                <th className="px-5 py-3 text-center">Method</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Gateway</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {isLoading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse"><td colSpan={6} className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gray-800" /><div className="h-4 w-36 bg-gray-800 rounded" /></div></td></tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center">
                  <RouteIcon className="w-10 h-10 text-gray-700 mb-3 mx-auto" />
                  <h3 className="text-base font-bold text-gray-200">No routes found</h3>
                  <p className="text-gray-500 text-sm mt-1">{searchQuery ? `No matches for "${searchQuery}"` : "Define your first traffic route."}</p>
                </td></tr>
              ) : filtered.map((rt) => (
                <tr key={rt.id} className="group hover:bg-blue-500/[0.03] transition-colors duration-200">
                  <td className="px-5 py-3">
                    <Link href={`/api-gateway/${rt.gateway_id}/routes/${rt.id}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                        <RouteIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <span className="text-sm font-mono font-semibold text-gray-100 group-hover:text-blue-400 transition-colors">{rt.path}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Badge variant="outline" className={cn("font-bold text-[10px] px-2 py-0.5 rounded-md border",
                      rt.method === 'GET' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      rt.method === 'POST' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    )}>{rt.method}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    {rt.is_aggregate ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20"><GitMerge className="w-3 h-3" />Aggregate</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400 bg-gray-800/40 px-2 py-0.5 rounded-md border border-gray-800/60"><LinkIcon className="w-3 h-3" />Standard</span>
                    )}
                  </td>
                  <td className="px-5 py-3"><span className="text-xs text-gray-300 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />{rt.serviceName}</span></td>
                  <td className="px-5 py-3">
                    <Link href={`/api-gateway/${rt.gateway_id}/routes`} className="text-gray-400 hover:text-blue-400 transition-colors text-xs flex items-center gap-1.5">
                      <Globe className="w-3 h-3" />{rt.gatewayName}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><button disabled={isDeleting === rt.id} className="p-1.5 text-gray-500 hover:text-gray-100 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50">{isDeleting === rt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}</button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 p-1 bg-gray-900 border-gray-800 text-gray-100 rounded-xl shadow-2xl">
                        <DropdownMenuItem onClick={() => router.push(`/api-gateway/${rt.gateway_id}/routes/${rt.id}/edit`)} className="flex items-center gap-2 p-2 cursor-pointer rounded-lg hover:bg-blue-500/10 hover:text-blue-400 text-sm"><Edit className="w-3.5 h-3.5" />Edit</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-800" />
                        <DropdownMenuItem onClick={() => rt.id && handleDelete(rt.id)} className="flex items-center gap-2 p-2 cursor-pointer text-red-400 hover:bg-red-500/10 rounded-lg text-sm"><Trash className="w-3.5 h-3.5" />Delete</DropdownMenuItem>
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
