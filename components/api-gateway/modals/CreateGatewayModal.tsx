"use client";

import React from 'react';
import { X, Globe } from 'lucide-react';
import { GatewayForm, GatewayFormValues } from '@/components/api-gateway/GatewayForm';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';

interface CreateGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateGatewayModal({ isOpen, onClose, onSuccess }: CreateGatewayModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (data: GatewayFormValues) => {
    try {
      await apiClient.gateways.create({
        name: data.name,
        description: data.description,
        mode: data.mode,
        is_active: data.is_active,
      });
      toast({ title: "Success", description: "Gateway created successfully!" });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create gateway", variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-50">Create Gateway</h2>
              <p className="text-xs text-gray-400">Configure a new API Gateway to route and manage your traffic</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800">
          <GatewayForm 
            onSubmit={handleSubmit}
            onCancel={onClose}
            hasSingleGateway={false}
            userSlug="my-slug"
          />
        </div>
      </div>
    </div>
  );
}
