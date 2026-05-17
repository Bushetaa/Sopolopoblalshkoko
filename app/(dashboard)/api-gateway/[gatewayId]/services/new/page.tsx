"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Server } from 'lucide-react';
import { ServiceForm, ServiceFormValues } from '@/components/services/ServiceForm';
import { apiClient, Gateway, GatewayCollection } from '@/lib/api-client';

export default function NewServicePage({ params }: { params: Promise<{ gatewayId: string }> }) {
  const router = useRouter();
  const { gatewayId } = use(params);
  
  const [gateway, setGateway] = useState<Gateway | null>(null);
  const [collections, setCollections] = useState<GatewayCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedGateway, fetchedCollections] = await Promise.all([
          apiClient.gateways.getById(gatewayId),
          apiClient.collections.getAll()
        ]);
        
        setGateway(fetchedGateway);
        setCollections(fetchedCollections.filter(c => c.gateway_id === gatewayId));
      } catch (error) {
        console.error("Failed to fetch gateway or collections", error);
        router.push(`/api-gateway/${gatewayId}/services`);
      } finally {
        setIsLoading(false);
      }
    };
    if (gatewayId) fetchData();
  }, [gatewayId, router]);

  const handleSubmit = async (data: ServiceFormValues) => {
    try {
      const created = await apiClient.services.create({
        ...data,
        gateway_id: gatewayId,
      });
      // Redirect to edit page to add targets
      router.push(`/api-gateway/${gatewayId}/services/${created.id}/edit`);
    } catch (error) {
      console.error("Failed to create service", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!gateway) return null;

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
            Add Upstream Service
          </h2>
          <p className="text-sm text-gray-400 mt-1">Configure a new backend service for {gateway.name}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
        <ServiceForm 
          gatewayMode={(gateway.mode as "single" | "pro") || "pro"}
          collections={collections}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/api-gateway/${gatewayId}/services`)}
        />
      </div>
    </div>
  );
}
