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
import { Server, Zap } from "lucide-react";

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gateway Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Main E-Commerce" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of what this gateway handles..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing Mode</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a routing mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem 
                        value="single" 
                        disabled={hasSingleGateway && initialValues?.mode !== "single"}
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-gray-400" />
                          <span>Single Mode</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="pro">
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-purple-400" />
                          <span>Pro Mode</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {selectedMode === 'single' 
                      ? `URLs format: /${userSlug}/{path}`
                      : `URLs format: /${userSlug}/{gateway-name}/{service}/{path}`
                    }
                  </FormDescription>
                  {hasSingleGateway && initialValues?.mode !== "single" && (
                    <p className="text-xs text-yellow-500 mt-2">
                      You already have a Single mode gateway. Only Pro mode is available.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4 bg-gray-900/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Enable or disable this gateway from processing traffic.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-800">
          {isEditMode && onDelete && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onDelete}
              className="mr-auto"
            >
              Delete Gateway
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : (isEditMode ? "Save Changes" : "Create Gateway")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
