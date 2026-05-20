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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050810]/90 backdrop-blur-md p-4">
      <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header - Styled like Wizard */}
        <div className="bg-gradient-to-br from-[#1E224F] via-[#141833] to-[#0B101B] px-8 py-5 border-b border-white/5 relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] relative group">
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Globe className="w-5 h-5 text-white stroke-[2.5px]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  Create Gateway
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest text-blue-400">Manual Entry</span>
                </h2>
                <p className="text-[#94A3B8] font-medium text-xs">Configure a new API Gateway to route and manage your traffic</p>
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
