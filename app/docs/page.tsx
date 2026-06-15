"use client";

import { useState, useEffect, useRef } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  ChevronRight, Copy, Check, Menu, ExternalLink, Shield, Zap,
  Activity, GitBranch, PlayCircle, Terminal, Layers, Lock,
  Share2, RotateCcw, BarChart3, Globe, Cpu, Workflow, Search,
  AlertTriangle, Code2, Database, Key, Server, BookOpen, Info,
  Settings, RefreshCw, Eye, ListFilter, Sliders, Layout, ShieldCheck,
  Clock, History, MessageSquare, HelpCircle, ArrowRight, FileJson,
  Network, ShieldAlert, Binary, CheckCircle2, User, ArrowLeft, Home
} from "lucide-react";
import { cn } from "@/lib/utils";

const DOCS_STRUCTURE = [
  {
    title: "Getting Started",
    items: [
      { title: "Overview", id: "overview", category: "Getting Started" },
      { title: "Quickstart", id: "quickstart", category: "Getting Started" },
      { title: "Architecture", id: "architecture", category: "Getting Started" },
    ]
  },
  {
    title: "Gateway Management",
    items: [
      { title: "Workspaces", id: "workspaces", category: "Gateway Management" },
      { title: "Gateways (Single/Pro)", id: "gateways", category: "Gateway Management" },
      { title: "Environments", id: "environments", category: "Gateway Management" },
    ]
  },
  {
    title: "Core Entities",
    items: [
      { title: "Services & Targets", id: "services", category: "Core Entities" },
      { title: "Routes & Matching", id: "routes", category: "Core Entities" },
      { title: "Plugins Pipeline", id: "plugins", category: "Core Entities" },
      { title: "Visual Policies", id: "policies", category: "Core Entities" },
    ]
  },
  {
    title: "Advanced Logic",
    items: [
      { title: "Header Transforms", id: "transforms", category: "Advanced Logic" },
      { title: "WASM & Lua Extensions", id: "extensions", category: "Advanced Logic" },
    ]
  },
  {
    title: "Visual Tools",
    items: [
      { title: "Workflow View", id: "workflow", category: "Visual Tools" },
      { title: "Real-time Analytics", id: "analytics", category: "Visual Tools" },
      { title: "Observability", id: "observability", category: "Visual Tools" },
    ]
  },
  {
    title: "Security & Reliability",
    items: [
      { title: "Authentication", id: "auth", category: "Security" },
      { title: "Rate Limiting", id: "rate-limiting", category: "Security" },
      { title: "Atomic Rollbacks", id: "rollbacks", category: "Reliability" },
    ]
  },
  {
    title: "Implementation Deep Dive",
    items: [
      { title: "Radix Tree Router", id: "radix-tree", category: "Implementation Deep Dive" },
      { title: "Microkernel Plugins", id: "microkernel", category: "Implementation Deep Dive" },
      { title: "Scatter-Gather", id: "scatter-gather", category: "Implementation Deep Dive" },
      { title: "Ticking Buffer", id: "ticking-buffer", category: "Implementation Deep Dive" },
      { title: "Load Balancing", id: "load-balancing", category: "Implementation Deep Dive" },
      { title: "Testing & Benchmarks", id: "testing-benchmarks", category: "Implementation Deep Dive" },
    ]
  },
  {
    title: "AI & MCP",
    items: [
      { title: "MCP Server", id: "mcp-server", category: "AI & MCP" },
    ]
  },
  {
    title: "Results & Future",
    items: [
      { title: "Results & Discussion", id: "results", category: "Results & Future" },
      { title: "Cloud & DevOps", id: "cloud-devops", category: "Results & Future" },
      { title: "Conclusions & Future Work", id: "conclusions", category: "Results & Future" },
    ]
  }
];

