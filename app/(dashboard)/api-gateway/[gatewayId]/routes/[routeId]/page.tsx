"use client";

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Route as RouteIcon, GitMerge, Link as LinkIcon, Trash2, Plus, Info, Settings2, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient, GatewayRoute } from '@/lib/api-client';
import CreateRouteModal from '@/components/api-gateway/modals/CreateRouteModal';

export default function RouteDetailsPage({ params }: { params: Promise<{ gatewayId: string; routeId: string }> }) {
  const router = useRouter();
  const { gatewayId, routeId } = use(params);
  const isNew = routeId === 'new';

  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('');
  const [protocol, setProtocol] = useState('http');
  const [timeout, setTimeoutVal] = useState('30s');
  const [collection, setCollection] = useState('');
  const [isAggregate, setIsAggregate] = useState(false);

  // Standard specific
  const [service, setService] = useState('');
  const [targetPath, setTargetPath] = useState('');
  const [websocket, setWebsocket] = useState(false);
  const [retryMax, setRetryMax] = useState('');
  const [retryStatus, setRetryStatus] = useState('');

  // Aggregate specific
  const [mergeStrategy, setMergeStrategy] = useState('merge_object');
  const [aggTimeout, setAggTimeout] = useState('30s');
  const [partialFailure, setPartialFailure] = useState(false);
  const [subRequests, setSubRequests] = useState<{ id: string; key: string; service: string; targetPath: string; method: string; required: boolean; timeout: string }[]>(
    isNew ? [] : []
  );

  const [isLoading, setIsLoading] = useState(!isNew);
  const [editingRoute, setEditingRoute] = useState<GatewayRoute | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  React.useEffect(() => {
    if (!isNew && routeId) {
      const fetchRoute = async () => {
        try {
          const rt = await apiClient.gatewayRoutes.getById(routeId);
          setPath(rt.path);
          setMethod(rt.method || 'GET');
          setTimeoutVal(rt.timeout || '30s');
          setIsAggregate(rt.is_aggregate || false);
          
          if (!rt.is_aggregate && rt.service_id) {
            try {
              const svc = await apiClient.services.getById(rt.service_id);
              setService(svc.name);
            } catch (e) {
              setService('Unknown Service');
            }
          }
          
          if (rt.is_aggregate) {
            setMergeStrategy(rt.aggregate_merge_strategy || 'merge_object');
            setAggTimeout(rt.aggregate_timeout || '30s');
            setPartialFailure(rt.allow_partial_failure || false);
            // If there are subrequests stored in the route object, we should parse them here
            // Assuming they might be in a metadata or specific field if not already handled
          }
        } catch (error) {
          console.error("Failed to fetch route details:", error);
          setPath("Error Loading Route");
        } finally {
          setIsLoading(false);
        }
      };
      fetchRoute();
    }
  }, [routeId, isNew]);

  const handleAddSubRequest = () => {
    setSubRequests([...subRequests, { id: Math.random().toString(), key: '', service: '', targetPath: '', method: 'GET', required: false, timeout: '' }]);
  };

  const handleRemoveSubRequest = (id: string) => {
    setSubRequests(subRequests.filter(s => s.id !== id));
  };

  const updateSubRequest = (id: string, field: string, value: any) => {
    setSubRequests(subRequests.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => globalThis.setTimeout(r, 1000));
    router.push(`/api-gateway/${gatewayId}/routes`);
  };

  const isProMode = true;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1E224F] via-[#141833] to-[#0B101B] border border-white/5 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        <div className="absolute top-[-20%] right-[-10%] opacity-10 blur-3xl">
          <RouteIcon className="w-64 h-64 text-emerald-500" />
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <Link 
              href={`/api-gateway/${gatewayId}/routes`}
              className="group flex items-center justify-center w-11 h-11 bg-[#0F172A] border border-white/5 rounded-2xl text-[#64748B] hover:text-white hover:border-white/10 hover:bg-[#1E293B] transition-all shadow-xl active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                <div className="w-6 h-[2px] bg-emerald-500" />
                Routing Topology
              </div>
              <h2 className="text-2xl font-black font-display text-white tracking-tight flex items-center gap-3">
                <RouteIcon className="w-6 h-6 text-emerald-500 stroke-[2.5px]" />
                {isNew ? 'Create Route' : path || 'Unnamed Route'}
              </h2>
              <p className="text-[#94A3B8] font-medium text-xs mt-1.5 tracking-tight">
                Mapping status: <span className="text-emerald-400 font-bold uppercase tracking-widest text-[9px]">Live Mapping</span>
              </p>
            </div>
          </div>
          
          {!isNew && (
            <button 
              onClick={async () => {
                try {
                  const rt = await apiClient.gatewayRoutes.getById(routeId);
                  setEditingRoute(rt);
                  setIsEditModalOpen(true);
                } catch (e) { console.error(e); }
              }}
              className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md active:scale-95"
            >
              <Settings2 className="w-4 h-4 text-emerald-400" />
              Configure Route
            </button>
          )}
        </div>
      </div>

      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 blur-[120px] -z-10" />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
          {/* Left Panel: Specs */}
          <div className="lg:col-span-1 p-6 bg-white/[0.01]">
            <h4 className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-emerald-500" />
              Route Specs
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-[10px] font-bold text-[#94A3B8]">Method</span>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border",
                  method === 'GET' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                )}>{method}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-[10px] font-bold text-[#94A3B8]">Type</span>
                <span className="text-[9px] font-black text-white uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">{isAggregate ? 'Aggregate' : 'Standard'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-[10px] font-bold text-[#94A3B8]">Timeout</span>
                <span className="text-[9px] font-black text-white uppercase tracking-widest bg-gray-800 px-2 py-0.5 rounded-md border border-white/5">{timeout}</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Configuration */}
          <div className="lg:col-span-3 p-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Endpoint Configuration
                </h3>
                <div className="bg-[#050810] rounded-xl p-4 border border-white/5 font-mono text-xs text-blue-400 shadow-inner">
                  {path || '/(not-defined)'}
                </div>
              </div>

              {!isAggregate ? (
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Upstream Mapping
                  </h3>
                  <div className="bg-[#050810] rounded-xl p-4 border border-white/5 shadow-inner flex items-center gap-4 group hover:border-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Server className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-[#64748B] uppercase tracking-widest">Target Service</span>
                      <p className="text-white font-black text-base">{service || 'No service selected'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Aggregation Pipeline
                  </h3>
                  <div className="space-y-3">
                    {subRequests.map((sub, idx) => (
                      <div key={sub.id} className="bg-[#050810] p-4 rounded-xl border border-white/5 flex items-center justify-between shadow-inner hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-[10px]">
                            {idx + 1}
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-[#64748B] uppercase tracking-widest">Key: {sub.key}</span>
                            <p className="text-white font-black text-sm">{sub.service}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">{sub.method}</span>
                          <p className="text-[9px] text-[#475569] font-mono mt-1">{sub.targetPath}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {editingRoute && (
        <CreateRouteModal 
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setEditingRoute(null); }}
          onSuccess={() => { router.refresh(); }}
          gatewayId={gatewayId}
          editingRoute={editingRoute}
          isEditMode={true}
        />
      )}
    </div>
  );
}
