"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { Route as RouteIcon, Plus, MoreVertical, GitMerge, Link as LinkIcon, Edit, Trash, Loader2, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { apiClient, GatewayRoute } from '@/lib/api-client';
import CreateRouteModal from '@/components/api-gateway/modals/CreateRouteModal';
import CodeSnippetsModal from '@/components/api-gateway/modals/CodeSnippetsModal';
import { Code2 } from 'lucide-react';

interface EnhancedRoute extends GatewayRoute {
  serviceName: string;
}

export default function RoutesPage({ params }: { params: Promise<{ gatewayId: string }> }) {
  const router = useRouter();
  const { gatewayId } = use(params);
  const [routes, setRoutes] = React.useState<EnhancedRoute[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [userSlug, setUserSlug] = React.useState<string>('');
  const [snippetsModalOpen, setSnippetsModalOpen] = React.useState(false);
  const [selectedSnippetRoute, setSelectedSnippetRoute] = React.useState<{ method: string, url: string } | null>(null);

  const fetchData = async () => {
    try {
      const [fetchedRoutes, services, profiles] = await Promise.all([
        apiClient.gatewayRoutes.getAll(),
        apiClient.services.getAll(),
        apiClient.userProfiles.getAll().catch(() => [])
      ]);

      if (profiles && profiles.length > 0) {
        setUserSlug(profiles[0].slug);
      }

      const gwRoutes = fetchedRoutes.filter(r => r.gateway_id === gatewayId);
      const formatted = gwRoutes.map(route => {
        const svc = services.find(s => s.id === route.service_id);
        return {
          ...route,
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
    if (gatewayId) {
      fetchData();
    }
  }, [gatewayId]);

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            <div className="w-8 h-[2px] bg-emerald-500" />
            Routing Infrastructure
          </div>
          <h2 className="text-3xl font-black font-display text-white tracking-tight flex items-center gap-3">
            Gateway Routes
          </h2>
          <p className="text-[13px] text-[#64748B] mt-1.5 font-medium leading-relaxed">
            Define access paths and map them to your upstream service cluster with granular control.
          </p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95 group w-full md:w-auto"
        >
          <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">
            <Plus className="w-3 h-3 text-white stroke-[3px]" />
          </div>
          Create New Route
        </button>
      </div>

      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] -z-10" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#050810]/80 border-b border-white/5 text-[#64748B] uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-7 py-5">Endpoint Definition</th>
                <th className="px-7 py-5">Method</th>
                <th className="px-7 py-5">Strategy</th>
                <th className="px-7 py-5">Target Upstream</th>
                <th className="px-7 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-7 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mb-4 animate-pulse">
                        <RouteIcon className="w-8 h-8 text-emerald-500/40" />
                      </div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">Compiling Route Topology...</p>
                    </div>
                  </td>
                </tr>
              ) : routes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-7 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4">
                        <RouteIcon className="w-8 h-8 text-[#1E293B]" />
                      </div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">No Routes Configured</p>
                      <p className="text-[10px] text-[#64748B] mt-2 font-medium uppercase tracking-wider">Start by defining your first API endpoint path.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                routes.map((rt) => (
                  <tr key={rt.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-7 py-5">
                      <Link href={`/api-gateway/${gatewayId}/routes/${rt.id}`} className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:border-emerald-500/40 transition-all">
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
                        "inline-flex font-black text-[9px] uppercase tracking-widest px-2.5 py-1.5 rounded-lg border transition-all shadow-sm",
                        rt.method === 'GET' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        rt.method === 'POST' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      )}>
                        {rt.method}
                      </span>
                    </td>
                    <td className="px-7 py-5">
                      {rt.is_aggregate ? (
                        <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/5 px-3 py-1.5 rounded-lg border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                          <GitMerge className="w-3 h-3" /> Aggregation
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#64748B] bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
                          <LinkIcon className="w-3 h-3" /> Standard
                        </span>
                      )}
                    </td>
                    <td className="px-7 py-5">
                      <div className="flex items-center gap-3 group/svc">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover/svc:border-blue-500/30 transition-all">
                          <Server className="w-4 h-4 text-[#475569] group-hover/svc:text-blue-400 transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-gray-200 uppercase tracking-tighter group-hover/svc:text-white transition-colors">{rt.serviceName}</span>
                          <span className="text-[9px] font-bold text-[#475569] uppercase tracking-widest">Internal Service</span>
                        </div>
                      </div>
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
                          <DropdownMenuItem onClick={() => router.push(`/api-gateway/${gatewayId}/routes/${rt.id}/edit`)} className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-all py-3 px-4">
                            <Edit className="w-3.5 h-3.5 mr-3 text-blue-500" />
                            Modify Parameters
                          </DropdownMenuItem>
                          <div className="h-[1px] bg-white/5 my-1" />
                          <DropdownMenuItem 
                            onClick={() => rt.id && handleDelete(rt.id)}
                            className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300 transition-all py-3 px-4"
                          >
                            <Trash className="w-3.5 h-3.5 mr-3" />
                            Terminate Route
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
      
      <CreateRouteModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchData}
        gatewayId={gatewayId}
      />

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
