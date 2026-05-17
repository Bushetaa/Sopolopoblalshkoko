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
      {/* Premium Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/60 to-blue-900/10 border border-gray-800/60 rounded-3xl p-8 backdrop-blur-md">
        <div className="absolute top-[-20%] right-[-10%] opacity-10 blur-3xl">
          <Globe className="w-96 h-96 text-blue-500" />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <Link 
            href="/api-gateway" 
            className="p-3 bg-gray-950/50 border border-gray-800 rounded-2xl text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-300 group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">
              <div className="w-6 h-[2px] bg-blue-500" />
              Infrastructure Management
            </div>
            <h2 className="text-3xl font-extrabold font-display text-gray-50 tracking-tight flex items-center gap-3">
              <Globe className="w-8 h-8 text-blue-500" />
              Edit Gateway
            </h2>
            <p className="text-gray-400 mt-1 text-sm font-medium tracking-tight">Update settings for <span className="text-blue-400 font-bold">{gateway.name}</span></p>
          </div>
        </div>
      </div>

      <div className="bg-gray-950/40 border border-gray-800/60 rounded-[2.5rem] p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
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
