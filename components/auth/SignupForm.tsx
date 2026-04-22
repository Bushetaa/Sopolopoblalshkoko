"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Mail, ArrowRight, RefreshCcw, Inbox } from "lucide-react";

const schema = z
  .object({
    firstName: z.string().min(2, "Enter your first name"),
    lastName: z.string().min(2, "Enter your last name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(1, "Password is too short"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

export function SignupForm() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = (values: Values) => {
    // Here we will eventually call the backend API
    setEmail(values.email);
    setIsEmailSent(true);
    setCountdown(60);
    toast({ 
      title: "Verification email sent", 
      description: `Please check your email: ${values.email}` 
    });
  };

  const handleResendEmail = () => {
    if (countdown > 0) return;
    setCountdown(60);
    toast({ 
      title: "Email resent", 
      description: `A new verification link has been sent to ${email}` 
    });
  };

  if (isEmailSent) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 py-4 text-center animate-in fade-in zoom-in duration-500">
        {/* Animated Icon Container */}
        <div className="relative group">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20 duration-[3000ms] scale-150" />
          <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/10 scale-125" />
          <div className="relative rounded-2xl bg-gradient-to-b from-green-500/20 to-green-500/5 p-6 border border-green-500/20 shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]">
            <Mail className="h-14 w-14 text-green-500" />
          </div>
        </div>
        
        {/* Text Content */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-white bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Check your inbox
          </h2>
          <p className="text-zinc-400 max-w-sm mx-auto text-base leading-relaxed">
            We've sent a verification link to <br />
            <span className="text-white font-semibold underline decoration-green-500/30 underline-offset-8 decoration-2">{email}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4 pt-2">
          <Button 
            variant="outline" 
            disabled={countdown > 0}
            className="w-full h-12 bg-white/5 border-zinc-800 hover:bg-white/10 text-white transition-all duration-300 group relative overflow-hidden active:scale-95"
            onClick={handleResendEmail}
          >
            <div className="flex items-center justify-center gap-2">
              {countdown > 0 ? (
                <>
                  <RefreshCcw className="h-4 w-4 animate-spin text-zinc-500" />
                  <span className="text-zinc-500 font-medium">Resend available in {countdown}s</span>
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="font-medium">Resend Verification Email</span>
                </>
              )}
            </div>
          </Button>
          
          <button 
            className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto group/back"
            onClick={() => setIsEmailSent(false)}
          >
            <ArrowRight className="h-4 w-4 rotate-180 group-hover/back:-translate-x-1 transition-transform" />
            Wrong email? Back to signup
          </button>
          
          <div className="pt-2">
            <a 
              href="/internal/verify/ok-93ef71/x-7dd8b2" 
              className="text-[10px] text-zinc-800 hover:text-zinc-600 transition-colors uppercase tracking-widest block"
            >
              Simulate Email Click (Dev Only)
            </a>
          </div>
        </div>

        {/* Extra Help */}
        <div className="pt-6 border-t border-zinc-900 w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-zinc-500 text-xs">
            <Inbox className="h-3 w-3" />
            <span>Didn't see it? Check your spam folder</span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-700 font-bold mt-2">
            Secure Authentication by Sopo
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-700 dark:text-zinc-300">First name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-white dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 text-black dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-700 dark:text-zinc-300">Last name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-white dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 text-black dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  className="bg-white dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 text-black dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-600"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 dark:text-zinc-300">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="bg-white dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 text-black dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-600"
                  {...field}
                />
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
              <FormLabel className="text-zinc-700 dark:text-zinc-300">Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="bg-white dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 text-black dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-600"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Create account</Button>
      </form>
    </Form>
  );
}
