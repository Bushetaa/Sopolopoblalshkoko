"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyPage() {
  const [status, setStatus] = useState<"loading" | "success">("loading");
  const router = useRouter();

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setStatus("success");
    }, 3500);

    let redirectTimer: NodeJS.Timeout;
    if (status === "success") {
      redirectTimer = setTimeout(() => {
        router.push("/signin");
      }, 3000);
    }

    return () => {
      clearTimeout(loadingTimer);
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [status, router]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans antialiased">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[110px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-green-500/20 rounded-full blur-[110px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>
      
      <div className="max-w-md w-full relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {status === "loading" ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center space-y-12"
            >
              <div className="relative">
                <div className="w-32 h-32 rounded-full border border-white/5 flex items-center justify-center relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-green-500/40 rounded-full"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border-b-2 border-blue-500/30 rounded-full"
                  />
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl">
                    <ShieldCheck className="w-10 h-10 text-white animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-center">
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-white tracking-tight"
                >
                  Authenticating
                </motion.h1>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-zinc-500 text-sm font-medium tracking-wide">
                    Establishing secure connection to Sopo Gateway
                  </p>
                  <div className="flex gap-1 mt-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1 h-1 rounded-full bg-green-500"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 100,
                duration: 0.6 
              }}
              className="w-full flex flex-col items-center space-y-10"
            >
              <div className="relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1, damping: 15, stiffness: 200 }}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/5 flex items-center justify-center border border-green-500/20 shadow-[0_0_50px_-12px_rgba(34,197,94,0.5)]"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </motion.div>
                
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1.5, 0],
                      x: Math.cos(i * 60 * Math.PI / 180) * 80,
                      y: Math.sin(i * 60 * Math.PI / 180) * 80,
                    }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="absolute top-1/2 left-1/2 w-1 h-1 bg-green-500 rounded-full"
                  />
                ))}
              </div>

              <div className="space-y-4 text-center">
                <h1 className="text-4xl font-extrabold text-white tracking-tighter">
                  Verified Successfully
                </h1>
                <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                  Your identity has been confirmed. <br />
                  <span className="text-zinc-600 text-sm font-normal">Welcome to the future of API management.</span>
                </p>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10"
              >
                <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
                <span className="text-zinc-400 text-sm font-medium">Redirecting to dashboard...</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center space-y-6">
        <div className="h-[1px] w-12 bg-zinc-800" />
        <div className="flex flex-col items-center space-y-2">
          <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-700 font-black">
            SOPO SECURITY PROTOCOL
          </p>
          <p className="text-[8px] text-zinc-800 font-medium">
            ENCRYPTED END-TO-END VERIFICATION
          </p>
        </div>
      </div>
    </div>
  );
}
