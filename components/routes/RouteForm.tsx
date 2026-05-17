"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { ChevronDown, ChevronUp, Network, Route as RouteIcon, Info, Settings2, CheckCircle2, Globe, Clock, Zap, ShieldAlert, ArrowRight } from "lucide-react";
import { GatewayCollection, Service } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const routeSchema = z.object({
  method: z.string(),
  path: z.string().startsWith('/', "Path must start with /"),
  protocol: z.string().optional(),
  timeout: z.string().optional(),
  collection_id: z.string().optional(),
  is_aggregate: z.boolean().default(false),
  
  // Standard Mode
  service_id: z.string().optional(),
  target_path: z.string().optional(),
  websocket: z.boolean().default(false),
  retry_max_attempts: z.coerce.number().min(0).optional(),
  retry_on_status: z.string().optional(), // Will store comma separated strings
  
  // Aggregate Mode
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
  const [isRetryOpen, setIsRetryOpen] = useState(false);
  const isEditMode = !!initialValues?.path;

  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      method: initialValues?.method || "GET",
      path: initialValues?.path || "",
      protocol: initialValues?.protocol || "http",
      timeout: initialValues?.timeout || "30s",
      collection_id: initialValues?.collection_id || "",
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

  // Enforce gRPC lock
  if (protocol === 'grpc' && form.getValues("method") !== "POST") {
    form.setValue("method", "POST");
  }

  const handleSubmit = async (data: RouteFormValues) => {
    setIsSubmitting(true);
    try {
      // Clean up collection_id if it's "none"
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
        
        {/* URL Preview - Premium Version */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-gray-950/80 border border-gray-800/60 rounded-2xl p-6 backdrop-blur-md overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Public Endpoint Preview</span>
            </div>
            
            <div className="flex items-center flex-wrap gap-1 font-mono text-base md:text-lg">
              <span className="text-gray-500">https://api.sopo.io/</span>
              <span className="text-blue-400 font-bold">{userSlug}</span>
              {gatewayMode === 'pro' && (
                <>
                  <span className="text-gray-600">/</span>
                  <span className="text-purple-400 font-bold">{gatewayName.toLowerCase().replace(/\s+/g, '-')}</span>
                  {!isAggregate && (
                    <>
                      <span className="text-gray-600">/</span>
                      <span className="text-emerald-400 font-bold">{serviceName}</span>
                    </>
                  )}
                </>
              )}
              <span className="text-gray-100 font-black">{path || "/..."}</span>
              {path && <div className="ml-2 w-1.5 h-5 bg-blue-500 animate-pulse inline-block align-middle" />}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Routing Definition */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em]">
              <Info className="w-3.5 h-3.5" />
              Routing Logic
            </div>

            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-bold text-gray-300 ml-1">Traffic Path</FormLabel>
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
                  <FormDescription className="text-[10px] text-gray-500 font-medium ml-1">Supports dynamic segments like <code className="text-blue-400/80">:id</code> or wildcards <code className="text-blue-400/80">**</code></FormDescription>
                  <FormMessage className="text-red-400 font-medium" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-gray-300 ml-1">HTTP Method</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={protocol === 'grpc'}
                    >
                      <FormControl>
                        <SelectTrigger className="h-14 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all">
                          <SelectValue placeholder="Method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-950 border-gray-800 rounded-2xl p-2 shadow-2xl">
                        {["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"].map(m => (
                          <SelectItem key={m} value={m} className="rounded-xl py-2 font-bold focus:bg-blue-500/10 focus:text-blue-400">{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="protocol"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-gray-300 ml-1">Backend Protocol</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-14 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all">
                          <SelectValue placeholder="Protocol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-950 border-gray-800 rounded-2xl p-2 shadow-2xl">
                        <SelectItem value="http" className="rounded-xl py-2 focus:bg-blue-500/10 focus:text-blue-400">HTTP/1.1 or 2</SelectItem>
                        <SelectItem value="grpc" className="rounded-xl py-2 focus:bg-purple-500/10 focus:text-purple-400">gRPC (HTTP/2)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_aggregate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-[2rem] border border-gray-800/60 p-6 bg-gray-950/40 backdrop-blur-sm group hover:border-blue-500/20 transition-all duration-300">
                  <div className="space-y-1">
                    <FormLabel className="text-lg font-bold text-gray-200 flex items-center gap-2">
                      <Network className="w-5 h-5 text-blue-400" />
                      Response Aggregation
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500 font-medium">
                      Fan-out requests to multiple upstream services
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Right Column: Execution Context */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em]">
              <Settings2 className="w-3.5 h-3.5" />
              Runtime Parameters
            </div>

            <FormField
              control={form.control}
              name="timeout"
              render={({ field }) => (                
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-bold text-gray-300 ml-1">Request Timeout</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                      <Input 
                        placeholder="e.g. 30s" 
                        {...field} 
                        className="h-14 pl-12 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 font-medium" />
                </FormItem>
              )}
            />

            {!isAggregate ? (
              <>
                {gatewayMode === "pro" && (
                  <FormField
                    control={form.control}
                    name="collection_id"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-bold text-gray-300 ml-1">Parent Collection (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-14 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all">
                              <SelectValue placeholder="Select a collection" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-950 border-gray-800 rounded-2xl p-2 shadow-2xl">
                            <SelectItem value="none" className="rounded-xl py-2 italic text-gray-500">None (Standalone Route)</SelectItem>
                            {collections.map(c => (
                              <SelectItem key={c.id} value={c.id!} className="rounded-xl py-2">
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="service_id"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-bold text-gray-300 ml-1">Upstream Target</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all">
                            <SelectValue placeholder="Select destination service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-950 border-gray-800 rounded-2xl p-2 shadow-2xl">
                          {services.map(s => (
                            <SelectItem key={s.id} value={s.id!} className="rounded-xl py-3 focus:bg-emerald-500/10 focus:text-emerald-400">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                                  <Zap className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold">{s.name}</span>
                                  <span className="text-[10px] text-gray-500">{s.protocol.toUpperCase()} Service</span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="websocket"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-gray-800/60 p-5 bg-gray-950/40 backdrop-blur-sm group hover:border-purple-500/20 transition-all duration-300">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-bold text-gray-200">WebSocket Upgrade</FormLabel>
                        <FormDescription className="text-[10px]">Support persistent full-duplex connections</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-purple-600" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-[2rem] p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Network className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-blue-400">Aggregate Mode Active</h4>
                  <p className="text-sm text-gray-500 mt-2">This route will orchestrate multiple backend calls. Save to configure child services.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Retry Policies - Premium Version */}
        <Collapsible
          open={isRetryOpen}
          onOpenChange={setIsRetryOpen}
          className="w-full border border-gray-800/60 rounded-[2rem] bg-gray-950/40 backdrop-blur-sm overflow-hidden group hover:border-blue-500/20 transition-all duration-500"
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-7 cursor-pointer hover:bg-blue-500/[0.02] transition-colors group">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                  isRetryOpen ? "bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "bg-gray-900 border border-gray-800"
                )}>
                  <ShieldAlert className={cn("w-6 h-6 transition-colors duration-500", isRetryOpen ? "text-blue-400" : "text-gray-500")} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-200 group-hover:text-blue-400 transition-colors">Reliability Policies</span>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">Retry logic & Error handling</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-900/50 border border-gray-800 flex items-center justify-center">
                {isRetryOpen ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-8 pb-8 pt-2 border-t border-gray-800/40 space-y-8 animate-in slide-in-from-top-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="retry_max_attempts"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Max Retry Attempts</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} className="h-12 bg-gray-900/60 border-gray-800 focus:border-blue-500/50 rounded-xl text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="retry_on_status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Retry on Status Codes</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 500,502,503" {...field} className="h-12 bg-gray-900/60 border-gray-800 focus:border-blue-500/50 rounded-xl text-sm" />
                    </FormControl>
                    <FormDescription className="text-[10px]">Comma separated list of HTTP status codes</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              Terminate Route
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
                Orchestrating...
              </>
            ) : (
              <>
                {isEditMode ? <CheckCircle2 className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                {isEditMode ? "Commit Changes" : "Deploy Route"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
