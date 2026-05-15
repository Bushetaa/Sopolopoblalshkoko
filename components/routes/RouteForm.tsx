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
import { ChevronDown, ChevronUp, Network } from "lucide-react";
import { GatewayCollection, Service } from "@/lib/api-client";

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
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        
        {/* URL Preview */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 font-mono text-sm">
          <span className="text-gray-400">URL: </span>
          <span className="text-blue-400">/{userSlug}</span>
          {gatewayMode === 'pro' && (
            <>
              <span className="text-purple-400">/{gatewayName.toLowerCase().replace(/\s+/g, '-')}</span>
              {!isAggregate && <span className="text-green-400">/{serviceName}</span>}
            </>
          )}
          <span className="text-gray-100">{path || "/..."}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route Path</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. /users/:id" {...field} />
                  </FormControl>
                  <FormDescription>Supports :param, *, **</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={protocol === 'grpc'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"].map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
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
                  <FormItem>
                    <FormLabel>Protocol</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Protocol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="http">HTTP</SelectItem>
                        <SelectItem value="grpc">gRPC</SelectItem>
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4 bg-gray-900/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Network className="w-4 h-4 text-blue-400" />
                      Aggregate Route
                    </FormLabel>
                    <FormDescription>
                      Combine responses from multiple services.
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
              name="timeout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeout</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 30s" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {gatewayMode === "pro" && (
              <FormField
                control={form.control}
                name="collection_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select collection" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {collections.map(c => (
                          <SelectItem key={c.id} value={c.id!}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* Dynamic Section based on Aggregate Mode */}
        <div className="mt-8 border-t border-gray-800 pt-6">
          <h3 className="text-lg font-medium text-gray-200 mb-4">
            {isAggregate ? "Aggregate Configuration" : "Standard Configuration"}
          </h3>

          {!isAggregate ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="service_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Service</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.map(s => (
                          <SelectItem key={s.id} value={s.id!}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="target_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Path Override (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. /internal/api" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="websocket"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                    <div className="space-y-0.5">
                      <FormLabel>WebSocket</FormLabel>
                      <FormDescription>Enable WebSocket support for this route</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Collapsible
                open={isRetryOpen}
                onOpenChange={setIsRetryOpen}
                className="w-full border border-gray-800 rounded-lg bg-gray-900/30 overflow-hidden col-span-1 md:col-span-2"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50 transition-colors">
                    <div className="font-medium text-gray-200">Retry Settings</div>
                    {isRetryOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="retry_max_attempts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Retry Attempts</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="retry_on_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Retry On Status</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 502,503" {...field} />
                        </FormControl>
                        <FormDescription>Comma-separated status codes</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="aggregate_merge_strategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Merge Strategy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select strategy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="merge_object">Merge Object</SelectItem>
                        <SelectItem value="merge_array">Merge Array</SelectItem>
                        <SelectItem value="first_success">First Success</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="aggregate_timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aggregate Timeout</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 30s" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allow_partial_failure"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4 col-span-1 md:col-span-2">
                    <div className="space-y-0.5">
                      <FormLabel>Allow Partial Failure</FormLabel>
                      <FormDescription>Return success even if some sub-requests fail</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-800">
          {isEditMode && onDelete && (
            <Button type="button" variant="destructive" onClick={onDelete} className="mr-auto">
              Delete Route
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : (isEditMode ? "Save Changes" : "Create Route")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