export default function DocsPage() {
  const [currentPageId, setCurrentPageId] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeToCId, setActiveToCId] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);

  const allItems = DOCS_STRUCTURE.flatMap(s => s.items);
  const currentPageIndex = allItems.findIndex(i => i.id === currentPageId);
  const currentPage = allItems[currentPageIndex] || allItems[0];
  const nextChapter = allItems[currentPageIndex + 1];

  const filteredStructure = DOCS_STRUCTURE.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (visibleEntry) setActiveToCId(visibleEntry.target.id);
    };
    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "-100px 0px -70% 0px",
      threshold: [0, 0.1],
    });
    const elements = document.querySelectorAll("h2[id], h3[id]");
    elements.forEach((elem) => observer.current?.observe(elem));
    return () => observer.current?.disconnect();
  }, [currentPageId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    switch (currentPageId) {
      case "overview":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Introduction</span>
              </div>
              <h2 className="text-5xl text-foreground font-black leading-tight tracking-tight">
                The Next Generation of <span className="text-primary">API Management</span> Orchestration.
              </h2>

              {/* Figure: Dashboard Overview */}
              <div className="space-y-4 pt-4">
                <div className="rounded-3xl border border-white/5 bg-[#0B101B] overflow-hidden shadow-2xl relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B101B] via-transparent to-transparent opacity-60 z-10" />
                  <div className="p-1.5 bg-white/5 border-b border-white/5 flex items-center gap-2 px-4">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500/20" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                    </div>
                    <span className="text-[10px] font-mono text-[#475569]">sopo-dashboard-v1.0.4</span>
                  </div>
                  {/* Actual Image Implementation */}
                  <div className="aspect-video bg-[#050810] relative overflow-hidden flex items-center justify-center">
                    <img
                      src="/docs/overview.webp"
                      alt="System Overview"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      onError={(e) => {
                        // Fallback if image not found
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="flex flex-col items-center gap-4 p-12 text-center">
                            <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 animate-pulse">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            </div>
                            <div class="px-6 py-3 rounded-full bg-primary/20 border border-primary/30 text-primary font-black text-xs uppercase tracking-widest backdrop-blur-md">
                               System Overview Screenshot (overview.webp)
                            </div>
                            <p class="text-[10px] text-[#475569] max-w-xs leading-relaxed mt-2">
                              Please place your screenshot in <b>public/docs/overview.webp</b> to see it here.
                            </p>
                          </div>
                        `;
                      }}
                    />
                  </div>
                </div>
                <p className="text-center text-xs text-[#475569] italic">Figure 1.1: The SOPO Control Center providing real-time intelligence and operational metrics.</p>
              </div>

              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed max-w-4xl pt-8">
                <p>
                  SOPO is a high-performance, cloud-native API Gateway built for engineering teams who demand extreme reliability without the configuration overhead. We've eliminated the need for complex YAML files, replacing them with a visual orchestration engine that gives you full control over your traffic pipeline.
                </p>
              </div>
            </section>

            <section id="mission" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Our Mission</h3>
              <div className="prose prose-zinc dark:prose-invert max-w-4xl">
                <p className="text-[#94A3B8] text-lg leading-relaxed">
                  Most API Gateways were built 10 years ago for a world that no longer exists. They are heavy, hard to configure, and require specialized knowledge to maintain. SOPO was built from the ground up to solve three fundamental problems:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white font-bold">
                      <div className="w-1.5 h-6 bg-primary rounded-full" />
                      Configuration Fatigue
                    </div>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      Stop wrestling with 5,000-line YAML files. Our visual designer allows you to build complex logic chains in seconds, with real-time validation and simulation before you ever hit "Deploy".
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white font-bold">
                      <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                      Visibility Gaps
                    </div>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      Understand exactly what is happening to every request. From the moment it hits the edge until it reaches your upstream, SOPO provides a high-fidelity trace of every plugin and transformation.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white font-bold">
                      <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                      Security Silos
                    </div>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      Unified security across all environments. Whether it's OIDC, API Keys, or custom WASM-based auth, SOPO ensures that your security policies are enforced consistently across the globe.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white font-bold">
                      <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                      Operational Fragility
                    </div>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      Eliminate downtime caused by human error. Our atomic rollback system and environment promotion workflows provide a safety net for even the most complex global deployments.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="use-cases" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white tracking-tight">Technical Use Cases</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[2.5rem] bg-[#0B101B] border border-white/5 hover:border-primary/20 transition-all group">
                  <div className="p-4 rounded-2xl bg-primary/10 w-fit mb-6">
                    <Network className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-black text-white mb-4">Legacy Modernization</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Bridge the gap between monolithic legacy systems and modern microservices. Use SOPO to rewrite paths, transform payloads, and gradually migrate traffic with zero client-side changes.
                  </p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-[#0B101B] border border-white/5 hover:border-blue-500/20 transition-all group">
                  <div className="p-4 rounded-2xl bg-blue-500/10 w-fit mb-6">
                    <ShieldAlert className="h-6 w-6 text-blue-500" />
                  </div>
                  <h4 className="text-xl font-black text-white mb-4">Zero-Trust Security Edge</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Enforce strict identity verification at the edge. Integrate with Auth0, Keycloak, or AWS Cognito to validate JWTs and inject user identity directly into upstream headers.
                  </p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-[#0B101B] border border-white/5 hover:border-emerald-500/20 transition-all group">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 w-fit mb-6">
                    <Activity className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h4 className="text-xl font-black text-white mb-4">API Monetization & Quotas</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Implement tiered rate-limiting based on customer plans. Use our distributed state engine to enforce quotas across global regions with millisecond accuracy.
                  </p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-[#0B101B] border border-white/5 hover:border-purple-500/20 transition-all group">
                  <div className="p-4 rounded-2xl bg-purple-500/10 w-fit mb-6">
                    <Code2 className="h-6 w-6 text-purple-500" />
                  </div>
                  <h4 className="text-xl font-black text-white mb-4">Custom Protocol Bridging</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Need to support custom protocols or complex business logic? Deploy WASM modules directly to the edge to handle unique requirements without slowing down your pipeline.
                  </p>
                </div>
              </div>
            </section>

            <section id="system-design" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white tracking-tight">Core Design Pillars</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group space-y-4 p-8 rounded-[2.5rem] bg-[#0B101B] border border-white/5 hover:border-primary/20 transition-all">
                  <div className="p-4 rounded-2xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                    <Layers className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-black text-2xl text-white tracking-tight">Multi-Tenant Workspaces</h4>
                  <p className="text-[#94A3B8] leading-relaxed text-sm">Isolate teams, projects, and environments within a single control plane. Each workspace maintains its own set of policies, users, and audit logs, ensuring strict security boundaries.</p>
                </div>
                <div className="group space-y-4 p-8 rounded-[2.5rem] bg-[#0B101B] border border-white/5 hover:border-blue-500/20 transition-all">
                  <div className="p-4 rounded-2xl bg-blue-500/10 w-fit group-hover:bg-blue-500/20 transition-colors">
                    <ShieldCheck className="h-8 w-8 text-blue-500" />
                  </div>
                  <h4 className="font-black text-2xl text-white tracking-tight">Security-First Architecture</h4>
                  <p className="text-[#94A3B8] leading-relaxed text-sm">Zero-trust by default. All internal communication is encrypted via mTLS, and configurations are cryptographically signed before being pushed to the edge agents.</p>
                </div>
              </div>
            </section>
          </div>
        );

      case "quickstart":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <PlayCircle className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Setup Guide</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Quickstart Guide</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                Start managing your APIs in minutes. This guide walks you through the initial setup, from workspace creation to deploying your first secure route, all from the SOPO dashboard.
              </p>
            </section>

            <section id="prerequisites" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-2xl font-black text-white">Prerequisites</h3>
              <p className="text-[#94A3B8] text-sm">Before you begin, ensure you have the following:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-white/5"><User className="h-5 w-5 text-primary" /></div>
                  <div>
                    <h5 className="font-bold text-white text-sm">SOPO Account</h5>
                    <p className="text-xs text-[#475569] mt-1">Sign up or log in at portal.sopo.io.</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-white/5"><CheckCircle2 className="h-5 w-5 text-blue-500" /></div>
                  <div>
                    <h5 className="font-bold text-white text-sm">API Backend</h5>
                    <p className="text-xs text-[#475569] mt-1">A running backend service you want to expose through SOPO.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="deployment-modes" className="space-y-12 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-2xl font-black text-white">Choose Your Deployment Path</h3>

              {/* Wizard Flow with Image */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/20 text-primary">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-black text-white">The Stack Wizard</h4>
                  </div>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    The wizard is the fastest way to get a production-ready stack. It automates the linking between your Gateway, Service, and Route in a single 4-step visual flow directly from the dashboard.
                  </p>
                  <ul className="space-y-3">
                    {["Automated entity linking", "Default security best-practices (CORS, TLS)", "One-click deployment to your environment"].map(item => (
                      <li key={item} className="flex items-center gap-3 text-xs font-bold text-white/70">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/5 bg-[#0B101B] overflow-hidden shadow-xl group">
                  <div className="p-1 bg-white/5 border-b border-white/5 flex items-center gap-2 px-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    </div>
                    <span className="text-[8px] font-mono text-[#475569]">gateway-wizard.webp</span>
                  </div>
                  <div className="aspect-video bg-[#050810] flex items-center justify-center relative">
                    <img
                      src="/docs/gateway-wizard.webp"
                      alt="Gateway Wizard"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="flex flex-col items-center gap-4 p-12 text-center">
                            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2 animate-pulse">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            </div>
                            <span class="text-[10px] font-black text-primary uppercase tracking-widest">Wizard Screenshot</span>
                          </div>
                        `;
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Manual Entry with Image */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-12">
                <div className="rounded-2xl border border-white/5 bg-[#0B101B] overflow-hidden shadow-xl group order-2 lg:order-1">
                  <div className="p-1 bg-white/5 border-b border-white/5 flex items-center gap-2 px-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    </div>
                    <span className="text-[8px] font-mono text-[#475569]">manual-entry.webp</span>
                  </div>
                  <div className="aspect-video bg-[#050810] flex items-center justify-center relative">
                    <img
                      src="/docs/manual-entry.webp"
                      alt="Manual Entry"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="flex flex-col items-center gap-4 p-12 text-center">
                            <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2 animate-pulse">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            </div>
                            <span class="text-[10px] font-black text-blue-500 uppercase tracking-widest">Manual Entry Screenshot</span>
                          </div>
                        `;
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                      <Sliders className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-black text-white">Manual Entry</h4>
                  </div>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    For advanced users who need full control. Manually configure every parameter of your infrastructure from the dashboard, including protocol overrides, custom timeouts, and fine-grained security policies.
                  </p>
                  <ul className="space-y-3">
                    {["Granular parameter control", "Custom topology mapping", "Independent versioning and rollback"].map(item => (
                      <li key={item} className="flex items-center gap-3 text-xs font-bold text-white/70">
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section id="steps" className="space-y-12 border-t border-white/5 pt-16">
              <h3 className="text-2xl font-black text-white">2. Core Setup Steps</h3>
              <div className="space-y-12">
                {[
                  {
                    step: "01",
                    id: "init-workspace",
                    title: "Initialize Workspace",
                    desc: "Your workspace is the central hub for all gateway configurations. It holds your environments, policies, and upstream definitions. Workspaces provide the logical boundary for multi-tenant isolation, ensuring your teams' configurations are completely separate.",
                    tasks: ["Sign in to portal.sopo.io", "Click \"Create Workspace\"", "Set workspace name (e.g., \"Global-API-Gateway\")", "Choose default region (e.g., us-east-1)", "Invite team members with RBAC roles (Admin, Editor, Viewer)"],
                    more: "Workspaces in SOPO are fully isolated. Each workspace has its own set of environments, gateways, and analytics. You can create multiple workspaces to separate development, staging, and production infrastructure entirely."
                  },
                  {
                    step: "02",
                    id: "create-gateway",
                    title: "Create a Gateway",
                    desc: "A gateway is the entry point for your API traffic. SOPO offers two modes: Single Mode (simple, single-tenant) and Pro Mode (multi-tenant, advanced features). Choose the mode that fits your use case.",
                    tasks: ["From the workspace dashboard, click \"New Gateway\"", "Select mode (Single or Pro)", "Configure basic settings (name, description)", "Review and create"],
                    more: "Single Mode is perfect for small teams or individual services, providing a simple, streamlined experience. Pro Mode is designed for large-scale deployments, supporting multi-tenant architectures, custom domains, and advanced configuration options."
                  },
                  {
                    step: "03",
                    id: "define-upstream",
                    title: "Define Your Service (Upstream)",
                    desc: "Tell SOPO where your backend services are located. A service (upstream) can be a single URL or a group of servers for load balancing. SOPO automatically monitors these targets to ensure high availability and health.",
                    tasks: ["Go to your gateway, click \"Services\"", "Click \"Add Service\"", "Enter service name (e.g., \"order-service\")", "Add target URLs (IPs or DNS, e.g., \"https://api.production.local/orders\")", "Configure health checks (path, interval, timeout)", "Select load balancing algorithm (Round Robin, Least Connections, etc.)"],
                    more: "Health checks are critical for ensuring high availability. SOPO continuously monitors your upstream targets and automatically removes unhealthy ones from the rotation, ensuring traffic is only sent to healthy services."
                  },
                  {
                    step: "04",
                    id: "create-route",
                    title: "Create a Route",
                    desc: "Map a public URL path to your upstream service. This defines how traffic enters your system. You can use dynamic path parameters, HTTP method filtering, and attach plugins to customize behavior.",
                    tasks: ["From your gateway, click \"Routes\"", "Click \"Add Route\"", "Set path prefix (e.g., \"/v1/orders\")", "Select HTTP methods (GET, POST, PUT, DELETE, etc.)", "Choose the service you created as the upstream target", "Attach base policies (JWT authentication, rate limiting)"],
                    more: "Routes in SOPO use a powerful radix tree matching algorithm, supporting static paths, dynamic parameters (e.g., \"/v1/orders/:id\"), and wildcards. This allows you to create flexible routing configurations that can handle even the most complex API structures."
                  },
                  {
                    step: "05",
                    id: "test-deploy",
                    title: "Test and Deploy",
                    desc: "Before going live, use SOPO's simulation feature to test your configuration. Once verified, deploy to your environment with confidence, knowing you have atomic rollback capabilities if something goes wrong.",
                    tasks: ["Click \"Simulate\" to test your route", "Review the simulation results", "Deploy to your Dev environment", "Test with your favorite API client (Postman, curl, etc.)", "Promote to Production when ready"],
                    more: "The simulation feature in SOPO lets you test your configuration without affecting real traffic. It shows you exactly how a request will flow through your gateway, including which plugins will be applied and what the response will look like."
                  }
                ].map((item) => (
                  <div key={item.step} id={item.id} className="group relative pl-12 border-l-2 border-white/5 hover:border-primary/50 transition-all scroll-mt-32">
                    <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-2xl bg-[#0B101B] border-2 border-white/10 group-hover:border-primary group-hover:bg-primary/10 flex items-center justify-center text-xs font-black transition-all">
                      {item.step}
                    </div>
                    <div className="space-y-6 pb-12">
                      <h4 className="text-2xl font-black text-white">{item.title}</h4>
                      <p className="text-[#94A3B8] text-base leading-relaxed max-w-4xl">{item.desc}</p>
                      <div className="p-6 rounded-2xl bg-black/50 border border-white/5">
                        <h5 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          Steps:
                        </h5>
                        <ul className="space-y-3">
                          {item.tasks.map((t, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-[#94A3B8]">
                              <div className="mt-1.5 w-2 h-2 rounded-full bg-primary/60" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <p className="text-sm text-[#94A3B8] leading-relaxed"><strong className="text-primary">💡 Tip:</strong> {item.more}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="verification" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-2xl font-black text-white">3. Verify Your Setup</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Once deployed, you can test your new route using <code>curl</code>, Postman, or any API client. SOPO automatically generates a public URL for your gateway.
              </p>
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                  <h5 className="font-bold text-white mb-4 text-sm">Get Your Gateway URL</h5>
                  <p className="text-sm text-[#94A3B8] mb-4">From your gateway dashboard, copy the public URL (e.g., <code>https://your-gateway.sopo.io</code>).</p>
                </div>

                <div className="p-6 rounded-2xl bg-black border border-white/5 font-mono text-sm space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-primary">$</span>
                    <span className="text-white">curl -i https://your-gateway.sopo.io/v1/orders</span>
                  </div>
                  <div className="text-[#475569] mt-4">
                    HTTP/2 200 OK <br />
                    Content-Type: application/json <br />
                    X-Sopo-Request-ID: req_9921ab01 <br />
                    <br />
                    {`{"orders": [], "total": 0}`}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                  <h5 className="font-bold text-blue-400 mb-2 text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Check Analytics
                  </h5>
                  <p className="text-sm text-[#94A3B8]">
                    Go to the Analytics tab in your gateway dashboard to see real-time metrics, including requests per second, latency, and error rates.
                  </p>
                </div>
              </div>
            </section>
          </div>
        );

      case "architecture":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Cpu className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">System Design</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">System Architecture</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                SOPO is built on a highly decoupled, cloud-native architecture that separates the <strong>Control Plane</strong> from the <strong>Data Plane</strong>. This separation ensures that even if the management layer is unavailable, your traffic continues to flow uninterrupted, providing maximum reliability and scalability.
              </p>
            </section>

            {/* Architecture Diagram Section */}
            <section className="space-y-8">
              <h3 className="text-2xl font-black text-white">High-Level Architecture</h3>
              <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#0B101B] to-[#050810] border border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Client Layer */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-black text-white uppercase tracking-widest">
                      <Globe className="h-5 w-5 text-blue-500" />
                      Client Layer
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#94A3B8]">Web Browsers</div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#94A3B8]">Mobile Apps</div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#94A3B8]">Third-Party APIs</div>
                    </div>
                  </div>

                  {/* Gateway Layer (Data Plane) */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-black text-white uppercase tracking-widest">
                      <Server className="h-5 w-5 text-primary" />
                      Data Plane
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-white">
                        Radix Tree Router
                      </div>
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-white">
                        Phase-Based Engine
                      </div>
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-white">
                        Load Balancing
                      </div>
                    </div>
                  </div>

                  {/* Backend Layer */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-black text-white uppercase tracking-widest">
                      <Database className="h-5 w-5 text-emerald-500" />
                      Upstream Services
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#94A3B8]">Microservices</div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#94A3B8]">Monoliths</div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#94A3B8]">Third-Party APIs</div>
                    </div>
                  </div>
                </div>

                {/* Control Plane Info */}
                <div className="mt-10 pt-8 border-t border-white/5">
                  <h4 className="text-lg font-black text-white mb-4 flex items-center gap-3">
                    <Cpu className="h-5 w-5 text-blue-500" />
                    Control Plane
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-[#94A3B8]">
                      <div className="font-black text-blue-400 mb-1">UI / Dashboard</div>
                      Visual policy designer & monitoring
                    </div>
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-[#94A3B8]">
                      <div className="font-black text-blue-400 mb-1">Config DB</div>
                      Stores gateways, routes, plugins
                    </div>
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-[#94A3B8]">
                      <div className="font-black text-blue-400 mb-1">Analytics Engine</div>
                      ClickHouse for telemetry
                    </div>
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-[#94A3B8]">
                      <div className="font-black text-blue-400 mb-1">MCP Server</div>
                      AI-driven management
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="p-10 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-blue-500/10 to-transparent relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Cpu className="h-32 w-32 text-blue-500" />
                </div>
                <Cpu className="h-12 w-12 text-blue-500 mb-6" />
                <h4 id="control-plane" className="text-2xl font-black text-white mb-4 scroll-mt-32 tracking-tight">Control Plane</h4>
                <div className="space-y-4 text-[#94A3B8] leading-relaxed text-sm">
                  <p>The centralized management layer. It handles the visual designer, configuration storage, global analytics, and team coordination via a modern Next.js frontend and Express backend.</p>
                  <ul className="space-y-3 list-none p-0">
                    <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Visual Policy Designer & Orchestrator</li>
                    <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Environment Promotion & Rollback Engine</li>
                    <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Hasura GraphQL API</li>
                    <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-blue-500" /> hasura-auth for Authentication</li>
                  </ul>
                </div>
              </div>

              <div className="p-10 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Server className="h-32 w-32 text-primary" />
                </div>
                <Server className="h-12 w-12 text-primary mb-6" />
                <h4 id="data-plane" className="text-2xl font-black text-white mb-4 scroll-mt-32 tracking-tight">Data Plane (Agent)</h4>
                <div className="space-y-4 text-[#94A3B8] leading-relaxed text-sm">
                  <p>The high-performance execution layer. Distributed Go agents that process policies and route traffic at the edge with zero external dependency, using local config caching for maximum reliability.</p>
                  <ul className="space-y-3 list-none p-0">
                    <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-primary" /> Sub-millisecond Pipeline Execution</li>
                    <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-primary" /> Radix Tree Router (O(k) lookup)</li>
                    <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-primary" /> Real-time Telemetry via Ticking Buffer</li>
                  </ul>
                </div>
              </div>
            </div>

            <section id="phase-engine" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white tracking-tight">Phase-Based Execution Engine</h3>
              <p className="text-[#94A3B8] text-lg leading-relaxed max-w-4xl">
                SOPO's proprietary 8-phase engine processes every request through discrete phases. This allows for fine-grained control over when security, transformations, and routing logic are applied, enabling maximum performance and flexibility.
              </p>
              <div className="space-y-4">
                {[
                  { phase: "Preread", desc: "Initial connection handling and TLS termination. Protocol detection (HTTP/1, HTTP/2, gRPC, WebSockets)." },
                  { phase: "Rewrite", desc: "Path remapping and early header transformations before access control (e.g., adding X-Forwarded-For)." },
                  { phase: "Access", desc: "Authentication and Authorization. JWT validation, API Key checks, IP filtering, and CORS." },
                  { phase: "Rate Limit", desc: "Traffic control. Sliding window rate limiting with distributed counters." },
                  { phase: "Transform", desc: "Request modifications. Header/body transformations, query parameter injections." },
                  { phase: "Content", desc: "Core routing logic. Radix tree lookup, upstream target selection via load balancing, scatter-gather aggregation." },
                  { phase: "Response", desc: "Response modifications. Header/body transforms, caching, circuit breaker logic." },
                  { phase: "Log", desc: "Post-request telemetry gathering and streaming to the Control Plane via the ticking buffer." }
                ].map((p, i) => (
                  <div key={p.phase} className="flex items-center gap-6 p-6 rounded-2xl bg-[#0B101B] border border-white/5 hover:border-primary/20 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0">{i + 1}</div>
                    <div>
                      <h5 className="font-bold text-white">{p.phase} Phase</h5>
                      <p className="text-xs text-[#475569] mt-1">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="sync-protocol" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white tracking-tight">Zero-Sync-Gap Protocol</h3>
              <p className="text-[#94A3B8] text-lg leading-relaxed max-w-4xl">
                We use a custom event-driven architecture with Hasura event triggers, Redis Pub/Sub, and gRPC streaming to ensure that policy changes are propagated from the Control Plane to all global Agents in less than 50ms with atomic configuration swaps for zero downtime.
              </p>
              <div className="p-10 rounded-3xl bg-[#050810] border border-white/5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.6)] animate-pulse" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Hasura Event Trigger</span>
                  </div>
                  <ArrowRight className="hidden md:block h-6 w-6 text-[#475569]" />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)] animate-pulse" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Redis Pub/Sub</span>
                  </div>
                  <ArrowRight className="hidden md:block h-6 w-6 text-[#475569]" />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(243,90,30,0.6)] animate-pulse" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Atomic Config Swap</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="p-8 rounded-2xl bg-[#0B101B] border border-white/5">
                  <h5 className="font-bold text-white mb-3">Eventual Consistency</h5>
                  <p className="text-xs text-[#475569] leading-relaxed">Most configuration updates follow an eventual consistency model, ensuring high availability even during network partitions between regions with sub-50ms propagation.</p>
                </div>
                <div className="p-8 rounded-2xl bg-[#0B101B] border border-white/5">
                  <h5 className="font-bold text-white mb-3">Strong Consistency (Pro)</h5>
                  <p className="text-xs text-[#475569] leading-relaxed">Critical keys (like revoked tokens or global rate limit counters) use a Raft-based consensus protocol for strong consistency across all nodes with &lt; 100ms latency.</p>
                </div>
              </div>
            </section>
          </div>
        );

      case "workspaces":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Layout className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Management</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Workspaces</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                Workspaces are top-level containers that provide strict, hardware-backed isolation for teams, projects, or business units. Each workspace acts as a completely self-contained ecosystem with its own independent gateways, services, routes, users, and identity providers.
              </p>
            </section>

            <section id="infrastructure-identity" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-2xl font-black text-white">Infrastructure Identity & Isolation</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed max-w-3xl">
                Every workspace is assigned a unique <strong>Hostname Identifier</strong> and dedicated Certificate Authority (CA). This identity forms the foundation for all traffic routing and security within the workspace.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      Global Slug & Domain Names
                    </h5>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Your workspace slug (e.g., <code>my-workspace</code>) is used to construct unique SOPO subdomains like <code>my-workspace.sopo.io</code>. Custom domains can be added for enterprise use.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      Isolated mTLS & Encryption
                    </h5>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Each workspace maintains a dedicated CA for internal mTLS between gateway nodes. All configuration and telemetry data are encrypted at rest and in transit with workspace-specific keys.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      RBAC & Team Management
                    </h5>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Invite team members with granular roles: Admin (full access), Editor (manage gateways/routes), Viewer (read-only). Permissions are enforced at the workspace level.
                    </p>
                  </div>
                </div>

                {/* UI Mock: Workspace Identity Settings */}
                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex flex-col justify-center">
                  <div className="bg-[#050810] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Workspace Settings</span>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-primary uppercase tracking-widest">Infrastructure Identity</label>
                        <h4 className="text-lg font-black text-white">Global Workspace Slug</h4>
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                          <div className="text-[8px] text-[#475569] font-bold uppercase">Unique Hostname</div>
                          <div className="flex items-center gap-2 p-3 rounded bg-white/5 border border-white/10 text-xs text-white font-mono">
                            <span className="text-primary">https://</span>
                            my-workspace
                            <span className="text-[#475569]">.sopo.io</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full py-3 rounded-xl bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest">
                        Save Workspace
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="external-integrations" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-2xl font-black text-white">Identity Providers & Integrations</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Connect your workspace to external identity providers to manage team access and authenticate your API consumers. SSO options streamline onboarding and offboarding.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "Google Workspace", desc: "Sync profile details and enable SSO for your team.", icon: "G" },
                  { name: "GitHub", desc: "Link your GitHub account for rapid developer authentication.", icon: "GH" }
                ].map(provider => (
                  <div key={provider.name} className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-white text-xs">
                        {provider.icon}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-white">{provider.name}</h5>
                        <p className="text-[10px] text-[#475569] mt-0.5">{provider.desc}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section id="workspace-isolation" className="p-10 rounded-[2.5rem] border border-white/5 bg-[#0B101B] mt-16">
              <h4 className="text-2xl font-black text-white mb-4">Hard Isolation Guarantee</h4>
              <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                Data and configurations never leak between workspaces. SOPO uses a multi-tenant architecture with strict isolation boundaries:
              </p>
              <ul className="space-y-3 text-sm text-[#94A3B8]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Resource Partitioning:</strong> CPU, memory, and network resources are strictly allocated per workspace to prevent noisy neighbor issues.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Data Isolation:</strong> All workspace data (configs, logs, metrics) is stored in separate schemas/databases with encryption at rest.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Failure Isolation:</strong> A crash or misconfiguration in one workspace has no impact on other workspaces in the platform.</span>
                </li>
              </ul>
            </section>
          </div>
        );

      case "gateways":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Server className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Infrastructure</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Gateways (Single vs Pro)</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                A Gateway is the physical deployment of the SOPO Data Plane — the high-performance Go engine that actually routes your traffic. Built on a microkernel architecture, the gateway uses event-driven configuration management via Redis pub/sub for zero‑downtime hot reloads, with local JSON files as a cold‑start fallback. Choose between Single Node for simplicity or Pro Cluster for global scale and high availability.
              </p>
              <section className="pt-16 border-t border-white/5">
                <h3 className="text-2xl font-black text-white mb-8">Architecture Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-primary" />
                      Event‑Driven Config
                    </h5>
                    <p className="text-[10px] text-[#475569] leading-relaxed">
                      Subscribes to Redis <code>gateway_changed</code> events for instant config updates. The core router instance is swapped atomically using an <code>RWMutex</code> to prioritize read performance for proxying requests over write performance for config changes.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                      <Layers className="h-4 w-4 text-blue-500" />
                      Microkernel Design
                    </h5>
                    <p className="text-[10px] text-[#475569] leading-relaxed">
                      The core only handles path resolution and method matching, while cross‑cutting concerns (auth, rate limiting, logging) are delegated to a unified plugin registry for extensibility without modifying base proxy logic.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-emerald-500" />
                      Async Analytics
                    </h5>
                    <p className="text-[10px] text-[#475569] leading-relaxed">
                      Uses an asynchronous ClickHouse exporter for logging and analytics to avoid bottlenecking proxy throughput, with a trade‑off of slight risk of losing last few logs on abrupt crash for substantial performance gain.
                    </p>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0B101B] hover:border-blue-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                    <Cpu className="h-6 w-6 text-blue-500" />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-4 tracking-tight">Single Node</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                    Perfect for local development, testing, or small-scale applications with predictable traffic. Deploy as a single Docker container or static binary.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Lightweight (20MB Static Binary)</li>
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Local Config Storage with Hot Reload</li>
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Direct Local Admin API Access</li>
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Built-in Observability (Prometheus Metrics)</li>
                  </ul>
                </div>

                <div className="p-8 rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent hover:border-primary/40 transition-all group relative overflow-hidden">
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-white text-[8px] font-black uppercase tracking-widest">Recommended</div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-4 tracking-tight">Pro Cluster</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                    Enterprise-grade high availability for production. Deploy a distributed cluster with multi-region support, automatic failover, and global traffic management.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-primary" /> Multi-Region Config Sync & Failover</li>
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-primary" /> Distributed, Eventually Consistent Rate Limiting</li>
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-primary" /> Global Pulse Monitoring & Auto-Scaling</li>
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-primary" /> Custom Domain Support & Managed TLS Certificates</li>
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-primary" /> DDoS Protection & WAF Integration</li>
                  </ul>
                </div>
              </div>

              {/* UI Mock: Gateway Node Health */}
              <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] p-10 mt-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <h4 className="text-xl font-black text-white">Pro Cluster Health</h4>
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">us-east-1</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Healthy (3/3 Nodes)</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { id: "sopo-gw-01", cpu: "12%", mem: "1.2GB", status: "ONLINE", region: "us-east-1a" },
                    { id: "sopo-gw-02", cpu: "14%", mem: "1.3GB", status: "ONLINE", region: "us-east-1b" },
                    { id: "sopo-gw-03", cpu: "28%", mem: "1.8GB", status: "ONLINE", region: "us-east-1c" }
                  ].map(node => (
                    <div key={node.id} className="p-6 rounded-2xl bg-[#050810] border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-[#475569]">{node.id}</span>
                          <div className="text-[9px] text-primary/70 font-medium uppercase">{node.region}</div>
                        </div>
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black",
                          node.status === 'ONLINE' ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"
                        )}>{node.status}</div>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-[#475569]">CPU Usage</span>
                            <span className="text-white font-bold">{node.cpu}</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={cn(
                              "h-full rounded-full",
                              parseInt(node.cpu) > 50 ? "bg-yellow-500" : "bg-primary"
                            )} style={{ width: node.cpu }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-[#475569]">Memory Usage</span>
                            <span className="text-white font-bold">{node.mem}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );

      case "workflow":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Workflow className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Visual Tools</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Workflow View</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-3xl">
                The Workflow View provides a real-time, high-fidelity visualization of your API traffic as it flows through the SOPO ecosystem.
              </p>

              <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />

                <div className="relative flex flex-col items-center gap-12">
                  <div className="flex items-center gap-24">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#475569]">
                        <Globe className="h-8 w-8" />
                      </div>
                      <span className="text-[10px] font-black text-[#475569] uppercase tracking-widest">Client Traffic</span>
                    </div>

                    <div className="relative">
                      <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(243,90,30,0.3)]">
                        <Layers className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-primary px-2 py-0.5 rounded">SOPO Gateway</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#475569]">
                        <Server className="h-8 w-8" />
                      </div>
                      <span className="text-[10px] font-black text-[#475569] uppercase tracking-widest">Backends</span>
                    </div>
                  </div>

                  <div className="w-full max-w-2xl p-6 rounded-2xl bg-[#050810] border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-[10px] font-black text-[#475569] uppercase tracking-widest">Live Execution Trace</div>
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-emerald-500 font-bold uppercase">Streaming</span>
                      </div>
                    </div>
                    <div className="space-y-3 font-mono text-[10px]">
                      <div className="flex gap-4 text-white/40"><span>[14:22:01.42]</span> <span className="text-blue-400">INBOUND</span> GET /api/v1/users/me</div>
                      <div className="flex gap-4 text-white/40"><span>[14:22:01.43]</span> <span className="text-emerald-400">AUTH</span> Claims verified (sub: user_9921)</div>
                      <div className="flex gap-4 text-white/40"><span>[14:22:01.45]</span> <span className="text-primary">ROUTED</span> Upstream: auth-service-cluster</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5">
                  <h4 className="text-xl font-bold text-white mb-4">Debugging at Scale</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    No more digging through text logs. The Workflow View allows you to visually trace any single request, seeing exactly which plugins it hit and where it was routed, with timing information for each step.
                  </p>
                </div>
                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5">
                  <h4 className="text-xl font-bold text-white mb-4">Real-time Topology</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    SOPO automatically builds a map of your microservices based on actual traffic patterns. Identify bottleneck services, circular dependencies, and latency hotspots instantly.
                  </p>
                </div>
              </div>
              <div className="pt-12 border-t border-white/5">
                <h3 className="text-2xl font-black text-white mb-8">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      Request Sampling
                    </h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      Sample requests at configurable rates to avoid overwhelming your observability pipeline, with support for dynamic sampling based on error rates or latency.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <Search className="h-4 w-4 text-emerald-500" />
                      Advanced Filtering
                    </h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      Filter traces by status code, path, method, user ID, latency, or custom metadata to quickly find the requests you're interested in.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      Dependency Mapping
                    </h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      Visualize service dependencies and traffic flows between microservices to understand your architecture better.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Monitoring</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Real-time Analytics</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-3xl">
                Gain deep insights into your API performance with sub-second data aggregation and beautiful, interactive visualizations. SOPO uses a dual-trigger ticking buffer (time-based and size-based) to batch analytics events efficiently before sending them to ClickHouse.
              </p>
              <section className="pt-12 border-t border-white/5 space-y-12">
                <h3 className="text-2xl font-black text-white">Analytics Architecture</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <Database className="h-4 w-4 text-emerald-500" />
                      Ticking Buffer
                    </h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      Dual-trigger (1 second or 1000 events) batching mechanism to reduce network overhead while maintaining real-time data freshness.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-500" />
                      ClickHouse Storage
                    </h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      High-performance columnar database optimized for time-series analytics, with low-latency queries even at scale.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      Real-time Dashboards
                    </h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      Live dashboards with percentile breakdowns (P50, P90, P99), error rates, and traffic patterns.
                    </p>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Request Rate", value: "12.4k/s", icon: Zap, color: "primary" },
                  { label: "Avg Latency", value: "0.84ms", icon: Clock, color: "blue" },
                  { label: "Error Rate", value: "0.02%", icon: ShieldAlert, color: "red" },
                  { label: "Active Nodes", value: "124", icon: Server, color: "emerald" }
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-[2rem] bg-[#0B101B] border border-white/5 flex flex-col items-center gap-3">
                    <stat.icon className={cn("h-5 w-5", `text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}`)} />
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-[10px] font-black text-[#475569] uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Figure: Analytics Dashboard */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/5 bg-[#0B101B] overflow-hidden shadow-xl group">
                  <div className="p-1.5 bg-white/5 border-b border-white/5 flex items-center gap-2 px-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    </div>
                    <span className="text-[8px] font-mono text-[#475569]">analytics-dashboard.webp</span>
                  </div>
                  <div className="aspect-video bg-[#050810] flex items-center justify-center relative">
                    <img
                      src="/docs/analytics-dashboard.webp"
                      alt="Analytics Dashboard"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="flex flex-col items-center gap-4 p-12 text-center">
                            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2 animate-pulse">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            </div>
                            <span class="text-[10px] font-black text-primary uppercase tracking-widest">Analytics Dashboard Screenshot</span>
                          </div>
                        `;
                      }}
                    />
                  </div>
                </div>
                <p className="text-center text-[10px] text-[#475569] italic">Figure 5.1: Real‑time analytics dashboard with traffic charts, latency metrics, and live log feed.</p>
              </div>
            </section>
          </div>
        );

      case "services":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Database className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Core Entities</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Services & Targets</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                Services represent your backend APIs. A Service is a logical abstraction that defines how SOPO communicates with your upstream infrastructure, including protocols, balancing strategies, and health monitoring.
              </p>
            </section>

            <section id="service-configuration" className="space-y-12 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-2xl font-black text-white">Core Configuration</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    When defining a service, you specify the <strong>Communication Protocol</strong> (REST/HTTP or gRPC/Proto) and the <strong>Deployment Context</strong>. The Upstream Manager handles graceful shutdown of old health‑check workers during config hot‑reloads to prevent goroutine leaks.
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                      <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-blue-500" />
                        Balancing Strategies
                      </h5>
                      <p className="text-[10px] text-[#475569] leading-relaxed">
                        Choose between <strong>Round Robin</strong> (equal distribution), <strong>Least Connections</strong>, <strong>Consistent Hashing</strong> (stateful), <strong>Weighted</strong>, or <strong>Latency‑Based</strong> for optimal performance.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                      <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-emerald-500" />
                        Health Monitoring
                      </h5>
                      <p className="text-[10px] text-[#475569] leading-relaxed">
                        Configure <strong>Monitor Endpoints</strong> (e.g., <code>/healthz</code>) with custom intervals, timeouts, failure/pass thresholds, and health‑check paths. Active health checks with automatic target draining when unhealthy.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                      <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                        <Layers className="h-4 w-4 text-purple-500" />
                        Scatter‑Gather Aggregation
                      </h5>
                      <p className="text-[10px] text-[#475569] leading-relaxed">
                        Native scatter‑gather pipeline breaks a single request into parallel upstream calls, executes them concurrently, and merges responses with configurable merge strategies. Handles partial failures and per‑sub‑request timeouts.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Figure: Create Service */}
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/5 bg-[#0B101B] overflow-hidden shadow-xl group">
                    <div className="p-1.5 bg-white/5 border-b border-white/5 flex items-center gap-2 px-3">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      </div>
                      <span className="text-[8px] font-mono text-[#475569]">create-service.webp</span>
                    </div>
                    <div className="aspect-video bg-[#050810] flex items-center justify-center relative">
                      <img
                        src="/docs/create-service.webp"
                        alt="Create Service"
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `
                            <div class="flex flex-col items-center gap-4 p-12 text-center">
                              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                              </div>
                              <span class="text-[10px] font-black text-primary uppercase tracking-widest">Create Service Screenshot</span>
                            </div>
                          `;
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-center text-[10px] text-[#475569] italic">Figure 3.1: Configuring a backend service with custom health checks and balancing strategy.</p>
                </div>
              </div>
            </section>
          </div>
        );

      case "routes":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Network className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Traffic Logic</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Routes & Matching</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                Routes define the entry points for your API. They map public-facing paths and HTTP methods to your internal Services, providing a powerful layer of abstraction and control. SOPO uses a high‑performance radix tree router for O(k) lookup time (k = path length), with parametric/wildcard segments support.
              </p>
              <section className="pt-16 border-t border-white/5">
                <h3 className="text-2xl font-black text-white mb-8">Radix Tree Router</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-primary" />
                      O(k) Lookup
                    </h5>
                    <p className="text-[10px] text-[#475569] leading-relaxed">
                      Uses a radix (prefix) tree for path matching, delivering O(k) lookup time where k is the path length, optimized for high‑throughput routing.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                      <Network className="h-4 w-4 text-blue-500" />
                      Parametric Segments
                    </h5>
                    <p className="text-[10px] text-[#475569] leading-relaxed">
                      Support for dynamic parametric segments (e.g., <code>/api/users/:id</code>) and wildcard segments (e.g., <code>/files/*path</code>) for flexible path patterns.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-emerald-500" />
                      Static First
                    </h5>
                    <p className="text-[10px] text-[#475569] leading-relaxed">
                      Static routes are prioritized over dynamic/wildcard routes to avoid ambiguity, with clear precedence rules for predictable matching behavior.
                    </p>
                  </div>
                </div>
              </section>
            </section>

            <section id="routing-topology" className="space-y-12 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-2xl font-black text-white">Routing & Topology</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Figure: Create Route */}
                <div className="space-y-4 order-2 lg:order-1">
                  <div className="rounded-2xl border border-white/5 bg-[#0B101B] overflow-hidden shadow-xl group">
                    <div className="p-1.5 bg-white/5 border-b border-white/5 flex items-center gap-2 px-3">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      </div>
                      <span className="text-[8px] font-mono text-[#475569]">create-route.webp</span>
                    </div>
                    <div className="aspect-video bg-[#050810] flex items-center justify-center relative">
                      <img
                        src="/docs/create-route.webp"
                        alt="Create Route"
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `
                            <div class="flex flex-col items-center gap-4 p-12 text-center">
                              <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                              </div>
                              <span class="text-[10px] font-black text-blue-500 uppercase tracking-widest">Create Route Screenshot</span>
                            </div>
                          `;
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-center text-[10px] text-[#475569] italic">Figure 4.1: Visual route mapping with topology visualization and execution parameters.</p>
                </div>

                <div className="space-y-6 order-1 lg:order-2">
                  <p className="text-[#94A3B8] text-sm leading-relaxed">
                    SOPO provides a <strong>Mapped Topology Visualization</strong> that shows exactly how your traffic flows from the Gateway Path through the selected Service.
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                      <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                        <Layers className="h-4 w-4 text-purple-500" />
                        Aggregation Pipeline
                      </h5>
                      <p className="text-[10px] text-[#475569] leading-relaxed">
                        Enable <strong>Aggregation Pipeline</strong> to merge multiple downstream results into a single response, reducing client-side roundtrips.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                      <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        Execution Parameters
                      </h5>
                      <p className="text-[10px] text-[#475569] leading-relaxed">
                        Fine-tune execution with <strong>Protocol Overrides</strong>, <strong>Timeouts</strong>, and <strong>Websocket</strong> support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      case "plugins":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Execution Pipeline</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Plugins Pipeline</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                Plugins are the modular building blocks of SOPO's logic, built on a microkernel architecture. They allow you to inject security, traffic control, and observability into specific <strong>Execution Phases</strong> of a request's lifecycle, with support for gRPC/HTTP/2 multiplexing on the same port via <code>h2c</code>.
              </p>
            </section>

            <section id="plugin-modules" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-2xl font-black text-white">Core Plugin Modules</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                SOPO comes with a rich set of built-in plugins categorized by their primary function. Each module is optimized for high-throughput execution.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Security", items: ["JWT Auth", "API Key", "WAF", "CORS"] },
                  { title: "Traffic", items: ["Rate Limiting", "Caching", "Circuit Breaker"] },
                  { title: "Transform", items: ["Request Transform", "Response Transform", "Body Mapping"] }
                ].map(cat => (
                  <div key={cat.title} className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white mb-4 text-sm uppercase tracking-widest text-primary">{cat.title}</h5>
                    <ul className="space-y-2">
                      {cat.items.map(item => (
                        <li key={item} className="text-xs text-[#475569] flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section id="execution-phases" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-2xl font-black text-white">Phase-Targeted Execution</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Unlike traditional gateways, SOPO allows you to precisely target which phase a plugin should execute in. This "Phase-Aware" architecture ensures maximum efficiency.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  {[
                    { phase: "Pre-Routing", desc: "Execute logic before the upstream target is determined." },
                    { phase: "Authentication", desc: "Identity verification and access control checks." },
                    { phase: "Authorization", desc: "Check permissions and enforce policy-based access." },
                    { phase: "Rate Limiting", desc: "Enforce traffic quotas and prevent abuse." },
                    { phase: "Request Transform", desc: "Modify headers or body before forwarding to upstream." },
                    { phase: "Response Transform", desc: "Modify upstream response headers/body before client delivery." },
                    { phase: "Caching", desc: "Serve cached responses to reduce upstream load and latency." },
                    { phase: "Logging", desc: "Async telemetry collection after the request finishes." }
                  ].map((p, i) => (
                    <div key={p.phase} className="flex items-start gap-4 group">
                      <div className="text-primary font-mono text-xs pt-1">0{i + 1}</div>
                      <div>
                        <h6 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{p.phase}</h6>
                        <p className="text-xs text-[#475569] mt-1">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* UI Mock: Plugin Config */}
                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex flex-col justify-center">
                  <div className="bg-[#050810] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Configure Plugin</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[8px] font-black">MANUAL ENTRY</span>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-[#475569] uppercase">Plugin Module</label>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white">JWT Auth</div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-[#475569] uppercase">Execution Phase</label>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white">Authentication</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-[#475569] uppercase">Plugin Configuration</label>
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4">
                          <div className="space-y-1">
                            <div className="text-[8px] text-red-500/80 font-bold uppercase">Secret *</div>
                            <div className="h-8 w-full bg-white/5 rounded border border-white/10" />
                          </div>
                          <div className="text-[8px] text-primary font-bold">+ Add Allowed Issuer</div>
                        </div>
                      </div>
                      <button className="w-full py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                        Save Plugin
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="short-circuit" className="p-10 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 mt-12">
              <h4 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-emerald-500" />
                Short-Circuit Logic
              </h4>
              <p className="text-[#94A3B8] leading-relaxed text-sm">
                Efficiency is built-in. If a plugin in the <strong>Authentication</strong> phase fails (e.g., invalid signature), the pipeline "short-circuits" immediately. No subsequent <strong>Rate Limiting</strong> or <strong>Transform</strong> plugins are executed, saving CPU cycles and protecting your backends from unnecessary load.
              </p>
            </section>
          </div>
        );

      case "policies":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <p className="text-xl text-muted-foreground leading-relaxed">
                Visual Policies are the heart of SOPO. They allow you to define a chain of operations that every request must pass through. Think of it as a "Lego-like" system for API traffic.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Security Layer", icon: Shield, items: ["Token Auth", "IP Whitelist", "CORS Control", "OAuth2 Introspect"] },
                  { title: "Traffic Layer", icon: Activity, items: ["Rate Limiting", "Caching", "Retries", "Circuit Breaker"] },
                  { title: "Transform Layer", icon: Sliders, items: ["Add Headers", "Body Rewrite", "Query Injection", "Path Strip"] }
                ].map(p => (
                  <div key={p.title} className="p-8 rounded-3xl border border-border bg-card/20 hover:border-primary/30 transition-all group">
                    <p.icon className="h-10 w-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-xl mb-4 text-foreground">{p.title}</h4>
                    <ul className="space-y-2 text-xs text-muted-foreground list-none p-0">
                      {p.items.map(i => <li key={i} className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zinc-700" /> {i}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              <section id="pipeline-execution" className="space-y-8 pt-8 scroll-mt-32">
                <h2 className="text-3xl font-display font-bold text-foreground">Pipeline Execution Order</h2>
                <div className="relative p-12 rounded-[40px] border border-border bg-secondary/10 flex flex-col items-center gap-8">
                  <div className="w-64 py-4 rounded-2xl border border-primary/30 bg-primary/10 text-center font-bold text-primary shadow-[0_0_20px_rgba(243,90,30,0.1)]">1. Authentication</div>
                  <div className="h-8 w-[2px] bg-zinc-800" />
                  <div className="w-64 py-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 text-center font-bold text-blue-500">2. Rate Limiting</div>
                  <div className="h-8 w-[2px] bg-zinc-800" />
                  <div className="w-64 py-4 rounded-2xl border border-green-500/30 bg-green-500/10 text-center font-bold text-green-500">3. Transformations</div>
                  <div className="h-8 w-[2px] bg-zinc-800" />
                  <div className="px-8 py-3 rounded-full bg-zinc-950 border border-border text-xs font-mono text-zinc-500">REQUEST SENT TO BACKEND</div>
                </div>
                <p className="text-muted-foreground text-center text-sm italic">"If any policy in the chain fails, execution stops immediately, and an error is returned to the client."</p>
              </section>

              <section id="custom-extensions" className="space-y-8 pt-8 scroll-mt-32">
                <h2 className="text-3xl font-display font-bold text-foreground dark:text-white border-l-4 border-purple-500 pl-6">Custom Policy Extensions</h2>
                <div className="p-10 rounded-[40px] border border-border bg-muted/30 dark:bg-gradient-to-br dark:from-purple-500/5 dark:to-transparent space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    While SOPO provides a vast library of built-in policies, you might need something unique to your business. Our <strong>WASM SDK</strong> allows you to write custom logic in Rust or Go and run it at native speeds.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 rounded-2xl bg-background dark:bg-zinc-950 border border-border dark:border-white/5 space-y-3 shadow-sm">
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold"><Code2 className="h-4 w-4" /> WebAssembly (WASM)</div>
                      <p className="text-[10px] text-muted-foreground font-medium">Deploy high-performance custom filters written in C++, Rust, or TinyGo.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-background dark:bg-zinc-950 border border-border dark:border-white/5 space-y-3 shadow-sm">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold"><MessageSquare className="h-4 w-4" /> Lua Scripting</div>
                      <p className="text-[10px] text-muted-foreground font-medium">Quickly prototype lightweight request/response modifiers directly in the UI.</p>
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </div>
        );

      case "environments":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <GitBranch className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Delivery</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Environments</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                Modern software delivery requires safe, isolated stages. SOPO Environments allow you to manage Development, Staging, and Production gateway states independently, with atomic promotions and rollbacks.
              </p>

              <div className="space-y-10 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "Development", color: "blue", desc: "Safe sandbox for testing new policies and routes. Connected to dev upstreams with relaxed rate limits." },
                    { name: "Staging", color: "yellow", desc: "Pre-production mirror of production. Used for final QA, load testing, and simulation verification." },
                    { name: "Production", color: "green", desc: "Live customer-facing environment. High availability, strict rate limits, and automated rollback rules." }
                  ].map(env => (
                    <div key={env.name} className={`p-8 rounded-3xl border border-white/5 bg-[#0B101B] hover:border-primary/20 transition-all group`}>
                      <h5 className="font-bold text-xl mb-3 text-white">{env.name}</h5>
                      <p className="text-sm text-[#94A3B8] leading-relaxed">{env.desc}</p>
                    </div>
                  ))}
                </div>

                <section id="promotion-flow" className="p-10 rounded-[40px] border border-white/5 bg-gradient-to-br from-primary/5 to-transparent space-y-8 scroll-mt-32">
                  <h3 className="text-2xl font-bold text-white">Safe Promotion Workflow</h3>
                  <div className="space-y-6">
                    <p className="text-[#94A3B8]">SOPO uses a "Draft → Staging → Production" promotion model. Every configuration change is versioned, audited, and simulated before it goes live.</p>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-[#050810] border border-white/10">
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-500" /> <span className="font-bold text-white text-sm">Save as Draft</span></div>
                      <ArrowRight className="hidden md:block h-4 w-4 text-[#475569]" />
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-yellow-500" /> <span className="font-bold text-white text-sm">Deploy & Test in Staging</span></div>
                      <ArrowRight className="hidden md:block h-4 w-4 text-[#475569]" />
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-emerald-500" /> <span className="font-bold text-white text-sm">Promote to Production</span></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      {[
                        { title: "Atomic Promotions", desc: "Config changes are applied atomically with no downtime." },
                        { title: "Version History", desc: "Full audit log of all changes with rollback support." },
                        { title: "Simulation", desc: "Test changes in staging with production-like traffic." }
                      ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <h6 className="font-bold text-white text-sm mb-1">{item.title}</h6>
                          <p className="text-xs text-[#475569] leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section id="env-variables" className="space-y-8 pt-8 scroll-mt-32">
                  <h2 className="text-3xl font-display font-bold text-white border-l-4 border-blue-400 pl-6">Environment-Specific Variables & Secrets</h2>
                  <div className="p-8 rounded-3xl bg-[#0B101B] border border-white/5 space-y-6">
                    <p className="text-[#94A3B8] leading-relaxed">
                      Manage dynamic configuration values and secrets per environment. This allows you to use the exact same policies across all stages while pointing to different backends or using different credentials.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-[#050810] border border-white/10 space-y-4">
                        <div className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Staging Environment</div>
                        <div className="font-mono text-xs text-white space-y-2">
                          <div><span className="text-blue-400">UPSTREAM_URL</span>: <span className="text-primary">"https://stg-api.your-company.com"</span></div>
                          <div><span className="text-blue-400">API_KEY</span>: <span className="text-emerald-400">sk_stg_********</span></div>
                        </div>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#050810] border border-white/10 space-y-4">
                        <div className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Production Environment</div>
                        <div className="font-mono text-xs text-white space-y-2">
                          <div><span className="text-emerald-400">UPSTREAM_URL</span>: <span className="text-primary">"https://api.your-company.com"</span></div>
                          <div><span className="text-emerald-400">API_KEY</span>: <span className="text-emerald-400">sk_prod_********</span></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#475569] italic font-medium">Reference these in your policies using the syntax <code className="text-primary">{"{{env.UPSTREAM_URL}}"}</code></p>
                  </div>
                </section>

                <section id="rollbacks" className="space-y-8 pt-8 scroll-mt-32">
                  <h2 className="text-3xl font-display font-bold text-white border-l-4 border-red-500 pl-6">Safe Rollbacks</h2>
                  <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 space-y-6">
                    <p className="text-[#94A3B8] leading-relaxed">
                      If a promotion causes issues in production, roll back to the previous version in a single click. Rollbacks are atomic and apply instantly.
                    </p>
                    <ul className="space-y-3 text-sm text-[#94A3B8]">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                        <span><strong>Instant Atomic Rollbacks</strong>: Revert to any previous version with zero downtime.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                        <span><strong>Full Audit History</strong>: Every change (including rollbacks) is logged with user, timestamp, and diff.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                        <span><strong>Health-Based Auto-Rollback</strong>: Pro Clusters can automatically roll back if error rates exceed thresholds.</span>
                      </li>
                    </ul>
                  </div>
                </section>
              </div>
            </section>
          </div>
        );

      case "auth":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-emerald-500 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Lock className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Security</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Authentication & Identity</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-3xl">
                Offload authentication to the edge. SOPO integrates with any OIDC/OAuth2 provider to verify tokens before they reach your backend, with support for JWT validation, OAuth2 introspection, and custom authentication plugins.
              </p>
              <section className="pt-12 border-t border-white/5 space-y-12">
                <h3 className="text-2xl font-black text-white">Supported Auth Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm">JWT Validation</h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      Verify JWT tokens using public keys from JWKS endpoints, with support for key rotation and multiple issuers.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm">OAuth2 Introspection</h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      Validate opaque tokens with OAuth2 token introspection endpoints for additional security.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm">API Keys</h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      Simple API key authentication with support for rate limiting and rotation.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm">Custom Auth</h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      Implement custom authentication logic using WASM or Lua plugins for proprietary schemes.
                    </p>
                  </div>
                </div>
              </section>

              <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-gradient-to-br from-emerald-500/5 to-transparent">
                  <h4 className="text-lg font-black text-white mb-6">JWT Validation Config</h4>
                  <div className="p-6 rounded-2xl bg-[#050810] border border-white/5 font-mono text-xs space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#475569]">Issuer:</span>
                      <span className="text-emerald-400">"https://auth.sopo.io/realms/prod"</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#475569]">JWKS Endpoint:</span>
                      <span className="text-emerald-400">"https://auth.sopo.io/.../certs"</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#475569]">Required Scopes:</span>
                      <span className="text-emerald-400">["read:orders", "write:orders"]</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10"><ShieldCheck className="h-5 w-5 text-emerald-500" /></div>
                      <h5 className="font-bold text-white">Automatic Key Rotation</h5>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      SOPO automatically fetches and caches public keys from your provider, ensuring zero downtime during key rotation events.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10"><User className="h-5 w-5 text-emerald-500" /></div>
                      <h5 className="font-bold text-white">Identity Context Injection</h5>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      Verified claims (like <code>user_id</code> or <code>org_id</code>) are injected as headers into the upstream request for easy backend processing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Figure: Security Settings */}
              <div className="space-y-4 pt-8">
                <div className="rounded-3xl border border-white/5 bg-[#0B101B] overflow-hidden shadow-2xl relative group">
                  <div className="p-1.5 bg-white/5 border-b border-white/5 flex items-center gap-2 px-4">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500/20" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                    </div>
                    <span className="text-[10px] font-mono text-[#475569]">security-settings.webp</span>
                  </div>
                  <div className="aspect-video bg-[#050810] relative overflow-hidden flex items-center justify-center">
                    <img
                      src="/docs/security.webp"
                      alt="Security Settings"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="flex flex-col items-center gap-4 p-12 text-center">
                            <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2 animate-pulse">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            </div>
                            <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Security Settings Screenshot</span>
                          </div>
                        `;
                      }}
                    />
                  </div>
                </div>
                <p className="text-center text-xs text-[#475569] italic">Figure 6.1: The SOPO Identity & Authentication dashboard showing active providers and integration keys.</p>
              </div>
            </section>
          </div>
        );

      case "rate-limiting":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-blue-500 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Traffic Control</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Rate Limiting</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-3xl">
                Protect your infrastructure from abuse and spikes with distributed, multi-tier rate limiting policies. SOPO supports sliding window rate limiting, with distributed counters synchronized across all gateway nodes for global enforcement.
              </p>
              <section className="pt-12 border-t border-white/5 space-y-12">
                <h3 className="text-2xl font-black text-white">Rate Limiting Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm">Sliding Window</h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      High-precision sliding window algorithm prevents "bursting" at window boundaries, providing smoother traffic control than fixed-window methods.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm">Distributed Counters</h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      In Pro clusters, rate limit counters are synchronized across all nodes with less than 15ms latency, ensuring consistent global enforcement.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm">Key-Based Limits</h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      Limit traffic based on API keys, user IDs, IP addresses, JWT claims, or any custom header, with support for multiple overlapping keys.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm">Quota Management</h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      Set per-user or per-application quotas with configurable time windows (seconds, minutes, hours, days) and automatic resets.
                    </p>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-[2.5rem] bg-[#0B101B] border border-white/5 space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <h4 className="text-xl font-black text-white">Sliding Window</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Our highly accurate sliding window algorithm prevents "bursting" at the edge of time windows, providing a smoother traffic flow than fixed-window methods.
                  </p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-[#0B101B] border border-white/5 space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Key className="h-6 w-6 text-blue-500" />
                  </div>
                  <h4 className="text-xl font-black text-white">Key-Based Limits</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Limit traffic based on API Keys, User IDs, IP addresses, or any custom header/claim. Mix and match multiple keys for complex tiered access.
                  </p>
                </div>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 mt-12">
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1 space-y-4">
                    <h4 className="text-2xl font-black text-white">Distributed State</h4>
                    <p className="text-[#94A3B8] leading-relaxed">
                      In a Pro Cluster, rate limit counters are synchronized across all nodes in real-time. This ensures that a user's quota is enforced globally, regardless of which gateway node they hit.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#050810] border border-white/5 font-mono text-xs text-blue-400">
                    Sync Latency: <span className="text-emerald-500">{"<"} 15ms</span> <br />
                    Cluster Size: 12 Nodes <br />
                    Active Keys: 42,901
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      case "transforms":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Binary className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Data Transformation</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Header Transforms</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-3xl">
                Transformations allow you to modify the request before it hits your upstream, or the response before it reaches the client. This is essential for maintaining backward compatibility, injecting tracing metadata, or adapting API versions without changing backend code.
              </p>
              <section className="pt-12 border-t border-white/5 space-y-12">
                <h3 className="text-2xl font-black text-white">Request & Response Modification</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      Request Header Operations
                    </h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      Add, remove, or modify HTTP headers. Inject <code>X-Request-ID</code> for distributed tracing, strip sensitive headers like <code>Authorization</code> before upstream, or add custom context headers like <code>X-User-ID</code> from JWT claims.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-purple-500" />
                      Response Header Operations
                    </h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      Modify upstream response headers before sending to clients. Add CORS headers, remove internal metadata, or normalize cache control headers for CDNs.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <Network className="h-4 w-4 text-emerald-500" />
                      Path Rewriting
                    </h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      Remap public paths to internal structures. For example, change <code>/shop/v2/orders</code> to <code>/api/internal/v3/orders</code> seamlessly without client awareness, with support for dynamic parameter substitution.
                    </p>
                  </div>
                </div>
              </section>

              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl border border-white/5 bg-[#0B101B] space-y-4 group hover:border-primary/30 transition-all">
                    <h3 id="header-transform" className="text-xl font-black text-white scroll-mt-32 flex items-center gap-2">
                      <Binary className="h-5 w-5 text-primary" />
                      Header Modification
                    </h3>
                    <ul className="text-xs text-[#94A3B8] space-y-3 list-none p-0">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Add <code>X-Sopo-Request-ID</code> for tracing.</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Strip <code>Authorization</code> before upstream.</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Rename legacy headers dynamically.</li>
                    </ul>
                  </div>
                  <div className="p-8 rounded-3xl border border-white/5 bg-[#0B101B] space-y-4 group hover:border-blue-500/30 transition-all">
                    <h3 id="path-rewrite" className="text-xl font-black text-white scroll-mt-32 flex items-center gap-2">
                      <Network className="h-5 w-5 text-blue-500" />
                      Path Rewriting
                    </h3>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">
                      Remap public paths to internal structures. For example, change <code>/shop/orders</code> to <code>/api/internal/v2/orders</code> seamlessly without client awareness.
                    </p>
                  </div>
                </div>

                {/* UI Mock: Visual Transformer */}
                <section id="body-transform" className="p-10 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-primary/5 to-transparent space-y-8 scroll-mt-32">
                  <h3 className="text-2xl font-black text-white">Advanced Body Mapping</h3>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">SOPO can parse JSON payloads and restructure them using a visual mapping engine. Perfect for adapting new client formats to legacy backend structures.</p>
                  <div className="flex flex-col md:flex-row items-center gap-8 justify-center p-8 bg-[#050810] rounded-3xl border border-white/5">
                    <div className="space-y-2">
                      <div className="text-[8px] font-black text-[#475569] uppercase tracking-widest">Incoming Payload</div>
                      <div className="text-[10px] font-mono p-4 rounded-xl bg-white/5 border border-white/5 text-blue-400">
                        {"{"}<br />
                        &nbsp;&nbsp;"user": "7721"<br />
                        {"}"}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-primary rotate-90 md:rotate-0" />
                      <span className="text-[8px] font-black text-primary uppercase tracking-widest">Transform</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-[8px] font-black text-[#475569] uppercase tracking-widest">Upstream Payload</div>
                      <div className="text-[10px] font-mono p-4 rounded-xl bg-white/5 border border-white/5 text-emerald-400">
                        {"{"}<br />
                        &nbsp;&nbsp;"id": 7721,<br />
                        &nbsp;&nbsp;"type": "legacy"<br />
                        {"}"}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          </div>
        );

      case "extensions":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-purple-500 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Code2 className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Custom Logic</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">WASM & Lua Extensions</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-3xl">
                When built-in plugins aren't enough, extend SOPO with custom logic. Use <strong>WebAssembly</strong> for native performance (ideal for production workloads) or <strong>Lua</strong> for rapid prototyping (perfect for experiments and fast iterations).
              </p>
              <section className="pt-12 border-t border-white/5 space-y-12">
                <h3 className="text-2xl font-black text-white">Use Cases</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm">Custom Auth</h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">Implement proprietary authentication schemes that aren't covered by standard plugins.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm">Payload Encryption</h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">Add field-level encryption/decryption for sensitive data in requests or responses.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm">Protocol Adapters</h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">Translate between different API protocols (e.g., REST to gRPC transcoding).</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                    <h5 className="font-bold text-white text-sm">Complex Routing</h5>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">Implement conditional routing based on request payload content or headers.</p>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="p-10 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-purple-500/10 to-transparent relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Binary className="h-32 w-32 text-purple-500" />
                  </div>
                  <h4 id="wasm-sdk" className="text-2xl font-black text-white mb-4 scroll-mt-32">WebAssembly (WASM)</h4>
                  <div className="space-y-4 text-[#94A3B8] leading-relaxed text-sm">
                    <p>Compile code from Rust, Go, or C++ into a WASM module and run it directly in the SOPO pipeline with near-native speeds.</p>
                    <ul className="space-y-3 list-none p-0">
                      <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-purple-500" /> Sandboxed Execution</li>
                      <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-purple-500" /> Memory-Safe Custom Filters</li>
                      <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-purple-500" /> Native SDK Support</li>
                    </ul>
                  </div>
                </div>

                <div className="p-10 rounded-[2.5rem] border border-white/5 bg-[#0B101B] relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MessageSquare className="h-32 w-32 text-blue-400" />
                  </div>
                  <h4 id="lua-scripting" className="text-2xl font-black text-white mb-4 scroll-mt-32">Lua Scripting</h4>
                  <div className="space-y-4 text-[#94A3B8] leading-relaxed text-sm">
                    <p>Quickly inject lightweight logic using Lua. Perfect for dynamic header generation, complex conditional routing, or custom logging.</p>
                    <ul className="space-y-3 list-none p-0">
                      <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-blue-400" /> Hot-Reloading Logic</li>
                      <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-blue-400" /> Minimal Memory Footprint</li>
                      <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-blue-400" /> Visual Code Editor</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* UI Mock: Code Editor for Extensions */}
              <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] overflow-hidden mt-8 shadow-2xl">
                <div className="px-8 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                    </div>
                    <span className="text-[10px] font-mono text-[#475569]">custom_auth.lua</span>
                  </div>
                  <div className="px-3 py-1 rounded-md bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">Running</div>
                </div>
                <div className="p-8 bg-[#050810] font-mono text-xs leading-relaxed">
                  <div className="flex gap-4">
                    <span className="text-[#475569] select-none">1</span>
                    <span className="text-purple-400">function</span> <span className="text-blue-400">on_request</span>(request)
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[#475569] select-none">2</span>
                    <span className="text-white">&nbsp;&nbsp;local token = request:get_header("X-Custom-Auth")</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[#475569] select-none">3</span>
                    <span className="text-white">&nbsp;&nbsp;</span><span className="text-purple-400">if</span> not token <span className="text-purple-400">then</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[#475569] select-none">4</span>
                    <span className="text-white">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-purple-400">return</span> request:respond(401, "Missing Token")
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[#475569] select-none">5</span>
                    <span className="text-white">&nbsp;&nbsp;</span><span className="text-purple-400">end</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[#475569] select-none">6</span>
                    <span className="text-purple-400">end</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      case "observability":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Observability</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Observability Suite</h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                You can't manage what you can't measure. SOPO's observability suite provides real-time telemetry for every request flowing through your gateway, including metrics, logs, and distributed tracing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "P99 Latency", value: "Optimized", icon: Clock },
                  { label: "Error Rate", value: "Minimal", icon: ShieldAlert },
                  { label: "Req/Second", value: "High", icon: Zap },
                  { label: "Active Nodes", value: "Multiple", icon: Network }
                ].map(item => (
                  <div key={item.label} className="p-6 rounded-3xl border border-border bg-card/20 flex flex-col items-center gap-4 group hover:border-primary/30 transition-all">
                    <item.icon className="h-6 w-6 text-primary" />
                    <div className="text-center">
                      <div className="text-2xl font-black text-foreground">{item.value}</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Figure: Observability Suite */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/5 bg-[#0B101B] overflow-hidden shadow-xl group">
                  <div className="p-1.5 bg-white/5 border-b border-white/5 flex items-center gap-2 px-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    </div>
                    <span className="text-[8px] font-mono text-[#475569]">observability-suite.webp</span>
                  </div>
                  <div className="aspect-video bg-[#050810] flex items-center justify-center relative">
                    <img
                      src="/docs/observability-suite.webp"
                      alt="Observability Suite"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="flex flex-col items-center gap-4 p-12 text-center">
                            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2 animate-pulse">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            </div>
                            <span class="text-[10px] font-black text-primary uppercase tracking-widest">Observability Suite Screenshot</span>
                          </div>
                        `;
                      }}
                    />
                  </div>
                </div>
                <p className="text-center text-[10px] text-[#475569] italic">Figure 6.1: Observability dashboard with global metrics and external integration options.</p>
              </div>

              <section id="external-exports" className="space-y-8 pt-8 scroll-mt-32">
                <h2 className="text-3xl font-display font-bold text-foreground dark:text-white border-l-4 border-blue-500 pl-6">External Integrations</h2>
                <div className="p-10 rounded-[40px] border border-border bg-card/50 dark:bg-card/20 space-y-8">
                  <p className="text-muted-foreground leading-relaxed">
                    SOPO doesn't lock your data. You can export metrics and logs to your existing observability stack using standard protocols like <strong>OpenTelemetry</strong> or <strong>StatsD</strong>.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-muted dark:bg-zinc-950 border border-border dark:border-white/5 flex flex-col items-center gap-4 group hover:bg-muted/80 dark:hover:bg-white/5 transition-all">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold group-hover:scale-110 transition-transform">OT</div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-foreground dark:text-white">OpenTelemetry</div>
                        <p className="text-[10px] text-muted-foreground dark:text-zinc-500">Native OTLP support for traces and metrics.</p>
                      </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-muted dark:bg-zinc-950 border border-border dark:border-white/5 flex flex-col items-center gap-4 group hover:bg-muted/80 dark:hover:bg-white/5 transition-all">
                      <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold group-hover:scale-110 transition-transform">PR</div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-foreground dark:text-white">Prometheus</div>
                        <p className="text-[10px] text-muted-foreground dark:text-zinc-500">Scrapable /metrics endpoint for time-series data.</p>
                      </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-muted dark:bg-zinc-950 border border-border dark:border-white/5 flex flex-col items-center gap-4 group hover:bg-muted/80 dark:hover:bg-white/5 transition-all">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-bold group-hover:scale-110 transition-transform">EL</div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-foreground dark:text-white">Elastic / Splunk</div>
                        <p className="text-[10px] text-muted-foreground dark:text-zinc-500">Structured JSON logs streamed via HTTP or gRPC.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </div>
        );

      case "rollbacks":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest font-mono">Reliability System</span>
              </div>
              <h2 className="text-5xl text-foreground font-black leading-tight tracking-tight">
                Atomic <span className="text-primary">Rollbacks</span>
              </h2>

              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                Rollbacks in SOPO are atomic version-state restorations. Every deployment across your environments is snapshot-versioned, allowing you to travel back in time to any known stable state rapidly with zero downtime.
              </p>
            </section>

            <section id="how-it-works" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Atomic Restoration Process</h3>
              <div className="space-y-8 max-w-4xl">
                {[
                  { step: "1", title: "Global Snapshot Versioning", desc: "Every time you promote a change, SOPO creates a complete, immutable snapshot of the entire gateway configuration (routes, upstreams, policies). This configuration state is cryptographically signed." },
                  { step: "2", title: "Pointer Swapping (RWMutex)", desc: "When a rollback is triggered, the Go gateway swaps the active configuration pointer atomically. Reading requests use a lock-free RLock path, ensuring zero downtime and zero dropped connections during configuration reloads." },
                  { step: "3", title: "Three-Tier Fallback Caching", desc: "If the connection to the control plane (Redis) is lost, agents fall back to a local config.json cache on the container file system, and finally to Amazon S3 for the last known good state." }
                ].map(item => (
                  <div key={item.step} className="flex gap-6 items-start p-6 rounded-2xl bg-[#0B101B] border border-white/5 hover:border-primary/20 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary font-black text-lg">{item.step}</div>
                    <div>
                      <h5 className="font-bold text-white text-lg mb-1">{item.title}</h5>
                      <p className="text-[#94A3B8] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="auto-rollback" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Auto-Rollback Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <div className="p-8 rounded-[2.5rem] border border-red-500/20 bg-red-500/5 space-y-4">
                  <h4 className="text-lg font-bold text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Threshold-Based Triggers
                  </h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Configure health-based auto-rollback rules. If a newly deployed version triggers error rates (5xx responses) or latency metrics to cross the configured thresholds within a 5-minute window, the gateway automatically reverts to the previous version.
                  </p>
                </div>
                <div className="p-8 rounded-[2.5rem] border border-white/5 bg-[#0B101B] space-y-4">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Health-Check Verification
                  </h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Active targets are drained automatically. Health checks monitor the newly loaded upstreams before routing client traffic, minimizing impact on active traffic during the reload window.
                  </p>
                </div>
              </div>
            </section>

            <section id="audit-trail" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Full Audit Trail</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed max-w-4xl">
                Every administrative configuration change, deployment, and rollback publishes event records to the PostgreSQL config database. These records contain the invoking user's ID, change description, timestamp, and a granular JSON diff showing the additions, modifications, and deletions between snapshots.
              </p>
            </section>
          </div>
        );

      case "radix-tree":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Network className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest font-mono">Routing Core</span>
              </div>
              <h2 className="text-5xl text-foreground font-black leading-tight tracking-tight">
                Radix Tree <span className="text-primary">Router</span>
              </h2>

              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                The Sopo gateway resolves path patterns using a high-performance compressed Radix Tree (Patricia Trie) implemented in Go. This delivers O(k) lookup time where k is path length, independent of the number of registered routes.
              </p>
            </section>

            <section id="tree-structure" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Node Types & Matching Priority</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    The router collapses common prefixes to minimize memory consumption and cache misses. When a request path is resolved, nodes are searched in a strict precedence order:
                  </p>
                  <ul className="space-y-4">
                    {[
                      { index: "1", type: "Static Nodes", desc: "Exact string matches (e.g. /api/users). Highest matching priority." },
                      { index: "2", type: "Parametric Nodes", desc: "Dynamic route segments prefix-matched (e.g. /api/users/:id), capturing parameters dynamically." },
                      { index: "3", type: "Wildcard Nodes", desc: "Asterisk catch-all segment (e.g. /static/*) matching any single path segment." },
                      { index: "4", type: "Deep Wildcard Nodes", desc: "Double asterisk catch-all segment (e.g. /proxy/**) matching all remaining path segments." }
                    ].map(node => (
                      <li key={node.index} className="flex gap-4 p-4 rounded-xl bg-[#0B101B] border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary font-black text-xs">{node.index}</div>
                        <div>
                          <h6 className="font-bold text-white text-sm">{node.type}</h6>
                          <p className="text-xs text-[#94A3B8] mt-0.5">{node.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-[#0B101B] border border-white/5 shadow-2xl">
                  <h4 className="text-sm font-black text-white mb-4 uppercase tracking-widest font-mono">Patricia Trie Representation</h4>
                  <div className="p-4 rounded-xl bg-black border border-white/5 font-mono text-xs">
                    <div className="text-[#475569] mb-3">// Routing trie layout</div>
                    <div className="text-white space-y-1">
                      root<br/>
                      ├── api/<br/>
                      │   ├── users/<br/>
                      │   │   ├── (:id) <span className="text-primary">// Parametric</span><br/>
                      │   │   └── me <span className="text-emerald-400">// Static</span><br/>
                      │   └── orders/<br/>
                      │       └── (:id)<br/>
                      ├── healthz<br/>
                      └── ** <span className="text-blue-400">// Catch-All</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-[#94A3B8]">
                    <strong className="text-primary">HTTP Method Matching:</strong> Path resolution is separate from HTTP method checking. The router resolves the node first, then queries the node's `methodRoutes` map, allowing correct HTTP 405 (Method Not Allowed) responses with an `Allow` header.
                  </div>
                </div>
              </div>
            </section>

            <section id="lookup-performance" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Immutable Lock-Free Resolution</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                To maximize concurrent read performance, the router is fully immutable once built. Updates are performed via the **Atomic Router Swap** pattern, where an entire new tree is built in the background and swapped atomically via pointer reassignment using an `RWMutex`. Read operations only take a shared read-lock (`RLock`), avoiding write lock contention entirely on the proxying hot path.
              </p>
            </section>

            <section id="benchmarks" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Performance Characteristics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {[
                  { title: "Lookup Throughput", value: "2.4M+ req/sec", desc: "Executed concurrently on a 3.5GHz CPU core" },
                  { title: "P99 Lookup Latency", value: "< 450 ns", desc: "Route resolution completes in sub-microsecond time" },
                  { title: "Memory Efficiency", value: "~120 bytes / route", desc: "collapsed prefixes minimize struct allocations" }
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white text-sm mb-2">{stat.title}</h5>
                    <div className="text-2xl font-black text-primary mb-1">{stat.value}</div>
                    <p className="text-xs text-[#475569]">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case "microkernel":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Layers className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest font-mono">Architecture</span>
              </div>
              <h2 className="text-5xl text-foreground font-black leading-tight tracking-tight">
                Microkernel <span className="text-primary">Plugins</span>
              </h2>

              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                The gateway core is minimal, using a plugin-based architecture for all cross-cutting concerns (Auth, Rate Limiting, Logging).
              </p>
            </section>

            <section id="phase-gates" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Execution Phase Gates</h3>
              <p className="text-sm text-[#94A3B8] max-w-4xl">
                Plugins are bound to specific lifecycle stages, ensuring predictable request modification order:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                {[
                  { phase: "Pre-Routing", desc: "Global Authentication & WAF rules." },
                  { phase: "Routing", desc: "Radix Tree path resolution." },
                  { phase: "Pre-Upstream", desc: "Rate limiting, header modification, transformation." },
                  { phase: "Post-Upstream", desc: "Logging, response mutation, metrics." }
                ].map((p, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-[#0B101B] border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary font-black text-xs">{i+1}</div>
                    <div>
                      <h6 className="font-bold text-white text-sm">{p.phase}</h6>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case "scatter-gather":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Workflow className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest font-mono">Aggregation</span>
              </div>
              <h2 className="text-5xl text-foreground font-black leading-tight tracking-tight">
                Scatter-Gather <span className="text-primary">Aggregation</span>
              </h2>

              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                Sopo provides a native Scatter-Gather execution engine to combine multiple upstream service calls into a single response. This reduces client-side round-trips for mobile/BFF clients.
              </p>
            </section>

            <section id="parallel-execution" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Parallel Upstream Requests</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    When a client invokes an aggregated route, the gateway decomposes the request into N parallel sub-requests. These are dispatched concurrently using Go goroutines and tracked using a `sync.WaitGroup` to block until completion or timeout:
                  </p>
                  <ul className="space-y-3 font-mono text-xs text-[#94A3B8]">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Concurrency via goroutines</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Coordination via sync.WaitGroup</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Per-sub-request timeout boundaries</li>
                  </ul>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-[#0B101B] border border-white/5 shadow-2xl">
                  <h4 className="text-sm font-black text-white mb-4 uppercase tracking-widest font-mono">Aggregation Flow</h4>
                  <div className="flex flex-col gap-4 font-mono text-xs">
                    <div className="p-3 bg-black border border-white/5 rounded text-center">Client Inbound GET /bff/dashboard</div>
                    <div className="flex justify-between gap-4">
                      <div className="w-1/3 p-3 bg-primary/10 border border-primary/20 rounded text-center text-primary">Sub-Req 1 (Auth)</div>
                      <div className="w-1/3 p-3 bg-primary/10 border border-primary/20 rounded text-center text-primary">Sub-Req 2 (Orders)</div>
                      <div className="w-1/3 p-3 bg-primary/10 border border-primary/20 rounded text-center text-primary">Sub-Req 3 (Promo)</div>
                    </div>
                    <div className="p-3 bg-black border border-white/5 rounded text-center text-emerald-400">Response Merger (200 OK Combined JSON)</div>
                  </div>
                </div>
              </div>
            </section>

            <section id="merge-strategies" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Three Response Merge Strategies</h3>
              <p className="text-sm text-[#94A3B8] max-w-4xl">
                The aggregator's response merger supports three strategies depending on requirements:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {[
                  { strategy: "merge", desc: "Combines multiple flat JSON objects into a single root JSON object, resolving field conflicts using priority schemes." },
                  { strategy: "envelope", desc: "Wraps each service payload under a key named after the upstream identifier (e.g. { 'user-service': {...}, 'order-service': {...} })." },
                  { strategy: "array", desc: "Combines the responses into a flat array of objects, useful for list-aggregation patterns." }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white text-sm mb-2 font-mono text-primary">{item.strategy}</h5>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="partial-failures" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Graceful Partial Failure Handling</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                When `allowPartial` is enabled, the failure of a non-critical sub-request does not terminate the transaction. The gateway returns all successful responses, attaching an `X-Aggregation-Partial: true` header to indicate missing resources, and logs the specific error messages. If a critical sub-request fails or `allowPartial` is disabled, the request fails immediately with an HTTP 502 (Bad Gateway).
              </p>
            </section>
          </div>
        );

      case "ticking-buffer":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest font-mono">Observability</span>
              </div>
              <h2 className="text-5xl text-foreground font-black leading-tight tracking-tight">
                Ticking <span className="text-primary">Buffer</span>
              </h2>

              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                The ticking buffer is a high-throughput telemetry ingestion pipeline implemented in Go. It enables asynchronous request logging to ClickHouse without blocking the proxy request execution path.
              </p>
            </section>

            <section id="dual-trigger" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Dual-Trigger Ingestion Mechanics</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    To optimize ClickHouse's columnar write performance, logging calls write to an in-memory lock-free channel. A background flushing loop aggregates these logs and triggers database writes based on two criteria:
                  </p>
                  <ul className="space-y-4">
                    {[
                      { trigger: "Time-Based Ticker", desc: "Fires every 1 second, guaranteeing real-time telemetry updates during low traffic periods." },
                      { trigger: "Count-Based Threshold", desc: "Fires immediately when the batch reaches 1,000 entries, preventing memory bloat during traffic bursts." }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4 p-4 rounded-xl bg-[#0B101B] border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-xs">{i+1}</div>
                        <div>
                          <h6 className="font-bold text-white text-sm">{item.trigger}</h6>
                          <p className="text-xs text-[#94A3B8] mt-0.5">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-[#0B101B] border border-white/5 shadow-2xl">
                  <h4 className="text-sm font-black text-white mb-4 uppercase tracking-widest font-mono">Loop Pseudocode</h4>
                  <div className="p-4 rounded-xl bg-black border border-white/5 font-mono text-[10px] text-white space-y-1">
                    for {'{'} <br/>
                    &nbsp;&nbsp;select {'{'} <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;case log := &lt;-logCh: <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;batch.Append(log) <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if len(batch) &gt;= 1000: Flush() <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;case &lt;-ticker.C: <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if len(batch) &gt; 0: Flush() <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;case &lt;-stopCh: <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DrainRemaining() <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return <br/>
                    &nbsp;&nbsp;{'}'} <br/>
                    {'}'}
                  </div>
                </div>
              </div>
            </section>

            <section id="zero-overhead" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Critical Path Isolation</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                The logging function uses a non-blocking `select/default` structure when sending to the channel. Under extreme load, if the buffer channel (capacity: 10,000) becomes saturated, logs are dropped in favor of keeping the proxy request path completely responsive. This limits telemetry latency impact to **&lt; 100 nanoseconds** per request.
              </p>
            </section>

            <section id="durability-wal" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Write-Ahead Log (WAL)</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                Before batch flushing completes, logs are appended to a Write-Ahead Log (WAL) on disk. During sudden container restarts or control plane crashes, the gateway replays this log on startup, ensuring that no telemetry data is lost even under catastrophic failures.
              </p>
            </section>

            <section id="buffer-performance" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Buffer Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {[
                  { metric: "Sustained Throughput", value: "50,000+ logs/sec", desc: "Ingested without system backpressure" },
                  { metric: "Channel Overflow Rate", value: "0.0%", desc: "Under normal and burst conditions" },
                  { metric: "Memory Footprint", value: "< 50 MB", desc: "Low allocation profiles on EKS" }
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white text-sm mb-2">{stat.metric}</h5>
                    <div className="text-2xl font-black text-primary mb-1">{stat.value}</div>
                    <p className="text-xs text-[#475569]">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case "load-balancing":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest font-mono">Traffic Dispatch</span>
              </div>
              <h2 className="text-5xl text-foreground font-black leading-tight tracking-tight">
                Load <span className="text-primary">Balancing</span>
              </h2>

              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                Sopo distributes requests across upstream targets using five health-aware balancing strategies, configurable per service, and optimized for low-latency operations.
              </p>
            </section>

            <section id="balancing-strategies" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Five Core Strategies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {[
                  { title: "Round Robin", desc: "Requests are distributed sequentially across targets using a lock-free atomic cyclic counter (`atomic.AddUint64`), minimizing synchronization contention." },
                  { title: "Weighted Random", desc: "Targets are chosen based on configured weights. Ideal for canary deployments and gradual traffic promotion between versions." },
                  { title: "Latency-Based (EMA)", desc: "Calculates an Exponential Moving Average (EMA) of upstream response times in real-time, dynamically routing requests to the fastest targets." },
                  { title: "Least Connections", desc: "Maintains an active connection counter per target, routing new requests to targets with the fewest concurrent requests." },
                  { title: "Random", desc: "Selects targets randomly, acting as a lightweight load balancer and serving as a baseline comparator during performance testing." }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 hover:border-primary/20 transition-all">
                    <h5 className="font-bold text-white text-sm mb-2 text-primary">{item.title}</h5>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="health-checking" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Active & Passive Health Checking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <div className="p-8 rounded-3xl bg-[#0B101B] border border-white/5 space-y-4">
                  <h4 className="font-bold text-white text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-400" />
                    Active Health Monitoring
                  </h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Background workers periodically send requests (e.g. every 5 seconds) to a specific target endpoint (like `/healthz`). Unhealthy targets are removed from routing immediately after consecutive failure thresholds are crossed.
                  </p>
                </div>
                <div className="p-8 rounded-3xl bg-[#0B101B] border border-white/5 space-y-4">
                  <h4 className="font-bold text-white text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Passive Circuit Breakers
                  </h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Evaluates actual request errors (5xx responses or timeouts) during live routing. If a target fails multiple consecutive live requests, it is marked as unhealthy immediately, without waiting for the next active check.
                  </p>
                </div>
              </div>
            </section>
          </div>
        );

      case "testing-benchmarks":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Terminal className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest font-mono">Verification</span>
              </div>
              <h2 className="text-5xl text-foreground font-black leading-tight tracking-tight">
                Testing & <span className="text-primary">Benchmarks</span>
              </h2>

              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                The platform is validated via rigorous testing methodologies spanning state machine models, category partitions, and automated integrations, alongside standardized performance benchmarks.
              </p>
            </section>

            <section id="state-machine-testing" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">State Machine Testing</h3>
              <p className="text-sm text-[#94A3B8] max-w-4xl">
                Critical systems are modeled as formal state machines to test state transition validity:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                  <h5 className="font-bold text-white text-sm">Gateway Config Lifecycle</h5>
                  <div className="p-3 bg-black border border-white/5 rounded text-xs font-mono text-[#94A3B8] space-y-1">
                    [Bootstrap] <br/>
                    &nbsp;&nbsp;│ (Check Redis) <br/>
                    &nbsp;&nbsp;├──► [Config from Redis] ──► [Running] <br/>
                    &nbsp;&nbsp;└──► [Config Fallback (Local/S3)] ──► [Running] <br/>
                    [Running] ──► (Reload Event) ──► [Pointer Swap] ──► [Running] <br/>
                    [Running] ──► (SIGTERM) ──► [Graceful Drain] ──► [Terminated]
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Asserts that reloads apply configuration update events correctly, and bad configuration schemas maintain the running state gracefully without crashing.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                  <h5 className="font-bold text-white text-sm">OAuth Authentication State Flow</h5>
                  <div className="p-3 bg-black border border-white/5 rounded text-xs font-mono text-[#94A3B8] space-y-1">
                    [Initiation] ──► [Redirect to Identity Provider] <br/>
                    &nbsp;&nbsp;│ (Callback Received) <br/>
                    &nbsp;&nbsp;▼ <br/>
                    [Exchange Token] ──► [Upsert User in PostgreSQL] <br/>
                    &nbsp;&nbsp;│ <br/>
                    &nbsp;&nbsp;▼ <br/>
                    [JWT Signed and Issued]
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Verifies transitions and checks that expired code parameters, invalid state keys, or provider errors return structured API failures.
                  </p>
                </div>
              </div>
            </section>

            <section id="category-partition" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Category Partition Testing</h3>
              <div className="space-y-4 max-w-4xl">
                <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#0B101B]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5 font-mono text-white">
                        <th className="p-4 font-bold">Category</th>
                        <th className="p-4 font-bold">Partition Case</th>
                        <th className="p-4 font-bold">Expected Verification Result</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#94A3B8] divide-y divide-white/5">
                      <tr>
                        <td className="p-4 font-bold text-white">Router Paths</td>
                        <td className="p-4">Static path (/api/users), dynamic (/api/users/:id), catching (*, **)</td>
                        <td className="p-4">Resolves node in O(k), maps segment parameters.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Router Methods</td>
                        <td className="p-4">Mismatched HTTP method for valid path</td>
                        <td className="p-4">Returns 405 Method Not Allowed with Allow header.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Plugin Safety</td>
                        <td className="p-4">Active plugin panics (FailOpen=true vs FailOpen=false)</td>
                        <td className="p-4">FailOpen continues pipeline; FailOpen=false aborts with 500.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Load Balancer</td>
                        <td className="p-4">All target instances down in selected upstream</td>
                        <td className="p-4">Aborts request execution, returns HTTP 503 Service Unavailable.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Aggregation</td>
                        <td className="p-4">Optional sub-request fails (allowPartial=true)</td>
                        <td className="p-4">Merges success data, returns X-Aggregation-Partial header.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section id="functional-testing" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Functional & User Acceptance Testing</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                Functional testing covers the gateway unit testing suites (`core/*_test.go`), configuration watchers, and a comprehensive Insomnia collection (`61 KB`) comprising 61 end-to-end tests for Express BFF authentication, token refresh, and CRUD routes. UAT was validated by evaluators performing hot-reloads under load, diagnosing upstreams, and testing responsiveness.
              </p>
            </section>

            <section id="experimental-benchmarks" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Calibrated Benchmarking Evaluation</h3>
              <div className="space-y-6 max-w-4xl">
                <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#0B101B]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5 font-mono text-white">
                        <th className="p-4 font-bold">Metric Evaluated</th>
                        <th className="p-4 font-bold text-primary">Sopo Gateway (Go)</th>
                        <th className="p-4 font-bold text-blue-400">NGINX (Baseline)</th>
                        <th className="p-4 font-bold text-purple-400">KrakenD (Go)</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#94A3B8] divide-y divide-white/5">
                      <tr>
                        <td className="p-4 font-bold text-white">Throughput (Single Upstream)</td>
                        <td className="p-4 font-black text-white">48,200 req/s</td>
                        <td className="p-4">52,100 req/s</td>
                        <td className="p-4">45,800 req/s</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">P99 Latency (Single Upstream)</td>
                        <td className="p-4 font-black text-white">1.2 ms</td>
                        <td className="p-4">0.8 ms</td>
                        <td className="p-4">1.5 ms</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Scatter-Gather (3 Upstreams)</td>
                        <td className="p-4 font-black text-white">12,400 req/s</td>
                        <td className="p-4">N/A (unsupported)</td>
                        <td className="p-4">11,200 req/s</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Hot-Reload Propagation Delay</td>
                        <td className="p-4 font-black text-white">&lt; 50 ms</td>
                        <td className="p-4">Requires SIGHUP</td>
                        <td className="p-4">Requires process restart</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Memory (Idle, 500 routes)</td>
                        <td className="p-4 font-black text-white">18 MB</td>
                        <td className="p-4">12 MB</td>
                        <td className="p-4">45 MB</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-[#475569] italic">Tested on a 3.5GHz CPU core, using a standardized JSON config object representing 500 routes.</p>
              </div>
            </section>
          </div>
        );

      case "mcp-server":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Code2 className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest font-mono">AI Integration</span>
              </div>
              <h2 className="text-5xl text-foreground font-black leading-tight tracking-tight">
                MCP Server for <span className="text-primary">AI Management</span>
              </h2>

              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                The Model Context Protocol (MCP) server is a TypeScript/Node.js server that allows AI agents to orchestrate the Sopo gateway infrastructure using natural language.
              </p>
            </section>

            <section id="mcp-background" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">What is Model Context Protocol?</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                MCP is an open standard developed by Anthropic that establishes a structured communication channel between LLMs and external software APIs. It defines how tools can be registered and invoked, how resources can expose system state, and how pre-built prompts can guide workflows.
              </p>
            </section>

            <section id="mcp-architecture" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Architecture & Transport Bridge</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                The Sopo MCP Server operates as a thin adapter layer, translating the AI client's requests (via stdio for local environments like Claude Desktop, or SSE for cursor/windsurf integrations) into validated HTTP calls targeting the Sopo Backend REST API. All access verification, JWT tokens, and DB mutations are delegated to the main BFF, keeping a single source of truth.
              </p>
            </section>

            <section id="mcp-capabilities" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">39 Tools & 3 Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                  <h5 className="font-bold text-white text-sm">39 CRUD Tools Across 10 Domains</h5>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Exposes tools with Zod schema validation (e.g. `list_gateways`, `create_service`, `attach_plugin`, `delete_route`). Domains include: Authentication, Gateways, Services, Targets, Routes, Plugins, Aggregations, Collections, Profiles, and ClickHouse telemetry queries.
                  </p>
                  <div className="p-3 bg-black border border-white/5 rounded text-xs font-mono text-primary">
                    auth_tools.ts, gateway_tools.ts, route_tools.ts, plugin_tools.ts, observability_tools.ts...
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-3">
                  <h5 className="font-bold text-white text-sm">3 Contextual Grounding Resources</h5>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Resources expose real-time system summaries to ground the AI model's context, preventing hallucinations:
                  </p>
                  <ul className="text-xs font-mono text-[#94A3B8] space-y-1">
                    <li>• <span className="text-primary">sopo://platform/overview</span> (schema details)</li>
                    <li>• <span className="text-primary">sopo://gateways/current-config</span> (live config)</li>
                    <li>• <span className="text-primary">sopo://stats/resources</span> (resource counts)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="mcp-prompts" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Guided Workflow Prompts</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                Prompts serve as declarative multi-step guides for conversational tasks. For example, the `setup_new_gateway` prompt directs the AI model through a 4-step deployment flow, resolving dependent entity IDs dynamically at runtime (create_gateway ──► create_service ──► create_target ──► create_route) without requiring manual scripting.
              </p>
            </section>

            <section id="mcp-performance" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Efficiency Gains (UI vs MCP)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {[
                  { task: "Gateway Stack Setup", ui: "4 min 30 sec", mcp: "45 sec", speedup: "6.0x" },
                  { task: "Attach Plugin Config", ui: "2 min 15 sec", mcp: "20 sec", speedup: "6.8x" },
                  { task: "Observability Report", ui: "8 min 00 sec", mcp: "30 sec", speedup: "16.0x" }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 text-center">
                    <h6 className="font-bold text-white text-sm mb-2">{item.task}</h6>
                    <div className="text-xs text-[#475569] space-y-1">
                      <div>Manual UI: {item.ui}</div>
                      <div>With MCP: {item.mcp}</div>
                      <div className="text-primary font-black text-sm mt-1">{item.speedup} speedup</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case "results":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest font-mono">Results</span>
              </div>
              <h2 className="text-5xl text-foreground font-black leading-tight tracking-tight">
                Results & <span className="text-primary">Discussion</span>
              </h2>

              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-4xl">
                Evaluation of Sopo API Gateway platform's lines of code, performance calibrations, hot-reload propagation times, and objectives assessments.
              </p>
            </section>

            <section id="platform-deliverables" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Platform Deliverables</h3>
              <p className="text-sm text-[#94A3B8] max-w-4xl">
                The platform contains six primary components totaling approximately **25,000 lines of production code** across Go, TypeScript, and configurations:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {[
                  { component: "sopo-gateway-server (Go)", loc: "~5,800 lines", desc: "Data plane reverse proxy" },
                  { component: "sopo_backend (TypeScript)", loc: "~4,200 lines", desc: "Control plane Express BFF API" },
                  { component: "sopo-frontend (TypeScript)", loc: "~12,000 lines", desc: "Control plane Next.js Dashboard UI" },
                  { component: "hasura-auth (Go/Node)", loc: "~2,500 lines", desc: "Auth sync services" },
                  { component: "sopo-mcp-server (TypeScript)", loc: "~1,200 lines", desc: "Model Context Protocol adapter" },
                  { component: "Infrastructure configs", loc: "~800 lines", desc: "Postgres, Redis, ClickHouse setups" }
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white text-sm mb-1">{item.component}</h5>
                    <div className="text-lg font-black text-primary mb-1">{item.loc}</div>
                    <p className="text-xs text-[#475569]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="performance-results" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Performance Calibration</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                Sopo Gateway achieves **92.5% of NGINX throughput** (C-based baseline) while supporting dynamic hot-reload (which NGINX lacks without expensive proprietary add-ons or reload downtime). Sopo also outperforms KrakenD by **5.2% in throughput** and **20% in P99 latency** due to the O(k) radix tree lookup.
              </p>
            </section>

            <section id="reload-latency" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Hot-Reload Propagation Latency</h3>
              <p className="text-sm text-[#94A3B8] max-w-4xl">
                End-to-end configuration reload takes between **26 ms and 50 ms** across 100 sample runs, keeping routing tables perfectly synchronized in real time:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl">
                {[
                  { step: "1. Hasura Trigger", time: "5-10 ms", desc: "Mutations detected and webhook emitted" },
                  { step: "2. Nhost Webhook", time: "15-25 ms", desc: "Serialized config published to Redis" },
                  { step: "3. Redis Delivery", time: "1-3 ms", desc: "Pub/Sub sends state to Go subscriber" },
                  { step: "4. Atomic Swap", time: "5-12 ms", desc: "Unmarshalled trie pointer swapped" }
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-xl bg-[#0B101B] border border-white/5">
                    <div className="text-xs font-mono font-bold text-primary mb-2">{item.step}</div>
                    <div className="text-xl font-black text-white mb-1">{item.time}</div>
                    <p className="text-[10px] text-[#475569] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="unexpected-findings" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Unexpected Findings</h3>
              <div className="space-y-4 max-w-4xl">
                {[
                  { title: "Radix Tree Depth Penalty", desc: "Paths with 6+ segments show a 15% throughput decrease compared to 3-segment routes due to tree traversal steps. Users are advised to limit route depth." },
                  { title: "ClickHouse Connector Latency", desc: "Queries against ClickHouse via Hasura Data Connector exhibited 3-5x higher latency than PostgreSQL. Resolved by creating ClickHouse Materialized Views to pre-aggregate data." },
                  { title: "Verb-First MCP Tool Naming", desc: "LLMs call verb-first tools (list_gateways) 15% more accurately than noun-first versions (gateways_list) due to action tokenization mapping." },
                  { title: "WebSocket H2C Cleartext Conflict", desc: "HTTP/2 cleartext (h2c) upgrade handlers conflict with WebSocket upgrade handshakes, requiring connection protocol sniffing at the TCP level." }
                ].map((finding, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white text-sm mb-2">{finding.title}</h5>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{finding.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="objective-assessment" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Objective Assessments (O1 - O12)</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed max-w-4xl">
                All 12 original objectives were fully achieved. Calibrated performance checks verify the system runs efficiently, routing configuration maps dynamically with atomic swaps under concurrent read loads, and Terraform provisionings build Kubernetes environments reliably.
              </p>
            </section>
          </div>
        );

      case "cloud-devops":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest font-mono">Operations</span>
              </div>
              <h2 className="text-5xl text-foreground font-black leading-tight tracking-tight">
                Cloud & <span className="text-primary">DevOps</span>
              </h2>

              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-3xl">
                Infrastructure as Code, CI/CD pipelines, and Kubernetes deployment for production-grade SOPO installations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-4xl">
                {[
                  { title: "Terraform", icon: "/docs/logos/terraform.png", fallbackIcon: "🌍", desc: "Infrastructure as Code for AWS, GCP, Azure" },
                  { title: "Amazon Web Services", icon: "/docs/logos/aws.png", fallbackIcon: "☁️", desc: "Cloud hosting on AWS EKS, RDS, and S3" },
                  { title: "GitHub Actions", icon: "/docs/logos/github-actions.png", fallbackIcon: "⚡", desc: "Automated CI/CD pipelines" }
                ].map((item, i) => (
                  <div key={i} className="p-8 rounded-[2.5rem] border border-white/5 bg-[#0B101B] hover:border-primary/20 transition-all flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 overflow-hidden">
                      <img 
                        src={item.icon} 
                        alt={item.title} 
                        className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `<span class="text-4xl">${item.fallbackIcon}</span>`;
                        }}
                      />
                    </div>
                    <h4 className="text-xl font-black text-white mb-3">{item.title}</h4>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="terraform-iac" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Terraform Infrastructure as Code</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                Declarative AWS resources are managed across modular configurations: `vpc` (subnets, NAT), `eks` (node groups, RBAC), `rds` (PostgreSQL Multi-AZ), `networking` (ALB, listeners), `security` (WAF, Shield), `storage` (S3 state backend), and `dns_acm` (Route 53).
              </p>
            </section>

            <section id="cicd-pipeline" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">GitHub Actions CI/CD Pipeline</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                Automated pipelines validate codes (`golangci-lint`, `eslint`), audit dependency vulnerabilities, build multi-stage Docker containers, tag with git SHAs, push to AWS ECR, plan/apply Terraform changes, and execute Helm upgrades atomically.
              </p>
            </section>

            <section id="eks-orchestration" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">EKS Container Orchestration</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                Worker nodes run in private subnets, exposing services only through Application Load Balancers. Autorecover restarts dead pods, and Horizontal Pod Autoscalers (HPA) scale the gateway replicas when CPU utilization crosses 70%.
              </p>
            </section>

            <section id="edge-security" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Edge Security & Networking</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                Edge protection is enforced via AWS WAF (blocking SQL injection, geographic bots), AWS Shield Standard (DDoS mitigation), and Application Load Balancer path-based listener rules terminating HTTPS with ACM certificates.
              </p>
            </section>

            <section id="data-services" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Data Services Layer</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                PostgreSQL is deployed on Multi-AZ RDS for configuration persistence and authentication records. Redis acts as the caching layer and hot-reload pub/sub channel. Telemetry data logs are batch-written to ClickHouse scheduled on EKS statefulsets.
              </p>
            </section>

            <section id="secrets-observability" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Secrets & Observability</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                AWS Secrets Manager endpoints are mounted securely to pods via External Secrets Operator (ESO). Observability is orchestrated by the kube-prometheus-stack (collecting gateway metrics like request rates, EMA latency), Promtail shipping container outputs to Grafana Loki, and Alertmanager routing warnings to Slack or PagerDuty.
              </p>
            </section>
          </div>
        );

      case "conclusions":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Info className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest font-mono">Summary</span>
              </div>
              <h2 className="text-5xl text-foreground font-black leading-tight tracking-tight">
                Conclusions & <span className="text-primary">Future Work</span>
              </h2>

              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-3xl">
                Summary of Sopo API platform contributions, key research findings, system limitations, and the future development roadmap.
              </p>
            </section>

            <section id="thesis-conclusions" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Thesis Conclusions</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                This project demonstrates the viability of building a cloud-native, high-performance API management platform from first principles in Go. The architecture successfully resolves traditional trade-offs by matching or beating comparable gateways in latency while delivering zero-downtime hot-reload configuration sync and conversational AI infrastructure management.
              </p>
            </section>

            <section id="core-contributions" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Core Contributions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                {[
                  { title: "High-Performance Proxying", desc: "Near-C-level execution speed (within 8% of NGINX) using lock-free read paths, radix routing, and pooled contexts." },
                  { title: "Zero-Downtime Event Sync", desc: "Sub-50ms configuration reload latency from database mutation to memory pointer swap, with zero connection drops." },
                  { title: "AI MCP Integration", desc: "TypeScript MCP server with 39 tools and resources enabling conversational natural language management of the platform." },
                  { title: "Production Cloud Deployment", desc: "Fully automated EKS and Multi-AZ database environments provisioned via Terraform and continuously delivered." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-[#0B101B] border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary font-black text-xs">{i + 1}</div>
                    <div>
                      <h5 className="font-bold text-white text-sm">{item.title}</h5>
                      <p className="text-xs text-[#94A3B8] mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="platform-limitations" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Platform Limitations</h3>
              <ul className="space-y-3 text-sm text-[#94A3B8] max-w-4xl">
                <li>• **Clustering Sync:** Replicas do not share distributed states for plugin caching or rate limiting (eventual consistency only).</li>
                <li>• **Access Granularity:** The platform uses a basic two-role authorization boundary (admin/user) rather than dynamic resource-level IAM policies.</li>
                <li>• **Subsystem Test Coverage:** The Go gateway is extensively tested, but the backend API, nextjs frontend, and MCP server lack complete automated test suites.</li>
              </ul>
            </section>

            <section id="development-reflection" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Development Reflections</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl">
                The development process validates the iterative, research-oriented methodology. The four pivots (hashmap to Radix Tree router, direct SQL to Hasura ClickHouse Connector, monolithic to modular Terraform, and stdio-only to dual-transport MCP) required additional time but resulted in a demonstrably superior design.
              </p>
            </section>

            <section id="future-roadmap" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white">Future Roadmap</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-2">
                  <h5 className="font-bold text-white text-sm">Short-Term Upgrades (1-3 months)</h5>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    WebSocket real-time log pushes, increasing automated test coverage to &gt;80% across all codebases, adding gRPC proxying, and building a fine-grained RBAC rule engine.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 space-y-2">
                  <h5 className="font-bold text-white text-sm">Medium/Long-Term Research</h5>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Raft consensus clustering, GraphQL-aware parsing, self-healing AI agents monitoring ClickHouse data to apply traffic policies automatically, and exporting visual configs to Terraform modules.
                  </p>
                </div>
              </div>
            </section>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-6 rounded-full bg-primary/10 mb-8">
              <Info className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Content Coming Soon</h2>
            <p className="text-muted-foreground max-w-lg text-lg leading-relaxed mb-10">
              We are currently building out the detailed documentation for <strong>{currentPage.title}</strong>. Stay tuned for updates!
            </p>
          </div>
        );
    }
  };

  const getPageHeadings = () => {
    switch (currentPageId) {
      case "overview": return [
        { id: "mission", label: "Our Mission" },
        { id: "use-cases", label: "Technical Use Cases" },
        { id: "system-design", label: "Core Design Pillars" }
      ];
      case "quickstart": return [
        { id: "prerequisites", label: "Prerequisites" },
        { id: "installation", label: "Installation" },
        { id: "deployment-modes", label: "Wizard vs Manual" },
        { id: "steps", label: "Setup Steps" },
        { id: "verification", label: "Verification" }
      ];
      case "architecture": return [
        { id: "control-plane", label: "Control Plane" },
        { id: "data-plane", label: "Data Plane (Agent)" },
        { id: "phase-engine", label: "Phase Engine" },
        { id: "sync-protocol", label: "Sync Protocol" }
      ];
      case "workspaces": return [
        { id: "infrastructure-identity", label: "Infrastructure Identity" },
        { id: "external-integrations", label: "Auth & Integrations" },
        { id: "workspace-isolation", label: "Hard Isolation" }
      ];
      case "gateways": return [];
      case "environments": return [
        { id: "promotion-flow", label: "Promotion Workflow" },
        { id: "env-variables", label: "Environment Variables" }
      ];
      case "services": return [
        { id: "service-configuration", label: "Core Configuration" }
      ];
      case "routes": return [
        { id: "routing-topology", label: "Routing & Topology" }
      ];
      case "plugins": return [
        { id: "plugin-modules", label: "Plugin Modules" },
        { id: "execution-phases", label: "Execution Phases" },
        { id: "short-circuit", label: "Short-Circuit Logic" }
      ];
      case "policies": return [
        { id: "pipeline-execution", label: "Pipeline Execution" },
        { id: "custom-extensions", label: "Custom Extensions" }
      ];
      case "transforms": return [
        { id: "header-transform", label: "Header Modification" },
        { id: "path-rewrite", label: "Path Rewriting" },
        { id: "body-transform", label: "Body Mapping" }
      ];
      case "extensions": return [
        { id: "wasm-sdk", label: "WebAssembly (WASM)" },
        { id: "lua-scripting", label: "Lua Scripting" }
      ];
      case "workflow": return [];
      case "analytics": return [];
      case "observability": return [
        { id: "global-metrics", label: "Global Aggregation" },
        { id: "external-exports", label: "External Integrations" }
      ];
      case "auth": return [];
      case "rate-limiting": return [];
      case "rollbacks": return [
        { id: "how-it-works", label: "Atomic Restoration" },
        { id: "auto-rollback", label: "Auto-Rollback Rules" },
        { id: "audit-trail", label: "Audit Trail" }
      ];
      case "radix-tree": return [];
      case "microkernel": return [];
      case "scatter-gather": return [];
      case "ticking-buffer": return [];
      case "load-balancing": return [];
      case "testing-benchmarks": return [];
      case "mcp-server": return [];
      case "results": return [];
      case "cloud-devops": return [];
      case "conclusions": return [];
      default: return [];
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background dark:bg-[#0B0E14] text-muted-foreground dark:text-[#C5CACE] font-sans selection:bg-primary/30">
        <Sidebar className="border-r border-border dark:border-white/5 bg-background dark:bg-[#0B0E14]">
          <SidebarContent className="px-3 pt-6">
            <div className="px-4 mb-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all group"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </div>
            <div className="px-4 py-2 mb-2">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-zinc-600 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted/50 dark:bg-secondary/30 border border-border dark:border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>
            {filteredStructure.map((section) => (
              <SidebarGroup key={section.title} className="py-2">
                <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.25em] text-foreground/90 dark:text-white/90 font-black px-4 mb-2">
                  {section.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-1">
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => {
                            setCurrentPageId(item.id);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          isActive={currentPageId === item.id}
                          className={cn(
                            "w-full justify-between hover:bg-muted dark:hover:bg-white/5 transition-all h-9 px-4 rounded-xl group relative overflow-hidden",
                            currentPageId === item.id ? "text-primary bg-primary/10 font-bold" : "text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-white transition-colors"
                          )}
                        >
                          <div className="flex items-center justify-between w-full relative z-10">
                            <span className="text-[13px] tracking-tight">{item.title}</span>
                            {currentPageId === item.id && (
                              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                            )}
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-background dark:bg-[#0B0E14] relative">
          <div className="absolute top-8 left-8 md:hidden z-20">
            <SidebarTrigger className="h-10 w-10 border border-border bg-background shadow-sm" />
          </div>
          <div className="flex flex-1 flex-col lg:flex-row relative z-10">
            <main className="flex-1 px-8 py-16 md:px-16 lg:px-24 max-w-5xl mx-auto w-full min-h-[calc(100vh-5rem)]">
              <div className="space-y-2 mb-12">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary/80">Documentation</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">{currentPage.category}</span>
                </div>

                <div className="flex items-center justify-between group pt-4">
                  <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight text-foreground dark:text-white">
                    {currentPage.title}
                  </h1>
                  <button
                    onClick={handleCopy}
                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full border border-border dark:border-white/10 bg-background hover:bg-muted dark:hover:bg-secondary transition-all text-xs font-bold text-muted-foreground hover:text-foreground dark:hover:text-white shadow-xl active:scale-95 border-b-2"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Link Copied" : "Copy Path"}</span>
                  </button>
                </div>
              </div>

              <div className="prose prose-zinc dark:prose-invert max-w-none">
                {renderContent()}
              </div>

              <div className="mt-32 pt-12 border-t border-border dark:border-white/5 flex justify-between items-center">
                {nextChapter ? (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground/60 dark:text-zinc-500 font-bold uppercase tracking-widest">Next Chapter</p>
                      <p className="text-lg font-bold text-foreground dark:text-white">{nextChapter.title}</p>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentPageId(nextChapter.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all group"
                    >
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground/60 dark:text-zinc-500 font-bold uppercase tracking-widest">End of Path</p>
                    <p className="text-lg font-bold text-white">Back to Overview</p>
                    <button
                      onClick={() => {
                        setCurrentPageId("overview");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="mt-4 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-bold text-sm"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Start Again
                    </button>
                  </div>
                )}
              </div>
            </main>

            <aside className="hidden xl:block w-80 shrink-0 px-10 py-16 sticky top-0 h-screen overflow-y-auto border-l border-border dark:border-white/5 bg-background/50 dark:bg-[#0B0E14]/50 backdrop-blur-3xl">
              <div className="space-y-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-foreground dark:text-white font-black">
                    <div className="w-1 h-5 bg-primary rounded-full shadow-[0_0_10px_rgba(243,90,30,0.5)]" />
                    <span className="text-[11px] uppercase tracking-[0.25em]">On this page</span>
                  </div>
                  <nav className="flex flex-col space-y-5">
                    <a
                      href="#"
                      className={cn(
                        "text-[13px] transition-all duration-300",
                        !activeToCId ? "text-primary font-black pl-2" : "text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-white hover:pl-2"
                      )}
                    >
                      Introduction
                    </a>
                    {getPageHeadings().map((link) => (
                      <a
                        key={link.id}
                        href={`#${link.id}`}
                        className={cn(
                          "text-[13px] transition-all duration-300",
                          activeToCId === link.id ? "text-primary font-black pl-2" : "text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-white hover:pl-2"
                        )}
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>
                </div>

                <div className="pt-10 border-t border-border dark:border-white/5">
                  <div className="p-8 rounded-[32px] bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 relative overflow-hidden group">
                    <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <HelpCircle className="h-32 w-32 text-primary" />
                    </div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Community</p>
                    <p className="text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed mb-6 font-medium">Have a specific use case or need technical guidance? Join our expert-led playground.</p>
                    <button
                      onClick={() => {
                        window.open("https://playground.sopo.io", "_blank");
                      }}
                      className="w-full py-3 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                      Launch Playground
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}