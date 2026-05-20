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
              Infrastructure Provisioning
            </div>
            <h2 className="text-3xl font-black font-display text-white tracking-tight flex items-center gap-3">
              <Server className="w-8 h-8 text-blue-500 stroke-[2.5px]" />
              New Service
            </h2>
            <p className="text-[#94A3B8] font-medium text-sm mt-1.5 tracking-tight">
              Deploying to <span className="text-blue-400 font-bold">{gateway.name}</span> environment
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
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
