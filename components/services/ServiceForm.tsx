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
import { ChevronDown, ChevronUp, Activity } from "lucide-react";
import { GatewayCollection } from "@/lib/api-client";

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
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. users-service" {...field} />
                  </FormControl>
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
                        <SelectValue placeholder="Select a protocol" />
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

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="lb_policy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Load Balancing Policy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a policy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="round_robin">Round Robin</SelectItem>
                      <SelectItem value="weighted">Weighted</SelectItem>
                      <SelectItem value="latency">Latency</SelectItem>
                      <SelectItem value="least_connections">Least Connections</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <FormLabel>Collection (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a collection" />
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

        {/* Health Check Section */}
        <Collapsible
          open={isHealthCheckOpen}
          onOpenChange={setIsHealthCheckOpen}
          className="w-full border border-gray-800 rounded-lg bg-gray-900/30 overflow-hidden"
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-2 text-gray-200 font-medium">
                <Activity className="w-4 h-4 text-green-400" />
                ⚕️ Health Check Settings (Advanced)
              </div>
              {isHealthCheckOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 border-t border-gray-800 space-y-4 bg-gray-950/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="health_check_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Health Check Path</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. /health" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="health_check_interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check Interval (Go duration)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 10s" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="health_check_timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeout (Go duration)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 5s" {...field} />
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
                    <FormItem>
                      <FormLabel>Fail Threshold</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="health_check_pass_threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pass Threshold</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-800">
          {isEditMode && onDelete && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onDelete}
              className="mr-auto"
            >
              Delete Service
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : (isEditMode ? "Save Changes" : "Create Service")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
