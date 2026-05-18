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
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-8 animate-in fade-in duration-500">
      {/* Compact Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/api-gateway" 
          className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold font-display text-gray-50 tracking-tight flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Create Gateway
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">Configure a new API Gateway for your traffic.</p>
        </div>
      </div>

      <div className="bg-gray-950/40 border border-gray-800/60 rounded-xl p-6">
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
