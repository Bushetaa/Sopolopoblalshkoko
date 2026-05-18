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
    <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/60 to-blue-900/10 border border-gray-800/60 rounded-3xl p-8 backdrop-blur-md">
        <div className="absolute top-[-20%] right-[-10%] opacity-10 blur-3xl">
          <RouteIcon className="w-96 h-96 text-blue-500" />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <Link 
            href={`/api-gateway/${gatewayId}/routes`}
            className="p-3 bg-gray-950/50 border border-gray-800 rounded-2xl text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-300 group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">
              <div className="w-6 h-[2px] bg-blue-500" />
              Traffic Control
            </div>
            <h2 className="text-3xl font-extrabold font-display text-gray-50 tracking-tight flex items-center gap-3">
              <RouteIcon className="w-8 h-8 text-blue-500" />
              Edit Route
            </h2>
            <p className="text-gray-400 mt-1 text-sm font-medium tracking-tight">Update settings for path <span className="text-blue-400 font-bold">{route.path}</span></p>
          </div>
        </div>
      </div>

      <div className="bg-gray-950/40 border border-gray-800/60 rounded-[2.5rem] p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
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
  );
}
