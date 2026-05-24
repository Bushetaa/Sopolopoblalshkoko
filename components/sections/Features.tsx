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
  Puzzle,
  Workflow,
  BarChart3,
  Key,
  CloudUpload,
  Check,
  Settings,
  Layout,
  Globe,
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
    title: "Centralized Workspace Control",
    description:
      "Manage all your API infrastructure from a unified workspace. Organize Gateways, Services, and Routes in a logical hierarchy designed for team collaboration and total visibility.",
    icon: Layout,
    align: "left" as const,
    tech: ["Unified Workspace", "Team RBAC", "Global View"]
  },
  {
    title: "Visual Workflow Orchestration",
    description:
      "Visualize your entire request pipeline as an interactive node graph. Track the flow from Gateway to Plugins, Routes, Services, and finally to your Upstream Targets with zero ambiguity.",
    icon: Workflow,
    align: "right" as const,
    tech: ["Interactive Graph", "Live Path Tracing", "Entity Mapping"]
  },
  {
    title: "Phase-Based Execution Engine",
    description:
      "Inject powerful logic at any stage. Our 5-phase engine (Access, Auth, Rate-Limit, Transform, Log) allows you to attach global or route-specific plugins without dropping connections.",
    icon: Puzzle,
    align: "left" as const,
    tech: ["Access Phase", "Auth Phase", "Hot-Reload"]
  },
  {
    title: "Decoupled Service Architecture",
    description:
      "Abstract your backends into reusable Services. Route traffic to multiple Upstream Targets with automated health checks and intelligent path-based discovery.",
    icon: Boxes,
    align: "right" as const,
    tech: ["Service Abstraction", "Upstream Health", "Path Discovery"]
  },
  {
    title: "Real-time Telemetry Dashboard",
    description:
      "Instant visibility into your API performance. Monitor P99 latency, error rates, and live logs directly from the dashboard with sub-second telemetry updates.",
    icon: BarChart3,
    align: "left" as const,
    tech: ["Live Logs", "P99 Metrics", "Error Tracking"]
  },
  {
    title: "Multi-Mode Gateway Nodes",
    description:
      "Deploy your data plane in 'Single Node' for simple setups or 'Pro Cluster' for high-availability production environments. Scale your infrastructure as your traffic grows.",
    icon: Server,
    align: "right" as const,
    tech: ["Single Node", "Pro Cluster", "Auto-Scale"]
  },
];

