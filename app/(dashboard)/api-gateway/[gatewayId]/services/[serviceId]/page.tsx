"use client";

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Server, Plus, Trash2, Activity, Settings2, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ServiceTargets } from '@/components/services/ServiceTargets';

export default function ServiceDetailsPage({ params }: { params: Promise<{ gatewayId: string; serviceId: string }> }) {
  const router = useRouter();
  const { gatewayId, serviceId } = use(params);
  const isNew = serviceId === 'new';

  const [name, setName] = useState(isNew ? '' : 'users-service');
  const [protocol, setProtocol] = useState<'http' | 'grpc'>(isNew ? 'http' : 'http');
  const [lbPolicy, setLbPolicy] = useState('round_robin');
  const [collection, setCollection] = useState('');
  const [showHealthCheck, setShowHealthCheck] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  // Health Check State
  const [hcPath, setHcPath] = useState('');
  const [hcInterval, setHcInterval] = useState('');
  const [hcTimeout, setHcTimeout] = useState('');
  const [hcFail, setHcFail] = useState(0);
  const [hcPass, setHcPass] = useState(0);

  const isProMode = true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    router.push(`/api-gateway/${gatewayId}/services`);
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#0B101B] border border-white/5 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.4)] relative">
        {/* Unified Premium Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1E224F] via-[#141833] to-[#0B101B] border-b border-white/5 p-7">
          <div className="absolute top-[-20%] right-[-10%] opacity-10 blur-3xl">
            <Server className="w-64 h-64 text-blue-500" />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-6">
              <Link 
                href={`/api-gateway/${gatewayId}/services`}
                className="group flex items-center justify-center w-11 h-11 bg-[#0F172A] border border-white/5 rounded-2xl text-[#64748B] hover:text-white hover:border-white/10 hover:bg-[#1E293B] transition-all shadow-xl active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </Link>
              <div>
                <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2.5">
                  <div className="w-8 h-[2px] bg-blue-500" />
                  Service Infrastructure Control
                </div>
                <h2 className="text-2xl font-black font-display text-white tracking-tight flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                    <Server className="w-5 h-5 text-white stroke-[2.5px]" />
                  </div>
                  {isNew ? 'Provision Service' : name}
                </h2>
                <div className="flex items-center gap-4 mt-2.5">
                  <p className="text-[#94A3B8] font-medium text-xs tracking-tight">
                    Cluster Status: <span className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] ml-1">Operational</span>
                  </p>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <p className="text-[#64748B] font-mono text-[9px] uppercase tracking-widest">ID: {serviceId.substring(0, 12)}...</p>
                </div>
              </div>
            </div>
            
            {!isNew && (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => router.push(`/api-gateway/${gatewayId}/services/${serviceId}/edit`)}
                  className="flex items-center gap-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95 group"
                >
                  <Settings2 className="w-4 h-4 text-white group-hover:rotate-90 transition-transform" />
                  Modify Configuration
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
            {/* Left Panel: Integrated Metrics & Info */}
            <div className="lg:col-span-1 p-6 bg-white/[0.01]">
              <div className="space-y-8">
                {/* Core Parameters */}
                <div>
                  <h4 className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-blue-500" />
                    Core Parameters
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Protocol</span>
                      <span className="text-[9px] font-black text-white uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">{protocol}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">LB Policy</span>
                      <span className="text-[9px] font-black text-white uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">{lbPolicy.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Health Status */}
                <div>
                  <h4 className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
                    Health Status
                  </h4>
                  <div className="p-4 bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/10 rounded-2xl relative overflow-hidden group">
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-base shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        100%
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Uptime</span>
                        <span className="text-[8px] text-emerald-500/60 font-bold uppercase tracking-tighter mt-0.5">All nodes online</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional Notice */}
                {lbPolicy === 'weighted' && (
                  <div className="p-4 bg-amber-500/[0.03] border border-amber-500/10 rounded-2xl">
                    <div className="flex items-center gap-2 text-amber-500 mb-2">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Notice</span>
                    </div>
                    <p className="text-[10px] text-[#64748B] leading-relaxed font-medium">
                      Proportional traffic distribution is active. Ensure weights are balanced across the registry.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Registry Table */}
            <div className="lg:col-span-3 p-8">
              <div className="relative">
                <ServiceTargets serviceId={serviceId} lbPolicy={lbPolicy} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
