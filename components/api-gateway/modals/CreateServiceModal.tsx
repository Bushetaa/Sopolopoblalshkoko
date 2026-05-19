"use client";

import React, { useState, useEffect } from 'react';
import { Server } from 'lucide-react';
import { ServiceForm, ServiceFormValues } from '@/components/services/ServiceForm';
import { apiClient, Gateway, GatewayCollection } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gatewayId: string;
}

export default function CreateServiceModal({ isOpen, onClose, onSuccess, gatewayId }: CreateServiceModalProps) {
  const [gateway, setGateway] = useState<Gateway | null>(null);
  const [collections, setCollections] = useState<GatewayCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchData = async () => {
      try {
        const [fetchedGateway, fetchedCollections] = await Promise.all([
          apiClient.gateways.getById(gatewayId),
          apiClient.collections.getAll()
        ]);
        
        setGateway(fetchedGateway);
        setCollections(fetchedCollections.filter(c => c.gateway_id === gatewayId));
      } catch (error) {
        console.error("Failed to fetch gateway or collections", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isOpen, gatewayId]);

  const handleSubmit = async (data: ServiceFormValues) => {
    try {
      await apiClient.services.create({
        ...data,
        gateway_id: gatewayId,
      });
      toast({ title: "Success", description: "Service created successfully!" });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create service", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-3xl rounded-2xl p-0 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"><Server className="w-4 h-4 text-white" /></div>
              Create Upstream Service
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm mt-1">Configure a new backend service for {gateway?.name || "your gateway"}.</DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-5 overflow-y-auto max-h-[70vh]">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ServiceForm 
              gatewayMode={(gateway?.mode as "single" | "pro") || "pro"}
              collections={collections}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