export function Features() {
  return (
    <section className="pt-6 sm:pt-12 md:pt-14 pb-24 sm:pb-32 md:pb-48 relative overflow-hidden bg-background">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black mb-4 uppercase tracking-[0.3em]">
            <Zap className="w-4 h-4" /> The Power of SOPO
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tight mb-4 leading-[0.9]">
            Next-Gen <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-blue-400 italic">
              API Infrastructure
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium">
            Centralize, secure, and intelligently orchestrate your microservices with a deterministic control plane built for extreme scale.
          </p>
        </motion.div>

        {/* Feature Grid - Re-designed as modern bento-like rows */}
        <div className="space-y-12 md:space-y-24">
          {blocks.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
              >
                <div className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-primary/30 transition-all duration-700 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <FeatureSketch kind={i} />
                  </div>
                </div>

                <div className={`lg:col-span-6 space-y-6 ${i % 2 === 1 ? "lg:order-1 lg:text-right" : "lg:order-2"}`}>
                  <div className={`w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-500 ${i % 2 === 1 ? "lg:ml-auto" : ""}`}>
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-3xl md:text-5xl font-display font-black tracking-tight text-foreground">
                    {b.title}
                  </h3>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    {b.description}
                  </p>

                  {/* Tech Badges */}
                  <div className={`flex flex-wrap gap-2 pt-2 ${i % 2 === 1 ? "justify-end" : ""}`}>
                    {b.tech?.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary/70">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className={`flex items-center gap-4 pt-4 ${i % 2 === 1 ? "justify-end" : ""}`}>
                    <div className="h-px w-12 bg-primary/30" />
                    <span className="text-xs font-black uppercase tracking-widest text-primary/60">Enterprise Feature</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 mt-32 md:mt-48">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h3 className="text-4xl md:text-7xl font-display font-black tracking-tight mb-6">
              Deterministic <br />
              <span className="text-primary italic">Architecture</span>
            </h3>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              A high-performance pipeline designed for zero-trust microservice communication at global scale.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 hidden lg:block">
              <div className="glass-panel p-12 rounded-[3.5rem] border-white/5 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <ArchitectureDiagram />
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              {[
                {
                  t: "Hyper-Performance",
                  d: "Global edge routing with sub-millisecond execution overhead.",
                  icon: Zap,
                  color: "from-amber-400 to-orange-500",
                },
                {
                  t: "Military-Grade Security",
                  d: "Native OIDC/JWT enforcement and automated mTLS rotation.",
                  icon: ShieldCheck,
                  color: "from-blue-400 to-cyan-500",
                },
                {
                  t: "Advanced Governance",
                  d: "Visual policy auditing and versioned environment promotion.",
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
                  className="glass-panel p-8 rounded-3xl border-white/5 hover:border-primary/40 hover:bg-white/[0.02] transition-all group"
                >
                  <div className="flex gap-6 items-center">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} p-0.5 shrink-0 shadow-lg shadow-black/40`}>
                      <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center">
                        <c.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-2xl font-display font-black mb-1 text-foreground group-hover:text-primary transition-colors">{c.t}</h5>
                      <p className="text-muted-foreground leading-relaxed">{c.d}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Epic CTA Section */}
      <div className="container mx-auto px-6 lg:px-8 relative z-10 mt-32 md:mt-48 mb-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel p-12 md:p-24 rounded-[4rem] border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent backdrop-blur-3xl relative overflow-hidden text-center"
          >
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-display font-black leading-[0.9] tracking-tight mb-12">
                Orchestrate your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 italic">API Future</span>
              </h2>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Link href="/signup">
                  <Button className="group h-20 px-12 text-2xl font-black bg-primary text-primary-foreground shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] hover:scale-105 transition-all duration-500 rounded-2xl">
                    GET STARTED NOW
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>

                <div className="flex flex-col items-center sm:items-start gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden ring-4 ring-primary/10">
                        <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
                    <span className="text-foreground">500+</span> enterprise teams
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
  // Unused, but kept for internal reference if needed, or can be removed.
  return null;
}

function FeatureSketch({ kind }: { kind: number }) {
  if (kind === 0) {
    // Centralized Workspace Control - Showing a unified dashboard view
    return (
      <div className="relative w-full h-full min-h-[240px] flex items-center justify-center p-6 bg-primary/5 rounded-3xl overflow-hidden">
        <div className="w-full max-w-[280px] bg-background/60 backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-2xl">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <div className="ml-auto text-[8px] font-mono text-muted-foreground uppercase">Workspace: Main</div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Gateways", count: 4, icon: Globe },
              { label: "Services", count: 12, icon: Boxes },
              { label: "Routes", count: 24, icon: Share2 }
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5"
              >
                <item.icon className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-bold text-foreground/80">{item.label}</span>
                <span className="ml-auto text-[10px] font-mono text-primary">{item.count}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (kind === 1) {
    // Visual Workflow Orchestration - High Fidelity Node Graph
    return (
      <div className="relative w-full h-full min-h-[280px] flex items-center justify-center p-6 bg-primary/5 rounded-[2.5rem] overflow-hidden group">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15)_0%,transparent_70%)]" />
        <svg viewBox="0 0 400 300" className="w-full h-full max-w-[340px] drop-shadow-2xl">
          <defs>
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Connection Lines with animated dash */}
          {[
            { x1: 60, y1: 150, x2: 140, y2: 80 },
            { x1: 60, y1: 150, x2: 140, y2: 220 },
            { x1: 140, y1: 80, x2: 260, y2: 150 },
            { x1: 140, y1: 220, x2: 260, y2: 150 },
            { x1: 260, y1: 150, x2: 340, y2: 150 }
          ].map((line, i) => (
            <g key={`line-${i}`}>
              <line
                x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.2"
              />
              <motion.line
                x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="url(#line-grad)" strokeWidth="2" strokeDasharray="10 20"
                animate={{ strokeDashoffset: [0, -30] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </g>
          ))}

          {/* Nodes */}
          {[
            { x: 60, y: 150, label: "GW", icon: Globe, color: "text-primary", bg: "fill-primary/10", stroke: "stroke-primary/40" },
            { x: 140, y: 80, label: "RT", icon: Share2, color: "text-blue-400", bg: "fill-blue-400/10", stroke: "stroke-blue-400/40" },
            { x: 140, y: 220, label: "PLG", icon: Puzzle, color: "text-purple-400", bg: "fill-purple-400/10", stroke: "stroke-purple-400/40" },
            { x: 260, y: 150, label: "SVC", icon: Boxes, color: "text-emerald-400", bg: "fill-emerald-400/10", stroke: "stroke-emerald-400/40" },
            { x: 340, y: 150, label: "TGT", icon: Network, color: "text-amber-400", bg: "fill-amber-400/10", stroke: "stroke-amber-400/40" }
          ].map((node, i) => (
            <motion.g
              key={node.label}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1 }}
            >
              <circle
                cx={node.x} cy={node.y} r="22"
                className="fill-background stroke-white/10"
                strokeWidth="1"
              />
              <circle
                cx={node.x} cy={node.y} r="18"
                className={`${node.bg} ${node.stroke}`}
                strokeWidth="1.5"
                style={{ filter: "url(#node-glow)" }}
              />
              <foreignObject x={node.x - 10} y={node.y - 10} width="20" height="20">
                <div className="w-full h-full flex items-center justify-center">
                  <node.icon className={`w-3.5 h-3.5 ${node.color}`} />
                </div>
              </foreignObject>
              <text
                x={node.x} y={node.y + 35}
                textAnchor="middle"
                className="fill-white/40 text-[9px] font-black uppercase tracking-widest"
              >
                {node.label}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
    );
  }
  if (kind === 2) {
    // Phase-Based Execution Engine - Ultra-Rich Pipeline
    const phases = [
      { id: "ACCESS", color: "text-blue-400", bg: "bg-blue-400/10", icon: Shield },
      { id: "AUTH", color: "text-primary", bg: "bg-primary/10", icon: Key },
      { id: "RATE", color: "text-amber-400", bg: "bg-amber-400/10", icon: Zap },
      { id: "TRANS", color: "text-emerald-400", bg: "bg-emerald-400/10", icon: Code2 },
      { id: "LOG", color: "text-purple-400", bg: "bg-purple-400/10", icon: Activity }
    ];
    return (
      <div className="relative w-full h-full min-h-[280px] flex items-center justify-center p-8 bg-primary/5 rounded-[2.5rem] overflow-hidden">
        <div className="flex flex-col gap-4 w-full max-w-[240px]">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Pipeline Execution</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] font-mono text-green-500 font-bold uppercase">Streaming</span>
            </div>
          </div>

          <div className="space-y-3 relative">
            {/* Background connection line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5 z-0" />

            {phases.map((phase, i) => (
              <motion.div
                key={phase.id}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 flex items-center gap-4 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${phase.bg} border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all shadow-xl backdrop-blur-sm`}>
                  <phase.icon className={`w-5 h-5 ${phase.color}`} />
                </div>
                <div className="flex-1 p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between group-hover:bg-white/[0.06] transition-all">
                  <span className="text-xs font-black text-foreground/80 tracking-tight">{phase.id}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(dot => (
                      <motion.div
                        key={dot}
                        className={`w-1 h-1 rounded-full ${phase.color.replace('text-', 'bg-')}`}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, delay: dot * 0.2 + i * 0.2, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
                {/* Flow particle */}
                <motion.div
                  className={`absolute left-6 w-2 h-2 rounded-full ${phase.color.replace('text-', 'bg-')} shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
                  initial={{ top: -20, opacity: 0 }}
                  animate={{ top: [0, 60], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5 rounded-[2.5rem]" />
      </div>
    );
  }
  if (kind === 3) {
    // Decoupled Service Architecture - Services & Targets
    return (
      <div className="relative w-full h-full min-h-[240px] flex items-center justify-center p-6 bg-primary/5 rounded-3xl">
        <div className="w-full max-w-[280px] space-y-4">
          <div className="p-3 rounded-xl border border-primary/30 bg-primary/10 flex items-center gap-3">
            <Boxes className="w-5 h-5 text-primary" />
            <div>
              <div className="text-[10px] font-black text-foreground">Order Service</div>
              <div className="text-[8px] text-muted-foreground uppercase">ID: svc_9283</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Target A", status: "Healthy" },
              { label: "Target B", status: "Healthy" }
            ].map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                className="p-2 rounded-lg border border-white/5 bg-background/40 flex flex-col gap-1"
              >
                <div className="text-[8px] font-bold text-muted-foreground uppercase">{t.label}</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[8px] text-green-500 font-bold uppercase">Online</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (kind === 4) {
    // Real-time Telemetry Dashboard - Mini Metrics
    return (
      <div className="relative w-full h-full min-h-[240px] flex items-center justify-center p-6 bg-primary/5 rounded-3xl overflow-hidden">
        <div className="w-full max-w-[300px] h-[160px] bg-background/60 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex flex-col gap-4 relative">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global P99</div>
              <div className="text-xl font-display font-black text-primary">18ms</div>
            </div>
            <div className="text-[8px] font-mono text-green-500 animate-pulse uppercase font-black tracking-widest">Live Streaming</div>
          </div>
          <div className="flex-1 flex items-end gap-1 pt-2">
            {[40, 60, 35, 80, 50, 75, 45, 95, 65, 85, 55, 70].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-primary rounded-t-[2px]"
                animate={{ height: [`${h}%`, `${h - 15}%`, `${h}%`] }}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  // Multi-Mode Gateway Nodes - Single vs Pro
  return (
    <div className="relative w-full h-full min-h-[240px] flex items-center justify-center p-6 bg-primary/5 rounded-3xl">
      <div className="grid grid-cols-2 gap-4 w-full max-w-[320px]">
        {[
          { mode: "SINGLE", desc: "Lightweight", color: "border-white/10" },
          { mode: "PRO", desc: "High Availability", color: "border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] bg-primary/5" }
        ].map((node, i) => (
          <motion.div
            key={node.mode}
            whileHover={{ y: -5 }}
            className={`p-4 rounded-2xl border ${node.color} flex flex-col items-center gap-3 text-center`}
          >
            <Server className={`w-8 h-8 ${i === 1 ? 'text-primary' : 'text-muted-foreground'}`} />
            <div>
              <div className={`text-[10px] font-black tracking-widest ${i === 1 ? 'text-primary' : 'text-foreground'}`}>{node.mode}</div>
              <div className="text-[8px] text-muted-foreground uppercase mt-0.5">{node.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
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