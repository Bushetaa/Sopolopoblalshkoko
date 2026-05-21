"use client";

import React, { useState, useEffect } from 'react';
import { X, Server } from 'lucide-react';
import { ServiceForm, ServiceFormValues } from '@/components/services/ServiceForm';
import { apiClient, Gateway, GatewayCollection, Service } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gatewayId: string;
  editingService?: Service;
  isEditMode?: boolean;
}

export default function CreateServiceModal({ isOpen, onClose, onSuccess, gatewayId, editingService, isEditMode = false }: CreateServiceModalProps) {
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
      if (isEditMode && editingService?.id) {
        // Don't include gateway_id in updates, it's immutable
        await apiClient.services.update(editingService.id, data);
        toast({ title: "Success", description: "Service updated successfully!" });
      } else {
        await apiClient.services.create({
          ...data,
          gateway_id: gatewayId,
        });
        toast({ title: "Success", description: "Service created successfully!" });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || `Failed to ${isEditMode ? 'update' : 'create'} service`, variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050810]/90 backdrop-blur-md p-4">
      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header - Styled like Wizard */}
        <div className="bg-gradient-to-br from-[#1E224F] via-[#141833] to-[#0B101B] px-8 py-5 border-b border-white/5 relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] relative group">
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Server className="w-5 h-5 text-white stroke-[2.5px]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  {isEditMode ? "Modify Service" : "Create Service"}
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest text-blue-400">
                    {isEditMode ? "Update" : "Manual Entry"}
                  </span>
                </h2>
                <p className="text-[#94A3B8] font-medium text-xs">
                  {isEditMode ? `Modify configuration for ${editingService?.name || 'this service'}` : `Configure a new backend service for ${gateway?.name || "your gateway"}`}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-[#64748B] hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin scrollbar-thumb-gray-800">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ServiceForm 
              key={isEditMode ? editingService?.id : 'create'}
              initialValues={isEditMode && editingService ? {
                name: editingService.name,
                protocol: editingService.protocol as "http" | "grpc",
                lb_policy: editingService.lb_policy as any,
                collection_id: editingService.collection_id || '',
                health_check_path: editingService.health_check_path || '',
                health_check_interval: editingService.health_check_interval || '',
                health_check_timeout: editingService.health_check_timeout || '',
                health_check_fail_threshold: editingService.health_check_fail_threshold || 0,
                health_check_pass_threshold: editingService.health_check_pass_threshold || 0,
              } : undefined}
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
