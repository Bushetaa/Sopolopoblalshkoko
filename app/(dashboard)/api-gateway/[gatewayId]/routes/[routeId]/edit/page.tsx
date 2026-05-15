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
      await apiClient.gatewayRoutes.update(routeId, {
        ...data as any,
        gateway_id: gatewayId,
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href={`/api-gateway/${gatewayId}/routes`}
          className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50 flex items-center gap-2">
            <RouteIcon className="w-6 h-6 text-blue-400" />
            Edit Route
          </h2>
          <p className="text-sm text-gray-400 mt-1">Update settings for {route.path}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
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
