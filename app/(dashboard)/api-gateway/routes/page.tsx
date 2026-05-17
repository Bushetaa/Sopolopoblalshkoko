"use client";

import React from 'react';
import Link from 'next/link';
import { Route as RouteIcon, GitMerge, Link as LinkIcon, MoreVertical, Edit, Trash, Loader2, Plus, Globe, Search, Filter, ArrowUpRight, MapPin, Share2 } from 'lucide-react';
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

import { apiClient, GatewayRoute, Gateway } from '@/lib/api-client';

interface EnhancedRoute extends GatewayRoute {
  gatewayName: string;
  serviceName: string;
}

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
          apiClient.gatewayRoutes.getAll(),
          apiClient.gateways.getAll(),
          apiClient.services.getAll()
        ]);

        setGateways(fetchedGateways);

        const formatted = fetchedRoutes.map(route => {
          const gw = fetchedGateways.find(g => g.id === route.gateway_id);
          const svc = services.find(s => s.id === route.service_id);
          return {
            ...route,
            gatewayName: gw?.name || 'Unknown',
            serviceName: svc?.name || 'Unknown'
          };
        });

        setRoutes(formatted);
      } catch (error) {
        console.error('Failed to fetch routes', error);
      } finally {
        setIsLoading(false);
      }
    };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this route?")) return;
    setIsDeleting(id);
    try {
      await apiClient.gatewayRoutes.delete(id);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete route", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredRoutes = routes.filter(rt => 
    rt.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rt.gatewayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rt.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header Section - Same Size as Gateway/Targets/Services */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/60 to-emerald-900/10 border border-gray-800/60 rounded-3xl p-8 backdrop-blur-md">
        <div className="absolute top-[-20%] right-[-10%] opacity-10 blur-3xl">
          <RouteIcon className="w-96 h-96 text-emerald-500" />
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-[0.2em]">
              <div className="w-6 h-[2px] bg-emerald-500" />
              Traffic Routing
            </div>
            <h2 className="text-4xl font-extrabold font-display text-gray-50 tracking-tight leading-tight">
              All Routes
            </h2>
            <p className="text-gray-400 max-w-2xl text-sm leading-relaxed font-medium">
              A global view of routes across all your gateways. Define path-based routing, manage HTTP methods, and configure aggregate endpoints for complex microservices orchestration.
            </p>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 bg-gray-950/50 border border-gray-800 px-3 py-1.5 rounded-xl">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-bold text-gray-300">Path-Based Discovery</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-950/50 border border-gray-800 px-3 py-1.5 rounded-xl">
                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-bold text-gray-300">Traffic Splitting Active</span>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="group relative h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95 overflow-hidden border border-blue-400/20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90 duration-500" />
                <span>Create Route</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 bg-gray-900 border-gray-800 text-gray-100 rounded-2xl shadow-2xl backdrop-blur-xl">
              <DropdownMenuLabel className="px-3 py-2 text-xs font-black text-gray-500 uppercase tracking-widest">Target Gateway</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800/50" />
              {gateways.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-gray-500">No gateways available</div>
              ) : (
                gateways.map(gw => (
                  <DropdownMenuItem key={gw.id} onClick={() => router.push(`/api-gateway/${gw.id}/routes/new`)} className="flex items-center gap-3 p-3 cursor-pointer rounded-xl hover:bg-blue-500/10 hover:text-blue-400 transition-all group/item">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{gw.name}</span>
                      <span className="text-[10px] text-gray-500 group-hover/item:text-blue-300/60">Edge Infrastructure</span>
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
            placeholder="Search routes by path, service or gateway..." 
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
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Routes: </span>
            <span className="text-sm font-bold text-blue-400 ml-1">{routes.length}</span>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-gray-900/20 border border-gray-800/60 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/40 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-8 py-5">Route Path</th>
                <th className="px-8 py-5 text-center">Method</th>
                <th className="px-8 py-5">Configuration</th>
                <th className="px-8 py-5">Target Service</th>
                <th className="px-8 py-5">Gateway</th>
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
              ) : filteredRoutes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
                      <div className="w-20 h-20 rounded-3xl bg-gray-800/30 flex items-center justify-center mb-6 border border-gray-800/50">
                        <RouteIcon className="w-10 h-10 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-200">No routes found</h3>
                      <p className="text-gray-500 text-sm mt-2 text-balance">
                        {searchQuery ? `No matches found for "${searchQuery}"` : "Define your first traffic route to start directing requests to your services."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRoutes.map((rt) => (
                  <tr key={rt.id} className="group hover:bg-blue-500/[0.02] transition-all duration-300">
                    <td className="px-8 py-5">
                      <Link href={`/api-gateway/${rt.gateway_id}/routes/${rt.id}`} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300">
                          <RouteIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-mono font-bold text-gray-100 group-hover:text-blue-400 transition-colors tracking-tight">
                            {rt.path}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">Virtual Endpoint</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex justify-center">
                        <Badge variant="outline" className={cn(
                          "font-black text-[10px] px-2 py-0.5 rounded-lg border",
                          rt.method === 'GET' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          rt.method === 'POST' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        )}>
                          {rt.method}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {rt.is_aggregate ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/20">
                          <GitMerge className="w-3.5 h-3.5" /> Aggregate
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-800/40 px-2 py-1 rounded-lg border border-gray-800/60">
                          <LinkIcon className="w-3.5 h-3.5" /> Standard
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-gray-300 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                        {rt.serviceName}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <Link href={`/api-gateway/${rt.gateway_id}/routes`} className="text-gray-400 hover:text-blue-400 transition-colors text-xs flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        {rt.gatewayName}
                      </Link>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === rt.id} className="p-2 text-gray-500 hover:text-gray-100 hover:bg-gray-800 rounded-xl transition-all disabled:opacity-50">
                            {isDeleting === rt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-5 h-5" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-1 bg-gray-900 border-gray-800 text-gray-100 rounded-xl shadow-2xl backdrop-blur-xl">
                          <DropdownMenuItem onClick={() => router.push(`/api-gateway/${rt.gateway_id}/routes/${rt.id}/edit`)} className="flex items-center gap-2 p-2.5 cursor-pointer rounded-lg hover:bg-blue-500/10 hover:text-blue-400 transition-all">
                            <Edit className="w-4 h-4" />
                            <span className="font-medium text-sm">Modify Route</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-800" />
                          <DropdownMenuItem 
                            onClick={() => rt.id && handleDelete(rt.id)}
                            className="flex items-center gap-2 p-2.5 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash className="w-4 h-4" />
                            <span className="font-medium text-sm">Delete Route</span>
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
