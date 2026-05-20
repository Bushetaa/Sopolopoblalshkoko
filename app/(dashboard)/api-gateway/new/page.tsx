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
              Gateway Deployment
            </div>
            <h2 className="text-3xl font-black font-display text-white tracking-tight flex items-center gap-3">
              Create Gateway
            </h2>
            <p className="text-[13px] text-[#64748B] mt-1.5 font-medium">Configure a new API Gateway for your infrastructure traffic.</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
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
