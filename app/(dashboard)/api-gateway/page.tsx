"use client";

import React from 'react';
import Link from 'next/link';
import { Plus, Globe, MoreVertical, Server, Zap, Edit, Trash, Loader2, Search, Filter, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { apiClient, Gateway } from '@/lib/api-client';

export default function ApiGatewayPage() {
  const router = useRouter();
  const [gateways, setGateways] = React.useState<Gateway[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

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

  const filteredGateways = gateways.filter(gw => 
    gw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gw.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header Section - Aligned with Service Targets card size */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/60 to-blue-900/10 border border-gray-800/60 rounded-3xl p-8 backdrop-blur-md">
        <div className="absolute top-[-20%] right-[-10%] opacity-10 blur-3xl">
          <Globe className="w-96 h-96 text-blue-500" />
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.2em]">
              <div className="w-6 h-[2px] bg-blue-500" />
              Network Infrastructure
            </div>
            <h2 className="text-4xl font-extrabold font-display text-gray-50 tracking-tight leading-tight">
              API Gateways
            </h2>
            <p className="text-gray-400 max-w-2xl text-sm leading-relaxed font-medium">
              Architect and manage your project's entry points. Control traffic flow, enforce security policies, and orchestrate microservices with enterprise-grade precision.
            </p>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 bg-gray-950/50 border border-gray-800 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-bold text-gray-300">Secure Protocol Enforced</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-950/50 border border-gray-800 px-3 py-1.5 rounded-xl">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-bold text-gray-300">Live Traffic Monitoring</span>
              </div>
            </div>
          </div>
          
          <Link 
            href="/api-gateway/new"
            className="group relative inline-flex h-12 items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-bold transition-all duration-300 shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.4)] active:scale-95 overflow-hidden border border-blue-400/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-500" />
            <span>Deploy Gateway</span>
          </Link>
        </div>
      </div>

      {/* Control Center Toolbar */}
      <div className="flex flex-col lg:flex-row items-center gap-6 bg-gray-950/40 p-5 rounded-[2rem] border border-gray-800/40 backdrop-blur-sm">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          <Input 
            placeholder="Search gateways by name or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Button variant="outline" className="h-14 px-6 border-gray-800 hover:bg-gray-800/60 text-gray-300 rounded-2xl flex-1 lg:flex-none font-bold">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>
          <div className="h-10 w-[1px] bg-gray-800 hidden lg:block" />
          <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-2xl hidden lg:block">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total: </span>
            <span className="text-sm font-black text-blue-400 ml-1">{gateways.length}</span>
          </div>
        </div>
      </div>

      {/* Gateways Grid/Table Container */}
      <div className="bg-gray-900/30 border border-gray-800/60 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/60 border-b border-gray-800/80 text-[11px] font-black text-gray-500 uppercase tracking-[0.25em]">
                <th className="px-10 py-7">Gateway Identity</th>
                <th className="px-10 py-7 text-center">Execution Mode</th>
                <th className="px-10 py-7 text-center">Deployment Status</th>
                <th className="px-10 py-7">Provisioned At</th>
                <th className="px-10 py-7 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-gray-800" />
                        <div className="space-y-3">
                          <div className="h-5 w-64 bg-gray-800 rounded-lg" />
                          <div className="h-3 w-40 bg-gray-800 rounded-lg" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredGateways.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-24 h-24 rounded-[2rem] bg-gray-800/30 flex items-center justify-center mb-8 border border-gray-700/50">
                        <Globe className="w-12 h-12 text-gray-600" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-200 tracking-tight">No Gateways Provisioned</h3>
                      <p className="text-gray-500 mt-3 text-lg leading-relaxed">
                        {searchQuery ? `No matches found for "${searchQuery}". Try a different search term.` : "Start by deploying your first API Gateway to manage and secure your microservices traffic."}
                      </p>
                      {!searchQuery && (
                        <Link href="/api-gateway/new" className="mt-8 text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center gap-2">
                          Create your first gateway <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredGateways.map((gw) => (
                  <tr key={gw.id} className="group hover:bg-blue-500/[0.03] transition-all duration-500">
                    <td className="px-10 py-7">
                      <Link href={`/api-gateway/${gw.id}/services`} className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-all duration-500">
                          <Globe className="w-7 h-7 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-xl text-gray-100 group-hover:text-blue-400 transition-colors tracking-tight">
                            {gw.name}
                          </span>
                          <span className="text-sm text-gray-500 font-medium line-clamp-1 max-w-xs group-hover:text-gray-400 transition-colors">
                            {gw.description || 'Enterprise Gateway Infrastructure'}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-10 py-7 text-center">
                      <div className="flex justify-center">
                        {gw.mode === 'pro' ? (
                          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1 rounded-xl font-black text-[10px] tracking-[0.15em] uppercase shadow-sm shadow-purple-500/5">
                            <Server className="w-3.5 h-3.5 mr-2" /> PRO CLUSTER
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-800/80 text-gray-300 border-gray-700 px-3 py-1 rounded-xl font-black text-[10px] tracking-[0.15em] uppercase shadow-sm shadow-black/20">
                            <Zap className="w-3.5 h-3.5 mr-2" /> SINGLE NODE
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-7 text-center">
                      <div className="flex justify-center">
                        <div className={cn(
                          "inline-flex items-center gap-2.5 text-xs font-black px-4 py-1.5 rounded-2xl border transition-all duration-500",
                          gw.is_active 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
                            : "bg-gray-800/50 text-gray-500 border-gray-800 shadow-none"
                        )}>
                          <span className={cn(
                            "w-2 h-2 rounded-full", 
                            gw.is_active ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-gray-600"
                          )} />
                          {gw.is_active ? "LIVE" : "DORMANT"}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-gray-300 tracking-tight">
                          {gw.created_at ? new Date(gw.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Provisioned recently'}
                        </span>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Global Region</span>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === gw.id} className="p-3 text-gray-500 hover:text-gray-100 hover:bg-gray-800/80 rounded-2xl transition-all duration-300 disabled:opacity-50">
                            {isDeleting === gw.id ? <Loader2 className="w-5 h-5 animate-spin text-blue-400" /> : <MoreVertical className="w-6 h-6" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2 bg-gray-900 border-gray-800 text-gray-100 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-xl">
                          <DropdownMenuItem onClick={() => router.push(`/api-gateway/${gw.id}/services`)} className="flex items-center gap-3 p-3 cursor-pointer rounded-xl hover:bg-blue-500/10 hover:text-blue-400 transition-colors group/item">
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/item:translate-x-1" />
                            <span className="font-bold text-sm">Open Infrastructure</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/api-gateway/${gw.id}/edit`)} className="flex items-center gap-3 p-3 cursor-pointer rounded-xl hover:bg-blue-500/10 hover:text-blue-400 transition-colors">
                            <Edit className="w-4 h-4" />
                            <span className="font-bold text-sm">Modify Configuration</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-800/50 my-1" />
                          <DropdownMenuItem 
                            onClick={() => gw.id && handleDelete(gw.id)}
                            className="flex items-center gap-3 p-3 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                          >
                            <Trash className="w-4 h-4" />
                            <span className="font-bold text-sm">Terminate Gateway</span>
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
