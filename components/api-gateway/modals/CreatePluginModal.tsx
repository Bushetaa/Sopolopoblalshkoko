"use client";

import React, { useState } from 'react';
import { X, Plug } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import DynamicPluginConfig from '@/components/forms/DynamicPluginConfig';
import { toast } from '@/hooks/use-toast';

interface CreatePluginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gatewayId: string;
}

export default function CreatePluginModal({ isOpen, onClose, onSuccess, gatewayId }: CreatePluginModalProps) {
  const [newPluginName, setNewPluginName] = useState('jwt');
  const [newPluginPhase, setNewPluginPhase] = useState('Authentication');
  const [newPluginConfig, setNewPluginConfig] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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
      toast({ title: "Success", description: "Plugin added successfully!" });
      
      // Reset state for next time
      setNewPluginName('jwt');
      setNewPluginPhase('Authentication');
      setNewPluginConfig({});
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create plugin", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050810]/90 backdrop-blur-md p-4">
      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header - Styled like Wizard */}
        <div className="bg-gradient-to-br from-[#1E224F] via-[#141833] to-[#0B101B] px-8 py-5 border-b border-white/5 relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] relative group">
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Plug className="w-5 h-5 text-white stroke-[2.5px]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  Configure Plugin
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest text-blue-400">Manual Entry</span>
                </h2>
                <p className="text-[#94A3B8] font-medium text-xs">Add a global plugin to your gateway</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-[#64748B] hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin scrollbar-thumb-gray-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Plugin Module</label>
              <select 
                value={newPluginName} 
                onChange={(e) => {
                  setNewPluginName(e.target.value);
                  setNewPluginConfig({});
                  // Auto-set a reasonable phase based on the plugin type
                  if (['jwt', 'apikey'].includes(e.target.value)) setNewPluginPhase('Authentication');
                  if (['ratelimit'].includes(e.target.value)) setNewPluginPhase('RateLimiting');
                  if (['cors', 'waf'].includes(e.target.value)) setNewPluginPhase('PreRouting');
                  if (['cache'].includes(e.target.value)) setNewPluginPhase('ResponseTransform');
                }} 
                className="w-full h-11 px-4 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] rounded-xl text-sm text-white outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="jwt">JWT Auth</option>
                <option value="apikey">API Key</option>
                <option value="ratelimit">Rate Limiting</option>
                <option value="cache">Caching</option>
                <option value="cors">CORS</option>
                <option value="waf">WAF</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Execution Phase</label>
              <select 
                value={newPluginPhase} 
                onChange={(e) => setNewPluginPhase(e.target.value)} 
                className="w-full h-11 px-4 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] rounded-xl text-sm text-white outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="PreRouting">Pre-Routing</option>
                <option value="Authentication">Authentication</option>
                <option value="RateLimiting">Rate Limiting</option>
                <option value="RequestTransform">Request Transform</option>
                <option value="UpstreamForward">Upstream Forward</option>
                <option value="ResponseTransform">Response Transform</option>
                <option value="Logging">Logging</option>
              </select>

            </div>
          </div>

          <div className="bg-[#050810] rounded-2xl p-6 border border-[#1E293B]">
            <h5 className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64748B] mb-4 border-b border-white/5 pb-2">Plugin Configuration</h5>
            <DynamicPluginConfig pluginName={newPluginName} config={newPluginConfig} onChange={setNewPluginConfig} />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-white/5 bg-[#0B101B] flex justify-end gap-3 shrink-0">
          <button 
            onClick={onClose} 
            className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-[#64748B] hover:text-white transition-all"
          >
            Cancel
          </button>
          <button 
            disabled={isSubmitting} 
            onClick={handleAddPlugin} 
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Plugin"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
