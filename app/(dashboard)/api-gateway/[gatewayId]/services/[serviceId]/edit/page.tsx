"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Server, Info } from 'lucide-react';
import { ServiceForm, ServiceFormValues } from '@/components/services/ServiceForm';
import { ServiceTargets } from '@/components/services/ServiceTargets';
import { apiClient, Gateway, GatewayCollection, Service } from '@/lib/api-client';

export default function EditServicePage({ params }: { params: Promise<{ gatewayId: string, serviceId: string }> }) {
  const router = useRouter();
  const { gatewayId, serviceId } = use(params);
  
  const [gateway, setGateway] = useState<Gateway | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [collections, setCollections] = useState<GatewayCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedGateway, fetchedService, fetchedCollections] = await Promise.all([
          apiClient.gateways.getById(gatewayId),
          apiClient.services.getById(serviceId),
          apiClient.collections.getAll()
        ]);
        
        setGateway(fetchedGateway);
        setService(fetchedService);
        setCollections(fetchedCollections.filter(c => c.gateway_id === gatewayId));
      } catch (error) {
        console.error("Failed to fetch data", error);
        router.push(`/api-gateway/${gatewayId}/services`);
      } finally {
        setIsLoading(false);
      }
    };
    if (gatewayId && serviceId) fetchData();
  }, [gatewayId, serviceId, router]);

  const handleSubmit = async (data: ServiceFormValues) => {
    try {
      // Don't include gateway_id in updates, it's immutable for existing services
      await apiClient.services.update(serviceId, {
        ...data,
      });
      router.push(`/api-gateway/${gatewayId}/services`);
    } catch (error) {
      console.error("Failed to update service", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await apiClient.services.delete(serviceId);
      router.push(`/api-gateway/${gatewayId}/services`);
    } catch (error) {
      console.error("Failed to delete service", error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!gateway || !service) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Consolidated Command Center Box */}
      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] -z-10" />

        {/* Integrated Premium Header */}
        <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.01] relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-5%] opacity-[0.03] blur-2xl -z-10">
            <Server className="w-96 h-96 text-blue-500" />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <Link 
                href={`/api-gateway/${gatewayId}/services`}
                className="group flex items-center justify-center w-10 h-10 bg-[#0F172A] border border-white/5 rounded-2xl text-[#64748B] hover:text-white hover:border-white/10 hover:bg-[#1E293B] transition-all shadow-xl active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </Link>
              <div>
                <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1.5">
                  <div className="w-5 h-[2px] bg-blue-500" />
                  Service Optimization
                </div>
                <h2 className="text-2xl font-black font-display text-white tracking-tight flex items-center gap-2.5">
                  <Server className="w-6 h-6 text-blue-500 stroke-[2.5px]" />
                  Edit Service
                </h2>
                <p className="text-[#94A3B8] font-medium text-xs mt-1 tracking-tight">Updating configuration for <span className="text-blue-400 font-bold">{service.name}</span></p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-4 bg-[#050810]/80 px-4 py-2.5 rounded-xl border border-white/5 shadow-inner">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-[#475569] uppercase tracking-[0.2em]">Deployment State</span>
                <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  ACTIVE NODE
                </span>
              </div>
              <div className="w-[1px] h-6 bg-white/5 mx-1" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-[#475569] uppercase tracking-[0.2em]">Gateway ID</span>
                <span className="text-[10px] font-mono font-bold text-[#94A3B8] mt-0.5 uppercase">{gatewayId.split('-')[0]}...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          {/* Left Column: Form Configuration */}
          <div className="lg:col-span-7 p-8 md:p-10 border-r border-white/5 flex flex-col">
            <div className="flex-1">
              <ServiceForm 
                initialValues={{
                  name: service.name,
                  protocol: service.protocol as "http" | "grpc",
                  lb_policy: service.lb_policy as any,
                  collection_id: service.collection_id,
                  health_check_path: service.health_check_path,
                  health_check_interval: service.health_check_interval,
                  health_check_timeout: service.health_check_timeout,
                  health_check_fail_threshold: service.health_check_fail_threshold,
                  health_check_pass_threshold: service.health_check_pass_threshold,
                }}
                gatewayMode={(gateway.mode as "single" | "pro") || "pro"}
                collections={collections}
                onSubmit={handleSubmit}
                onCancel={() => router.push(`/api-gateway/${gatewayId}/services`)}
                onDelete={handleDelete}
              />
            </div>
          </div>

          {/* Right Column: Targets & Registry */}
          <div className="lg:col-span-5 p-8 md:p-10 bg-[#050810]/20 backdrop-blur-3xl flex flex-col">
            <div className="flex-1">
              <ServiceTargets serviceId={serviceId} lbPolicy={service.lb_policy} />
            </div>

            {/* Quick Stats/Info below targets */}
            <div className="mt-10 p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Info className="w-4 h-4 text-purple-400" />
                </div>
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Optimization Guide</h4>
              </div>
              <p className="text-[10px] text-[#64748B] font-medium leading-relaxed">
                Updating service configuration will propagate changes across all active nodes in the <span className="text-blue-400 font-bold">{gateway.name}</span> cluster. Ensure health check paths are reachable from the gateway environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
