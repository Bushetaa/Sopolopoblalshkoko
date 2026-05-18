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
  const [newPluginPhase, setNewPluginPhase] = useState('auth');
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
      setNewPluginPhase('auth');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Plug className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-50">Configure New Plugin</h2>
              <p className="text-xs text-gray-400">Add a global plugin to your gateway</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800 space-y-6">
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
                className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 outline-none focus:border-blue-500"
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
                className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 outline-none focus:border-blue-500"
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
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-lg font-medium transition-colors">
            Cancel
          </button>
          <button disabled={isSubmitting} onClick={handleAddPlugin} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
            {isSubmitting ? "Saving..." : "Save Plugin"}
          </button>
        </div>
      </div>
    </div>
  );
}
