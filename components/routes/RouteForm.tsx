
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Route as RouteIcon, Info, Settings2, CheckCircle2, Server, Network, Zap, Loader2 } from "lucide-react";
import { GatewayCollection, Service } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const routeSchema = z.object({
  method: z.string(),
  path: z.string().startsWith("/", "Path must start with /"),
  protocol: z.string().optional(),
  timeout: z.string().optional(),
  collection_id: z.string().optional(),
  is_aggregate: z.boolean().default(false),
  
  service_id: z.string().optional(),
  target_path: z.string().optional(),
  websocket: z.boolean().default(false),
  retry_max_attempts: z.coerce.number().min(0).optional(),
  retry_on_status: z.string().optional(),
  
  aggregate_merge_strategy: z.string().optional(),
  aggregate_timeout: z.string().optional(),
  allow_partial_failure: z.boolean().default(false),
});

export type RouteFormValues = z.infer<typeof routeSchema>;

interface RouteFormProps {
  initialValues?: Partial<RouteFormValues>;
  gatewayMode: "single" | "pro";
  gatewayName: string;
  userSlug?: string;
  collections: GatewayCollection[];
  services: Service[];
  onSubmit: (data: RouteFormValues) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
}

export function RouteForm({ 
  initialValues,
  gatewayMode,
  gatewayName,
  userSlug = "my-slug",
  collections,
  services,
  onSubmit, 
  onCancel,
  onDelete
}: RouteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const isEditMode = !!initialValues?.path;

  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      method: initialValues?.method || "GET",
      path: initialValues?.path || "",
      protocol: initialValues?.protocol || "http",
      timeout: initialValues?.timeout || "30s",
      collection_id: initialValues?.collection_id || "none",
      is_aggregate: initialValues?.is_aggregate || false,
      
      service_id: initialValues?.service_id || "",
      target_path: initialValues?.target_path || "",
      websocket: initialValues?.websocket || false,
      retry_max_attempts: initialValues?.retry_max_attempts || 0,
      retry_on_status: initialValues?.retry_on_status || "",
      
      aggregate_merge_strategy: initialValues?.aggregate_merge_strategy || "merge_object",
      aggregate_timeout: initialValues?.aggregate_timeout || "30s",
      allow_partial_failure: initialValues?.allow_partial_failure || false,
    },
  });

  const isAggregate = form.watch("is_aggregate");
  const protocol = form.watch("protocol");
  const path = form.watch("path");
  const serviceId = form.watch("service_id");
  
  const selectedService = services.find(s => s.id === serviceId);
  const serviceName = selectedService?.name || "{service}";

  if (protocol === "grpc" && form.getValues("method") !== "POST") {
    form.setValue("method", "POST");
  }

  const handleSubmit = async (data: RouteFormValues) => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        ...data,
        collection_id: data.collection_id === "none" ? undefined : data.collection_id
      };
      await onSubmit(submissionData as RouteFormValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        
        {/* URL Preview - Premium Style */}
        <div className="bg-[#050810] border border-white/5 rounded-3xl p-5 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-inner group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
          <div className="flex items-center gap-2.5 text-[#64748B] font-black uppercase tracking-[0.2em] text-[10px]">
            <Network className="w-3.5 h-3.5 text-blue-400" />
            Mapped Topology
          </div>
          <div className="flex items-center gap-1.5 bg-[#0F172A] px-4 py-2.5 rounded-2xl border border-white/5 group-hover:border-blue-500/20 transition-all shadow-xl">
            <span className="text-blue-400 font-black tracking-tight">/{userSlug}</span>
            {gatewayMode === "pro" && (
              <>
                <span className="text-[#64748B] font-black opacity-30">/</span>
                <span className="text-blue-400 font-black tracking-tight">{gatewayName.toLowerCase().replace(/\s+/g, "-")}</span>
                {!isAggregate && (
                  <>
                    <span className="text-[#64748B] font-black opacity-30">/</span>
                    <span className="text-emerald-400 font-black tracking-tight">{serviceName}</span>
                  </>
                )}
              </>
            )}
            <span className="text-[#64748B] font-black opacity-30">/</span>
            <span className="text-white font-black animate-pulse shadow-blue-500/10 tracking-tight">{path || "..."}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Routing Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#64748B] font-black text-[10px] uppercase tracking-[0.2em] ml-1">
              <div className="w-5 h-px bg-white/10" />
              <Info className="w-3.5 h-3.5" />
              Routing Identity
            </div>

            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Incoming Gateway Path <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <RouteIcon className="w-4 h-4 text-[#475569] group-focus-within:text-[#2563EB] transition-colors" />
                      </div>
                      <Input 
                        placeholder="e.g. /v1/user-profile" 
                        {...field} 
                        className="h-12 pl-11 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl text-sm transition-all text-white placeholder:text-gray-700 font-mono"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-[10px] font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">HTTP Operation Method</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-2.5">
                      {["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"].map(m => (
                        <button
                          key={m}
                          type="button"
                          disabled={protocol === "grpc"}
                          onClick={() => field.onChange(m)}
                          className={cn(
                            "h-11 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all relative overflow-hidden",
                            field.value === m 
                              ? "bg-[#2563EB]/10 border-[#2563EB] text-[#38BDF8] shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                              : "bg-[#050810] border-[#1E293B] text-[#475569] hover:border-[#475569] disabled:opacity-20"
                          )}
                        >
                          {m}
                          {field.value === m && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-blue-500 rounded-bl-lg shadow-blue-500/50" />}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-[10px] font-medium" />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column: Target Destination */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#64748B] font-black text-[10px] uppercase tracking-[0.2em] ml-1">
              <div className="w-5 h-px bg-white/10" />
              <Network className="w-3.5 h-3.5" />
              Target Destination
            </div>

            <FormField
              control={form.control}
              name="service_id"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Upstream Target Instance</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl text-sm transition-all text-white font-medium">
                        <SelectValue placeholder="Select target service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0B101B] border-[#1E293B] rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-h-64 animate-in zoom-in-95 duration-200">
                      {services.length === 0 ? (
                        <div className="p-6 text-[10px] text-[#64748B] text-center font-black uppercase tracking-widest leading-relaxed">
                          No services detected in <br/> this gateway cluster
                        </div>
                      ) : (
                        services.map(s => (
                          <SelectItem key={s.id} value={s.id!} className="rounded-xl py-3 px-4 focus:bg-[#2563EB]/10 focus:text-white group transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Server className="w-4 h-4 stroke-[2.5px]" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black text-[11px] uppercase tracking-wider">{s.name}</span>
                                <span className="text-[9px] text-[#64748B] font-mono group-hover:text-blue-300 transition-colors uppercase tracking-widest mt-0.5">{s.protocol} ENGINE</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400 text-[10px] font-medium" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4 pt-1">
              <FormField
                control={form.control}
                name="is_aggregate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-[1.25rem] border border-[#1E293B] p-5 bg-[#050810]/50 group hover:border-[#2563EB]/30 transition-all duration-300 shadow-inner">
                    <div className="space-y-1">
                      <FormLabel className="text-[11px] font-black uppercase tracking-widest text-white flex items-center gap-2.5">
                        Aggregation Pipeline
                        {field.value && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.5)]" />}
                      </FormLabel>
                      <p className="text-[9px] text-[#64748B] font-bold uppercase tracking-widest opacity-60">Merge multiple downstream clusters</p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#2563EB] scale-90"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Advanced Settings Collapsible - Compact Style */}
        <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#050810]/30 transition-all">
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                isAdvancedOpen ? "bg-blue-500/10 text-blue-400" : "bg-gray-800/50 text-gray-500"
              )}>
                <Settings2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-gray-200 block">Advanced Parameters</span>
                <span className="text-[9px] text-[#64748B] font-medium">Timeouts, retries and protocol specifics</span>
              </div>
            </div>
            {isAdvancedOpen ? <ChevronUp className="w-4 h-4 text-[#64748B]" /> : <ChevronDown className="w-4 h-4 text-[#64748B] group-hover:text-white" />}
          </button>
          
          <div className={cn("px-6 overflow-hidden transition-all duration-300", isAdvancedOpen ? "pb-6 max-h-[500px]" : "max-h-0")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="protocol"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em]">Protocol</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 bg-[#0B101B] border-[#1E293B] focus:border-[#2563EB] rounded-lg text-xs text-white">
                            <SelectValue placeholder="Protocol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#0B101B] border-[#1E293B] rounded-xl text-white">
                          <SelectItem value="http" className="text-xs focus:bg-[#2563EB]/10">HTTP/REST</SelectItem>
                          <SelectItem value="grpc" className="text-xs focus:bg-[#2563EB]/10">gRPC/Proto</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeout"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em]">Timeout</FormLabel>
                      <FormControl>
                        <Input placeholder="30s" {...field} className="h-10 bg-[#0B101B] border-[#1E293B] focus:border-[#2563EB] rounded-lg text-xs text-white" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="retry_max_attempts"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em]">Retries</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-10 bg-[#0B101B] border-[#1E293B] focus:border-[#2563EB] rounded-lg text-xs text-white" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="websocket"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0 mt-4 px-3 py-2 bg-[#0B101B] border border-white/5 rounded-xl">
                      <FormLabel className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em]">Websocket</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} className="scale-75 data-[state=checked]:bg-blue-500" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-white/5">
          {isEditMode && onDelete && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onDelete}
              className="w-full sm:w-auto sm:mr-auto h-11 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-red-500/20 transition-all"
            >
              Terminate Route
            </Button>
          )}
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="w-full sm:w-auto h-11 px-6 border-[#1E293B] hover:bg-[#1E293B] text-[#64748B] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className={cn(
              "w-full sm:w-auto h-11 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-md active:scale-95 flex items-center gap-2",
              isEditMode 
                ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-900/20" 
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin stroke-[3px]" />
                Deploying...
              </>
            ) : (
              <>
                {isEditMode ? <CheckCircle2 className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                {isEditMode ? "Commit Changes" : "Deploy Route"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

