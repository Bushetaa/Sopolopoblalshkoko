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
import { Textarea } from "@/components/ui/textarea";

const pluginSchema = z.object({
  name: z.string().min(1, "Plugin type is required"),
  enabled: z.boolean().default(true),
  config: z.string().refine(val => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, { message: "Invalid JSON format" }),
});

export type PluginFormValues = z.infer<typeof pluginSchema>;

interface PluginFormProps {
  initialValues?: Partial<PluginFormValues>;
  onSubmit: (data: PluginFormValues) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
}

const PLUGIN_TYPES = [
  { id: "rate_limit", name: "Rate Limiting" },
  { id: "cors", name: "CORS" },
  { id: "auth", name: "Authentication" },
  { id: "cache", name: "Caching" },
  { id: "ip_restriction", name: "IP Restriction" },
  { id: "custom", name: "Custom Plugin" }
];

export function PluginForm({ 
  initialValues, 
  onSubmit, 
  onCancel,
  onDelete
}: PluginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialValues?.name;

  const form = useForm<PluginFormValues>({
    resolver: zodResolver(pluginSchema),
    defaultValues: {
      name: initialValues?.name || "rate_limit",
      enabled: initialValues?.enabled ?? true,
      config: initialValues?.config || '{\n  "limit": 100,\n  "window": "1m"\n}',
    },
  });

  const selectedType = form.watch("name");

  // Handle template switching when plugin type changes
  const handleTypeChange = (value: string) => {
    form.setValue("name", value);
    let template = "{}";
    if (value === "rate_limit") {
      template = '{\n  "limit": 100,\n  "window": "1m"\n}';
    } else if (value === "cors") {
      template = '{\n  "allowed_origins": ["*"],\n  "allowed_methods": ["GET", "POST"]\n}';
    } else if (value === "auth") {
      template = '{\n  "provider": "jwt",\n  "secret_key": ""\n}';
    }
    form.setValue("config", template);
  };

  const handleSubmit = async (data: PluginFormValues) => {
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
                  <FormLabel>Plugin Type</FormLabel>
                  <Select 
                    onValueChange={handleTypeChange} 
                    defaultValue={field.value}
                    disabled={isEditMode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plugin type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PLUGIN_TYPES.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4 bg-gray-900/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enabled</FormLabel>
                    <FormDescription>
                      Activate or deactivate this plugin.
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

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="config"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Configuration (JSON)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="{}" 
                      className="font-mono h-48 resize-none bg-gray-950 border-gray-800" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Must be a valid JSON object.</FormDescription>
                  <FormMessage />
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
              Delete Plugin
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : (isEditMode ? "Save Changes" : "Install Plugin")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
