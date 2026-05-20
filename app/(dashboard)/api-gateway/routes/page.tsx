"use client";

import React from 'react';
import Link from 'next/link';
import { Route as RouteIcon, GitMerge, Link as LinkIcon, MoreVertical, Edit, Trash, Loader2, Plus, Globe } from 'lucide-react';
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

import { apiClient, GatewayRoute, Gateway } from '@/lib/api-client';
import CreateRouteModal from '@/components/api-gateway/modals/CreateRouteModal';
import CodeSnippetsModal from '@/components/api-gateway/modals/CodeSnippetsModal';
import { Code2 } from 'lucide-react';

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
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedGatewayId, setSelectedGatewayId] = React.useState<string>('');
  const [userSlug, setUserSlug] = React.useState<string>('');
  const [snippetsModalOpen, setSnippetsModalOpen] = React.useState(false);
  const [selectedSnippetRoute, setSelectedSnippetRoute] = React.useState<{ method: string, url: string } | null>(null);

  const fetchData = async () => {
      try {
        const [fetchedRoutes, fetchedGateways, services, profiles] = await Promise.all([
          apiClient.gatewayRoutes.getAll(),
          apiClient.gateways.getAll(),
          apiClient.services.getAll(),
          apiClient.userProfiles.getAll().catch(() => [])
        ]);

        if (profiles && profiles.length > 0) {
          setUserSlug(profiles[0].slug);
        }

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

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            <div className="w-8 h-[2px] bg-blue-500" />
            Route Infrastructure
          </div>
          <h2 className="text-3xl font-black font-display text-white tracking-tight">All Routes</h2>
          <p className="text-[13px] text-[#64748B] mt-1.5 font-medium">A global view of routes across all your gateways.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95 group">
              <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">
                <Plus className="w-3 h-3 text-white stroke-[3px]" />
              </div>
              Create Route
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#0B101B] border-white/5 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-[#64748B] px-4 py-2">Select a Gateway</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            {gateways.length === 0 ? (
              <DropdownMenuItem disabled className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider px-4 py-3">No gateways available</DropdownMenuItem>
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] -z-10" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#050810]/80 border-b border-white/5 text-[#64748B] uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-7 py-5">Route Path</th>
                <th className="px-7 py-5">Method</th>
                <th className="px-7 py-5">Topology Type</th>
                <th className="px-7 py-5">Upstream Service</th>
                <th className="px-7 py-5">Parent Gateway</th>
                <th className="px-7 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-7 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mb-4 animate-pulse">
                        <RouteIcon className="w-8 h-8 text-emerald-500/40" />
                      </div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">Synchronizing Routing Table...</p>
                    </div>
                  </td>
                </tr>
              ) : routes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-7 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4">
                        <RouteIcon className="w-8 h-8 text-[#1E293B]" />
                      </div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">No Active Routes</p>
                      <p className="text-[10px] text-[#64748B] mt-2 font-medium uppercase tracking-wider">Start by creating a new path mapping above.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                routes.map((rt) => (
                  <tr key={rt.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-7 py-5">
                      <Link href={`/api-gateway/${rt.gateway_id}/routes/${rt.id}`} className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-white/5 flex items-center justify-center group-hover:border-emerald-500/40 transition-all shadow-inner">
                          <RouteIcon className="w-4.5 h-4.5 text-emerald-400 stroke-[2.5px]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-white font-black text-sm group-hover:text-emerald-400 transition-colors tracking-tight">
                            {rt.path}
                          </span>
                          <span className="text-[9px] text-[#475569] font-black uppercase tracking-widest mt-0.5">Active Gateway Path</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-7 py-5">
                      <span className={cn(
                        "inline-flex font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm",
                        rt.method === 'GET' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        rt.method === 'POST' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      )}>
                        {rt.method}
                      </span>
                    </td>
                    <td className="px-7 py-5">
                      {rt.is_aggregate ? (
                        <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                          <GitMerge className="w-3 h-3" /> Aggregate
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#94A3B8] bg-white/[0.03] px-3 py-1 rounded-lg border border-white/5">
                          <LinkIcon className="w-3 h-3" /> Standard
                        </span>
                      )}
                    </td>
                    <td className="px-7 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#475569]" />
                        <span className="text-[11px] font-bold text-[#94A3B8]">{rt.serviceName}</span>
                      </div>
                    </td>
                    <td className="px-7 py-5">
                      <Link href={`/api-gateway/${rt.gateway_id}/routes`} className="flex items-center gap-2 group/gw">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover/gw:bg-blue-500 transition-colors" />
                        <span className="text-[11px] font-bold text-[#64748B] group-hover/gw:text-white transition-colors">
                          {rt.gatewayName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-7 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === rt.id} className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95 border border-transparent hover:border-white/5">
                            {isDeleting === rt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-[#0B101B] border-white/5 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                          <DropdownMenuItem onClick={() => {
                            const baseUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:5000';
                            const path = rt.path.startsWith('/') ? rt.path : `/${rt.path}`;
                            const slugStr = userSlug ? `/${userSlug}` : '';
                            const fullUrl = `${baseUrl}${slugStr}${path}`;
                            setSelectedSnippetRoute({ method: rt.method, url: fullUrl });
                            setSnippetsModalOpen(true);
                          }} className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 hover:bg-blue-500/5 focus:bg-blue-500/5 focus:text-blue-300 transition-all py-3 px-4">
                            <Code2 className="w-3.5 h-3.5 mr-3" />
                            Integration Code
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/api-gateway/${rt.gateway_id}/routes/${rt.id}/edit`)} className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-all py-3 px-4">
                            <Edit className="w-3.5 h-3.5 mr-3 text-blue-500" />
                            Modify Configuration
                          </DropdownMenuItem>
                          <div className="h-[1px] bg-white/5 my-1" />
                          <DropdownMenuItem 
                            onClick={() => rt.id && handleDelete(rt.id)}
                            className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300 transition-all py-3 px-4"
                          >
                            <Trash className="w-3.5 h-3.5 mr-3" />
                            Terminate Mapping
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
        <CreateRouteModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchData}
          gatewayId={selectedGatewayId}
        />
      )}

      {selectedSnippetRoute && (
        <CodeSnippetsModal
          isOpen={snippetsModalOpen}
          onClose={() => setSnippetsModalOpen(false)}
          method={selectedSnippetRoute.method}
          url={selectedSnippetRoute.url}
        />
      )}
    </div>
  );
}
