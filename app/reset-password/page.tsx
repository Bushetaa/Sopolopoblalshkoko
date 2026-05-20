"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, KeyRound, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type Values = z.infer<typeof schema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Nhost verify redirects with refreshToken in the URL
  const refreshToken = searchParams.get("refreshToken");
  const type = searchParams.get("type");

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: Values) => {
    setIsSubmitting(true);
    try {
      // Use the ticket/refreshToken to change the password
      await apiClient.post("/auth/user/password", {
        newPassword: values.newPassword,
        ticket: `passwordReset:${refreshToken}`,
      });

      setIsSuccess(true);
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated. Redirecting to sign in...",
      });

      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password. The link may have expired.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/20 scale-150" />
          <div className="relative rounded-2xl bg-gradient-to-b from-green-500/20 to-green-500/5 p-6 border border-green-500/20 shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]">
            <CheckCircle2 className="h-14 w-14 text-green-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Password Updated!</h2>
          <p className="text-muted-foreground text-sm">
            Your password has been reset successfully.
            <br />
            <span className="text-muted-foreground/70">Redirecting to sign in...</span>
          </p>
        </div>

        <Link href="/signin">
          <Button variant="default" className="mt-2">
            Go to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-lg font-medium text-foreground mb-2">Set New Password</h2>
          <p className="text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 dark:text-zinc-300">New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    disabled={isSubmitting}
                    placeholder="Enter new password"
                    className="bg-white dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 text-black dark:text-white disabled:opacity-50 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 dark:text-zinc-300">Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    disabled={isSubmitting}
                    placeholder="Confirm new password"
                    className="bg-white dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 text-black dark:text-white disabled:opacity-50 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Resetting password..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen py-32 bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-md relative z-10">
        <div className="flex flex-col items-center gap-4 mb-8">
          <Link href="/signin">
            <div className="p-3 glass-panel rounded-2xl shadow-xl hover:bg-white/10 transition-colors">
              <img src="/assets/sopo_logo.gif" alt="SOPO" className="w-16 h-16" />
            </div>
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <h1 className="text-3xl font-display font-bold text-foreground">Reset Password</h1>
            </div>
            <p className="text-muted-foreground text-sm mt-1">Choose a new password for your account</p>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl border-white/10 shadow-2xl">
          <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}>
            <ResetPasswordContent />
          </Suspense>
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          Remember your password? <Link href="/signin" className="text-primary font-medium hover:underline transition-all">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
