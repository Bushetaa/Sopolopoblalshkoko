"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe } from 'lucide-react';
import { GatewayForm, GatewayFormValues } from '@/components/api-gateway/GatewayForm';
import { apiClient } from '@/lib/api-client';

export default function NewGatewayPage() {
  const router = useRouter();
  const hasSingleGateway = false; // TODO: fetch from user profile/gateways

  const handleSubmit = async (data: GatewayFormValues) => {
    try {
      await apiClient.gateways.create({
        name: data.name,
        description: data.description,
        mode: data.mode,
        is_active: data.is_active,
      });
      router.push('/api-gateway');
    } catch (error) {
      console.error("Failed to create gateway", error);
      // In a real app, you would show a toast here
    }
  };

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
              Provisioning
            </div>
            <h2 className="text-3xl font-extrabold font-display text-gray-50 tracking-tight flex items-center gap-3">
              <Globe className="w-8 h-8 text-blue-500" />
              Create Gateway
            </h2>
            <p className="text-gray-400 mt-1 text-sm font-medium">Configure a new API Gateway to route and manage your traffic.</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-950/40 border border-gray-800/60 rounded-[2.5rem] p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
        <GatewayForm 
          onSubmit={handleSubmit}
          onCancel={() => router.push('/api-gateway')}
          hasSingleGateway={hasSingleGateway}
          userSlug="my-slug"
        />
      </div>
    </div>
  );
}
