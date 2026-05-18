"use client";

import React, { useState } from 'react';
import { Plug, Plus, Trash2, Power, Settings2, Info, CheckCircle2, ArrowRight, ArrowLeft, ChevronDown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import DynamicPluginConfig from '@/components/forms/DynamicPluginConfig';
import Link from 'next/link';

import { apiClient, GatewayPlugin, Gateway } from '@/lib/api-client';

export default function PluginsPage({ params }: { params: Promise<{ gatewayId: string }> }) {
  const { gatewayId } = React.use(params);
  const [gateway, setGateway] = useState<Gateway | null>(null);
  const [plugins, setPlugins] = useState<GatewayPlugin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newPluginName, setNewPluginName] = useState('jwt');
  const [newPluginPhase, setNewPluginPhase] = useState('auth');
  const [newPluginConfig, setNewPluginConfig] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [gatewayData, pluginsData] = await Promise.all([
        apiClient.gateways.getById(gatewayId),
        apiClient.gatewayPlugins.getAll()
      ]);
      setGateway(gatewayData);
      setPlugins(pluginsData.filter(p => p.gateway_id === gatewayId && !p.route_id && !p.service_id));
    } catch (error) {
      console.error("Failed to fetch plugins", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (gatewayId) { fetchData(); }
  }, [gatewayId]);
  
  const handleAddPlugin = async () => {
    setIsSubmitting(true);
    try {
      await apiClient.gatewayPlugins.create({
        name: newPluginName, phase: newPluginPhase, gateway_id: gatewayId,
        config: newPluginConfig, enabled: true,
      });
      setIsAdding(false); setNewPluginConfig({}); setNewPluginPhase('auth');
      await fetchData();
    } catch (error) { console.error("Failed to create plugin", error); }
    finally { setIsSubmitting(false); }
  };

  const handleToggleEnable = async (plugin: GatewayPlugin) => {
    try {
      await apiClient.gatewayPlugins.update(plugin.id!, { ...plugin, enabled: !plugin.enabled });
      await fetchData();
    } catch (error) { console.error("Failed to update plugin", error); }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this plugin?")) return;
    try { await apiClient.gatewayPlugins.delete(id); await fetchData(); }
    catch (error) { console.error("Failed to delete plugin", error); }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-8 animate-in fade-in duration-500">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50 tracking-tight">Global Plugins</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Middleware for all routes in <span className="text-blue-400 font-semibold">{gateway?.name || 'this Gateway'}</span>.
          </p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="h-9 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-blue-900/20 active:scale-95">
            <Plus className="w-4 h-4" />Provision Plugin
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-950/40 border border-gray-800/60 rounded-xl p-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between border-b border-gray-800/60 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Plug className="w-4.5 h-4.5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-100">New Plugin</h4>
                <p className="text-xs text-gray-500">Configure global traffic policy</p>
              </div>
            </div>
            <button onClick={() => setIsAdding(false)} className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-gray-100 transition-all hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">Plugin Type</label>
                <div className="relative">
                  <Settings2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select 
                    value={newPluginName} 
                    onChange={(e) => {
                      setNewPluginName(e.target.value); setNewPluginConfig({});
                      if (['jwt', 'apikey'].includes(e.target.value)) setNewPluginPhase('auth');
                      if (['ratelimit', 'cors', 'waf'].includes(e.target.value)) setNewPluginPhase('pre_request');
                      if (['cache'].includes(e.target.value)) setNewPluginPhase('response');
                    }} 
                    className="w-full h-10 pl-10 pr-4 bg-gray-900/60 border border-gray-800 focus:border-blue-500/50 rounded-lg text-sm text-gray-100 outline-none transition-all appearance-none"
                  >
                    <option value="jwt">JWT Authentication</option>
                    <option value="apikey">API Key Security</option>
                    <option value="ratelimit">Rate Limiting Policy</option>
                    <option value="cache">Response Caching</option>
                    <option value="cors">CORS Policy</option>
                    <option value="waf">Web App Firewall</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">Execution Phase</label>
                <div className="relative">
                  <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select 
                    value={newPluginPhase} 
                    onChange={(e) => setNewPluginPhase(e.target.value)} 
                    className="w-full h-10 pl-10 pr-4 bg-gray-900/60 border border-gray-800 focus:border-blue-500/50 rounded-lg text-sm text-gray-100 outline-none transition-all appearance-none"
                  >
                    <option value="auth">Auth Phase</option>
                    <option value="pre_request">Pre-Request Phase</option>
                    <option value="request">Request Phase</option>
                    <option value="response">Response Phase</option>
                    <option value="post_response">Post-Response Phase</option>
                    <option value="logging">Logging Phase</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900/60 rounded-xl p-5 border border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-blue-400" />
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Policy Parameters</h5>
              </div>
              <DynamicPluginConfig pluginName={newPluginName} config={newPluginConfig} onChange={setNewPluginConfig} />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setIsAdding(false)} className="h-9 px-5 border border-gray-800 hover:bg-gray-800 text-gray-300 rounded-lg font-semibold text-sm transition-all">
                Discard
              </button>
              <button disabled={isSubmitting} onClick={handleAddPlugin} className="h-9 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2">
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" />Apply Plugin</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-900/30 border border-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : plugins.length === 0 && !isAdding ? (
        <div className="bg-gray-900/30 border border-gray-800/60 rounded-xl py-16 text-center">
          <Plug className="w-10 h-10 text-gray-700 mb-3 mx-auto" />
          <h3 className="text-base font-bold text-gray-200">No Global Middleware</h3>
          <p className="text-gray-500 mt-1.5 text-sm max-w-xs mx-auto">
            Provision global plugins to enforce security and traffic policies across all routes.
          </p>
          <button onClick={() => setIsAdding(true)} className="mt-4 text-blue-400 font-semibold hover:text-blue-300 transition-colors flex items-center gap-1.5 text-sm mx-auto">
            Deploy your first plugin <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plugins.map(plugin => (
            <div 
              key={plugin.id} 
              className={cn(
                "group relative bg-gray-900/40 border rounded-xl p-5 flex flex-col transition-all duration-300 hover:bg-gray-900/60", 
                plugin.enabled ? "border-gray-800 hover:border-blue-500/30" : "border-gray-800/50 opacity-60"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all border", 
                    plugin.enabled ? "bg-gray-950 border-gray-800 group-hover:border-blue-500/30" : "bg-gray-950 border-gray-900"
                  )}>
                    <Plug className={cn("w-5 h-5", plugin.enabled ? "text-blue-400" : "text-gray-600")} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-100 capitalize group-hover:text-blue-400 transition-colors">{plugin.name}</h4>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Phase: {plugin.phase}</span>
                  </div>
                </div>
                
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => handleToggleEnable(plugin)}
                    className={cn("p-1.5 rounded-lg border transition-all", 
                      plugin.enabled ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500 hover:text-white" : "text-gray-500 bg-gray-800 border-gray-700 hover:bg-gray-700"
                    )}
                    title={plugin.enabled ? "Deactivate" : "Activate"}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleRemove(plugin.id!)}
                    className="p-1.5 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-gray-950/80 rounded-lg p-3 border border-gray-800/60 overflow-hidden">
                <pre className="text-[10px] text-gray-400 font-mono leading-relaxed max-h-[100px] overflow-y-auto custom-scrollbar">
                  {JSON.stringify(plugin.config, null, 2)}
                </pre>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                {plugin.enabled ? (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-emerald-400 uppercase">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                    <span className="text-[9px] font-bold text-gray-500 uppercase">Off</span>
                  </div>
                )}
                <span className="text-[10px] text-gray-600">{plugin.id?.substring(0, 8)}...</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
