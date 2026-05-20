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
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Activity, Server, Info, Settings2, CheckCircle2, ShieldCheck, Clock, RefreshCcw, Zap, Loader2 } from "lucide-react";
import { GatewayCollection } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  protocol: z.enum(["http", "grpc"]),
  lb_policy: z.enum(["round_robin", "weighted", "latency", "least_connections", "random"]),
  collection_id: z.string().optional(),
  health_check_path: z.string().optional().refine(val => !val || val.startsWith('/'), {
    message: "Path must start with /"
  }),
  health_check_interval: z.string().optional(),
  health_check_timeout: z.string().optional(),
  health_check_fail_threshold: z.coerce.number().min(0).optional(),
  health_check_pass_threshold: z.coerce.number().min(0).optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  initialValues?: Partial<ServiceFormValues>;
  gatewayMode: "single" | "pro";
  collections: GatewayCollection[];
  onSubmit: (data: ServiceFormValues) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
}

export function ServiceForm({ 
  initialValues,
  gatewayMode,
  collections,
  onSubmit, 
  onCancel,
  onDelete
}: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHealthCheckOpen, setIsHealthCheckOpen] = useState(false);
  const isEditMode = !!initialValues?.name;

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: initialValues?.name || "",
      protocol: initialValues?.protocol || "http",
      lb_policy: initialValues?.lb_policy || "round_robin",
      collection_id: initialValues?.collection_id || "",
      health_check_path: initialValues?.health_check_path || "",
      health_check_interval: initialValues?.health_check_interval || "",
      health_check_timeout: initialValues?.health_check_timeout || "",
      health_check_fail_threshold: initialValues?.health_check_fail_threshold || 0,
      health_check_pass_threshold: initialValues?.health_check_pass_threshold || 0,
    },
  });

  const handleSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      // Clean up collection_id if it's "none"
      const submissionData = {
        ...data,
        collection_id: data.collection_id === "none" ? undefined : data.collection_id
      };
      await onSubmit(submissionData as ServiceFormValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Basic Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#64748B] font-black text-[10px] uppercase tracking-[0.2em] ml-1">
              <div className="w-5 h-px bg-white/10" />
              <Info className="w-3.5 h-3.5" />
              Service Identity
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Service Identifier <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Server className="w-4 h-4 text-[#475569] group-focus-within:text-[#2563EB] transition-colors" />
                      </div>
                      <Input 
                        placeholder="e.g. core-auth-service" 
                        {...field} 
                        className="h-12 pl-11 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl text-sm transition-all text-white placeholder:text-gray-700 font-medium"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-[10px] font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="protocol"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Communication Protocol</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'http', label: 'REST / HTTP', icon: Activity, color: '#3B82F6' },
                        { id: 'grpc', label: 'gRPC / Protobuf', icon: Zap, color: '#8B5CF6' }
                      ].map((proto) => (
                        <button
                          key={proto.id}
                          type="button"
                          onClick={() => field.onChange(proto.id)}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden group",
                            field.value === proto.id 
                              ? "border-[#2563EB] bg-[#2563EB]/5 text-white shadow-[0_0_25px_rgba(37,99,235,0.15)]" 
                              : "border-[#1E293B] bg-[#050810] text-[#64748B] hover:border-[#475569]"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                            field.value === proto.id ? "bg-[#2563EB] text-white shadow-lg" : "bg-[#1E293B] text-[#475569]"
                          )}>
                            <proto.icon className="w-5 h-5 stroke-[2.5px]" />
                          </div>
                          <div className="flex flex-col">
                            <span className={cn("font-black text-[11px] uppercase tracking-wider", field.value === proto.id ? "text-white" : "text-[#94A3B8]")}>{proto.label}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-40 mt-0.5">{proto.id} Engine</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-[10px] font-medium" />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column: Traffic Management */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#64748B] font-black text-[10px] uppercase tracking-[0.2em] ml-1">
              <div className="w-5 h-px bg-white/10" />
              <Settings2 className="w-3.5 h-3.5" />
              Traffic Distribution
            </div>

            <FormField
              control={form.control}
              name="lb_policy"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Load Balancing Strategy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl text-sm transition-all text-white font-medium">
                        <SelectValue placeholder="Select a policy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0B101B] border-[#1E293B] rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
                      {[
                        { id: 'round_robin', label: 'Round Robin', desc: 'Equal packet distribution' },
                        { id: 'weighted', label: 'Weighted', desc: 'Prioritize by instance capacity' },
                        { id: 'latency', label: 'Lowest Latency', desc: 'Route to fastest respondent' },
                        { id: 'least_connections', label: 'Least Active', desc: 'Balance by connection count' },
                        { id: 'random', label: 'Randomized', desc: 'Stochastic traffic spread' }
                      ].map(policy => (
                        <SelectItem key={policy.id} value={policy.id} className="rounded-xl py-3 px-4 focus:bg-[#2563EB]/10 focus:text-white group transition-all">
                          <div className="flex flex-col">
                            <span className="font-black text-xs uppercase tracking-wider">{policy.label}</span>
                            <span className="text-[9px] text-[#64748B] group-focus:text-blue-300 font-medium mt-0.5">{policy.desc}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400 text-[10px] font-medium" />
                </FormItem>
              )}
            />

            {gatewayMode === "pro" && (
              <FormField
                control={form.control}
                name="collection_id"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Deployment Context</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl text-sm transition-all text-white font-medium">
                          <SelectValue placeholder="Standalone Service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0B101B] border-[#1E293B] rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                        <SelectItem value="none" className="rounded-xl py-3 px-4 italic text-[#64748B] focus:bg-white/5 font-medium">None (Global Scope)</SelectItem>
                        {collections.map(c => (
                          <SelectItem key={c.id} value={c.id!} className="rounded-xl py-3 px-4 focus:bg-[#2563EB]/10">
                            <span className="font-black text-xs uppercase tracking-wider">{c.name} Group</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 text-[10px] font-medium" />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* Health Check Collapsible - Compact Style */}
        <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#050810]/30 transition-all">
          <button
            type="button"
            onClick={() => setIsHealthCheckOpen(!isHealthCheckOpen)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                isHealthCheckOpen ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-800/50 text-gray-500"
              )}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-gray-200 block">Health Check Monitor</span>
                <span className="text-[9px] text-[#64748B] font-medium">Automatic target verification settings</span>
              </div>
            </div>
            {isHealthCheckOpen ? <ChevronUp className="w-4 h-4 text-[#64748B]" /> : <ChevronDown className="w-4 h-4 text-[#64748B] group-hover:text-white" />}
          </button>
          
          <div className={cn("px-6 overflow-hidden transition-all duration-300", isHealthCheckOpen ? "pb-6 max-h-[500px]" : "max-h-0")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <FormField
                control={form.control}
                name="health_check_path"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em]">Monitor Path</FormLabel>
                    <FormControl>
                      <Input placeholder="/healthz" {...field} className="h-10 bg-[#0B101B] border-[#1E293B] focus:border-[#2563EB] rounded-lg text-xs font-mono text-white" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="health_check_interval"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] flex items-center gap-1"><RefreshCcw className="w-2.5 h-2.5" /> Interval</FormLabel>
                      <FormControl>
                        <Input placeholder="30s" {...field} className="h-10 bg-[#0B101B] border-[#1E293B] focus:border-[#2563EB] rounded-lg text-xs text-white" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="health_check_timeout"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.1em] flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> Timeout</FormLabel>
                      <FormControl>
                        <Input placeholder="5s" {...field} className="h-10 bg-[#0B101B] border-[#1E293B] focus:border-[#2563EB] rounded-lg text-xs text-white" />
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
              Terminate Service
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
                {isEditMode ? "Commit Changes" : "Deploy Service"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
