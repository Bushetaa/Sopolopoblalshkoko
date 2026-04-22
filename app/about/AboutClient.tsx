"use client";

import Link from "next/link";
import { Github, Linkedin, Zap, Shield, Layout, Target, Rocket, Activity, Globe, Cpu, BarChart3, Code2, Heart, CheckCircle2, Sparkles, Network, Infinity as InfinityIcon, ArrowRight, Database, Server, Lock, Cloud, Share2, FileText, FastForward, Check } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  { 
    icon: <Zap className="w-8 h-8 text-primary" />, 
    title: "Instant Velocity", 
    desc: "Built on high-performance architecture ensuring data flows seamlessly through every request, eliminating bottlenecks." 
  },
  { 
    icon: <Shield className="w-8 h-8 text-primary" />, 
    title: "Resilient Security", 
    desc: "Multi-layered protection and intelligent traffic management to keep your services secure and consistently reliable." 
  },
  { 
    icon: <Layout className="w-8 h-8 text-primary" />, 
    title: "Visual Control", 
    desc: "Define routes, auth, limits, and transforms in one visual place—no manual overhead or configuration chaos." 
  },
];

const developers = [
  { name: "Abdelrahman tony", github: "https://github.com/ab622", linkedin: "https://www.linkedin.com/in/abdelrahman-tony/" },
  { name: "Momen moatz", github: "https://github.com/momenmotaz", linkedin: "https://www.linkedin.com/in/momenmotaz/" },
  { name: "Sherif thabit", github: "https://github.com/Bushetaa", linkedin: "https://www.linkedin.com/in/sherif-thabit/" },
  { name: "Amr Hossam", github: "https://github.com/AmrHossamkamel", linkedin: "https://www.linkedin.com/in/amr-hossam-333687260" },
  { name: "Amr khalid", github: "https://github.com/Engamrbarkat", linkedin: "https://www.linkedin.com/in/amr-barkat-3a5b52299/" },
  { name: "Omar ayman", github: "https://github.com/oa0368770-web", linkedin: "https://www.linkedin.com/in/omar-ayman-982793341/" },
];

