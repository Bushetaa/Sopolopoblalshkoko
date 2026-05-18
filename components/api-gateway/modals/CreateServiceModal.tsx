"use client";

import React, { useState, useEffect } from 'react';
import { X, Server } from 'lucide-react';
import { ServiceForm, ServiceFormValues } from '@/components/services/ServiceForm';
import { apiClient, Gateway, GatewayCollection } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-50">Create Upstream Service</h2>
              <p className="text-xs text-gray-400">Configure a new backend service for {gateway?.name || "your gateway"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800">
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
      </div>
    </div>
  );
}
