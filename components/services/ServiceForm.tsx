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
import { ChevronDown, ChevronUp, Activity, Server, Info, Settings2, CheckCircle2, ShieldCheck, Clock, RefreshCcw } from "lucide-react";
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Basic Info */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em]">
              <Info className="w-3.5 h-3.5" />
              Service Identity
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-bold text-gray-300 ml-1">Service Identifier</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Server className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                      <Input 
                        placeholder="e.g. users-service" 
                        {...field} 
                        className="h-14 pl-12 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="protocol"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-bold text-gray-300 ml-1">Communication Protocol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-14 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all">
                        <SelectValue placeholder="Select a protocol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-950 border-gray-800 rounded-2xl p-2 shadow-2xl">
                      <SelectItem value="http" className="rounded-xl py-3 focus:bg-blue-500/10 focus:text-blue-400">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                            <span className="text-[10px] font-black text-blue-400">HTTP</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold">REST / HTTP</span>
                            <span className="text-[10px] text-gray-500">Standard web traffic</span>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="grpc" className="rounded-xl py-3 focus:bg-purple-500/10 focus:text-purple-400 mt-1">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                            <span className="text-[10px] font-black text-purple-400">gRPC</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold">gRPC Protocol</span>
                            <span className="text-[10px] text-gray-500">High-performance RPC</span>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400 font-medium" />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column: Traffic Management */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em]">
              <Settings2 className="w-3.5 h-3.5" />
              Traffic Distribution
            </div>

            <FormField
              control={form.control}
              name="lb_policy"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-bold text-gray-300 ml-1">Load Balancing Strategy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-14 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all">
                        <SelectValue placeholder="Select a policy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-950 border-gray-800 rounded-2xl p-2 shadow-2xl">
                      <SelectItem value="round_robin" className="rounded-xl py-2 focus:bg-blue-500/10">Round Robin</SelectItem>
                      <SelectItem value="weighted" className="rounded-xl py-2 focus:bg-blue-500/10">Weighted Distribution</SelectItem>
                      <SelectItem value="latency" className="rounded-xl py-2 focus:bg-blue-500/10">Latency Optimized</SelectItem>
                      <SelectItem value="least_connections" className="rounded-xl py-2 focus:bg-blue-500/10">Least Connections</SelectItem>
                      <SelectItem value="random" className="rounded-xl py-2 focus:bg-blue-500/10">Random Selection</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400 font-medium" />
                </FormItem>
              )}
            />

            {gatewayMode === "pro" && (
              <FormField
                control={form.control}
                name="collection_id"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-gray-300 ml-1">Parent Collection (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-14 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all">
                          <SelectValue placeholder="Select a collection" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-950 border-gray-800 rounded-2xl p-2 shadow-2xl">
                        <SelectItem value="none" className="rounded-xl py-2 italic text-gray-500">None (Standalone Service)</SelectItem>
                        {collections.map(c => (
                          <SelectItem key={c.id} value={c.id!} className="rounded-xl py-2">
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 font-medium" />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* Health Check Section */}
        <Collapsible
          open={isHealthCheckOpen}
          onOpenChange={setIsHealthCheckOpen}
          className="w-full border border-gray-800/60 rounded-[2rem] bg-gray-950/40 backdrop-blur-sm overflow-hidden group hover:border-emerald-500/20 transition-all duration-500"
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-7 cursor-pointer hover:bg-emerald-500/[0.02] transition-colors group">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                  isHealthCheckOpen ? "bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "bg-gray-900 border border-gray-800"
                )}>
                  <Activity className={cn("w-6 h-6 transition-colors duration-500", isHealthCheckOpen ? "text-emerald-400" : "text-gray-500")} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-200 group-hover:text-emerald-400 transition-colors">Advanced Health Monitoring</span>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">Self-healing infrastructure parameters</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-900/50 border border-gray-800 flex items-center justify-center">
                {isHealthCheckOpen ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-8 pb-8 pt-2 border-t border-gray-800/40 space-y-8 animate-in slide-in-from-top-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="health_check_path"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Verification Path</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/60" />
                        <Input 
                          placeholder="e.g. /health" 
                          {...field} 
                          className="h-12 pl-11 bg-gray-900/60 border-gray-800 focus:border-emerald-500/50 rounded-xl text-sm transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="health_check_interval"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Check Interval</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/60" />
                        <Input 
                          placeholder="e.g. 10s" 
                          {...field} 
                          className="h-12 pl-11 bg-gray-900/60 border-gray-800 focus:border-emerald-500/50 rounded-xl text-sm transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="health_check_timeout"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Probe Timeout</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <RefreshCcw className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/60" />
                        <Input 
                          placeholder="e.g. 5s" 
                          {...field} 
                          className="h-12 pl-11 bg-gray-900/60 border-gray-800 focus:border-emerald-500/50 rounded-xl text-sm transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="health_check_fail_threshold"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Fail Count</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} className="h-12 bg-gray-900/60 border-gray-800 focus:border-emerald-500/50 rounded-xl text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="health_check_pass_threshold"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Pass Count</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} className="h-12 bg-gray-900/60 border-gray-800 focus:border-emerald-500/50 rounded-xl text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8 border-t border-gray-800/60">
          {isEditMode && onDelete && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onDelete}
              className="w-full sm:w-auto sm:mr-auto h-12 px-6 rounded-xl font-bold bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-red-500/20 transition-all"
            >
              Delete Service
            </Button>
          )}
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="w-full sm:w-auto h-12 px-8 border-gray-800 hover:bg-gray-800 text-gray-300 rounded-xl font-bold transition-all"
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className={cn(
              "w-full sm:w-auto h-12 px-10 rounded-xl font-black transition-all duration-300 shadow-lg active:scale-95 flex items-center gap-2",
              isEditMode 
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20" 
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20"
            )}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isEditMode ? <CheckCircle2 className="w-5 h-5" /> : <Server className="w-5 h-5" />}
                {isEditMode ? "Update Service" : "Provision Service"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
