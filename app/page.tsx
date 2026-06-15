"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  AlertTriangle, Activity, Clock, Settings, ShieldAlert, Split, ZapOff, Lock, RefreshCcw,
  Sparkles, ShieldCheck, Rocket, Zap, Gavel, MousePointer2, Layers, Puzzle, BarChart3,
  PlusCircle, Edit, CloudUpload, ArrowUpDown, Ban, Key, LineChart, ToyBrick, Globe,
  Network, ExternalLink, ChevronRight
} from "lucide-react";

const fadeIn = { 
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const staggerContainer = { 
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true }
};

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!localStorage.getItem("sopo_access_token"));
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // If loading and there is a token in localStorage, show a loading screen to prevent flashing
  if (isLoading && hasToken) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 animate-pulse">
          <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Loading Workspace...</span>
      </div>
    );
  }

  // If already logged in, do not render landing page content while router redirects
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30 selection:text-primary-foreground">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--foreground)) 1px, transparent 0)`, backgroundSize: '40px 40px' }}>
      </div>

      <main className="flex-grow relative z-10">
        <Hero />
        <LogoMarquee />
        
        {/* The Problem Section - Darker/More Intense */}
        <section className="py-20 md:py-40 relative overflow-hidden" id="problem">
          <div className="absolute top-0 right-0 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-destructive/10 blur-[80px] md:blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[250px] md:w-[600px] h-[250px] md:h-[600px] bg-destructive/5 blur-[60px] md:blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div {...fadeIn} className="max-w-4xl mx-auto text-center mb-12 md:mb-24">
              <h2 className="text-[10px] md:text-sm font-black tracking-[0.3em] text-destructive uppercase mb-4 md:mb-6 inline-block px-3 md:px-4 py-1 border border-destructive/20 rounded-full bg-destructive/5">The Challenge</h2>
              <h3 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold mb-6 md:mb-8 tracking-tight leading-[1.1] px-2">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-destructive to-destructive/60">Fragmentation</span> Chaos
              </h3>
              <p className="text-base sm:text-lg md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
                Manual API management spreads routing, auth, and policies across tools and teams—creating drift and risky releases.
              </p>
            </motion.div>

            {/* Bento Grid for Problem */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-auto md:auto-rows-[380px]">
              {/* Large Card */}
              <motion.div 
                variants={fadeIn}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="md:col-span-8 group glass-panel p-6 sm:p-10 md:p-12 rounded-2xl md:rounded-3xl hover:border-destructive/40 transition-all duration-500 overflow-hidden relative min-h-[320px] md:min-h-0"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity hidden sm:block">
                  <ShieldAlert className="w-32 md:w-48 h-32 md:h-48 text-destructive" />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-end">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-6 md:mb-8">
                    <ShieldAlert className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 leading-tight">Risky Deploys & Opaque Configs</h4>
                  <p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-xl leading-relaxed">Opaque configurations and manual updates lead to unpredictable production behavior and dangerous release cycles.</p>
                </div>
              </motion.div>

              {/* Medium Card */}
              <motion.div 
                variants={fadeIn}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="md:col-span-4 group glass-panel p-6 sm:p-10 md:p-10 rounded-2xl md:rounded-3xl hover:border-destructive/40 transition-all duration-500 overflow-hidden relative flex flex-col justify-between min-h-[320px] md:min-h-0"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity hidden sm:block">
                   <Network className="w-24 md:w-32 h-24 md:h-32 text-destructive/30" />
                </div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                    <Split className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <h4 className="text-xl sm:text-2xl md:text-2xl font-bold mb-3 md:mb-4">Environment Drift</h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                    Inconsistent behavior across Dev, Staging, and Production environments causes <span className="text-destructive/80 font-bold italic">"it works on my machine"</span> syndrome.
                  </p>
                </div>

                {/* Visual Drift Indicator */}
                <div className="relative h-12 md:h-14 w-full bg-destructive/5 rounded-xl border border-destructive/10 overflow-hidden p-3 md:p-4 flex items-center gap-4 mt-auto">
                  <div className="flex flex-col gap-1.5 md:gap-2 w-full">
                    <div className="h-1 w-[90%] bg-destructive/40 rounded-full"></div>
                    <div className="h-1 w-[60%] bg-destructive/20 rounded-full animate-pulse"></div>
                  </div>
                  <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 text-destructive shrink-0 animate-bounce" />
                </div>
              </motion.div>

              {/* Square Cards */}
              {[
                { t: "Slow Recovery", d: "Long mean-time-to-restore due to complex manual rollbacks.", i: <Clock className="w-6 h-6" />, bgIcon: Clock },
                { t: "Config Sprawl", d: "Policies scattered across multiple tools.", i: <Settings className="w-6 h-6" />, bgIcon: Settings },
                { t: "Auth Inconsistency", d: "Security logic becomes fragmented over time.", i: <Lock className="w-6 h-6" />, bgIcon: Lock },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeIn}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="md:col-span-4 group glass-panel p-6 sm:p-10 rounded-2xl md:rounded-3xl hover:border-destructive/40 transition-all duration-500 relative overflow-hidden min-h-[240px] md:min-h-0"
                >
                  <div className="absolute -bottom-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
                    <item.bgIcon className="w-24 md:w-32 h-24 md:h-32 text-destructive" />
                  </div>
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-destructive/10 flex items-center justify-center text-destructive mb-6 group-hover:scale-110 transition-transform">
                      {item.i}
                    </div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-4">{item.t}</h4>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">{item.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* The Solution Section - Brighter/Cleaner */}
        <section className="py-20 md:py-40 relative" id="solution">
          <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[1000px] h-[300px] md:h-[1000px] bg-primary/5 blur-[80px] md:blur-[180px] rounded-full pointer-events-none"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div {...fadeIn} className="max-w-4xl mx-auto text-center mb-12 md:mb-24">
              <h2 className="text-[10px] md:text-sm font-black tracking-[0.3em] text-primary uppercase mb-4 md:mb-6 inline-block px-3 md:px-4 py-1 border border-primary/20 rounded-full bg-primary/5">The Solution</h2>
              <h3 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold mb-6 md:mb-8 tracking-tight leading-[1.1] px-2">
                Deterministic <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Pipeline</span>
              </h3>
              <p className="text-base sm:text-lg md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
                SOPO Gateway is a no-code API gateway that turns policy chaos into a clear, unified pipeline—fast to change and safe to ship.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { 
                  t: "Visual Policies", 
                  d: "Define routes, auth, and transforms in one place. Review interactive diffs before every deploy.", 
                  i: <Sparkles className="w-6 h-6 md:w-8 md:h-8" />,
                  gradient: "from-blue-500/20 to-indigo-500/20"
                },
                { 
                  t: "Safe Delivery", 
                  d: "Gated promotions and one-click rollbacks. Test in Staging, promote with total confidence.", 
                  i: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />,
                  gradient: "from-indigo-500/20 to-purple-500/20"
                },
                { 
                  t: "Ship Faster", 
                  d: "Built-in observability to fix bottlenecks quickly. Focus on building product, not plumbing.", 
                  i: <Rocket className="w-6 h-6 md:w-8 md:h-8" />,
                  gradient: "from-purple-500/20 to-pink-500/20"
                },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  {...fadeIn} 
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative h-full"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl md:rounded-3xl blur-xl`}></div>
                  <div className="relative glass-panel p-6 sm:p-10 md:p-10 rounded-2xl md:rounded-3xl h-full border-white/5 group-hover:border-primary/30 transition-all duration-500 flex flex-col">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 md:mb-8 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] transition-all shrink-0">
                      {item.i}
                    </div>
                    <h4 className="text-xl sm:text-2xl md:text-2xl font-bold mb-3 md:mb-4">
                      {item.t}
                    </h4>
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                      {item.d}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why SOPO Section - Clean & Informative */}
        <section className="py-20 md:py-40 bg-background/50 relative overflow-hidden" id="why-sopo">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div {...fadeIn} className="max-w-4xl mx-auto text-center mb-12 md:mb-24">
              <h2 className="text-[10px] md:text-sm font-black tracking-[0.3em] text-primary uppercase mb-4 md:mb-6">Why Choose SOPO</h2>
              <h3 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold mb-6 md:mb-8 tracking-tight px-2">Built for <span className="text-primary italic">Velocity</span></h3>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">Clear ownership and safe releases without the configuration chaos.</p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              {[
                { t: "Developer Velocity", d: "Ship policies in minutes—no YAML wrestling required.", i: <Zap className="w-5 h-5 md:w-6 md:h-6" /> },
                { t: "Stronger Governance", d: "Unified changes, clean diffs, and safe approvals.", i: <Gavel className="w-5 h-5 md:w-6 md:h-6" /> },
                { t: "One-Click Deploys", d: "Promote with confidence and roll back without drama.", i: <MousePointer2 className="w-5 h-5 md:w-6 md:h-6" /> },
                { t: "Zero Drift", d: "Environment-aware configs keep Dev and Prod aligned.", i: <Layers className="w-5 h-5 md:w-6 md:h-6" /> },
                { t: "Composable Plugins", d: "Ready plugins plus your own, reusable presets.", i: <Puzzle className="w-5 h-5 md:w-6 md:h-6" /> },
                { t: "Observability", d: "Per-route tail latency and errors with alerts and traces.", i: <BarChart3 className="w-5 h-5 md:w-6 md:h-6" /> },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeIn} 
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="group glass-panel p-6 sm:p-10 rounded-2xl md:rounded-3xl transition-all duration-300 border-white/5"
                >
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 md:mb-6 group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] transition-all">
                    {item.i}
                  </div>
                  <h4 className="text-lg sm:text-xl md:text-xl font-bold mb-2 md:mb-3">{item.t}</h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.d}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section - Visual Workflow */}
        <section className="py-20 md:py-40 relative" id="how-it-works">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div {...fadeIn} className="max-w-4xl mx-auto text-center mb-12 md:mb-24">
              <h2 className="text-[10px] md:text-sm font-black tracking-[0.3em] text-primary uppercase mb-4 md:mb-6">Workflow</h2>
              <h3 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold mb-6 md:mb-8 tracking-tight">Simple Setup</h3>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-primary/5 via-primary/40 to-primary/5 z-0"></div>
              
              {[
                { 
                  t: "Create Project", 
                  d: "Spin up a clean workspace with Dev, Staging, and Prod. Bootstrap templates with secure baselines.",
                  i: <PlusCircle className="w-8 h-8 md:w-10 md:h-10" />
                },
                { 
                  t: "Configure Visually", 
                  d: "Define paths and drag-and-drop plugins like API Key and Rate Limits. Review diffs instantly.",
                  i: <Edit className="w-8 h-8 md:w-10 md:h-10" />
                },
                { 
                  t: "Deploy Instantly", 
                  d: "Use gated promotions to promote to Prod with one click. Roll back in seconds if metrics spike.",
                  i: <CloudUpload className="w-8 h-8 md:w-10 md:h-10" />
                },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  {...fadeIn} 
                  transition={{ delay: i * 0.2 }}
                  className="relative z-10 flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center text-primary mb-6 md:mb-10 shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)] group-hover:border-primary group-hover:scale-110 transition-all duration-500 relative ring-pulse">
                    <div className="absolute -inset-2 bg-primary/5 rounded-full animate-pulse"></div>
                    {item.i}
                  </div>
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">{item.t}</h4>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-sm px-6">{item.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture Section - Engineering Focused */}
        <section className="py-20 md:py-40 relative overflow-hidden" id="architecture">
          <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-primary/5 blur-[80px] md:blur-[150px] rounded-full pointer-events-none translate-y-1/2 translate-x-1/4"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row gap-12 md:gap-24 items-center">
              <motion.div {...fadeIn} className="lg:w-1/2 w-full">
                <h2 className="text-[10px] md:text-sm font-black tracking-[0.3em] text-primary uppercase mb-4 md:mb-6">Engineering</h2>
                <h3 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold mb-8 md:mb-10 leading-[1.1] tracking-tight px-2">Architecture at a Glance</h3>
                <p className="text-base sm:text-lg md:text-2xl text-muted-foreground leading-relaxed mb-8 md:mb-12 px-4">
                  A deterministic pipeline: routing, auth, and transforms applied consistently in the data plane, with a visual control plane for unified deploys.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 px-4 md:px-0">
                  {[
                    { t: "Fast Data Plane", d: "Low-latency execution for every request.", i: <Zap className="w-5 h-5" /> },
                    { t: "Visual Control", d: "Deterministic deployments.", i: <MousePointer2 className="w-5 h-5" /> },
                    { t: "Redis-Backed", d: "Reliable state for limits and QoS.", i: <Layers className="w-5 h-5" /> },
                    { t: "Telemetry Flow", d: "Real-time logs and traces.", i: <Activity className="w-5 h-5" /> },
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 10 }}
                      className="flex gap-4 md:gap-5 items-start p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {item.i}
                      </div>
                      <div>
                        <div className="font-bold text-base sm:text-lg mb-1">{item.t}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{item.d}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                {...fadeIn} 
                className="lg:w-1/2 w-full aspect-square relative group mt-8 lg:mt-0 px-4 sm:px-0"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-[2.5rem] md:rounded-[4rem] blur-2xl md:blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative h-full w-full glass-panel rounded-[2rem] md:rounded-[3rem] border-white/10 flex items-center justify-center p-6 sm:p-10 md:p-20 overflow-hidden">
                  {/* Visual Representation of Architecture */}
                  <div className="relative w-full h-full flex items-center justify-center scale-90 sm:scale-75 md:scale-100">
                    <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                    <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
                    
                    <div className="relative z-10 w-24 h-24 sm:w-32 md:w-40 md:h-40 rounded-2xl md:rounded-3xl bg-background border border-primary/40 flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)] group-hover:scale-110 transition-transform duration-700">
                      <Network className="w-12 h-12 md:w-20 md:h-20 text-primary" />
                      <div className="absolute -inset-3 md:-inset-4 border border-primary/20 rounded-[1.5rem] md:rounded-[2rem] animate-[spin_10s_linear_infinite]"></div>
                      <div className="absolute -inset-6 md:-inset-8 border border-primary/10 rounded-[2rem] md:rounded-[2.5rem] animate-[spin_15s_linear_infinite_reverse]"></div>
                    </div>

                    {/* Animated Particles/Packets */}
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]"
                        style={{
                          animation: `data-flow-x 4s linear infinite ${i}s`,
                          top: `${30 + i * 15}%`,
                          left: '-10%'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section - Epic Conclusion */}
        <section className="py-24 md:py-60 relative overflow-hidden" id="cta">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[1200px] h-[300px] md:h-[1200px] bg-primary/10 blur-[80px] md:blur-[200px] rounded-full pointer-events-none opacity-50"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-6xl md:text-8xl font-display font-bold mb-8 md:mb-10 tracking-tighter leading-tight px-4">
                Ready to Scale <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/40 italic inline-block px-[16px] py-[16px] relative -left-[16px]">Safely?</span>
              </h2>
              <p className="text-base sm:text-lg md:text-3xl text-muted-foreground mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed px-6">
                Join the engineering teams managing APIs with zero drift and absolute confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center px-6">
                <Link href="/signup" className="w-full sm:w-auto group relative px-8 md:px-12 py-4 md:py-6 bg-primary text-primary-foreground font-display font-black tracking-[0.1em] md:tracking-[0.2em] rounded-xl md:rounded-2xl hover:scale-105 transition-all duration-300 shadow-[0_15px_40px_rgba(var(--primary-rgb),0.2)] md:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)]">
                  <div className="relative z-10 flex items-center justify-center gap-3 md:gap-4 text-sm md:text-base">
                    START NOW
                    <ChevronRight className="w-4 h-4 md:w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl md:rounded-2xl"></div>
                </Link>
                <Link href="/docs" className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 glass-panel font-display font-black tracking-[0.1em] md:tracking-[0.2em] rounded-xl md:rounded-2xl hover:bg-white/10 transition-all duration-300 border-white/10 text-sm md:text-base">
                  VIEW DOCS
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

