"use client";

import React from 'react';
import Link from 'next/link';
import { Server, Globe, MoreVertical, Edit, Trash, Loader2, Plus, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient, Service, Gateway } from '@/lib/api-client';

interface EnhancedService extends Service { gatewayName: string; targetsCount: number; }

export default function GlobalServicesPage() {
  const router = useRouter();
  const [services, setServices] = React.useState<EnhancedService[]>([]);
  const [gateways, setGateways] = React.useState<Gateway[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchData = async () => {
    try {
      const [fetchedServices, fetchedGateways, targets] = await Promise.all([
        apiClient.services.getAll(), apiClient.gateways.getAll(), apiClient.serviceTargets.getAll()
      ]);
      setGateways(fetchedGateways);
      setServices(fetchedServices.map(svc => ({
        ...svc, gatewayName: fetchedGateways.find(g => g.id === svc.gateway_id)?.name || 'Unknown',
        targetsCount: targets.filter(t => t.service_id === svc.id).length
      })));
    } catch (error) { console.error('Failed to fetch services', error); }
    finally { setIsLoading(false); }
  };

  React.useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setIsDeleting(id);
    try { await apiClient.services.delete(id); await fetchData(); }
    catch (error) { console.error("Failed to delete service", error); }
    finally { setIsDeleting(null); }
  };

  const filtered = services.filter(svc => svc.name.toLowerCase().includes(searchQuery.toLowerCase()) || svc.gatewayName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50 tracking-tight">All Services</h2>
          <p className="text-sm text-gray-400 mt-0.5">Monitor services, protocols, and load balancing across gateways.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-900/20 active:scale-95">
              <Plus className="w-4 h-4 mr-1.5" />Create Service
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5 bg-gray-900 border-gray-800 text-gray-100 rounded-xl shadow-2xl">
            <DropdownMenuLabel className="px-2.5 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Select Gateway</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800/50" />
            {gateways.length === 0 ? <div className="px-3 py-3 text-center text-xs text-gray-500">No gateways available</div> :
              gateways.map(gw => (
                <DropdownMenuItem key={gw.id} onClick={() => router.push(`/api-gateway/${gw.id}/services/new`)} className="flex items-center gap-2.5 p-2 cursor-pointer rounded-lg hover:bg-blue-500/10 hover:text-blue-400 text-sm">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />{gw.name}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input placeholder="Search services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9 bg-gray-900/50 border-gray-800 focus:ring-blue-500/30 rounded-lg text-sm" />
        </div>
        <Button variant="outline" size="sm" className="h-9 px-3 border-gray-800 hover:bg-gray-800 text-gray-400 rounded-lg"><Filter className="w-3.5 h-3.5 mr-1.5" />Filter</Button>
        <div className="px-3 py-1.5 bg-gray-900/50 border border-gray-800 rounded-lg hidden sm:block">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total: </span>
          <span className="text-xs font-bold text-blue-400">{services.length}</span>
        </div>
      </div>

      <div className="bg-gray-900/20 border border-gray-800/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/40 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Gateway</th>
                <th className="px-5 py-3 text-center">Protocol</th>
                <th className="px-5 py-3">LB Policy</th>
                <th className="px-5 py-3 text-center">Targets</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {isLoading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse"><td colSpan={6} className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gray-800" /><div className="h-4 w-36 bg-gray-800 rounded" /></div></td></tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center">
                  <Server className="w-10 h-10 text-gray-700 mb-3 mx-auto" />
                  <h3 className="text-base font-bold text-gray-200">No services found</h3>
                  <p className="text-gray-500 text-sm mt-1">{searchQuery ? `No matches for "${searchQuery}"` : "Add an upstream service to a gateway."}</p>
                </td></tr>
              ) : filtered.map((svc) => (
                <tr key={svc.id} className="group hover:bg-blue-500/[0.03] transition-colors duration-200">
                  <td className="px-5 py-3">
                    <Link href={`/api-gateway/${svc.gateway_id}/services/${svc.id}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                        <Server className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <span className="text-sm font-semibold text-gray-100 group-hover:text-blue-400 transition-colors">{svc.name}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/api-gateway/${svc.gateway_id}/services`} className="inline-flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors">
                      <Globe className="w-3 h-3" /><span className="text-xs">{svc.gatewayName}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Badge variant="outline" className={cn("font-bold text-[10px] px-2 py-0.5 rounded-md border", svc.protocol === 'grpc' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20")}>{svc.protocol.toUpperCase()}</Badge>
                  </td>
                  <td className="px-5 py-3"><span className="text-xs font-mono text-gray-400 bg-gray-800/40 px-1.5 py-0.5 rounded border border-gray-800/60">{svc.lb_policy}</span></td>
                  <td className="px-5 py-3 text-center"><span className="inline-flex items-center justify-center w-6 h-5 rounded bg-gray-800 text-blue-400 text-[10px] font-bold border border-gray-700">{svc.targetsCount}</span></td>
                  <td className="px-5 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><button disabled={isDeleting === svc.id} className="p-1.5 text-gray-500 hover:text-gray-100 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50">{isDeleting === svc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}</button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 p-1 bg-gray-900 border-gray-800 text-gray-100 rounded-xl shadow-2xl">
                        <DropdownMenuItem onClick={() => router.push(`/api-gateway/${svc.gateway_id}/services/${svc.id}/edit`)} className="flex items-center gap-2 p-2 cursor-pointer rounded-lg hover:bg-blue-500/10 hover:text-blue-400 text-sm"><Edit className="w-3.5 h-3.5" />Edit</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-800" />
                        <DropdownMenuItem onClick={() => svc.id && handleDelete(svc.id)} className="flex items-center gap-2 p-2 cursor-pointer text-red-400 hover:bg-red-500/10 rounded-lg text-sm"><Trash className="w-3.5 h-3.5" />Delete</DropdownMenuItem>
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