const stats = [
  { label: "Latency", value: "Minimal", icon: <Activity className="w-5 h-5" /> },
  { label: "Uptime", value: "Constant", icon: <CheckCircle2 className="w-5 h-5" /> },
  { label: "Plugins", value: "Diverse", icon: <Cpu className="w-5 h-5" /> },
  { label: "Reach", value: "Global", icon: <Globe className="w-5 h-5" /> },
];

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20 selection:bg-primary/30">
      {/* Background Decorations - Enhanced for both modes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 dark:bg-primary/20 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/10 blur-[180px] rounded-full"></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-24 pb-16 md:pt-40 md:pb-32 text-center max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-black mt-4 md:mt-0 mb-6 md:mb-8 uppercase tracking-[0.2em] md:tracking-[0.3em]">
              <AboutSparkles className="w-3.5 h-3.5 md:w-4 h-4" /> Next-Gen Gateway
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-display font-black mb-6 md:mb-8 tracking-tight leading-[1] md:leading-[0.9] text-foreground">
              Engineering the <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-blue-400 italic inline-block px-[11px] py-[11px] relative -left-[11px]">API Future</span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium mb-10 md:mb-12">
              SOPO APIGateway isn't just a gateway. It's a deterministic pipeline that turns policy chaos into clarity, 
              giving developers the velocity they deserve.
            </p>

            {/* Quick Stats Grid - Animated */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 max-w-4xl mx-auto">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="glass-panel p-4 md:p-6 rounded-xl md:rounded-2xl flex flex-col items-center justify-center border-black/5 dark:border-white/5 relative group overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                    className="text-primary mb-1 md:mb-2 opacity-80 relative z-10"
                  >
                    {stat.icon}
                  </motion.div>
                  
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-xl md:text-3xl font-black mb-1 font-display tracking-tight uppercase relative z-10 text-foreground"
                  >
                    {stat.value}
                  </motion.div>
                  
                  <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold relative z-10 opacity-60 group-hover:opacity-100 transition-opacity">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CORE PHILOSOPHY SECTION - RE-DESIGNED AS FEATURE GRID */}
        <section className="py-20 md:py-32 mb-10 md:mb-20 px-4">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-stretch">
            {/* Left Side: Main Feature Cards */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2 glass-panel p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border-black/5 dark:border-white/5 relative overflow-hidden group bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm shadow-sm"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center mb-6 md:mb-8 border border-primary/20">
                    <Code2 className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-black mb-4 text-foreground tracking-tight">Developer Velocity First</h3>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                    We believe developers should spend time on product, not plumbing. 
                    SOPO APIGateway eliminates configuration drift and manual overhead, letting you ship with unmatched speed.
                  </p>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700 text-foreground hidden md:block">
                  <Rocket className="w-64 h-64 rotate-12" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-black/5 dark:border-white/5 relative overflow-hidden group bg-card/50 backdrop-blur-sm shadow-sm"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 md:mb-6 border border-blue-500/20">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                </div>
                <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-foreground">Safety as a Default</h4>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Every change is versioned and reversible. Confidence in every deployment.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-black/5 dark:border-white/5 relative overflow-hidden group bg-card/50 backdrop-blur-sm shadow-sm"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 md:mb-6 border border-purple-500/20">
                  <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                </div>
                <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-foreground">Observability</h4>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Real-time insight into flows. No more guessing in production.
                </p>
              </motion.div>
            </div>

            {/* Right Side: Accelerated Deployment Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/3 glass-panel rounded-[2rem] md:rounded-[3.5rem] border-primary/20 flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden relative group bg-card/50 backdrop-blur-sm shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-6 md:mb-10"
                >
                  <div className="w-24 h-24 md:w-40 md:h-40 bg-primary/10 rounded-[2rem] md:rounded-[3rem] border border-primary/20 flex items-center justify-center mx-auto shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.2)_0%,transparent_70%)]"></div>
                    <Zap className="w-12 h-12 md:w-20 md:h-20 text-primary relative z-10 drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" />
                  </div>
                </motion.div>
                
                <h3 className="text-2xl md:text-4xl font-display font-black mb-2 md:mb-4 text-foreground tracking-tight">Accelerated</h3>
                <p className="text-primary font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs mb-6 md:mb-8">Policy Deployment</p>
                
                <div className="flex gap-2 justify-center">
                  {[...Array(3)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                      className="w-6 md:w-8 h-1 rounded-full bg-primary"
                    />
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full"></div>
            </motion.div>
          </div>
        </section>

        {/* NEW SECTION 1: THE ECOSYSTEM - RE-DESIGNED (SYSTEM INTERCONNECT) */}
        <section className="py-20 md:py-40 mb-10 md:mb-20 relative px-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.03)_0%,transparent_70%)]"></div>
          
          <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-32 relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-10 md:space-y-16"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6 md:mb-8">
                  Connectivity
                </div>
                <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tighter text-foreground leading-[1] md:leading-[0.85] mb-6 md:mb-10">
                  The Communication <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-blue-600 italic inline-block px-[7px] py-[7px] relative -left-[7px]">Fabric</span>
                </h2>
                <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed font-light max-w-xl">
                  SOPO APIGateway integrates into the very heart of your infrastructure, providing a unified path for data without the friction of traditional middleware.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:gap-10">
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="group flex gap-5 md:gap-8 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-card/50 border border-black/5 dark:border-white/5 hover:border-primary/30 transition-all duration-500 backdrop-blur-sm shadow-sm"
                >
                   <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Network className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                   </div>
                   <div>
                      <h4 className="text-xl md:text-2xl font-black text-foreground mb-1 md:mb-2 tracking-tight">Adaptive Topology</h4>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-light">Adapts to your existing patterns effortlessly, moving with the rhythm of your core logic.</p>
                   </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 10 }}
                  className="group flex gap-5 md:gap-8 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-card/50 border border-black/5 dark:border-white/5 hover:border-blue-400/30 transition-all duration-500 backdrop-blur-sm shadow-sm"
                >
                   <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                      <InfinityIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                   </div>
                   <div>
                      <h4 className="text-xl md:text-2xl font-black text-foreground mb-1 md:mb-2 tracking-tight">Limitless Expansion</h4>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-light">Grows with your vision, no matter the volume. Designed for massive scalability.</p>
                   </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/2 relative min-h-[500px] hidden md:flex items-center justify-center"
            >
              <div className="relative w-full h-full max-w-2xl aspect-square mx-auto">
                {/* Background Grid Dots */}
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-2 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                  {[...Array(144)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-foreground rounded-full"></div>
                  ))}
                </div>

                {/* SVG Connections (Lines) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  
                  {[...Array(6)].map((_, i) => {
                    const angle = (i * 60) * (Math.PI / 180);
                    const x2 = 200 + Math.cos(angle) * 140;
                    const y2 = 200 + Math.sin(angle) * 140;
                    return (
                      <g key={i}>
                        <motion.line 
                          x1="200" y1="200" x2={x2} y2={y2}
                          stroke="url(#lineGradient)"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          initial={{ pathLength: 0, opacity: 0 }}
                          whileInView={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 1.5, delay: i * 0.2 }}
                        />
                        {/* Data Pulses */}
                        <motion.circle
                          r="3"
                          fill="hsl(var(--primary))"
                          initial={{ offsetDistance: "0%" }}
                          animate={{ offsetDistance: "100%" }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            delay: i * 0.5,
                            ease: "easeInOut" 
                          }}
                          style={{ 
                            offsetPath: `path('M 200 200 L ${x2} ${y2}')`,
                            filter: "blur(2px) drop-shadow(0 0 5px hsl(var(--primary)))"
                          }}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Central Gateway Node */}
                <motion.div 
                  animate={{ 
                    boxShadow: ["0 0 20px rgba(var(--primary-rgb), 0.1)", "0 0 60px rgba(var(--primary-rgb), 0.3)", "0 0 20px rgba(var(--primary-rgb), 0.1)"],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-36 md:h-36 bg-background border-2 border-primary/40 backdrop-blur-3xl rounded-3xl flex items-center justify-center z-20 shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                  <Network className="w-12 h-12 md:w-16 md:h-16 text-primary relative z-10" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-primary/10 rounded-full scale-150 border-dashed"
                  />
                </motion.div>

                {/* Satellite Service Nodes */}
                {[
                  { Icon: Database, color: "text-blue-400", bg: "bg-blue-500/10" },
                  { Icon: Server, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { Icon: Lock, color: "text-amber-400", bg: "bg-amber-500/10" },
                  { Icon: Cloud, color: "text-sky-400", bg: "bg-sky-500/10" },
                  { Icon: Share2, color: "text-purple-400", bg: "bg-purple-500/10" },
                  { Icon: Cpu, color: "text-rose-400", bg: "bg-rose-500/10" }
                ].map((item, i) => {
                  const angle = (i * 60) * (Math.PI / 180);
                  const x = 50 + Math.cos(angle) * 35;
                  const y = 50 + Math.sin(angle) * 35;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 + i * 0.1 }}
                      className={`absolute w-14 h-14 md:w-16 md:h-16 ${item.bg} border border-white/10 dark:border-white/5 rounded-2xl flex items-center justify-center backdrop-blur-2xl shadow-lg z-30 group hover:border-primary/50 transition-colors`}
                      style={{ 
                        top: `calc(${y}% - ${item.Icon === Share2 ? '2px' : '0px'})`, 
                        left: `calc(${x}% - ${item.Icon === Share2 ? '60px' : '0px'})`,
                        transform: "translate(-50%, -50%)"
                      }}
                    >
                      <item.Icon className={`w-6 h-6 md:w-8 md:h-8 ${item.color} group-hover:scale-110 transition-transform`} />
                      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Ambient Particles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -20, 0],
                      x: [0, 10, 0],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{ 
                      duration: 3 + Math.random() * 5, 
                      repeat: Infinity, 
                      delay: Math.random() * 5 
                    }}
                    className="absolute w-1 h-1 bg-primary/40 rounded-full"
                    style={{ 
                      top: `${Math.random() * 100}%`, 
                      left: `${Math.random() * 100}%` 
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* VALUES SECTION - RE-DESIGNED (CORE PILLARS) */}
        <section className="py-20 md:py-40 px-4">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-6 md:mb-8">
              The Foundation
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-black mb-6 tracking-tighter text-foreground leading-[1] md:leading-none">
              Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/60 to-foreground/20 italic inline-block px-[10px] py-[10px] relative -left-[10px]">Pillars</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-light tracking-tight leading-relaxed">
              The engineering principles that guide every decision we make, <br className="hidden md:block" />
              ensuring stability, performance, and simplicity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {values.map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -15 }}
                className="group relative"
              >
                <div className="absolute -inset-4 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2rem] md:rounded-[3rem]"></div>
                
                <div className="glass-panel p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border-black/5 dark:border-white/5 bg-card/30 hover:bg-card/50 hover:border-primary/30 transition-all duration-700 relative z-10 h-full flex flex-col items-start text-left shadow-lg backdrop-blur-sm">
                   <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-[1.5rem] bg-primary/10 flex items-center justify-center mb-6 md:mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-primary/20">
                      {value.icon}
                   </div>
                   <h3 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {value.title}
                   </h3>
                   <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light group-hover:text-muted-foreground/90 transition-colors">
                      {value.desc}
                   </p>
                   
                   <div className="mt-auto pt-8 md:pt-10 w-full">
                      <div className="h-[1px] w-0 bg-primary/30 group-hover:w-full transition-all duration-1000"></div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* NEW SECTION 2: THE HORIZON - RE-DESIGNED (MINIMALIST & DEEP) */}
        <section className="py-20 md:py-40 mb-10 md:mb-20 relative px-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,hsl(var(--primary)/0.05)_0%,transparent_60%)]"></div>
          
          <div className="relative z-10 text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-8 md:mb-12">
                The Roadmap
              </div>
              <h2 className="text-4xl sm:text-7xl md:text-9xl font-display font-black mb-8 md:mb-12 tracking-tighter text-foreground leading-[1] md:leading-[0.85]">
                Beyond the <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-blue-600 italic inline-block px-[11px] py-[11px] relative -left-[11px]">Horizon</span>
              </h2>
              <p className="text-lg md:text-3xl text-muted-foreground leading-relaxed mb-12 md:mb-24 font-light tracking-tight max-w-3xl mx-auto">
                Our journey doesn't end with stability. We are constantly exploring the intersection of 
                AI-driven optimization and infrastructure automation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl">
                <div className="bg-card/50 backdrop-blur-xl p-8 md:p-16 group hover:bg-card/80 transition-colors duration-700">
                  <div className="text-primary font-black text-3xl md:text-5xl mb-2 md:mb-4 font-display group-hover:scale-110 transition-transform tracking-tighter">Infinite</div>
                  <div className="text-muted-foreground text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold group-hover:text-primary/60 transition-colors">Innovation</div>
                </div>
                <div className="bg-card/50 backdrop-blur-xl p-8 md:p-16 group hover:bg-card/80 transition-colors duration-700 border-y md:border-y-0 md:border-x border-black/5 dark:border-white/5">
                  <div className="text-foreground font-black text-3xl md:text-5xl mb-2 md:mb-4 font-display group-hover:scale-110 transition-transform tracking-tighter">Total</div>
                  <div className="text-muted-foreground text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold group-hover:text-foreground/40 transition-colors">Autonomy</div>
                </div>
                <div className="bg-card/50 backdrop-blur-xl p-8 md:p-16 group hover:bg-card/80 transition-colors duration-700">
                  <div className="text-blue-400 font-black text-3xl md:text-5xl mb-2 md:mb-4 font-display group-hover:scale-110 transition-transform tracking-tighter">Perfect</div>
                  <div className="text-muted-foreground text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold group-hover:text-blue-400/60 transition-colors">Clarity</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* STORY SECTION - BENTO GRID DESIGN (PREMIUM) */}
        <section className="mb-20 md:mb-40 relative px-4">
          <div className="text-center mb-12 md:mb-20">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-6">
                <Target className="w-3 h-3" /> The Evolution
             </div>
             <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter text-foreground">
                The <span className="text-primary italic">Genesis</span> of SOPO APIGateway
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 max-w-7xl mx-auto auto-rows-auto md:auto-rows-[300px]">
            {/* LARGE BOX: THE ORIGIN */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-8 md:row-span-2 glass-panel p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border-black/5 dark:border-white/5 relative overflow-hidden group bg-card/50 backdrop-blur-sm shadow-sm min-h-[400px] md:min-h-0"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity text-foreground hidden md:block">
                 <Cpu className="w-64 h-64 rotate-12" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                 <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                 </div>
                 <h3 className="text-2xl md:text-5xl font-display font-black mb-4 md:mb-6 text-foreground tracking-tight">The Origin</h3>
                 <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed font-light max-w-2xl">
                    SOPO Gateway started as a project to solve the fragmentation in microservices communication settings. 
                    We saw developers struggling with complex manual configurations and the friction 
                    of deploying changes to live services.
                 </p>
              </div>
            </motion.div>

            {/* SMALL BOX: THE VISION (QUOTE) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:col-span-4 md:row-span-1 glass-panel p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-primary/20 bg-primary/5 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-sm min-h-[200px] md:min-h-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
              <p className="relative z-10 text-lg md:text-2xl text-foreground font-serif italic leading-relaxed">
                 "Finding elegance in the heart of complexity."
              </p>
            </motion.div>

            {/* MEDIUM BOX: THE FUTURE */}
            <motion.div 
              initial={{ opacity: 0, x: 20, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-4 md:row-span-1 glass-panel p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border-black/5 dark:border-white/5 relative overflow-hidden group bg-card/50 backdrop-blur-sm shadow-sm min-h-[250px] md:min-h-0"
            >
              <div className="absolute bottom-0 right-0 p-8 opacity-5 text-foreground hidden md:block">
                 <InfinityIcon className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                 <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 text-foreground">The Future</h3>
                 <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Evolving into a comprehensive gateway that bridge the gap between infrastructure complexity and developer velocity.
                 </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* TEAM SECTION - MONOLITHIC GLASS DESIGN */}
        <section className="py-16 md:py-20 relative px-4">
          <div className="text-center mb-16 md:mb-32">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-8 md:mb-10">
              The Minds Behind
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-9xl font-display font-black mb-8 md:mb-12 tracking-tighter text-foreground leading-[1] md:leading-[0.85]">
              The Architects <br className="hidden sm:block" />
              of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary/50 italic inline-block px-[18px] py-[18px] relative -left-[18px]">Flow</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-2xl font-light tracking-tight leading-relaxed">
              A collective of thinkers defining the core of our digital philosophy, <br className="hidden md:block" />
              building the invisible structures of the future.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {developers.map((dev, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -20 }}
                className="group relative flex flex-col items-center text-center p-8 md:p-12 rounded-[2rem] md:rounded-[4rem] bg-card/20 border border-black/5 dark:border-white/5 hover:bg-card/40 hover:border-primary/40 transition-all duration-700 shadow-xl backdrop-blur-md overflow-hidden"
              >
                {/* Immersive Background Glow */}
                <div className="absolute -inset-20 bg-primary/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                {/* Avatar Monolith */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 mb-8 md:mb-12">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-blue-600/40 rounded-[1.5rem] md:rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
                   <div className="relative w-full h-full bg-background/80 border border-black/5 dark:border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center group-hover:border-primary/50 transition-all duration-700 shadow-2xl overflow-hidden backdrop-blur-2xl">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="relative z-10 text-3xl md:text-4xl font-black text-foreground group-hover:text-primary transition-colors tracking-tighter font-display">
                         {dev.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                   </div>
                </div>

                {/* Developer Identity */}
                <div className="relative z-10 w-full">
                   <h3 className="text-2xl md:text-3xl font-black text-foreground group-hover:text-foreground transition-colors tracking-tighter mb-8 md:mb-10 font-display">
                      {dev.name}
                   </h3>
                   
                   <div className="flex justify-center gap-8 md:gap-10 pt-8 md:pt-10 border-t border-black/5 dark:border-white/5">
                      <a href={dev.github} className="text-muted-foreground/40 hover:text-primary hover:scale-125 transition-all duration-500">
                        <Github className="w-6 h-6 md:w-7 md:h-7" />
                      </a>
                      <a href={dev.linkedin} className="text-muted-foreground/40 hover:text-primary hover:scale-125 transition-all duration-500">
                        <Linkedin className="w-6 h-6 md:w-7 md:h-7" />
                      </a>
                   </div>
                </div>

                {/* Floating Corner Accent */}
                <div className="absolute top-6 md:top-8 right-8 md:right-10 w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors animate-pulse"></div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FINAL CTA - RESTORED V3 DESIGN - Adjusted for light mode */}
        <section className="py-20 md:py-32 relative px-4">
          <div className="absolute inset-0 bg-card/80 dark:bg-[#050505] rounded-[2.5rem] md:rounded-[4rem] border border-black/5 dark:border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1)_0%,transparent_50%)]"></div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 text-center max-w-4xl mx-auto px-6"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="inline-block mb-6 md:mb-8"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Rocket className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-8xl font-display font-black mb-8 md:mb-10 tracking-tighter leading-[1] md:leading-[0.85] text-foreground">
              Ready to <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary/50 italic inline-block px-[14px] py-[14px] relative -left-[14px]">Ascend?</span>
            </h2>
            
            <p className="text-lg md:text-2xl text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed font-light">
              Join the new standard of API management. Experience clarity, speed, and safety in every request.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group px-8 md:px-12 py-4 md:py-5 bg-foreground text-background font-black rounded-xl md:rounded-2xl overflow-hidden shadow-xl text-center"
                >
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 flex items-center justify-center gap-3 tracking-[0.1em] md:tracking-[0.2em] uppercase text-[10px] md:text-xs">
                    Launch Console
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-background/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </span>
                </motion.div>
              </Link>
              
              <Link href="/features" className="w-full sm:w-auto">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 md:px-12 py-4 md:py-5 border border-black/10 dark:border-white/10 rounded-xl md:rounded-2xl font-black tracking-[0.1em] md:tracking-[0.2em] uppercase text-[10px] md:text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-500 text-center"
                >
                  Explore More
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}

// Sparkles Component for the Hero
function AboutSparkles({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
