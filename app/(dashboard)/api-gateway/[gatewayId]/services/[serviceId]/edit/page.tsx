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
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/60 to-blue-900/10 border border-gray-800/60 rounded-3xl p-8 backdrop-blur-md">
        <div className="absolute top-[-20%] right-[-10%] opacity-10 blur-3xl">
          <Server className="w-96 h-96 text-blue-500" />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <Link 
            href={`/api-gateway/${gatewayId}/services`}
            className="p-3 bg-gray-950/50 border border-gray-800 rounded-2xl text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-300 group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">
              <div className="w-6 h-[2px] bg-blue-500" />
              Service Configuration
            </div>
            <h2 className="text-3xl font-extrabold font-display text-gray-50 tracking-tight flex items-center gap-3">
              <Server className="w-8 h-8 text-blue-500" />
              Edit Service
            </h2>
            <p className="text-gray-400 mt-1 text-sm font-medium tracking-tight">Update settings for <span className="text-blue-400 font-bold">{service.name}</span></p>
          </div>
        </div>
      </div>

      <div className="bg-gray-950/40 border border-gray-800/60 rounded-[2.5rem] p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
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

      <div className="bg-gray-950/40 border border-gray-800/60 rounded-[2.5rem] p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/5 blur-[100px] -z-10" />
        <ServiceTargets serviceId={serviceId} lbPolicy={service.lb_policy} />
      </div>
    </div>
  );
}
