"use client";

import React, { useState, useEffect } from 'react';
import { X, Route as RouteIcon } from 'lucide-react';
import { RouteForm, RouteFormValues } from '@/components/routes/RouteForm';
import { apiClient, Gateway, Service } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CreateRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gatewayId: string;
}

export default function CreateRouteModal({ isOpen, onClose, onSuccess, gatewayId }: CreateRouteModalProps) {
  const [gateway, setGateway] = useState<Gateway | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [userSlug, setUserSlug] = useState<string>("my-slug");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isOpen, gatewayId]);

  const handleSubmit = async (data: RouteFormValues) => {
    try {
      await apiClient.gatewayRoutes.create({
        ...data as any,
        gateway_id: gatewayId,
      });
      toast({ title: "Success", description: "Route created successfully!" });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create route", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0B101B] border border-white/5 text-gray-100 max-w-4xl rounded-[2.5rem] p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] [&>button:last-child]:hidden animate-in zoom-in-95 duration-300">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-br from-[#1E224F] via-[#141833] to-[#0B101B] px-8 py-5 border-b border-white/5 relative shrink-0">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-left">
                <div className="w-11 h-11 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] relative group">
                  <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <RouteIcon className="w-5 h-5 text-white stroke-[2.5px]" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    Create Route
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest text-blue-400">Manual Entry</span>
                  </DialogTitle>
                  <DialogDescription className="text-[#94A3B8] font-medium text-xs mt-0.5">
                    Configure a new route for {gateway?.name || "your gateway"}
                  </DialogDescription>
                </div>
              </div>
              <DialogClose className="p-2 text-[#64748B] hover:text-white rounded-lg hover:bg-white/5 transition-all">
                <X className="w-5 h-5" />
              </DialogClose>
            </div>
          </DialogHeader>
        </div>

        {/* Content Area */}
        <div className="px-8 py-6 relative z-10 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-800">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <RouteForm 
              gatewayMode={(gateway?.mode as "single" | "pro") || "single"}
              gatewayName={gateway?.name || ""}
              userSlug={userSlug}
              collections={collections}
              services={services}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
