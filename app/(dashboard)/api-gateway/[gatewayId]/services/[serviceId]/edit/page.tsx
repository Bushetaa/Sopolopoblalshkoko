"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Server } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1E224F] via-[#141833] to-[#0B101B] border border-white/5 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        <div className="absolute top-[-20%] right-[-10%] opacity-10 blur-3xl">
          <Server className="w-96 h-96 text-blue-500" />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <Link 
            href={`/api-gateway/${gatewayId}/services`}
            className="group flex items-center justify-center w-12 h-12 bg-[#0F172A] border border-white/5 rounded-2xl text-[#64748B] hover:text-white hover:border-white/10 hover:bg-[#1E293B] transition-all shadow-xl active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              <div className="w-6 h-[2px] bg-blue-500" />
              Service Optimization
            </div>
            <h2 className="text-3xl font-black font-display text-white tracking-tight flex items-center gap-3">
              <Server className="w-8 h-8 text-blue-500 stroke-[2.5px]" />
              Edit Service
            </h2>
            <p className="text-[#94A3B8] font-medium text-sm mt-1.5 tracking-tight">Updating configuration for <span className="text-blue-400 font-bold">{service.name}</span></p>
          </div>
        </div>
      </div>

      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
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

      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/5 blur-[100px] -z-10" />
        <ServiceTargets serviceId={serviceId} lbPolicy={service.lb_policy} />
      </div>
    </div>
  );
}
