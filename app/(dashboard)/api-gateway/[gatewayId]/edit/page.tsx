"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe } from 'lucide-react';
import { GatewayForm, GatewayFormValues } from '@/components/api-gateway/GatewayForm';
import { apiClient, Gateway } from '@/lib/api-client';

export default function EditGatewayPage({ params }: { params: Promise<{ gatewayId: string }> }) {
  const router = useRouter();
  const { gatewayId } = use(params);
  
  const [gateway, setGateway] = useState<Gateway | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasSingleGateway = false; // Mock for now

  useEffect(() => {
    const fetchGateway = async () => {
      try {
        const data = await apiClient.gateways.getById(gatewayId);
        setGateway(data);
      } catch (error) {
        console.error("Failed to fetch gateway", error);
        router.push('/api-gateway');
      } finally {
        setIsLoading(false);
      }
    };
    if (gatewayId) {
      fetchGateway();
    }
  }, [gatewayId, router]);

  const handleSubmit = async (data: GatewayFormValues) => {
    try {
      await apiClient.gateways.update(gatewayId, {
        name: data.name,
        description: data.description,
        mode: data.mode,
        is_active: data.is_active,
      });
      router.push('/api-gateway');
    } catch (error) {
      console.error("Failed to update gateway", error);
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
      {/* High-density Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Link 
            href="/api-gateway" 
            className="w-11 h-11 flex items-center justify-center bg-[#0B101B] border border-white/5 rounded-xl text-[#64748B] hover:text-white hover:border-blue-500/30 transition-all shadow-xl active:scale-95 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
              <div className="w-8 h-[2px] bg-blue-500" />
              Gateway Configuration
            </div>
            <h2 className="text-3xl font-black font-display text-white tracking-tight flex items-center gap-3">
              Edit Gateway
            </h2>
            <p className="text-[13px] text-[#64748B] mt-1.5 font-medium">Update settings for <span className="text-blue-400 font-black">{gateway.name}</span></p>
          </div>
        </div>
      </div>

      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
        <GatewayForm 
          initialValues={{
            name: gateway.name,
            description: gateway.description || "",
            mode: (gateway.mode as "single" | "pro") || "pro",
            is_active: gateway.is_active
          }}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/api-gateway')}
          hasSingleGateway={hasSingleGateway && gateway.mode !== 'single'}
          userSlug="my-slug"
        />
      </div>
    </div>
  );
}
