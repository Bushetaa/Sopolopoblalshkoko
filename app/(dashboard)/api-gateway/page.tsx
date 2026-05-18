"use client";

import React from 'react';
import Link from 'next/link';
import { Plus, Globe, MoreVertical, Server, Zap, Edit, Trash, Loader2, Search, Filter, ArrowRight } from 'lucide-react';
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
    <div className="space-y-4 max-w-7xl mx-auto pb-6 animate-in fade-in duration-500">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50 tracking-tight">
            API Gateways
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your project's entry points and traffic flow.
          </p>
        </div>
        <Link 
          href="/api-gateway/new"
          className="group inline-flex h-9 items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-900/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy Gateway</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            placeholder="Search gateways..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-gray-900/50 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-lg text-sm"
          />
        </div>
        <Button variant="outline" size="sm" className="h-9 px-3 border-gray-800 hover:bg-gray-800/60 text-gray-400 rounded-lg">
          <Filter className="w-3.5 h-3.5 mr-1.5" />
          Filters
        </Button>
        <div className="px-3 py-1.5 bg-gray-900/50 border border-gray-800 rounded-lg hidden sm:block">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total: </span>
          <span className="text-xs font-bold text-blue-400">{gateways.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/30 border border-gray-800/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/60 border-b border-gray-800/80 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Gateway</th>
                <th className="px-5 py-3 text-center">Mode</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-800" />
                        <div className="space-y-1.5">
                          <div className="h-4 w-40 bg-gray-800 rounded" />
                          <div className="h-3 w-28 bg-gray-800 rounded" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredGateways.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
                      <div className="w-14 h-14 rounded-xl bg-gray-800/30 flex items-center justify-center mb-4 border border-gray-700/50">
                        <Globe className="w-7 h-7 text-gray-600" />
                      </div>
                      <h3 className="text-base font-bold text-gray-200">No Gateways Found</h3>
                      <p className="text-gray-500 mt-1.5 text-sm">
                        {searchQuery ? `No matches for "${searchQuery}".` : "Deploy your first API Gateway to get started."}
                      </p>
                      {!searchQuery && (
                        <Link href="/api-gateway/new" className="mt-4 text-blue-400 font-semibold hover:text-blue-300 transition-colors flex items-center gap-1.5 text-sm">
                          Create your first gateway <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredGateways.map((gw) => (
                  <tr key={gw.id} className="group hover:bg-blue-500/[0.03] transition-colors duration-200">
                    <td className="px-5 py-3">
                      <Link href={`/api-gateway/${gw.id}/services`} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all duration-300">
                          <Globe className="w-4.5 h-4.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-gray-100 group-hover:text-blue-400 transition-colors">
                            {gw.name}
                          </span>
                          <span className="text-xs text-gray-500 line-clamp-1 max-w-xs">
                            {gw.description || 'No description'}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex justify-center">
                        {gw.mode === 'pro' ? (
                          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wider uppercase">
                            <Server className="w-3 h-3 mr-1" /> PRO
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-800/80 text-gray-400 border-gray-700 px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wider uppercase">
                            <Zap className="w-3 h-3 mr-1" /> SINGLE
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex justify-center">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border",
                          gw.is_active 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-gray-800/50 text-gray-500 border-gray-800"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full", 
                            gw.is_active ? "bg-emerald-400 animate-pulse" : "bg-gray-600"
                          )} />
                          {gw.is_active ? "LIVE" : "OFF"}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-400">
                        {gw.created_at ? new Date(gw.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === gw.id} className="p-1.5 text-gray-500 hover:text-gray-100 hover:bg-gray-800/80 rounded-lg transition-colors disabled:opacity-50">
                            {isDeleting === gw.id ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> : <MoreVertical className="w-4 h-4" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1 bg-gray-900 border-gray-800 text-gray-100 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-xl">
                          <DropdownMenuItem onClick={() => router.push(`/api-gateway/${gw.id}/services`)} className="flex items-center gap-2 p-2 cursor-pointer rounded-lg hover:bg-blue-500/10 hover:text-blue-400 transition-colors text-sm">
                            <ArrowRight className="w-3.5 h-3.5" />
                            Open Gateway
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/api-gateway/${gw.id}/edit`)} className="flex items-center gap-2 p-2 cursor-pointer rounded-lg hover:bg-blue-500/10 hover:text-blue-400 transition-colors text-sm">
                            <Edit className="w-3.5 h-3.5" />
                            Edit Config
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-800/50 my-0.5" />
                          <DropdownMenuItem 
                            onClick={() => gw.id && handleDelete(gw.id)}
                            className="flex items-center gap-2 p-2 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                          >
                            <Trash className="w-3.5 h-3.5" />
                            Delete Gateway
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
