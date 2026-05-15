"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Globe } from 'lucide-react';
import { GatewayForm, GatewayFormValues } from '@/components/api-gateway/GatewayForm';
import { apiClient, Gateway } from '@/lib/api-client';

export default function EditGatewayPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [gateway, setGateway] = useState<Gateway | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasSingleGateway = false; // Mock for now

  useEffect(() => {
    const fetchGateway = async () => {
      try {
        const data = await apiClient.gateways.getById(id);
        setGateway(data);
      } catch (error) {
        console.error("Failed to fetch gateway", error);
        router.push('/api-gateway');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchGateway();
    }
  }, [id, router]);

  const handleSubmit = async (data: GatewayFormValues) => {
    try {
      await apiClient.gateways.update(id, {
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/api-gateway" 
          className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-400" />
            Edit Gateway
          </h2>
          <p className="text-sm text-gray-400 mt-1">Update settings for {gateway.name}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
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
