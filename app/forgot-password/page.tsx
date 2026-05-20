import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";
import { ForgotPasswordRedirect } from "@/components/auth/ForgotPasswordRedirect";

export const metadata = {
  title: "Forgot Password",
  description: "Reset your SOPO workspace password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen py-32 bg-background relative overflow-hidden flex items-center justify-center">
      {/* If URL has refreshToken, redirect to /reset-password */}
      <Suspense fallback={null}>
        <ForgotPasswordRedirect />
      </Suspense>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-md relative z-10">
        <div className="flex flex-col items-center gap-4 mb-8">
          <Link href="/signin">
            <div className="p-3 glass-panel rounded-2xl shadow-xl hover:bg-white/10 transition-colors">
              <img src="/assets/sopo_logo.gif" alt="SOPO" className="w-16 h-16" />
            </div>
          </Link>
        </div>

        <div className="glass-panel p-8 rounded-2xl border-white/10 shadow-2xl">
          <ForgotPasswordForm />
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          Remember your password? <Link href="/signin" className="text-primary font-medium hover:underline transition-all">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
