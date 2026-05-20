"use client";

import { useEffect, useRef, useState } from "react";
import {
  Server,
  Shield,
  ShieldCheck,
  Activity,
  Boxes,
  Share2,
  Network,
  CheckCircle2,
  Zap,
  Code2,
  ArrowRight,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const blocks = [
  {
    title: "Intelligent Traffic Orchestration",
    description:
      "SOPO dynamically manages incoming traffic using advanced routing logic and adaptive load balancing strategies. It ensures optimal request distribution, reduced latency, and consistent performance—even under heavy load.",
    icon: Share2,
    align: "left" as const,
  },
  {
    title: "Enterprise-Grade Security Layer",
    description:
      "Security is enforced at the gateway layer with token validation, RBAC authorization, request validation, IP filtering, and intelligent rate limiting. SOPO implements a zero‑trust access model across all services.",
    icon: ShieldCheck,
    align: "right" as const,
  },
  {
    title: "Real-time Observability & Analytics",
    description:
      "Gain full visibility into your traffic. Monitor latency, error rates, and throughput in real-time with built-in logging and metrics.",
    icon: Activity,
    align: "left" as const,
  },
  {
    title: "Microservices‑Native Design",
    description:
      "Built for containerized and distributed environments, SOPO supports modular architecture and horizontal scaling without adding complexity.",
    icon: Boxes,
    align: "left" as const,
  },
  {
    title: "High Availability & Fault Tolerance",
    description:
      "Integrated circuit breaker patterns and automated failover mechanisms provide resilience and uninterrupted service continuity.",
    icon: Network,
    align: "right" as const,
  },
  {
    title: "Horizontal Scalability",
    description:
      "Engineered to handle exponential traffic growth while maintaining stability, responsiveness, and operational efficiency.",
    icon: Share2,
    align: "left" as const,
  },
];

export function Features() {
  return (
    <section className="py-12 sm:py-20 md:py-40 relative overflow-hidden overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center mb-10 sm:mb-14 md:mb-24"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight mb-4 sm:mb-6 md:mb-7">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-blue-400">
              SOPO
            </span>
            : The Ultimate{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500">
              API Gateway
            </span>{" "}
            for Modern Backends
          </h1>
          <h2 className="text-sm sm:text-xl md:text-2xl font-semibold text-foreground/90 mb-2 sm:mb-3">
            An intelligent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              API Gateway
            </span>{" "}
            that orchestrates traffic, enforces security, and scales with your growth.
          </h2>
          <p className="text-xs sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            SOPO centralizes, secures, and intelligently orchestrates service‑to‑service communication across distributed systems.
            Designed with enterprise‑level reliability, it transforms complex microservices into a unified, high‑performance architecture.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <div className={`${inter.className} glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
              <div className="md:col-span-7">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-foreground mb-3 sm:mb-4 tracking-tight">
                  What is SOPO?
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
                  SOPO is an intelligent API gateway that standardizes routing, security, and observability across microservices.
                  It helps teams deliver reliable, secure, and observable services with consistent policies and predictable latency.
                </p>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { t: "Intelligent Routing", d: "Latency‑aware paths and adaptive load distribution." },
                    { t: "Zero‑Trust Security", d: "API Key, RBAC, limits—enforced at the gateway." },
                    { t: "Deep Observability", d: "Built‑in metrics, logs, and tracing." },
                    { t: "Developer Friendly", d: "Fast iteration with safe, versioned changes." },
                  ].map((c) => (
                    <div
                      key={c.t}
                      className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
                        <div>
                          <div className="text-foreground/90 text-sm font-medium">{c.t}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{c.d}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-5 flex items-center justify-center">
                <ServerOrbit3D />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
          {blocks.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`group glass-panel p-5 sm:p-8 md:p-10 rounded-2xl md:rounded-[3rem] border-black/5 dark:border-white/5 relative overflow-hidden md:flex md:items-stretch md:justify-between gap-6 md:gap-8 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                } hover:translate-y-[-2px] hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all`}
              >
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity text-foreground hidden sm:block">
                  <Icon className="w-48 md:w-64 h-48 md:h-64 rotate-12" />
                </div>
                <div className="relative z-10 md:w-7/12">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 border border-primary/20">
                    <Icon
                      className={`w-6 h-6 sm:w-7 sm:h-7 text-primary ${
                        i === 1 || i === 3 ? "drop-shadow-[0_0_12px_hsl(var(--primary)/0.35)]" : ""
                      }`}
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-4xl font-display font-black mb-2 sm:mb-3 md:mb-5 tracking-tight">
                    {b.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">{b.description}</p>
                </div>
                <div className="relative md:w-5/12 flex items-center justify-center px-2 sm:px-0">
                  <FeatureSketch kind={i} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-20 md:mt-32">
        <div className="max-w-6xl mx-auto">
          {/* Title and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl md:text-5xl font-display font-black tracking-tight mb-4">
              SOPO <span className="text-primary italic">Architecture</span>
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              A high-performance, deterministic pipeline designed for zero-trust microservice communication and global scale.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Diagram Display */}
            <div className="lg:col-span-7 order-2 lg:order-1 hidden lg:flex items-center justify-center">
              <div className="glass-panel p-6 sm:p-8 rounded-[2rem] border-white/5 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md relative overflow-hidden group w-full max-w-[500px]">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <ArchitectureDiagram />
              </div>
            </div>

            {/* Feature Cards */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col gap-4">
              {[
                {
                  t: "Performance",
                  d: "Global edge routing, low-latency pipelines, and scalable throughput tuned for production.",
                  icon: Zap,
                  color: "from-amber-400 to-orange-500",
                },
                {
                  t: "Security",
                  d: "Policy enforcement at the gateway: auth, rate limits, and zero‑trust patterns.",
                  icon: ShieldCheck,
                  color: "from-blue-400 to-cyan-500",
                },
                {
                  t: "Developer Experience",
                  d: "Clear policies, fast iteration, and deep visibility—built for modern teams.",
                  icon: Code2,
                  color: "from-emerald-400 to-teal-500",
                },
              ].map((c, idx) => (
                <motion.div
                  key={c.t}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="glass-panel p-6 rounded-2xl border-white/5 hover:border-primary/40 hover:bg-white/[0.02] transition-all group cursor-default"
                >
                  <div className="flex gap-4">
                    <motion.div 
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} p-0.5 shrink-0 shadow-lg shadow-black/20`}
                    >
                      <div className="w-full h-full bg-white dark:bg-background rounded-[10px] flex items-center justify-center">
                        <c.icon className={`w-6 h-6 ${idx === 0 ? "text-amber-500" : idx === 1 ? "text-blue-500" : "text-emerald-500"} dark:text-white`} />
                      </div>
                    </motion.div>
                    <div>
                      <h5 className="text-xl font-display font-bold mb-1 text-foreground group-hover:text-primary transition-colors">{c.t}</h5>
                      <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors">{c.d}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-20 md:mt-32 mb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel p-10 md:p-20 rounded-[3rem] border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-transparent backdrop-blur-xl relative overflow-hidden text-center"
          >
            {/* Background decorative glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
            
            <div className="relative z-10">
              <p className="text-2xl sm:text-4xl md:text-5xl font-display font-black leading-tight tracking-tight mx-auto max-w-4xl">
                SOPO is not just an{" "}
                <span className="text-muted-foreground/40 italic">API Gateway</span>. 
                <br className="hidden md:block" />
                It is the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  intelligent control layer
                </span>{" "}
                that <span className="text-primary font-semibold">governs</span>,{" "}
                <span className="text-primary font-semibold">protects</span>, and{" "}
                <span className="text-primary font-semibold">accelerates</span> modern backend systems.
              </p>
              
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/signup">
                  <Button className="group h-16 px-10 md:px-14 text-xl font-bold bg-primary text-primary-foreground shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_60px_rgba(var(--primary-rgb),0.5)] hover:scale-105 transition-all duration-300 rounded-2xl relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started with SOPO
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Button>
                </Link>
                
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden ring-2 ring-white/5">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                    </div>
                  ))}
                  <div className="pl-6 text-sm text-muted-foreground font-medium">
                    <span className="text-foreground font-bold">500+</span> teams joined
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ServerOrbit3D() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px" });
  return (
    <div ref={ref} className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 will-change-transform gpu-hint">
      <motion.div
        className="absolute inset-0 rounded-3xl border border-primary/30 bg-primary/5"
        animate={
          inView
            ? {
                boxShadow: [
                  "0 0 0px rgba(0,0,0,0)",
                  "0 0 50px rgba(34,211,238,0.18)",
                  "0 0 0px rgba(0,0,0,0)",
                ],
                y: [0, -6, 0],
              }
            : undefined
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full will-change-transform" aria-hidden="true">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(199 89% 60%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(199 89% 40%)" stopOpacity="0" />
          </radialGradient>
          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>
        <circle cx="150" cy="150" r="90" fill="url(#glow)" />
        <g filter="url(#soft)">
          <rect x="118" y="108" width="64" height="22" rx="8" fill="none" stroke="hsl(199 89% 58%)" strokeWidth="2" />
          <rect x="112" y="138" width="76" height="26" rx="10" fill="none" stroke="hsl(199 89% 58%)" strokeWidth="2" />
          <rect x="118" y="172" width="64" height="22" rx="8" fill="none" stroke="hsl(199 89% 58%)" strokeWidth="2" />
        </g>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const r = 120;
          const a = (i / 6) * Math.PI * 2;
          const cx = 150 + r * Math.cos(a);
          const cy = 150 + r * Math.sin(a);
          return (
            <g key={i}>
              <motion.line
                x1={cx}
                y1={cy}
                x2={150}
                y2={150}
                stroke="hsl(199 89% 55%)"
                strokeOpacity="0.35"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                animate={inView ? { strokeDashoffset: [0, -20] } : undefined}
                transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                r="6"
                fill="hsl(199 89% 55%)"
                filter="url(#soft)"
                animate={
                  inView
                    ? {
                        cx: [cx, 150 + (r - 8) * Math.cos(a + Math.PI / 8), cx],
                        cy: [cy, 150 + (r - 8) * Math.sin(a + Math.PI / 8), cy],
                        opacity: [0.6, 1, 0.6],
                      }
                    : undefined
                }
                transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
              />
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-primary/40 bg-primary/10 flex items-center justify-center"
          animate={inView ? { scale: [1, 1.06, 1] } : undefined}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Server className="w-6 h-6 text-primary" />
        </motion.div>
      </div>
    </div>
  );
}

function FeatureSketch({ kind }: { kind: number }) {
  if (kind === 0) {
    return (
      <svg viewBox="0 0 360 220" className="w-full max-w-md" aria-hidden="true">
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="currentColor" className="text-primary" />
          </marker>
        </defs>
        <motion.rect
          x="150"
          y="80"
          width="60"
          height="60"
          rx="14"
          className="fill-primary/10 stroke-primary/30"
          strokeWidth="2"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {[30, 180, 330].map((x, i) => (
          <motion.circle
            key={x}
            cx={x}
            cy={30}
            r="10"
            className="fill-primary/20"
            animate={{ cy: [26, 34, 26] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        {[30, 180, 330].map((x, i) => (
          <motion.line
            key={`t${x}`}
            x1={x}
            y1={40}
            x2={180}
            y2={80}
            stroke="currentColor"
            className="text-primary/40"
            strokeWidth="2"
            markerEnd="url(#arrow)"
            strokeDasharray="4 6"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 2.2 + i * 0.2, repeat: Infinity }}
          />
        ))}
        {[60, 150, 300].map((x, i) => (
          <motion.circle
            key={`b${x}`}
            cx={x}
            cy={190}
            r="10"
            className="fill-primary/20"
            animate={{ cy: [186, 194, 186] }}
            transition={{ duration: 4.5 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        {[60, 150, 300].map((x, i) => (
          <motion.line
            key={`d${x}`}
            x1={180}
            y1={140}
            x2={x}
            y2={180}
            stroke="currentColor"
            className="text-primary/40"
            strokeWidth="2"
            markerEnd="url(#arrow)"
            strokeDasharray="4 6"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 2.4 + i * 0.2, repeat: Infinity }}
          />
        ))}
      </svg>
    );
  }
  if (kind === 1) {
    return (
      <div className="relative w-full max-w-sm h-56 flex items-center justify-center">
        <motion.div className="absolute inset-0 rounded-2xl border border-primary/20" />
        <motion.div
          className="absolute w-40 h-40 rounded-full border-2 border-primary/30"
          animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <Shield className="w-12 h-12 text-primary relative" />
      </div>
    );
  }
  if (kind === 2) {
    return (
      <svg viewBox="0 0 360 200" className="w-full max-w-md" aria-hidden="true">
        <defs>
          <filter id="cyan-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect
          x="20"
          y="20"
          width="320"
          height="160"
          rx="14"
          className="fill-primary/5 stroke-primary/20"
          strokeWidth="2"
        />
        {[40, 80, 120, 160, 200, 240, 280, 320].map((x) => (
          <line key={x} x1={x} y1={30} x2={x} y2={170} className="stroke-primary/10" strokeWidth="1" />
        ))}
        <motion.path
          d="M 40 150 L 80 120 L 120 130 L 160 90 L 200 110 L 240 80 L 280 95 L 320 60"
          fill="none"
          stroke="currentColor"
          className="text-primary"
          strokeWidth="2"
          style={{ filter: "url(#cyan-glow)" }}
          animate={{ pathLength: [0, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
        />
      </svg>
    );
  }
  if (kind === 3) {
    return (
      <svg viewBox="0 0 360 180" className="w-full max-w-md" aria-hidden="true">    
        <defs>
          <filter id="ms-glow" x="-50%" y="-50%" width="200%" height="200%">        
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>   
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <motion.rect
          x="150"
          y="60"
          width="60"
          height="60"
          rx="14"
          className="fill-primary/10 stroke-primary/30"
          strokeWidth="2"
          animate={{ opacity: [0.85, 1, 0.85], y: [60, 58, 60] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {[
          { x: 60, y: 35, d: 3.8 },
          { x: 300, y: 35, d: 4.2 },
          { x: 60, y: 145, d: 4.5 },
          { x: 300, y: 145, d: 3.6 },
        ].map((n, i) => (
          <g key={i}>
            <motion.line
              x1={180}
              y1={90}
              x2={n.x}
              y2={n.y}
              stroke="currentColor"
              className="text-primary/35"
              strokeWidth="2"
              strokeDasharray="6 6"
              animate={{ strokeDashoffset: [0, -12] }}
              transition={{ duration: 2.2 + i * 0.2, repeat: Infinity, ease: "linear" }}
            />
            <motion.rect
              x={n.x - 10}
              y={n.y - 10}
              width="20"
              height="20"
              rx="6"
              className="fill-primary/10 stroke-primary/40"
              strokeWidth="2"
              filter="url(#ms-glow)"
              animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: n.d, repeat: Infinity, ease: "easeInOut" }}   
            />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            r="2"
            className="fill-primary"
            filter="url(#ms-glow)"
            animate={{
              cx: [60, 180, 300, 180, 60][i],
              cy: [90, 35, 90, 145, 90][i],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "linear" }}      
          />
        ))}
      </svg>
    );
  }
  if (kind === 4) {
    return (
      <svg viewBox="0 0 360 180" className="w-full max-w-md" aria-hidden="true">
        <rect
          x="60"
          y="50"
          width="80"
          height="80"
          rx="14"
          className="fill-primary/10 stroke-primary/30"
          strokeWidth="2"
        />
        <rect
          x="220"
          y="50"
          width="80"
          height="80"
          rx="14"
          className="fill-primary/10 stroke-primary/30"
          strokeWidth="2"
        />
        <motion.line
          x1="140"
          y1="90"
          x2="220"
          y2="90"
          stroke="currentColor"
          className="text-primary/40"
          strokeWidth="3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </svg>
    );
  }
  return (
    <div className="flex items-end gap-2 w-full max-w-xs h-40">
      {[10, 18, 26, 34, 42].map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-md bg-primary/30"
          style={{ height: h }}
          animate={{ height: [h, h + 20, h] }}
          transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function ArchitectureDiagram() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const orbitIcons = [Shield, Zap, Activity, Network, Boxes, Share2];
  
  const steps = 60; 
  const duration = 40; 
  
  // Define precise dimensions
  // Desktop: container 240px, radius 120px
  // Mobile: container 200px, radius 100px
  const [dim, setDim] = useState({ size: 240, r: 120 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDim({ size: 160, r: 120 });
      } else {
        setDim({ size: 200, r: 150 });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={ref} className="relative mx-auto flex items-center justify-center w-full max-w-[400px] md:max-w-[600px] aspect-square overflow-visible">
      
      {/* 1. Combined Diagram (SVG) - Centralized Coordinate System */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg 
          className="w-full h-full overflow-visible" 
          viewBox="0 0 600 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(300, 300)">
            {/* The Main Orbit Path (Dashed Circle) */}
            <circle 
              r={dim.r} 
              stroke="currentColor" 
              className="text-primary/20" 
              strokeWidth="1" 
              strokeDasharray="4 4" 
            />
            
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const Icon = orbitIcons[idx];
              const angle = (idx * Math.PI * 2) / 6;
              const xKeys = Array.from({ length: steps + 1 }, (_, k) => dim.r * Math.cos(angle + (k / steps) * Math.PI * 2));
              const yKeys = Array.from({ length: steps + 1 }, (_, k) => dim.r * Math.sin(angle + (k / steps) * Math.PI * 2));

              return (
                <g key={`orbit-svg-${idx}`}>
                  {/* Radial Lines from Center */}
                  <motion.line
                    x1="0" y1="0"
                    stroke="currentColor" className="text-primary/10" strokeWidth="1"
                    animate={inView ? { x2: xKeys, y2: yKeys } : undefined}
                    transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Orbiting Icons using foreignObject to keep them in SVG space */}
                  <motion.g
                    animate={inView ? { 
                      x: xKeys,
                      y: yKeys
                    } : undefined}
                    transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
                  >
                    <foreignObject x="-25" y="-25" width="50" height="50" className="overflow-visible pointer-events-auto">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg glass-panel border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-black/40 group hover:border-primary/50 transition-colors relative">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                          {/* Status Indicator */}
                          <div className="absolute -top-0.5 -right-0.5 w-2 h-2">
                            <div className="absolute inset-0 rounded-full bg-primary/80 animate-ping" />
                            <div className="absolute inset-0 rounded-full bg-primary shadow-[0_0_5px_rgba(59,130,246,1)]" />
                          </div>
                        </div>
                      </div>
                    </foreignObject>
                  </motion.g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 2. Central Logo - Exactly at the center */}
      <div 
        className="relative z-10 flex items-center justify-center"
        style={{ width: dim.size, height: dim.size }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/40 bg-primary/5 shadow-[0_0_30px_rgba(59,130,246,0.1)] flex items-center justify-center overflow-hidden"
          animate={inView ? {
            boxShadow: ["0 0 15px rgba(59,130,246,0.1)", "0 0 40px rgba(59,130,246,0.2)", "0 0 15px rgba(59,130,246,0.1)"],
          } : undefined}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
          <img 
            src="/assets/sopo_logo.gif" 
            alt="SOPO Logo" 
            className="w-1/2 h-1/2 object-contain relative z-10" 
          />
          {/* Inner pulse */}
          <motion.div 
            className="absolute inset-0 bg-primary/5 rounded-full"
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}