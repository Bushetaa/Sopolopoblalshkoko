import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export const metadata = {
  title: "Sign in",
  description: "Access your SOPO workspace to manage routes and policies.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen py-32 bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-md relative z-10">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="p-3 glass-panel rounded-2xl shadow-xl">
            <img src="/assets/sopo_logo_1771857176169.png" alt="SOPO" className="w-12 h-12" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground text-sm mt-2">Enter your credentials to access your workspace</p>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl border-white/10 shadow-2xl">
          <LoginForm />
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          Don’t have an account? <Link href="/signup" className="text-primary font-medium hover:underline transition-all">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
