
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
import { ChevronDown, ChevronUp, Route as RouteIcon, Info, Settings2, CheckCircle2, Server, Network } from "lucide-react";
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
        
        {/* URL Preview */}
        <div className="bg-gray-950/50 border border-gray-800/60 rounded-2xl p-5 font-mono text-sm flex flex-wrap items-center gap-2 shadow-inner">
          <span className="text-gray-500 font-medium">Mapped Endpoint:</span>
          <div className="flex items-center gap-1 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
            <span className="text-blue-400 font-bold">/{userSlug}</span>
            {gatewayMode === "pro" && (
              <>
                <span className="text-blue-400 font-bold">/{gatewayName.toLowerCase().replace(/\s+/g, "-")}</span>
                {!isAggregate && <span className="text-emerald-400 font-bold">/{serviceName}</span>}
              </>
            )}
            <span className="text-gray-100 font-bold">{path || "/..."}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em]">
              <Info className="w-3.5 h-3.5" />
              Routing Identity
            </div>

            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-bold text-gray-300 ml-1">Route Path</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <RouteIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                      <Input 
                        placeholder="e.g. /users/:id" 
                        {...field} 
                        className="h-14 pl-12 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-gray-300 ml-1">Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={protocol === "grpc"}>
                      <FormControl>
                        <SelectTrigger className="h-14 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all">
                          <SelectValue placeholder="Method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-950 border-gray-800 rounded-2xl p-2 shadow-2xl">
                        {["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"].map(m => (
                          <SelectItem key={m} value={m} className="rounded-xl py-2 font-mono font-bold text-gray-300">{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="protocol"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-gray-300 ml-1">Protocol</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-14 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all">
                          <SelectValue placeholder="Protocol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-950 border-gray-800 rounded-2xl p-2 shadow-2xl">
                        <SelectItem value="http" className="rounded-xl py-2">HTTP</SelectItem>
                        <SelectItem value="grpc" className="rounded-xl py-2">gRPC</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em]">
              <Settings2 className="w-3.5 h-3.5" />
              Target Destination
            </div>

            <FormField
              control={form.control}
              name="service_id"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-bold text-gray-300 ml-1">Upstream Service</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-14 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all">
                        <SelectValue placeholder="Select target service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-950 border-gray-800 rounded-2xl p-2 shadow-2xl max-h-60">
                      {services.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">No services found</div>
                      ) : (
                        services.map(s => (
                          <SelectItem key={s.id} value={s.id!} className="rounded-xl py-3 focus:bg-blue-500/10">
                            <div className="flex items-center gap-3">
                              <Server className="w-4 h-4 text-blue-400" />
                              <span className="font-bold">{s.name}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {gatewayMode === "pro" && (
              <FormField
                control={form.control}
                name="collection_id"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-gray-300 ml-1">Group Collection (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-14 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all">
                          <SelectValue placeholder="Select a collection" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-950 border-gray-800 rounded-2xl p-2 shadow-2xl">
                        <SelectItem value="none" className="rounded-xl py-2 italic text-gray-500">Standalone Route</SelectItem>
                        {collections.map(c => (
                          <SelectItem key={c.id} value={c.id!} className="rounded-xl py-2">{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* Advanced Settings Section */}
        <Collapsible
          open={isAdvancedOpen}
          onOpenChange={setIsAdvancedOpen}
          className="w-full border border-gray-800/60 rounded-[2rem] bg-gray-950/40 backdrop-blur-sm overflow-hidden group hover:border-blue-500/20 transition-all duration-500"
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-7 cursor-pointer hover:bg-blue-500/[0.02] transition-colors group">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                  isAdvancedOpen ? "bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "bg-gray-900 border border-gray-800"
                )}>
                  <Network className={cn("w-6 h-6 transition-colors duration-500", isAdvancedOpen ? "text-blue-400" : "text-gray-500")} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-200 group-hover:text-blue-400 transition-colors">Advanced Configuration</span>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">Timeout, retry, and aggregations</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-900/50 border border-gray-800 flex items-center justify-center">
                {isAdvancedOpen ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-8 pb-8 pt-2 border-t border-gray-800/40 space-y-8 animate-in slide-in-from-top-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="timeout"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Route Timeout</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 30s" {...field} className="h-12 bg-gray-900/60 border-gray-800 focus:border-blue-500/50 rounded-xl text-sm" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="target_path"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Rewrite Path Override</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. /internal/api" {...field} className="h-12 bg-gray-900/60 border-gray-800 focus:border-blue-500/50 rounded-xl text-sm" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="retry_max_attempts"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Max Retries</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} className="h-12 bg-gray-900/60 border-gray-800 focus:border-blue-500/50 rounded-xl text-sm" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="retry_on_status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Retry On Status</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 502,503" {...field} className="h-12 bg-gray-900/60 border-gray-800 focus:border-blue-500/50 rounded-xl text-sm" />
                      </FormControl>
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
              Delete Route
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
              "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20"
            )}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isEditMode ? <CheckCircle2 className="w-5 h-5" /> : <RouteIcon className="w-5 h-5" />}
                {isEditMode ? "Update Route" : "Provision Route"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

