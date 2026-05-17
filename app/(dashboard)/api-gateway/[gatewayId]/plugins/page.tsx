"use client";

import React, { useState } from 'react';
import { Plug, Plus, Trash2, Power, Settings2, Info, CheckCircle2, AlertCircle, Shield, Zap, Activity, ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
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
    if (gatewayId) {
      fetchData();
    }
  }, [gatewayId]);
  
  const handleAddPlugin = async () => {
    setIsSubmitting(true);
    try {
      await apiClient.gatewayPlugins.create({
        name: newPluginName,
        phase: newPluginPhase,
        gateway_id: gatewayId,
        config: newPluginConfig,
        enabled: true,
      });
      setIsAdding(false);
      setNewPluginConfig({});
      setNewPluginPhase('auth');
      await fetchData();
    } catch (error) {
      console.error("Failed to create plugin", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleEnable = async (plugin: GatewayPlugin) => {
    try {
      await apiClient.gatewayPlugins.update(plugin.id!, {
        ...plugin,
        enabled: !plugin.enabled
      });
      await fetchData();
    } catch (error) {
      console.error("Failed to update plugin", error);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this plugin?")) return;
    try {
      await apiClient.gatewayPlugins.delete(id);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete plugin", error);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/60 to-blue-900/10 border border-gray-800/60 rounded-3xl p-8 backdrop-blur-md">
        <div className="absolute top-[-20%] right-[-10%] opacity-10 blur-3xl">
          <Plug className="w-96 h-96 text-blue-500" />
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.2em]">
              <div className="w-6 h-[2px] bg-blue-500" />
              Traffic Middleware
            </div>
            <h2 className="text-4xl font-extrabold font-display text-gray-50 tracking-tight leading-tight">
              Global Plugins
            </h2>
            <p className="text-gray-400 max-w-2xl text-sm leading-relaxed font-medium">
              Configure plugins that apply to all routes in <span className="text-blue-400 font-bold">{gateway?.name || 'this Gateway'}</span>. Implement security, caching, and rate limiting policies gateway-wide.
            </p>
          </div>
          
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="group relative inline-flex h-12 items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-bold transition-all duration-300 shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.4)] active:scale-95 overflow-hidden border border-blue-400/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-500" />
              <span>Provision Plugin</span>
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="bg-gray-950/40 border border-gray-800/60 rounded-[2.5rem] p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
          
          <div className="flex items-center justify-between border-b border-gray-800/60 pb-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Plug className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-100 tracking-tight">Middleware Configuration</h4>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Define new global traffic policy</p>
              </div>
            </div>
            <button 
              onClick={() => setIsAdding(false)}
              className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-gray-100 transition-all hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-300 ml-1">Plugin Blueprint</label>
                <div className="relative">
                  <Settings2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <select 
                    value={newPluginName} 
                    onChange={(e) => {
                      setNewPluginName(e.target.value);
                      setNewPluginConfig({});
                      if (['jwt', 'apikey'].includes(e.target.value)) setNewPluginPhase('auth');
                      if (['ratelimit', 'cors', 'waf'].includes(e.target.value)) setNewPluginPhase('pre_request');
                      if (['cache'].includes(e.target.value)) setNewPluginPhase('response');
                    }} 
                    className="w-full h-14 pl-12 pr-4 bg-gray-900/40 border border-gray-800 focus:border-blue-500/50 rounded-2xl text-lg text-gray-100 outline-none transition-all appearance-none"
                  >
                    <option value="jwt">JWT Authentication</option>
                    <option value="apikey">API Key Security</option>
                    <option value="ratelimit">Rate Limiting Policy</option>
                    <option value="cache">Response Caching</option>
                    <option value="cors">CORS Policy</option>
                    <option value="waf">Web App Firewall</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-300 ml-1">Execution Phase</label>
                <div className="relative">
                  <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <select 
                    value={newPluginPhase} 
                    onChange={(e) => setNewPluginPhase(e.target.value)} 
                    className="w-full h-14 pl-12 pr-4 bg-gray-900/40 border border-gray-800 focus:border-blue-500/50 rounded-2xl text-lg text-gray-100 outline-none transition-all appearance-none"
                  >
                    <option value="auth">Auth Phase</option>
                    <option value="pre_request">Pre-Request Phase</option>
                    <option value="request">Request Phase</option>
                    <option value="response">Response Phase</option>
                    <option value="post_response">Post-Response Phase</option>
                    <option value="logging">Logging Phase</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900/60 rounded-[2rem] p-8 border border-gray-800 shadow-inner">
              <div className="flex items-center gap-3 mb-6">
                <Info className="w-5 h-5 text-blue-400" />
                <h5 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Policy Parameters</h5>
              </div>
              <DynamicPluginConfig pluginName={newPluginName} config={newPluginConfig} onChange={setNewPluginConfig} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
              <button 
                onClick={() => setIsAdding(false)} 
                className="w-full sm:w-auto h-12 px-8 border border-gray-800 hover:bg-gray-800 text-gray-300 rounded-xl font-bold transition-all"
              >
                Discard
              </button>
              <button 
                disabled={isSubmitting} 
                onClick={handleAddPlugin} 
                className="w-full sm:w-auto h-12 px-10 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Synchronizing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Apply Plugin
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-900/30 border border-gray-800 rounded-[2rem] animate-pulse" />
          ))}
        </div>
      ) : plugins.length === 0 && !isAdding ? (
        <div className="bg-gray-900/30 border border-gray-800/60 rounded-[2.5rem] py-32 text-center backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
            <div className="w-24 h-24 rounded-[2rem] bg-gray-800/30 flex items-center justify-center mb-8 border border-gray-700/50">
              <Plug className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-200 tracking-tight">No Global Middleware</h3>
            <p className="text-gray-500 mt-3 text-lg leading-relaxed">
              Provision global plugins to enforce security and traffic policies across all microservices in this gateway.
            </p>
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-8 text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center gap-2"
            >
              Deploy your first plugin <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plugins.map(plugin => (
            <div 
              key={plugin.id} 
              className={cn(
                "group relative bg-gray-900/40 border rounded-[2rem] p-7 flex flex-col transition-all duration-500 hover:scale-[1.02] hover:bg-gray-900/60", 
                plugin.enabled ? "border-gray-800 hover:border-blue-500/30" : "border-gray-800/50 opacity-60"
              )}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -z-10 group-hover:bg-blue-600/10 transition-all" />
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500", 
                    plugin.enabled ? "bg-gray-950 border border-gray-800 group-hover:border-blue-500/30 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.1)]" : "bg-gray-950 border border-gray-900"
                  )}>
                    <Plug className={cn("w-7 h-7 transition-colors", plugin.enabled ? "text-blue-400" : "text-gray-600")} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-100 tracking-tight capitalize group-hover:text-blue-400 transition-colors">{plugin.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Phase: {plugin.phase}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleToggleEnable(plugin)}
                    className={cn(
                      "p-2 rounded-xl border transition-all duration-300", 
                      plugin.enabled ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500 hover:text-white" : "text-gray-500 bg-gray-800 border-gray-700 hover:bg-gray-700"
                    )}
                    title={plugin.enabled ? "Deactivate" : "Activate"}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleRemove(plugin.id!)}
                    className="p-2 rounded-xl border border-gray-800 bg-gray-900/50 text-gray-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
                    title="Terminate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-gray-950/80 rounded-2xl p-5 border border-gray-800/60 overflow-hidden relative">
                <div className="absolute top-2 right-4 flex items-center gap-1.5 opacity-30 group-hover:opacity-100 transition-opacity">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter">Live Config</span>
                </div>
                <pre className="text-[11px] text-gray-400 font-mono leading-relaxed max-h-[120px] overflow-y-auto custom-scrollbar">
                  {JSON.stringify(plugin.config, null, 2)}
                </pre>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {plugin.enabled ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black text-emerald-400 uppercase">Operational</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 border border-gray-700 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                      <span className="text-[9px] font-black text-gray-500 uppercase">Suspended</span>
                    </div>
                  )}
                </div>
                
                <span className="text-[10px] font-bold text-gray-600 group-hover:text-blue-400/50 transition-colors">
                  UUID: {plugin.id?.substring(0, 8)}...
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
