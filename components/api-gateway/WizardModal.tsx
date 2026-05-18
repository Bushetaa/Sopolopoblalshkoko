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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-50">Create Gateway Wizard</h2>
              <p className="text-xs text-gray-400">Deploy a full gateway stack in seconds</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-8 py-5 border-b border-gray-800 bg-gray-950/30">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-800 z-0"></div>
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;
              
              return (
                <div key={step.num} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                    isActive ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : 
                    isCompleted ? "bg-emerald-500 border-emerald-400 text-white" : 
                    "bg-gray-900 border-gray-700 text-gray-500"
                  )}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={cn(
                    "text-xs font-medium absolute -bottom-6 whitespace-nowrap",
                    isActive ? "text-blue-400" : isCompleted ? "text-emerald-400" : "text-gray-500"
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-800">
          
          {/* STEP 1: Gateway */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-1">Gateway Details</h3>
                <p className="text-sm text-gray-400">The main entry point for your API traffic.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Gateway Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. production-gateway"
                    value={formData.gateway.name}
                    onChange={(e) => updateData('gateway', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                  <textarea
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500 h-20 resize-none"
                    placeholder="Brief description of this gateway..."
                    value={formData.gateway.description}
                    onChange={(e) => updateData('gateway', 'description', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Gateway Mode</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => updateData('gateway', 'mode', 'pro')}
                      className={cn("flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all", formData.gateway.mode === 'pro' ? "border-purple-500 bg-purple-500/10 text-purple-400" : "border-gray-800 bg-gray-950 text-gray-500 hover:border-gray-700")}
                    >
                      <Server className="w-5 h-5 mb-1" />
                      <span className="font-bold text-sm">PRO Mode</span>
                      <span className="text-[10px] opacity-70 mt-0.5 text-center px-2">Multi-node clustered setup</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateData('gateway', 'mode', 'single')}
                      className={cn("flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all", formData.gateway.mode === 'single' ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-gray-800 bg-gray-950 text-gray-500 hover:border-gray-700")}
                    >
                      <Zap className="w-5 h-5 mb-1" />
                      <span className="font-bold text-sm">SINGLE Mode</span>
                      <span className="text-[10px] opacity-70 mt-0.5 text-center px-2">Standalone fast instance</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Service */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-1">Core Service</h3>
                <p className="text-sm text-gray-400">Define the upstream service that will handle the requests.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Service Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. user-auth-service"
                    value={formData.service.name}
                    onChange={(e) => updateData('service', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Target URL <span className="text-red-400">*</span></label>
                  <input
                    type="url"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. https://api.backend.internal:8080"
                    value={formData.service.targetUrl}
                    onChange={(e) => updateData('service', 'targetUrl', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Protocol</label>
                    <select
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500"
                      value={formData.service.protocol}
                      onChange={(e) => updateData('service', 'protocol', e.target.value)}
                    >
                      <option value="http">HTTP</option>
                      <option value="https">HTTPS</option>
                      <option value="grpc">gRPC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Load Balancing</label>
                    <select
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500"
                      value={formData.service.lb_policy}
                      onChange={(e) => updateData('service', 'lb_policy', e.target.value)}
                    >
                      <option value="round_robin">Round Robin</option>
                      <option value="least_request">Least Request</option>
                      <option value="ring_hash">Ring Hash</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Route */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-1">Default Route</h3>
                <p className="text-sm text-gray-400">Map an incoming path to your new service.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Route Path <span className="text-red-400">*</span></label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-800 bg-gray-900 text-gray-400 text-sm">
                      {window.location.hostname}
                    </span>
                    <input
                      type="text"
                      className="flex-1 bg-gray-950 border border-gray-800 rounded-r-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500"
                      placeholder="/api/v1/users"
                      value={formData.route.path}
                      onChange={(e) => updateData('route', 'path', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">HTTP Method</label>
                  <select
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500"
                    value={formData.route.method}
                    onChange={(e) => updateData('route', 'method', e.target.value)}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Plugins & Review */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-1">Enhance & Review</h3>
                <p className="text-sm text-gray-400">Add optional plugins and review your configuration.</p>
              </div>
              
              <div className={cn("border rounded-xl p-4 transition-colors", formData.plugin.name !== 'none' ? "bg-blue-500/5 border-blue-500/30" : "bg-gray-900 border-gray-800")}>
                <div className="flex items-start gap-4">
                  <div className={cn("p-2 rounded-lg shrink-0 transition-colors", formData.plugin.name !== 'none' ? "bg-blue-500/20 text-blue-400" : "bg-gray-800 text-gray-500")}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-200 mb-1">Select a Plugin (Optional)</h4>
                    <p className="text-xs text-gray-400 mb-4">Enhance your gateway with security or traffic control right out of the box.</p>
                    
                    <div className="space-y-4">
                      <div>
                        <select
                          className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-blue-500"
                          value={formData.plugin.name}
                          onChange={(e) => updateData('plugin', 'name', e.target.value)}
                        >
                          <option value="none">No Plugin (Skip this step)</option>
                          <option value="rate-limiting">Rate Limiting (Traffic Control)</option>
                          <option value="key-auth">API Key Authentication</option>
                          <option value="cors">CORS (Cross-Origin)</option>
                        </select>
                      </div>

                      {formData.plugin.name === 'rate-limiting' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                          <label className="block text-xs font-medium text-gray-400 mb-1.5">Requests Per Minute Limit</label>
                          <input
                            type="number"
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-blue-500"
                            value={formData.plugin.rateLimitingLimit}
                            onChange={(e) => updateData('plugin', 'rateLimitingLimit', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      )}

                      {formData.plugin.name === 'key-auth' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                          <label className="block text-xs font-medium text-gray-400 mb-1.5">Key Names (Comma separated)</label>
                          <input
                            type="text"
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-blue-500"
                            placeholder="e.g. apikey, x-api-key"
                            value={formData.plugin.keyAuthNames}
                            onChange={(e) => updateData('plugin', 'keyAuthNames', e.target.value)}
                          />
                        </div>
                      )}

                      {formData.plugin.name === 'cors' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                          <label className="block text-xs font-medium text-gray-400 mb-1.5">Allowed Origins (Comma separated, * for all)</label>
                          <input
                            type="text"
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-blue-500"
                            placeholder="e.g. https://myapp.com, *"
                            value={formData.plugin.corsOrigins}
                            onChange={(e) => updateData('plugin', 'corsOrigins', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-medium text-gray-300 border-b border-gray-800 pb-2">Deployment Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs">Gateway</span>
                    <span className="text-gray-200 font-medium">{formData.gateway.name} <span className="text-[10px] uppercase text-gray-500 ml-1">({formData.gateway.mode})</span></span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Service Target</span>
                    <span className="text-gray-200 font-medium truncate block" title={formData.service.targetUrl}>{formData.service.targetUrl}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Route</span>
                    <span className="text-gray-200 font-medium">{formData.route.method} {formData.route.path}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Plugin</span>
                    <span className="text-gray-200 font-medium">
                      {formData.plugin.name !== 'none' ? formData.plugin.name : 'None'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/50 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentStep > 1 ? <span className="flex items-center gap-1"><ChevronLeft className="w-4 h-4"/> Back</span> : ''}
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deploying Stack...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Deploy Gateway Stack
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
