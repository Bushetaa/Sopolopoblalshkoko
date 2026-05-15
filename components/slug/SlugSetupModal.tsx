"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";

const reservedWords = [
  "admin", "api", "healthz", "metrics", "docs", 
  "swagger", "static", "assets", "ws", "graphql"
];

const slugSchema = z.object({
  slug: z.string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9][a-z0-9\-]{1,}[a-z0-9]$/, "Slug must contain only lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen.")
    .refine((val) => !reservedWords.includes(val), {
      message: "This slug is a reserved word and cannot be used.",
    }),
});

type SlugFormValues = z.infer<typeof slugSchema>;

interface SlugSetupModalProps {
  isOpen: boolean;
  onSuccess: (slug: string) => void;
}

export function SlugSetupModal({ isOpen, onSuccess }: SlugSetupModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SlugFormValues>({
    resolver: zodResolver(slugSchema),
    defaultValues: {
      slug: "",
    },
  });

  const slugValue = form.watch("slug");

  const onSubmit = async (data: SlugFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call to save profile/slug
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSuccess(data.slug);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Setup Your Profile</DialogTitle>
          <DialogDescription>
            Choose a unique slug for your API URLs. This will be the base path for all your gateways.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="my-company" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your URLs will start with: <strong>/{slugValue || "slug"}/...</strong>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Profile"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
