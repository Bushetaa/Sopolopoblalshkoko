"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Route as RouteIcon } from 'lucide-react';
import { RouteForm, RouteFormValues } from '@/components/routes/RouteForm';
import { apiClient, Gateway, GatewayRoute, Service } from '@/lib/api-client';

export default function EditRoutePage({ params }: { params: Promise<{ gatewayId: string, routeId: string }> }) {
  const router = useRouter();
  const { gatewayId, routeId } = use(params);
  
  const [gateway, setGateway] = useState<Gateway | null>(null);
  const [route, setRoute] = useState<GatewayRoute | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [userSlug, setUserSlug] = useState<string>("my-slug");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedGateway, fetchedRoute, fetchedServices, fetchedProfiles, fetchedCollections] = await Promise.all([
          apiClient.gateways.getById(gatewayId),
          apiClient.gatewayRoutes.getById(routeId),
          apiClient.services.getAll(),
          apiClient.userProfiles.getAll().catch(() => []),
          apiClient.collections.getAll().catch(() => [])
        ]);
        
        setGateway(fetchedGateway);
        setRoute(fetchedRoute);
        setServices(fetchedServices.filter(s => s.gateway_id === gatewayId));
        setCollections(fetchedCollections.filter((c: any) => c.gateway_id === gatewayId));
        if (fetchedProfiles && fetchedProfiles.length > 0 && fetchedProfiles[0].slug) {
          setUserSlug(fetchedProfiles[0].slug);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        router.push(`/api-gateway/${gatewayId}/routes`);
      } finally {
        setIsLoading(false);
      }
    };
    if (gatewayId && routeId) fetchData();
  }, [gatewayId, routeId, router]);

  const handleSubmit = async (data: RouteFormValues) => {
    try {
      // Don't include gateway_id in updates, it's immutable for existing routes
      await apiClient.gatewayRoutes.update(routeId, {
        ...data as any,
      });
      router.push(`/api-gateway/${gatewayId}/routes`);
    } catch (error) {
      console.error("Failed to update route", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this route?")) return;
    try {
      await apiClient.gatewayRoutes.delete(routeId);
      router.push(`/api-gateway/${gatewayId}/routes`);
    } catch (error) {
      console.error("Failed to delete route", error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!gateway || !route) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Consolidated Route Command Center */}
      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] -z-10" />

        {/* Integrated Premium Header - Compact Style */}
        <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.01] relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-5%] opacity-[0.03] blur-2xl -z-10">
            <RouteIcon className="w-96 h-96 text-emerald-500" />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <Link 
                href={`/api-gateway/${gatewayId}/routes`}
                className="group flex items-center justify-center w-10 h-10 bg-[#0F172A] border border-white/5 rounded-2xl text-[#64748B] hover:text-white hover:border-white/10 hover:bg-[#1E293B] transition-all shadow-xl active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </Link>
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1.5">
                  <div className="w-5 h-[2px] bg-emerald-500" />
                  Traffic Management
                </div>
                <h2 className="text-2xl font-black font-display text-white tracking-tight flex items-center gap-2.5">
                  <RouteIcon className="w-6 h-6 text-emerald-500 stroke-[2.5px]" />
                  Edit Route
                </h2>
                <p className="text-[#94A3B8] font-medium text-xs mt-1 tracking-tight">Updating configuration for path <span className="text-blue-400 font-bold">{route.path}</span></p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-4 bg-[#050810]/80 px-4 py-2.5 rounded-xl border border-white/5 shadow-inner">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-[#475569] uppercase tracking-[0.2em]">Routing Status</span>
                <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE TRAFFIC
                </span>
              </div>
              <div className="w-[1px] h-6 bg-white/5 mx-1" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-[#475569] uppercase tracking-[0.2em]">Gateway Context</span>
                <span className="text-[10px] font-mono font-bold text-[#94A3B8] mt-0.5 uppercase">{gateway.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-8 md:p-10">
          <RouteForm 
            initialValues={{
              path: route.path,
              method: route.method as any,
              service_id: route.service_id,
              is_aggregate: route.is_aggregate,
              aggregate_merge_strategy: route.aggregate_merge_strategy,
              aggregate_timeout: route.aggregate_timeout,
              allow_partial_failure: route.allow_partial_failure,
            }}
            gatewayMode={(gateway.mode as "single" | "pro") || "single"}
            gatewayName={gateway.name}
            userSlug={userSlug}
            collections={collections}
            services={services}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/api-gateway/${gatewayId}/routes`)}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
