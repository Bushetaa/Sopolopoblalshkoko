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
    <div className="max-w-3xl mx-auto space-y-5 pb-8 animate-in fade-in duration-500">
      {/* Compact Header */}
      <div className="flex items-center gap-4">
        <Link 
          href={`/api-gateway/${gatewayId}/services`}
          className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold font-display text-gray-50 tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-500" />
            Add Service
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">Configure a new backend service for <span className="text-blue-400 font-semibold">{gateway.name}</span></p>
        </div>
      </div>

      <div className="bg-gray-950/40 border border-gray-800/60 rounded-xl p-6">
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
