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
      await apiClient.services.update(serviceId, {
        ...data,
        gateway_id: gatewayId,
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href={`/api-gateway/${gatewayId}/services`}
          className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50 flex items-center gap-2">
            <Server className="w-6 h-6 text-blue-400" />
            Edit Service
          </h2>
          <p className="text-sm text-gray-400 mt-1">Update settings for {service.name}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
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

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
        <ServiceTargets serviceId={serviceId} lbPolicy={service.lb_policy} />
      </div>
    </div>
  );
}
