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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Server, Zap, Globe, Info, Activity, Shield, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const gatewaySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  mode: z.enum(["single", "pro"]),
  is_active: z.boolean().default(true),
});

export type GatewayFormValues = z.infer<typeof gatewaySchema>;

interface GatewayFormProps {
  initialValues?: Partial<GatewayFormValues>;
  hasSingleGateway?: boolean;
  userSlug?: string;
  onSubmit: (data: GatewayFormValues) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
}

export function GatewayForm({ 
  initialValues, 
  hasSingleGateway = false, 
  userSlug = "your-slug",
  onSubmit, 
  onCancel,
  onDelete
}: GatewayFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialValues?.name;

  const form = useForm<GatewayFormValues>({
    resolver: zodResolver(gatewaySchema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      mode: initialValues?.mode || (hasSingleGateway ? "pro" : "single"),
      is_active: initialValues?.is_active ?? true,
    },
  });

  const selectedMode = form.watch("mode");

  const handleSubmit = async (data: GatewayFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Basic Information */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em]">
              <Info className="w-3.5 h-3.5" />
              Primary Configuration
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-bold text-gray-300 ml-1">Gateway Identity</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                      <Input 
                        placeholder="e.g. Main E-Commerce" 
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
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-bold text-gray-300 ml-1">Infrastructure Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of what this gateway handles..." 
                      className="min-h-[140px] bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-base transition-all resize-none p-5" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 font-medium" />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column: Routing & Status */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em]">
              <Activity className="w-3.5 h-3.5" />
              Operational Parameters
            </div>

            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-bold text-gray-300 ml-1">Routing Strategy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-14 bg-gray-900/40 border-gray-800 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-2xl text-lg transition-all">
                        <SelectValue placeholder="Select a routing mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-950 border-gray-800 rounded-2xl p-2 shadow-2xl">
                      <SelectItem 
                        value="single" 
                        disabled={hasSingleGateway && initialValues?.mode !== "single"}
                        className="rounded-xl py-3 focus:bg-blue-500/10 focus:text-blue-400"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold">Single Mode</span>
                            <span className="text-[10px] text-gray-500">Global path matching</span>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="pro"
                        className="rounded-xl py-3 focus:bg-purple-500/10 focus:text-purple-400 mt-1"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                            <Server className="w-4 h-4 text-purple-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold">Pro Mode</span>
                            <span className="text-[10px] text-gray-500">Advanced hierarchical routing</span>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 mt-2">
                    <p className="text-xs text-blue-400/80 font-medium leading-relaxed">
                      {selectedMode === 'single' 
                        ? `Unified Endpoint: /${userSlug}/{path}`
                        : `Namespaced Endpoint: /${userSlug}/${form.getValues("name") || '{gateway}'}/{service}/{path}`
                      }
                    </p>
                  </div>
                  {hasSingleGateway && initialValues?.mode !== "single" && (
                    <p className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-wider mt-2 flex items-center gap-1.5">
                      <Shield className="w-3 h-3" />
                      Cluster Restriction: Only Pro mode available
                    </p>
                  )}
                  <FormMessage className="text-red-400 font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-[2rem] border border-gray-800/60 p-6 bg-gray-950/40 backdrop-blur-sm group hover:border-blue-500/20 transition-all duration-300">
                  <div className="space-y-1">
                    <FormLabel className="text-lg font-bold text-gray-200 flex items-center gap-2">
                      Deployment Status
                      {field.value ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-600" />
                      )}
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500 font-medium">
                      Enable live traffic processing for this cluster
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
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8 border-t border-gray-800/60">
          {isEditMode && onDelete && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onDelete}
              className="w-full sm:w-auto sm:mr-auto h-12 px-6 rounded-xl font-bold bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-red-500/20 transition-all"
            >
              Terminate Gateway
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
                Synchronizing...
              </>
            ) : (
              <>
                {isEditMode ? <CheckCircle2 className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                {isEditMode ? "Commit Changes" : "Deploy Gateway"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
