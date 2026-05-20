"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Route as RouteIcon } from 'lucide-react';
import { RouteForm, RouteFormValues } from '@/components/routes/RouteForm';
import { apiClient, Gateway, Service } from '@/lib/api-client';

export default function NewRoutePage({ params }: { params: Promise<{ gatewayId: string }> }) {
  const router = useRouter();
  const { gatewayId } = use(params);
  
  const [gateway, setGateway] = useState<Gateway | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [userSlug, setUserSlug] = useState<string>("my-slug");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedGateway, fetchedServices, fetchedProfiles, fetchedCollections] = await Promise.all([
          apiClient.gateways.getById(gatewayId),
          apiClient.services.getAll(),
          apiClient.userProfiles.getAll().catch(() => []),
          apiClient.collections.getAll().catch(() => [])
        ]);
        
        setGateway(fetchedGateway);
        setServices(fetchedServices.filter(s => s.gateway_id === gatewayId));
        setCollections(fetchedCollections.filter((c: any) => c.gateway_id === gatewayId));
        if (fetchedProfiles && fetchedProfiles.length > 0 && fetchedProfiles[0].slug) {
          setUserSlug(fetchedProfiles[0].slug);
        }
      } catch (error) {
        console.error("Failed to fetch gateway or services", error);
        router.push(`/api-gateway/${gatewayId}/routes`);
      } finally {
        setIsLoading(false);
      }
    };
    if (gatewayId) fetchData();
  }, [gatewayId, router]);

  const handleSubmit = async (data: RouteFormValues) => {
    try {
      await apiClient.gatewayRoutes.create({
        ...data as any,
        gateway_id: gatewayId,
      });
      router.push(`/api-gateway/${gatewayId}/routes`);
    } catch (error) {
      console.error("Failed to create route", error);
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
          <RouteIcon className="w-96 h-96 text-emerald-500" />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <Link 
            href={`/api-gateway/${gatewayId}/routes`}
            className="group flex items-center justify-center w-12 h-12 bg-[#0F172A] border border-white/5 rounded-2xl text-[#64748B] hover:text-white hover:border-white/10 hover:bg-[#1E293B] transition-all shadow-xl active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              <div className="w-6 h-[2px] bg-emerald-500" />
              Routing Topology
            </div>
            <h2 className="text-3xl font-black font-display text-white tracking-tight flex items-center gap-3">
              <RouteIcon className="w-8 h-8 text-emerald-500 stroke-[2.5px]" />
              Create Route
            </h2>
            <p className="text-[#94A3B8] font-medium text-sm mt-1.5 tracking-tight">
              Mapping new path to <span className="text-blue-400 font-bold">{gateway.name}</span> cluster
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] -z-10" />
        <RouteForm 
          gatewayMode={(gateway.mode as "single" | "pro") || "single"}
          gatewayName={gateway.name}
          userSlug={userSlug}
          collections={collections}
          services={services}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/api-gateway/${gatewayId}/routes`)}
        />
      </div>
    </div>
  );
}
