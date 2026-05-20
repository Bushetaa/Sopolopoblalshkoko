"use client";

import React from 'react';
import { X, Target, Server, Loader2, Scale, Network, CheckCircle2, Zap, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Service } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface CreateTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  services: Service[];
  isSaving: boolean;
  formData: { url: string; service_id: string; weight: number };
  setFormData: (data: { url: string; service_id: string; weight: number }) => void;
  handleCreate: () => void;
  isEditMode?: boolean;
}

export default function CreateTargetModal({
  isOpen,
  onClose,
  onSuccess,
  services,
  isSaving,
  formData,
  setFormData,
  handleCreate,
  isEditMode = false
}: CreateTargetModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0B101B] border border-white/5 text-gray-100 max-w-md rounded-[2.5rem] p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] [&>button:last-child]:hidden animate-in zoom-in-95 duration-300">
        {/* Header - Styled like Wizard */}
        <div className="bg-gradient-to-br from-[#1E224F] via-[#141833] to-[#0B101B] px-6 py-4.5 border-b border-white/5 relative shrink-0">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] relative group">
                  <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Target className="w-4.5 h-4.5 text-white stroke-[2.5px]" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    {isEditMode ? "Modify Target" : "New Target"}
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest text-blue-400">
                      {isEditMode ? "Update" : "Manual Entry"}
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-[#94A3B8] font-medium text-[11px] mt-0.5">
                    {isEditMode ? "Modify upstream address or performance weight" : "Connect a physical upstream instance to your service"}
                  </DialogDescription>
                </div>
              </div>
              <DialogClose className="p-2 text-[#64748B] hover:text-white rounded-lg hover:bg-white/5 transition-all">
                <X className="w-4.5 h-4.5" />
              </DialogClose>
            </div>
          </DialogHeader>
        </div>

        {/* Form Content - Compact & Stacked Vertically */}
        <div className="px-6 py-5 space-y-4">
          <div className="space-y-4">
            {/* Parent Service */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">
                Parent Service <span className="text-red-500">*</span>
              </label>
              <Select 
                value={formData.service_id} 
                onValueChange={(val) => setFormData({ ...formData, service_id: val })}
              >
                <SelectTrigger className="h-10 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl text-xs transition-all text-white">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent className="bg-[#0B101B] border-[#1E293B] rounded-xl p-2 shadow-2xl">
                  {services.map(s => (
                    <SelectItem key={s.id} value={s.id!} className="rounded-lg my-0.5 focus:bg-blue-500/10 focus:text-blue-400">
                      <div className="flex items-center gap-2">
                        <Server className="w-3.5 h-3.5" />
                        <span className="font-bold text-xs text-gray-200">{s.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destination URL */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">
                Destination URL <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Network className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] group-focus-within:text-[#2563EB] transition-colors" />
                <Input 
                  placeholder="http://10.0.0.5:8080" 
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="h-10 pl-10 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl text-xs transition-all text-white placeholder:text-gray-700 font-mono"
                />
              </div>
              <p className="text-[8px] text-[#475569] font-medium ml-1">Actual IP or Hostname of the upstream server</p>
            </div>

            {/* Traffic Weight */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Traffic Weight</label>
              <div className="flex items-center gap-3 bg-[#050810] border border-[#1E293B] rounded-xl px-3.5 h-10">
                <Scale className="w-4 h-4 text-[#475569]" />
                <input 
                  type="number" 
                  min="1"
                  className="flex-1 bg-transparent border-none focus:ring-0 text-xs text-white font-mono"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
          </div>

          {/* Preview Card - More Compact */}
          <div className="bg-[#050810]/50 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-7.5 h-7.5 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-[#64748B] block">Deployment Preview</span>
                <span className="text-xs font-bold text-gray-200 truncate max-w-[180px] block">
                  Forwarding to {formData.url || "..."}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">w:{formData.weight}</span>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-4.5 border-t border-white/5">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-auto h-10 px-5 border-[#1E293B] hover:bg-[#1E293B] text-[#64748B] hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleCreate} 
              disabled={isSaving || !formData.service_id || !formData.url}
              className="w-full sm:w-auto h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-[0.12em] transition-all duration-300 shadow-md active:scale-95 flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-[#2563EB]/20"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin stroke-[3px]" />
                  {isEditMode ? "Saving..." : "Deploying..."}
                </>
              ) : (
                <>
                  {isEditMode ? (
                    <Save className="w-3.5 h-3.5 stroke-[2.5px]" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 fill-white stroke-none" />
                  )}
                  {isEditMode ? "Save Changes" : "Launch Target"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
