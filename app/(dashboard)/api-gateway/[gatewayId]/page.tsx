"use client";

import React, { useState, useEffect, use } from 'react';
import { Server, Zap, Settings, Globe, Trash, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

export default function GatewaySettingsPage({ params }: { params: Promise<{ gatewayId: string }> }) {
  const { gatewayId } = use(params);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'single' | 'pro'>('pro');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchGateway = async () => {
      try {
        const data = await apiClient.gateways.getById(gatewayId);
        setName(data.name);
        setDescription(data.description || '');
        setMode((data.mode as 'single' | 'pro') || 'pro');
        setIsActive(data.is_active);
      } catch (error) {
        console.error("Failed to fetch gateway settings", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (gatewayId) fetchGateway();
  }, [gatewayId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiClient.gateways.update(gatewayId, {
        name,
        description,
        mode,
        is_active: isActive
      });
    } catch (error) {
      console.error("Failed to update gateway", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[#1E224F] via-[#141833] to-[#0B101B] px-8 py-6 border-b border-white/5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] relative group">
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Settings className="w-6 h-6 text-white stroke-[2.5px]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  Gateway Settings
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest text-blue-400">Configuration</span>
                </h3>
                <p className="text-[#94A3B8] font-medium text-xs mt-0.5">
                  Update your infrastructure parameters and traffic modes
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-[#64748B] group-hover:text-white transition-colors">Active Status</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">
                  Gateway Name <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] group-focus-within:text-[#2563EB] transition-colors" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 pl-11 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl text-sm transition-all text-white font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="description" className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">
                  Description <span className="text-gray-500 text-[9px] font-normal lowercase tracking-normal">(Optional)</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl text-sm transition-all text-white font-medium resize-none"
                  placeholder="Describe the purpose of this gateway..."
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">
                  Operation Mode <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-4">
                  <div 
                    className={cn(
                      "p-4 border rounded-2xl cursor-pointer transition-all relative group overflow-hidden",
                      mode === 'single' 
                        ? "bg-[#2563EB]/5 border-[#2563EB] shadow-[0_0_20px_rgba(37,99,235,0.1)]" 
                        : "bg-[#050810] border-[#1E293B] hover:border-[#475569]"
                    )}
                    onClick={() => setMode('single')}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                        mode === 'single' ? "bg-[#2563EB] text-white" : "bg-[#1E293B] text-[#475569]"
                      )}>
                        <Zap className="w-5 h-5 fill-current stroke-none" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={cn("text-xs font-black uppercase tracking-widest", mode === 'single' ? "text-white" : "text-[#94A3B8]")}>Standalone</span>
                          {mode === 'single' && <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />}
                        </div>
                        <p className="text-[10px] text-[#475569] font-medium mt-0.5">Optimized for single instance deployment</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={cn(
                      "p-4 border rounded-2xl cursor-pointer transition-all relative group overflow-hidden",
                      mode === 'pro' 
                        ? "bg-purple-500/5 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.1)]" 
                        : "bg-[#050810] border-[#1E293B] hover:border-[#475569]"
                    )}
                    onClick={() => setMode('pro')}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                        mode === 'pro' ? "bg-purple-500 text-white" : "bg-[#1E293B] text-[#475569]"
                      )}>
                        <Server className="w-5 h-5 stroke-[2.5px]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={cn("text-xs font-black uppercase tracking-widest", mode === 'pro' ? "text-white" : "text-[#94A3B8]")}>Enterprise</span>
                          {mode === 'pro' && <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />}
                        </div>
                        <p className="text-[10px] text-[#475569] font-medium mt-0.5">Full cluster support & multi-region sync</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <Trash className="w-4 h-4" />
              Terminate Infrastructure
            </button>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="submit"
                disabled={isSaving || !name}
                className="w-full sm:w-auto h-12 px-10 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 shadow-xl active:scale-95 flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-[#2563EB]/20 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin stroke-[3px]" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5px]" />
                    Commit Configuration
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
