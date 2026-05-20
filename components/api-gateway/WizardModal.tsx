"use client";

import React, { useState } from 'react';
import { X, Check, ChevronRight, ChevronLeft, Loader2, Globe, Server, Route as RouteIcon, Plug, Shield, Zap } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface WizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WizardModal({ isOpen, onClose, onSuccess }: WizardModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultFormState = {
    gateway: {
      name: '',
      description: '',
      mode: 'pro',
      is_active: true,
    },
    service: {
      name: '',
      protocol: 'http',
      lb_policy: 'round_robin',
      targetUrl: '',
    },
    route: {
      path: '/api/v1',
      method: 'GET',
    },
    plugin: {
      name: 'none',
      rateLimitingLimit: 100,
      keyAuthNames: 'apikey',
      corsOrigins: '*',
    }
  };

  const [formData, setFormData] = useState(defaultFormState);

  const resetForm = () => {
    setCurrentStep(1);
    setFormData(defaultFormState);
  };

  if (!isOpen) return null;

  const updateData = (section: keyof typeof formData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    // Basic validation before moving next
    if (currentStep === 1 && !formData.gateway.name) {
      toast({ title: "Error", description: "Gateway name is required", variant: "destructive" });
      return;
    }
    if (currentStep === 2 && (!formData.service.name || !formData.service.targetUrl)) {
      toast({ title: "Error", description: "Service name and target URL are required", variant: "destructive" });
      return;
    }
    if (currentStep === 3 && !formData.route.path) {
      toast({ title: "Error", description: "Route path is required", variant: "destructive" });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create Gateway
      const gw = await apiClient.gateways.create({
        name: formData.gateway.name,
        description: formData.gateway.description,
        mode: formData.gateway.mode,
        is_active: formData.gateway.is_active,
      });
      const gatewayId = gw.id!;

      // 2. Create Service
      const svc = await apiClient.services.create({
        name: formData.service.name,
        gateway_id: gatewayId,
        protocol: formData.service.protocol,
        lb_policy: formData.service.lb_policy,
      });
      const serviceId = svc.id!;

      // 3. Create Service Target
      await apiClient.serviceTargets.create({
        service_id: serviceId,
        url: formData.service.targetUrl,
        weight: 100
      });

      // 4. Create Route
      await apiClient.gatewayRoutes.create({
        gateway_id: gatewayId,
        service_id: serviceId,
        path: formData.route.path,
        method: formData.route.method,
      });

      // 5. Add Plugin (Optional)
      if (formData.plugin.name !== 'none') {
        let pluginConfig = {};
        if (formData.plugin.name === 'rate-limiting') {
           pluginConfig = { requests_per_minute: formData.plugin.rateLimitingLimit };
        } else if (formData.plugin.name === 'key-auth') {
           pluginConfig = { key_names: formData.plugin.keyAuthNames.split(',').map(s=>s.trim()) };
        } else if (formData.plugin.name === 'cors') {
           pluginConfig = { origins: formData.plugin.corsOrigins.split(',').map(s=>s.trim()) };
        }

        await apiClient.gatewayPlugins.create({
          name: formData.plugin.name,
          phase: 'access',
          gateway_id: gatewayId,
          is_enabled: true,
          plugin_config: pluginConfig
        });
      }

      toast({ title: "Success", description: "Gateway created successfully with all components!" });
      onSuccess();
      resetForm();
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create gateway stack", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Gateway', icon: Globe },
    { num: 2, title: 'Service', icon: Server },
    { num: 3, title: 'Route', icon: RouteIcon },
    { num: 4, title: 'Plugins', icon: Plug },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050810]/90 backdrop-blur-md p-4">
      <div className="bg-[#0B101B] border border-white/5 rounded-[2rem] w-full max-w-4xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header - More Compact */}
        <div className="bg-gradient-to-br from-[#1E224F] via-[#141833] to-[#0B101B] px-8 py-5 border-b border-white/5 relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] relative group">
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Zap className="w-5 h-5 text-white stroke-[2.5px]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  Gateway Wizard
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest text-blue-400">Stack Deploy</span>
                </h2>
                <p className="text-[#94A3B8] font-medium text-xs">Deploy a production-ready gateway stack instantly</p>
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

        {/* Stepper - Compact & Elegant */}
        <div className="px-8 py-4 bg-[#0B101B]/50 border-b border-white/5 relative shrink-0">
          <div className="flex items-center justify-between relative max-w-xl mx-auto">
            <div className="absolute left-0 top-4 w-full h-[1px] bg-[#1E293B] z-0"></div>
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;
              
              return (
                <div key={step.num} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                    isActive ? "bg-[#2563EB] border-[#3B82F6] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-110" : 
                    isCompleted ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" : 
                    "bg-[#0F172A] border-[#1E293B] text-[#475569]"
                  )}>
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3px]" /> : <Icon className="w-3.5 h-3.5 stroke-[2px]" />}
                  </div>
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-[0.12em] transition-colors duration-300",
                    isActive ? "text-[#38BDF8]" : isCompleted ? "text-emerald-400" : "text-[#475569]"
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area - Optimized Density */}
        <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin scrollbar-thumb-gray-800">
          
          {/* STEP 1: Gateway */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Infrastructure</h3>
                  <p className="text-[#64748B] text-xs font-medium">Configure the entry point for your API traffic.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">
                      IDENTIFIER <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="h-10 w-full bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-lg px-4 text-sm transition-all text-white placeholder:text-gray-700"
                      placeholder="e.g. core-prod-gateway"
                      value={formData.gateway.name}
                      onChange={(e) => updateData('gateway', 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">
                      DESCRIPTION
                    </label>
                    <textarea
                      className="w-full bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-lg px-4 py-2 text-sm transition-all text-white placeholder:text-gray-700 h-20 resize-none"
                      placeholder="Purpose of this gateway..."
                      value={formData.gateway.description}
                      onChange={(e) => updateData('gateway', 'description', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1 block">
                    OPERATIONAL MODE
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'pro', label: 'PRO Mode', tag: 'Clustered', desc: 'High availability multi-node setup.', icon: Server, color: '#8B5CF6' },
                      { id: 'single', label: 'SINGLE Mode', tag: 'Standalone', desc: 'Single-instance performance setup.', icon: Zap, color: '#0EA5E9' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => updateData('gateway', 'mode', mode.id)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 text-left group",
                          formData.gateway.mode === mode.id 
                            ? `border-[${mode.color}] bg-[${mode.color}]/5 text-white shadow-lg` 
                            : "border-[#1E293B] bg-[#050810] text-[#64748B] hover:border-[#334155]"
                        )}
                        style={formData.gateway.mode === mode.id ? { borderColor: mode.color, backgroundColor: `${mode.color}10` } : {}}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                          formData.gateway.mode === mode.id ? "text-white" : "bg-[#1E293B] text-[#475569] group-hover:bg-[#334155]"
                        )} style={formData.gateway.mode === mode.id ? { backgroundColor: mode.color } : {}}>
                          <mode.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{mode.label}</span>
                            <span className="text-[7px] font-black uppercase tracking-widest bg-white/10 px-1 py-0.5 rounded">{mode.tag}</span>
                          </div>
                          <p className="text-[10px] font-medium opacity-60 leading-tight">{mode.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Service */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-400">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Server className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Upstream Service</h3>
                  <p className="text-[#64748B] text-xs font-medium">The backend application processing the traffic.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">
                      SERVICE NAME <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="h-10 w-full bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-lg px-4 text-sm transition-all text-white placeholder:text-gray-700"
                      placeholder="e.g. user-auth-api"
                      value={formData.service.name}
                      onChange={(e) => updateData('service', 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">
                      TARGET URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      className="h-10 w-full bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-lg px-4 text-sm transition-all text-white placeholder:text-gray-700 font-mono"
                      placeholder="https://api.internal.cluster:8080"
                      value={formData.service.targetUrl}
                      onChange={(e) => updateData('service', 'targetUrl', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">
                        PROTOCOL
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['http', 'https', 'grpc'].map((proto) => (
                          <button
                            key={proto}
                            type="button"
                            onClick={() => updateData('service', 'protocol', proto)}
                            className={cn(
                              "h-9 rounded-lg border font-bold text-[10px] uppercase tracking-widest transition-all",
                              formData.service.protocol === proto 
                                ? "bg-[#2563EB]/10 border-[#2563EB] text-[#38BDF8]" 
                                : "bg-[#050810] border-[#1E293B] text-[#475569] hover:border-[#334155]"
                            )}
                          >
                            {proto}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">
                        LOAD BALANCING
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: 'round_robin', label: 'Round Robin' },
                          { id: 'least_request', label: 'Least Request' },
                          { id: 'ring_hash', label: 'Ring Hash' }
                        ].map((policy) => (
                          <button
                            key={policy.id}
                            type="button"
                            onClick={() => updateData('service', 'lb_policy', policy.id)}
                            className={cn(
                              "h-9 px-4 rounded-lg border transition-all text-[11px] font-bold flex items-center justify-between",
                              formData.service.lb_policy === policy.id 
                                ? "bg-[#2563EB]/5 border-[#2563EB]/50 text-white" 
                                : "bg-[#050810] border-[#1E293B] text-[#64748B] hover:border-[#334155]"
                            )}
                          >
                            {policy.label}
                            {formData.service.lb_policy === policy.id && <Check className="w-3 h-3 text-[#38BDF8]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Route */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-400">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <RouteIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Access Route</h3>
                  <p className="text-[#64748B] text-xs font-medium">Map an external path to your service.</p>
                </div>
              </div>

              <div className="max-w-xl mx-auto space-y-6 py-2">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1 block">
                    INCOMING PATH <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-stretch group">
                    <div className="flex items-center px-4 rounded-l-xl border border-r-0 border-[#1E293B] bg-[#0F172A] text-[#38BDF8] text-xs font-mono border-dashed">
                      {formData.gateway.name ? `${formData.gateway.name}.sopo.io` : 'gateway.sopo.io'}
                    </div>
                    <input
                      type="text"
                      className="flex-1 h-12 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-r-xl px-4 text-base transition-all text-white placeholder:text-gray-800 font-mono"
                      placeholder="/v1/users/auth"
                      value={formData.route.path}
                      onChange={(e) => updateData('route', 'path', e.target.value)}
                    />
                  </div>
                  <p className="text-[9px] text-[#475569] font-medium ml-1 mt-1">
                    Your API will be accessible at: <span className="text-[#38BDF8]">https://{formData.gateway.name || 'gateway'}.sopo.io{formData.route.path}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1 block">
                    HTTP METHOD
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['GET', 'POST', 'PUT', 'DELETE'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => updateData('route', 'method', method)}
                        className={cn(
                          "h-12 rounded-xl border transition-all flex items-center justify-center",
                          formData.route.method === method 
                            ? "bg-[#2563EB]/10 border-[#2563EB] text-white" 
                            : "bg-[#050810] border-[#1E293B] text-[#475569] hover:border-[#334155]"
                        )}
                      >
                        <span className={cn(
                          "font-black text-xs",
                          formData.route.method === method ? "text-[#38BDF8]" : "text-[#475569]"
                        )}>{method}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Plugins & Review */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-400">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Plug className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Finalize</h3>
                  <p className="text-[#64748B] text-xs font-medium">Add security and review deployment.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={cn(
                  "border rounded-2xl p-6 transition-all duration-500 relative overflow-hidden group", 
                  formData.plugin.name !== 'none' 
                    ? "bg-[#2563EB]/5 border-[#2563EB]/30 shadow-md" 
                    : "bg-[#050810] border-[#1E293B]"
                )}>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-500",
                        formData.plugin.name !== 'none' ? "bg-[#2563EB] text-white" : "bg-[#1E293B] text-[#475569]"
                      )}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-white text-sm">Security Module</h4>
                    </div>

                    <div className="space-y-3">
                      <select
                        className="w-full h-10 bg-[#0B101B] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-lg px-3 text-xs text-white appearance-none cursor-pointer"
                        value={formData.plugin.name}
                        onChange={(e) => updateData('plugin', 'name', e.target.value)}
                      >
                        <option value="none">No Plugin (Skip)</option>
                        <option value="rate-limiting">Rate Limiting</option>
                        <option value="key-auth">API Key Auth</option>
                        <option value="cors">CORS Policy</option>
                      </select>

                      {formData.plugin.name !== 'none' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-[#0B101B]/50 p-4 rounded-xl border border-white/5">
                          <label className="text-[8px] font-bold text-[#64748B] uppercase tracking-[0.1em] mb-2 block">
                            CONFIGURATION
                          </label>
                          <input
                            type={formData.plugin.name === 'rate-limiting' ? 'number' : 'text'}
                            className="w-full h-9 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-lg px-3 text-sm text-white"
                            placeholder={formData.plugin.name === 'key-auth' ? 'apikey, x-api-key' : ''}
                            value={formData.plugin.name === 'rate-limiting' ? formData.plugin.rateLimitingLimit : (formData.plugin.name === 'key-auth' ? formData.plugin.keyAuthNames : formData.plugin.corsOrigins)}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (formData.plugin.name === 'rate-limiting') updateData('plugin', 'rateLimitingLimit', parseInt(val) || 0);
                              else if (formData.plugin.name === 'key-auth') updateData('plugin', 'keyAuthNames', val);
                              else updateData('plugin', 'corsOrigins', val);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-[#050810] border border-[#1E293B] rounded-2xl p-6 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64748B] border-b border-white/5 pb-2">Review Summary</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#475569] font-bold uppercase">Gateway</span>
                      <span className="text-gray-100 font-bold">{formData.gateway.name} ({formData.gateway.mode})</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#475569] font-bold uppercase">Service</span>
                      <span className="text-gray-100 font-bold truncate max-w-[120px]">{formData.service.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#475569] font-bold uppercase">Path</span>
                      <span className="text-emerald-400 font-bold">{formData.route.path}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                      <span className="text-[#475569] font-bold uppercase">Security</span>
                      <span className="text-orange-400 font-bold uppercase">{formData.plugin.name !== 'none' ? formData.plugin.name.replace('-', ' ') : 'None'}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions - Optimized Height */}
        <div className="px-8 py-5 border-t border-white/5 bg-[#0B101B] flex items-center justify-between shrink-0">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#64748B] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 group"
          >
            {currentStep > 1 && (
              <>
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                Back
              </>
            )}
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-md active:scale-[0.98] group"
            >
              Continue 
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform stroke-[3px]" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin stroke-[3px]" />
                  Deploying...
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-white stroke-none" />
                  Launch Stack
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
