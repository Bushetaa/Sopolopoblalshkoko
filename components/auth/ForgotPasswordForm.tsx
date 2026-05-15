"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const { resetPassword, isAuthenticating } = useAuth();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: Values) => {
    setServerError(null);
    try {
      await resetPassword(values.email);
      setEmail(values.email);
      setIsEmailSent(true);
    } catch (error: any) {
      setServerError(error.message || "Failed to request password reset");
    }
  };

  if (isEmailSent) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 py-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative group">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 duration-[3000ms] scale-150" />
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10 scale-125" />
          <div className="relative rounded-2xl bg-gradient-to-b from-primary/20 to-primary/5 p-6 border border-primary/20 shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]">
            <Mail className="h-14 w-14 text-primary" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Check your email
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto text-base leading-relaxed">
            We've sent a password reset link to <br />
            <span className="text-foreground font-semibold underline decoration-primary/30 underline-offset-8 decoration-2">{email}</span>
          </p>
        </div>

        <div className="w-full space-y-4 pt-2">
          <Link href="/signin" className="w-full block">
            <Button 
              variant="default" 
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
            >
              Return to sign in
            </Button>
          </Link>
          
          <button 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 mx-auto group/back"
            onClick={() => setIsEmailSent(false)}
          >
            <ArrowRight className="h-4 w-4 rotate-180 group-hover/back:-translate-x-1 transition-transform" />
            Try a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-3 py-2 rounded text-sm">
            {serverError}
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className="text-lg font-medium text-foreground mb-2">Reset Password</h2>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 dark:text-zinc-300">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  disabled={isAuthenticating}
                  placeholder="you@example.com"
                  className="bg-white dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 text-black dark:text-white disabled:opacity-50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isAuthenticating}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
        >
          {isAuthenticating && <Loader2 className="h-4 w-4 animate-spin" />}
          {isAuthenticating ? "Sending link..." : "Send reset link"}
        </Button>
      </form>
    </Form>
  );
}
