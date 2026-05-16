"use client";

import React, { useState } from 'react';
import { Plug, Plus, Trash2, Power } from 'lucide-react';
import { cn } from '@/lib/utils';
import DynamicPluginConfig from '@/components/forms/DynamicPluginConfig';

import { apiClient, GatewayPlugin } from '@/lib/api-client';

export default function PluginsPage({ params }: { params: Promise<{ gatewayId: string }> }) {
  const { gatewayId } = React.use(params);
  const [plugins, setPlugins] = useState<GatewayPlugin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newPluginName, setNewPluginName] = useState('jwt');
  const [newPluginPhase, setNewPluginPhase] = useState('auth');
  const [newPluginConfig, setNewPluginConfig] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await fetchPlugins();
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-display text-gray-50">Global Plugins</h3>
          <p className="text-sm text-gray-400 mt-1">Configure plugins that apply to all routes in this Gateway.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Plugin</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-900 border border-blue-500/30 rounded-xl p-6 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
            <h4 className="font-bold text-gray-100 flex items-center gap-2">
              <Plug className="w-5 h-5 text-blue-400" />
              Configure New Plugin
            </h4>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Plugin Name</label>
                <select 
                  value={newPluginName} 
                  onChange={(e) => {
                    setNewPluginName(e.target.value);
                    setNewPluginConfig({});
                    // Auto-set a reasonable phase based on the plugin type
                    if (['jwt', 'apikey'].includes(e.target.value)) setNewPluginPhase('auth');
                    if (['ratelimit', 'cors', 'waf'].includes(e.target.value)) setNewPluginPhase('pre_request');
                    if (['cache'].includes(e.target.value)) setNewPluginPhase('response');
                  }} 
                  className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 outline-none"
                >
                  <option value="jwt">JWT Auth</option>
                  <option value="apikey">API Key</option>
                  <option value="ratelimit">Rate Limiting</option>
                  <option value="cache">Caching</option>
                  <option value="cors">CORS</option>
                  <option value="waf">WAF</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phase</label>
                <select 
                  value={newPluginPhase} 
                  onChange={(e) => setNewPluginPhase(e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 outline-none"
                >
                  <option value="auth">Auth</option>
                  <option value="pre_request">Pre-Request</option>
                  <option value="request">Request</option>
                  <option value="response">Response</option>
                  <option value="post_response">Post-Response</option>
                  <option value="logging">Logging</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-950 rounded-lg p-5 border border-gray-800">
              <h5 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Plugin Configuration</h5>
              <DynamicPluginConfig pluginName={newPluginName} config={newPluginConfig} onChange={setNewPluginConfig} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-lg font-medium transition-colors">
                Cancel
              </button>
              <button disabled={isSubmitting} onClick={handleAddPlugin} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                {isSubmitting ? "Saving..." : "Save Plugin"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-900 border border-gray-800 rounded-xl">
            <Plug className="w-12 h-12 text-gray-700 mx-auto mb-3 animate-pulse" />
            <p className="text-base font-medium text-gray-300">Loading Plugins...</p>
          </div>
        ) : plugins.length === 0 && !isAdding ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-900 border border-gray-800 rounded-xl">
            <Plug className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-base font-medium text-gray-300">No Global Plugins Configured</p>
            <p className="mt-1">Add a plugin to apply policies gateway-wide.</p>
          </div>
        ) : (
          plugins.map(plugin => (
            <div key={plugin.id} className={cn("bg-gray-900 border rounded-xl p-5 flex flex-col transition-all", plugin.enabled ? "border-gray-700" : "border-gray-800 opacity-70")}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", plugin.enabled ? "bg-blue-500/10 text-blue-400" : "bg-gray-800 text-gray-500")}>
                    <Plug className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-100 capitalize">{plugin.name}</h4>
                    <p className="text-xs text-gray-500 font-mono">{(plugin.name.includes('auth') || plugin.name.includes('jwt')) ? 'Authentication' : 'TrafficControl'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggleEnable(plugin)}
                  className={cn("p-1.5 rounded-full transition-colors", plugin.enabled ? "text-green-400 hover:bg-green-400/10" : "text-gray-500 hover:bg-gray-700")}
                  title={plugin.enabled ? "Disable" : "Enable"}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 bg-gray-950 rounded-md p-3 border border-gray-800 overflow-x-auto">
                <pre className="text-[10px] text-gray-400 font-mono">
                  {JSON.stringify(plugin.config, null, 2)}
                </pre>
              </div>

              <div className="flex justify-end pt-4 mt-auto">
                <button onClick={() => plugin.id && handleRemove(plugin.id)} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 p-1.5 hover:bg-red-500/10 rounded transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
