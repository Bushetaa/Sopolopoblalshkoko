
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-10">
        
        {/* Section 1: Routing Context & Topology */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-blue-400/60 font-black text-[10px] uppercase tracking-[0.3em] ml-1">
            <div className="w-4 h-[2px] bg-blue-500/30" />
            Routing Context & Topology
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Path Configuration */}
            <div className="lg:col-span-5 space-y-6">
              <FormField
                control={form.control}
                name="path"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Gateway Path <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <RouteIcon className="w-4 h-4 text-[#475569] group-focus-within:text-[#2563EB] transition-colors" />
                        </div>
                        <Input 
                          placeholder="e.g. /v1/user-profile" 
                          {...field} 
                          className="h-12 pl-11 bg-[#050810]/60 border-[#1E293B] focus:border-[#2563EB]/50 focus:ring-0 rounded-xl text-sm transition-all text-white placeholder:text-gray-800 font-mono shadow-inner"
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
                    <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">HTTP Operation</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-2 p-1 bg-[#050810]/60 border border-[#1E293B] rounded-xl">
                        {["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"].map(m => (
                          <button
                            key={m}
                            type="button"
                            disabled={protocol === "grpc"}
                            onClick={() => field.onChange(m)}
                            className={cn(
                              "h-9 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all relative overflow-hidden",
                              field.value === m 
                                ? "bg-[#2563EB] text-white shadow-lg shadow-blue-500/20" 
                                : "text-[#475569] hover:text-[#94A3B8]"
                            )}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Right: Topology Preview */}
            <div className="lg:col-span-7 flex flex-col justify-end pb-1">
              <div className="bg-[#050810]/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden group min-h-[140px] flex flex-col justify-center">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/30" />
                <div className="flex items-center gap-2.5 text-[#475569] font-black uppercase tracking-[0.2em] text-[9px] mb-4">
                  <Network className="w-3.5 h-3.5 text-blue-500/50" />
                  Mapped Topology Visualization
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-[#0F172A] px-3 py-2 rounded-xl border border-white/5 shadow-xl">
                    <span className="text-blue-400 font-black tracking-tight text-[11px]">/{userSlug}</span>
                  </div>
                  <div className="w-4 h-px bg-white/10" />
                  <div className="flex items-center gap-1.5 bg-[#0F172A] px-3 py-2 rounded-xl border border-white/5 shadow-xl">
                    <span className="text-blue-400 font-black tracking-tight text-[11px]">{gatewayName.toLowerCase().replace(/\s+/g, "-")}</span>
                  </div>
                  {!isAggregate && (
                    <>
                      <div className="w-4 h-px bg-white/10" />
                      <div className="flex items-center gap-1.5 bg-emerald-500/5 px-3 py-2 rounded-xl border border-emerald-500/10 shadow-xl">
                        <span className="text-emerald-400 font-black tracking-tight text-[11px]">{serviceName}</span>
                      </div>
                    </>
                  )}
                  <div className="w-4 h-px bg-white/10" />
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/10 shadow-2xl">
                    <span className="text-white font-black animate-pulse text-[11px] tracking-tight">{path || "..."}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Upstream Intelligence */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-purple-400/60 font-black text-[10px] uppercase tracking-[0.3em] ml-1">
            <div className="w-4 h-[2px] bg-purple-500/30" />
            Upstream Intelligence
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="service_id"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Target Cluster</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-[#050810]/60 border-[#1E293B] focus:border-[#2563EB]/50 focus:ring-0 rounded-xl text-sm transition-all text-white font-medium shadow-inner">
                        <SelectValue placeholder="Select target service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0B101B] border-[#1E293B] rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-h-64">
                      {services.length === 0 ? (
                        <div className="p-6 text-[10px] text-[#64748B] text-center font-black uppercase tracking-widest">No services available</div>
                      ) : (
                        services.map(s => (
                          <SelectItem key={s.id} value={s.id!} className="rounded-xl py-3 px-4 focus:bg-[#2563EB]/10">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Server className="w-3.5 h-3.5 text-blue-400 stroke-[2.5px]" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black text-[10px] uppercase tracking-wider text-white">{s.name}</span>
                                <span className="text-[8px] text-[#475569] font-mono uppercase tracking-widest mt-0.5">{s.protocol} ENGINE</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="flex items-center gap-6 p-5 bg-[#050810]/40 border border-[#1E293B] rounded-xl">
              <div className="space-y-1 flex-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-white">Aggregation Pipeline</label>
                <p className="text-[9px] text-[#475569] font-bold uppercase tracking-widest leading-tight">Merge multiple downstream results into one</p>
              </div>
              <FormField
                control={form.control}
                name="is_aggregate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Advanced Execution Parameters */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-emerald-400/60 font-black text-[10px] uppercase tracking-[0.3em] ml-1">
            <div className="w-4 h-[2px] bg-emerald-500/30" />
            Execution Parameters
          </div>
          
          <div className="bg-[#050810]/30 border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="protocol"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Protocol Override</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-[#0B101B] border-[#1E293B] focus:border-[#2563EB]/50 rounded-xl text-xs text-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0B101B] border-[#1E293B] rounded-xl">
                        <SelectItem value="http" className="text-xs">HTTP/REST</SelectItem>
                        <SelectItem value="grpc" className="text-xs">gRPC/Proto</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeout"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Execution Timeout</FormLabel>
                    <FormControl>
                      <Input placeholder="30s" {...field} className="h-11 bg-[#0B101B] border-[#1E293B] focus:border-[#2563EB]/50 rounded-xl text-xs text-white text-center font-black" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between p-3 bg-[#0B101B] border border-white/5 rounded-xl h-11 self-end">
                <label className="text-[9px] font-black text-[#475569] uppercase tracking-[0.1em]">Websocket</label>
                <FormField
                  control={form.control}
                  name="websocket"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          className="scale-75 data-[state=checked]:bg-blue-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-8 border-t border-white/5">
          {isEditMode && onDelete && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onDelete}
              className="w-full sm:w-auto sm:mr-auto h-11 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-red-500/20 transition-all shadow-lg shadow-red-500/10"
            >
              Terminate Route
            </Button>
          )}
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="w-full sm:w-auto h-11 px-6 border-[#1E293B] bg-[#050810]/40 hover:bg-[#1E293B] text-[#475569] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className={cn(
              "w-full sm:w-auto h-11 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-md active:scale-95 flex items-center gap-2.5",
              "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/25"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin stroke-[3px]" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Commit Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

