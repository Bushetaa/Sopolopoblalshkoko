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
import { Server, Zap, Globe, Info, Activity, Shield, CheckCircle2, X, Loader2 } from "lucide-react";
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Basic Information */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-[#64748B] font-black text-[9px] uppercase tracking-[0.15em] ml-1">
              <Info className="w-3 h-3" />
              Primary Configuration
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Gateway Identifier <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] group-focus-within:text-[#2563EB] transition-colors" />
                      <Input 
                        placeholder="e.g. core-prod-gateway" 
                        {...field} 
                        className="h-11 pl-11 bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl text-sm transition-all text-white placeholder:text-gray-700"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-[10px] font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Infrastructure Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of what this gateway handles..." 
                      className="min-h-[100px] bg-[#050810] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl text-sm transition-all resize-none p-4 text-white placeholder:text-gray-700" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-[10px] font-medium" />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column: Operational Parameters */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-[#64748B] font-black text-[9px] uppercase tracking-[0.15em] ml-1">
              <Activity className="w-3 h-3" />
              Operational Parameters
            </div>

            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] ml-1">Operational Mode</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => field.onChange('pro')}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 text-left group",
                          field.value === 'pro' 
                            ? "border-[#8B5CF6] bg-[#8B5CF6]/5 text-white shadow-lg" 
                            : "border-[#1E293B] bg-[#050810] text-[#64748B] hover:border-[#334155]"
                        )}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                          field.value === 'pro' ? "bg-[#8B5CF6] text-white" : "bg-[#1E293B] text-[#475569] group-hover:bg-[#334155]"
                        )}>
                          <Server className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">PRO Mode</span>
                            <span className="text-[7px] font-black uppercase tracking-widest bg-white/10 px-1 py-0.5 rounded">Clustered</span>
                          </div>
                          <p className="text-[10px] font-medium opacity-60 leading-tight">High availability multi-node setup.</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => field.onChange('single')}
                        disabled={hasSingleGateway && initialValues?.mode !== "single"}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 text-left group",
                          field.value === 'single' 
                            ? "border-[#0EA5E9] bg-[#0EA5E9]/5 text-white shadow-lg" 
                            : "border-[#1E293B] bg-[#050810] text-[#64748B] hover:border-[#334155] disabled:opacity-30 disabled:cursor-not-allowed"
                        )}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                          field.value === 'single' ? "bg-[#0EA5E9] text-white" : "bg-[#1E293B] text-[#475569] group-hover:bg-[#334155]"
                        )}>
                          <Zap className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">SINGLE Mode</span>
                            <span className="text-[7px] font-black uppercase tracking-widest bg-white/10 px-1 py-0.5 rounded">Standalone</span>
                          </div>
                          <p className="text-[10px] font-medium opacity-60 leading-tight">Performance optimized single instance.</p>
                        </div>
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-[10px] font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-[#1E293B] p-4 bg-[#050810] group hover:border-[#2563EB]/20 transition-all duration-300">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-bold text-gray-200 flex items-center gap-2">
                      Deployment Status
                      {field.value && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                    </FormLabel>
                    <FormDescription className="text-[10px] text-[#64748B] font-medium">
                      Enable live traffic processing
                    </FormDescription>
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

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-white/5">
          {isEditMode && onDelete && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onDelete}
              className="w-full sm:w-auto sm:mr-auto h-11 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-red-500/20 transition-all"
            >
              Terminate Gateway
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
                ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-[#2563EB]/20" 
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
                {isEditMode ? "Commit Changes" : "Deploy Gateway"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
