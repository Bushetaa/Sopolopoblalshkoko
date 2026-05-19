"use client";

import React from 'react';
import { Globe, Plus, Loader2 } from 'lucide-react';
import { GatewayForm, GatewayFormValues } from '@/components/api-gateway/GatewayForm';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CreateGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateGatewayModal({ isOpen, onClose, onSuccess }: CreateGatewayModalProps) {
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-3xl rounded-2xl p-0 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"><Globe className="w-4 h-4 text-white" /></div>
              Create Gateway
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm mt-1">Configure a new API Gateway for your traffic.</DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-5 overflow-y-auto max-h-[70vh]">
          <GatewayForm 
            onSubmit={handleSubmit}
            onCancel={onClose}
            hasSingleGateway={false}
            userSlug="my-slug"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
