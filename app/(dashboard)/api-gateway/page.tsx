"use client";

import React from 'react';
import Link from 'next/link';
import { Plus, Globe, MoreVertical, Server, Zap, Edit, Trash, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { apiClient, Gateway } from '@/lib/api-client';
import WizardModal from '@/components/api-gateway/WizardModal';
import CreateGatewayModal from '@/components/api-gateway/modals/CreateGatewayModal';

export default function ApiGatewayPage() {
  const router = useRouter();
  const [gateways, setGateways] = React.useState<Gateway[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [isManualCreateOpen, setIsManualCreateOpen] = React.useState(false);

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
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            <div className="w-8 h-[2px] bg-blue-500" />
            Infrastructure Overview
          </div>
          <h2 className="text-3xl font-black font-display text-white tracking-tight">API Gateways</h2>
          <p className="text-[13px] text-[#64748B] mt-1.5 font-medium">Manage your entry points, routing, and traffic policies with precision.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsManualCreateOpen(true)}
            className="flex items-center gap-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 shadow-xl active:scale-95 group"
          >
            <div className="w-4 h-4 rounded bg-white/5 flex items-center justify-center">
              <Plus className="w-3 h-3 text-[#64748B] group-hover:text-white stroke-[3px] transition-colors" />
            </div>
            Manual Create
          </button>
          <button 
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95 group"
          >
            <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">
              <Zap className="w-3 h-3 text-yellow-300 stroke-[3px] fill-yellow-300/20" />
            </div>
            Wizard Setup
          </button>
        </div>
      </div>

      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#050810]/80 border-b border-white/5 text-[#64748B] uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-7 py-5">Gateway Topology</th>
                <th className="px-7 py-5">Deployment Mode</th>
                <th className="px-7 py-5">System Status</th>
                <th className="px-7 py-5">Deployment Date</th>
                <th className="px-7 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-7 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center mb-4 animate-pulse">
                        <Globe className="w-8 h-8 text-blue-500/40" />
                      </div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">Synchronizing Infrastructure...</p>
                    </div>
                  </td>
                </tr>
              ) : gateways.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-7 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4">
                        <Globe className="w-8 h-8 text-[#1E293B]" />
                      </div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">No Active Gateways</p>
                      <p className="text-[10px] text-[#64748B] mt-2 font-medium uppercase tracking-wider">Start by creating a new entry point above.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                gateways.map((gw) => (
                  <tr key={gw.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-7 py-5">
                      <Link href={`/api-gateway/${gw.id}/services`} className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.1)] group-hover:border-blue-500/40 transition-all">
                          <Globe className="w-4.5 h-4.5 text-blue-400 stroke-[2.5px]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                            {gw.name}
                          </span>
                          <span className="text-[9px] text-[#475569] font-black uppercase tracking-widest mt-0.5">Primary Cluster</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-7 py-5">
                      <div className="flex items-center">
                        {gw.mode === 'pro' ? (
                          <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                            <Server className="w-3 h-3" /> Professional
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg">
                            <Zap className="w-3 h-3" /> Standard
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-7 py-5">
                      <span className={cn(
                        "inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border transition-all",
                        gw.is_active 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", gw.is_active ? "bg-emerald-400 animate-pulse" : "bg-red-500")} />
                        {gw.is_active ? "Operational" : "Offline"}
                      </span>
                    </td>
                    <td className="px-7 py-5">
                      <div className="flex flex-col">
                        <span className="text-white font-mono text-[11px] tracking-tight tabular-nums">
                          {gw.created_at ? new Date(gw.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending'}
                        </span>
                        <span className="text-[8px] text-[#475569] font-black uppercase tracking-[0.2em] mt-0.5">Creation Timestamp</span>
                      </div>
                    </td>
                    <td className="px-7 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button disabled={isDeleting === gw.id} className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95 border border-transparent hover:border-white/5">
                            {isDeleting === gw.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-[#0B101B] border-white/5 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                          <DropdownMenuItem onClick={() => router.push(`/api-gateway/${gw.id}/edit`)} className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-all py-3 px-4">
                            <Edit className="w-3.5 h-3.5 mr-3 text-blue-500" />
                            Modify Parameters
                          </DropdownMenuItem>
                          <div className="h-[1px] bg-white/5 my-1" />
                          <DropdownMenuItem 
                            onClick={() => gw.id && handleDelete(gw.id)}
                            className="cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300 transition-all py-3 px-4"
                          >
                            <Trash className="w-3.5 h-3.5 mr-3" />
                            Terminate Gateway
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

      <WizardModal 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        onSuccess={fetchGateways} 
      />

      <CreateGatewayModal 
        isOpen={isManualCreateOpen}
        onClose={() => setIsManualCreateOpen(false)}
        onSuccess={fetchGateways}
      />
    </div>
  );
}
