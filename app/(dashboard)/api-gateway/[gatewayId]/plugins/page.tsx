"use client";

import React, { useState } from 'react';
import { Plug, Plus, Trash2, Power } from 'lucide-react';
import { cn } from '@/lib/utils';
import CreatePluginModal from '@/components/api-gateway/modals/CreatePluginModal';

import { apiClient, GatewayPlugin } from '@/lib/api-client';

export default function PluginsPage({ params }: { params: Promise<{ gatewayId: string }> }) {
  const { gatewayId } = React.use(params);
  const [plugins, setPlugins] = useState<GatewayPlugin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const fetchPlugins = async () => {
    try {
      const data = await apiClient.gatewayPlugins.getAll();
      setPlugins(data.filter(p => p.gateway_id === gatewayId && !p.route_id && !p.service_id));
    } catch (error) {
      console.error("Failed to fetch plugins", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (gatewayId) {
      fetchPlugins();
    }
  }, [gatewayId]);
  
  const handleToggleEnable = async (plugin: GatewayPlugin) => {
    try {
      await apiClient.gatewayPlugins.update(plugin.id!, {
        ...plugin,
        enabled: !plugin.enabled
      });
      await fetchPlugins();
    } catch (error) {
      console.error("Failed to update plugin", error);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this plugin?")) return;
    try {
      await apiClient.gatewayPlugins.delete(id);
      await fetchPlugins();
    } catch (error) {
      console.error("Failed to delete plugin", error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black font-display text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
              <Plug className="w-5 h-5 text-blue-400 stroke-[2.5px]" />
            </div>
            Global Plugins
          </h3>
          <p className="text-[#94A3B8] font-medium text-xs mt-1.5 ml-1">
            Configure middleware and policies that apply across the entire gateway.
          </p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95 group w-full sm:w-auto"
          >
            <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 text-white stroke-[3.5px]" />
            </div>
            <span>Activate Plugin</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-24 text-center bg-[#0B101B] border border-white/5 rounded-[2.5rem] shadow-2xl">
            <div className="w-20 h-20 rounded-[2rem] bg-blue-500/5 flex items-center justify-center mb-6 mx-auto relative">
              <div className="absolute inset-0 rounded-[2rem] border border-blue-500/20 animate-ping" />
              <Plug className="w-10 h-10 text-blue-500/40" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Indexing Global Middleware...</p>
          </div>
        ) : plugins.length === 0 && !isAdding ? (
          <div className="col-span-full py-24 text-center bg-[#0B101B] border border-white/5 rounded-[2.5rem] shadow-2xl">
            <div className="w-20 h-20 rounded-[2rem] bg-gray-900 flex items-center justify-center mb-6 mx-auto border border-white/5 shadow-inner">
              <Plug className="w-10 h-10 text-gray-800" />
            </div>
            <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No Active Plugins</p>
            <p className="text-xs text-[#475569] mt-3 max-w-[320px] mx-auto leading-relaxed font-medium">
              You haven't activated any global plugins yet. Enhance your gateway with security and traffic management.
            </p>
          </div>
        ) : (
          plugins.map(plugin => (
            <div key={plugin.id} className={cn(
              "bg-[#0B101B] border rounded-[2rem] p-6 flex flex-col transition-all relative group overflow-hidden shadow-xl", 
              plugin.enabled 
                ? "border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:shadow-blue-500/5 hover:border-blue-500/20" 
                : "border-white/5 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            )}>
              {/* Background Glow */}
              {plugin.enabled && <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />}
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg", 
                    plugin.enabled 
                      ? "bg-[#2563EB] text-white shadow-blue-500/20" 
                      : "bg-gray-800 text-gray-500"
                  )}>
                    <Plug className="w-6 h-6 stroke-[2.5px]" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base capitalize tracking-tight">{plugin.name}</h4>
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded mt-1 inline-block">
                      {(plugin.name.includes('auth') || plugin.name.includes('jwt')) ? 'Identity & Security' : 'Traffic Management'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggleEnable(plugin)}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 border", 
                    plugin.enabled 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                      : "bg-gray-800 text-gray-500 border-transparent"
                  )}
                  title={plugin.enabled ? "Deactivate Plugin" : "Activate Plugin"}
                >
                  <Power className="w-5 h-5 stroke-[2.5px]" />
                </button>
              </div>

              <div className="flex-1 bg-[#050810] rounded-2xl p-4 border border-white/5 overflow-hidden group/code relative mb-6 shadow-inner">
                <div className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                  <span className="text-[8px] font-black text-[#475569] uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Configuration Map</span>
                </div>
                <pre className="text-[10px] text-[#94A3B8] font-mono leading-relaxed">
                  {JSON.stringify(plugin.config, null, 2)}
                </pre>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", plugin.enabled ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-gray-600")} />
                  <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">{plugin.enabled ? "Operational" : "Standby"}</span>
                </div>
                <button 
                  onClick={() => plugin.id && handleRemove(plugin.id)} 
                  className="flex items-center gap-2 text-[10px] font-black text-red-400/70 hover:text-red-400 uppercase tracking-widest px-3 py-1.5 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CreatePluginModal 
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onSuccess={fetchPlugins}
        gatewayId={gatewayId}
      />
    </div>
  );
}
