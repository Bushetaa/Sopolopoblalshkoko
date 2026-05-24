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
                      src="/docs/overview.png"
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
                               System Overview Screenshot (overview.png)
                            </div>
                            <p class="text-[10px] text-[#475569] max-w-xs leading-relaxed mt-2">
                              Please place your screenshot in <b>public/docs/overview.png</b> to see it here.
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
                Start managing your APIs in minutes. This guide walks you through the initial setup, from workspace creation to deploying your first secure route.
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
                    <p className="text-xs text-[#475569] mt-1">Sign up at portal.sopo.io to get your API keys.</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5 flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-white/5"><Terminal className="h-5 w-5 text-blue-500" /></div>
                  <div>
                    <h5 className="font-bold text-white text-sm">CLI Installed</h5>
                    <p className="text-xs text-[#475569] mt-1">Install the SOPO CLI on your local machine.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="installation" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-2xl font-black text-white">1. Install the CLI</h3>
              <p className="text-[#94A3B8] text-sm">Run the following command in your terminal to install the SOPO toolchain globally:</p>
              <div className="p-6 rounded-2xl bg-black border border-white/5 group relative">
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => navigator.clipboard.writeText("curl -sSL https://get.sopo.io | sh")} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#475569] hover:text-white transition-all">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-4 font-mono text-sm">
                  <span className="text-primary">$</span>
                  <span className="text-white">curl -sSL https://get.sopo.io | sh</span>
                </div>
              </div>
              <p className="text-xs text-[#475569]">Supports macOS (Homebrew), Linux, and Windows (PowerShell).</p>
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
                    The wizard is the fastest way to get a production-ready stack. It automates the linking between your Gateway, Service, and Route in a single 4-step flow.
                  </p>
                  <ul className="space-y-3">
                    {["Automated entity linking", "Default security best-practices", "One-click deployment"].map(item => (
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
                    <span className="text-[8px] font-mono text-[#475569]">gateway-wizard.png</span>
                  </div>
                  <div className="aspect-video bg-[#050810] flex items-center justify-center relative">
                    <img
                      src="/docs/gateway-wizard.png"
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
                    <span className="text-[8px] font-mono text-[#475569]">manual-entry.png</span>
                  </div>
                  <div className="aspect-video bg-[#050810] flex items-center justify-center relative">
                    <img
                      src="/docs/manual-entry.png"
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
                    For advanced users who need full control. Manually configure every parameter of your infrastructure, including protocol overrides and custom timeouts.
                  </p>
                  <ul className="space-y-3">
                    {["Granular parameter control", "Custom topology mapping", "Independent versioning"].map(item => (
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
                    desc: "Your workspace is the central hub for all gateway configurations. It holds your environments, policies, and upstream definitions. Workspaces provide the logical boundary for multi-tenant isolation.",
                    tasks: ["Set workspace name", "Choose default region (e.g., us-east-1)", "Invite team members with RBAC roles"],
                    code: "sopo workspace create \"Global-API-Gateway\""
                  },
                  {
                    step: "02",
                    id: "define-upstream",
                    title: "Define Your Upstream",
                    desc: "Tell SOPO where your backend services are located. An upstream can be a single URL or a group of servers for load balancing. SOPO automatically monitors these targets to ensure high availability.",
                    tasks: ["Add target URLs (IPs or DNS)", "Configure Passive/Active Health Checks", "Select Load Balancing algo (Round Robin, Least Conn)"],
                    code: "sopo upstream add order-service \\\n  --url https://api.production.local/orders \\\n  --health-path /health"
                  },
                  {
                    step: "03",
                    id: "create-route",
                    title: "Create a Route",
                    desc: "Map a public URL to your upstream service. This is where you define the entry point for your consumers. You can use regex for dynamic paths and filter by HTTP methods.",
                    tasks: ["Set path prefix (e.g., /v1/orders)", "Select HTTP methods (GET, POST, etc.)", "Attach base security policies (JWT, Rate Limit)"],
                    code: "sopo route add /v1/orders --upstream order-service"
                  },
                  {
                    step: "04",
                    id: "promote-prod",
                    title: "Promotion to Production",
                    desc: "Review your changes in the visual pipeline. SOPO generates a semantic diff of your configuration changes, allowing you to audit exactly what will be updated.",
                    tasks: ["Verify simulation results", "Push to Dev environment", "Promote to Production with atomic rollback"],
                    code: "sopo promote dev production --tag v1.0.4"
                  }
                ].map((item) => (
                  <div key={item.step} id={item.id} className="group relative pl-12 border-l-2 border-white/5 hover:border-primary/50 transition-all scroll-mt-32">
                    <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-2xl bg-[#0B101B] border-2 border-white/10 group-hover:border-primary group-hover:bg-primary/10 flex items-center justify-center text-xs font-black transition-all">
                      {item.step}
                    </div>
                    <div className="space-y-6 pb-12">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h4 className="text-2xl font-black text-white">{item.title}</h4>
                        <div className="p-4 rounded-xl bg-black border border-white/5 font-mono text-[11px] text-primary/90 flex items-center gap-3">
                          <Terminal className="h-3.5 w-3.5" />
                          {item.code}
                        </div>
                      </div>
                      <p className="text-[#94A3B8] text-base leading-relaxed max-w-2xl">{item.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.tasks.map(t => (
                          <span key={t} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-[#475569]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="verification" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-2xl font-black text-white">3. Verify Your Setup</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Once deployed, you can test your new route using <code>curl</code> or any API client. SOPO automatically generates a public URL for your workspace environments.
              </p>
              <div className="p-6 rounded-2xl bg-black border border-white/5 font-mono text-sm space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-primary">$</span>
                  <span className="text-white">curl -i https://your-workspace.sopo.io/v1/orders</span>
                </div>
                <div className="text-[#475569] mt-4">
                  HTTP/2 200 OK <br />
                  Content-Type: application/json <br />
                  X-Sopo-Request-ID: req_9921ab01 <br />
                  ...
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
                SOPO is built on a highly decoupled, cloud-native architecture that separates the <strong>Control Plane</strong> from the <strong>Data Plane</strong>. This separation ensures that even if the management layer is unavailable, your traffic continues to flow uninterrupted.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="p-10 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-blue-500/10 to-transparent relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Cpu className="h-32 w-32 text-blue-500" />
                </div>
                <Cpu className="h-12 w-12 text-blue-500 mb-6" />
                <h4 id="control-plane" className="text-2xl font-black text-white mb-4 scroll-mt-32 tracking-tight">Control Plane</h4>
                <div className="space-y-4 text-[#94A3B8] leading-relaxed text-sm">
                  <p>The centralized management layer. It handles the visual designer, configuration storage, global analytics, and team coordination.</p>
                  <ul className="space-y-3 list-none p-0">
                    <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Visual Policy Designer & Orchestrator</li>
                    <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Environment Promotion & Rollback Engine</li>
                    <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-blue-500" /> API Key, Secret & Certificate Vault</li>
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
                  <p>The high-performance execution layer. Distributed agents that process policies and route traffic at the edge with zero external dependency.</p>
                  <ul className="space-y-3 list-none p-0">
                    <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-primary" /> Sub-millisecond Pipeline Execution</li>
                    <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-primary" /> Local Config Caching & Offline Mode</li>
                    <li className="flex gap-3 items-center text-xs font-bold"><CheckCircle2 className="h-4 w-4 text-primary" /> Real-time Telemetry & Pulse Streaming</li>
                  </ul>
                </div>
              </div>
            </div>

            <section id="phase-engine" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white tracking-tight">Phase-Based Execution Engine</h3>
              <p className="text-[#94A3B8] text-lg leading-relaxed max-w-4xl">
                SOPO's proprietary engine processes every request through a series of discrete phases. This allows for fine-grained control over when security, transformations, and routing logic are applied.
              </p>
              <div className="space-y-4">
                {[
                  { phase: "Preread", desc: "Initial connection handling and TLS termination. Protocol detection (HTTP/1, HTTP/2, gRPC)." },
                  { phase: "Rewrite", desc: "Path remapping and early header transformations before access control." },
                  { phase: "Access", desc: "Authentication and Authorization. JWT validation, API Key checks, and IP filtering." },
                  { phase: "Content", desc: "Core routing logic. Selection of upstream targets and load balancing." },
                  { phase: "Log", desc: "Post-request telemetry gathering and streaming to the Control Plane." }
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
                We use a custom gRPC-based streaming protocol to ensure that policy changes are propagated from the Control Plane to all global Agents in less than 50ms.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-3xl bg-[#050810] border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.6)] animate-pulse" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">Update Issued</span>
                </div>
                <div className="flex-1 h-[2px] bg-gradient-to-r from-blue-500 via-primary to-primary relative mx-4">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 rounded-full bg-[#0B101B] border border-white/10 text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-2xl">
                    Low Latency gRPC Stream
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-white uppercase tracking-widest">Global Enforcement</span>
                  <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(243,90,30,0.6)] animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="p-8 rounded-2xl bg-[#0B101B] border border-white/5">
                  <h5 className="font-bold text-white mb-3">Eventual Consistency</h5>
                  <p className="text-xs text-[#475569] leading-relaxed">Most configuration updates follow an eventual consistency model, ensuring high availability even during network partitions between regions.</p>
                </div>
                <div className="p-8 rounded-2xl bg-[#0B101B] border border-white/5">
                  <h5 className="font-bold text-white mb-3">Strong Consistency (Pro)</h5>
                  <p className="text-xs text-[#475569] leading-relaxed">Critical keys (like revoked tokens or global rate limit counters) use a consensus-based protocol for strong consistency across all nodes.</p>
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
                Workspaces are top-level containers that provide strict isolation for teams, projects, or business units. Each workspace acts as a self-contained ecosystem with its own independent configuration, users, and identity.
              </p>
            </section>

            <section id="infrastructure-identity" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-2xl font-black text-white">Infrastructure Identity</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed max-w-3xl">
                Every workspace is assigned a unique <strong>Hostname Identifier</strong>. This hostname defines the primary entry point for all your gateway deployments and traffic routing within that workspace.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      Global Slug
                    </h5>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Your workspace slug (e.g., <code>my-workspace</code>) is used to construct your unique SOPO subdomains and API endpoints.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      Isolated mTLS
                    </h5>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Each workspace maintains a dedicated Certificate Authority (CA) for securing internal traffic between gateway nodes.
                    </p>
                  </div>
                </div>

                {/* UI Mock: Workspace Identity Settings */}
                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex flex-col justify-center">
                  <div className="bg-[#050810] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Security Settings</span>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-primary uppercase tracking-widest">Infrastructure Identity</label>
                        <h4 className="text-lg font-black text-white">Workspace Hostname</h4>
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                          <div className="text-[8px] text-[#475569] font-bold uppercase">Proposed Hostname Identifier</div>
                          <div className="flex items-center gap-2 p-3 rounded bg-white/5 border border-white/10 text-xs text-white font-mono">
                            <span className="text-primary">@</span>
                            my-workspace
                          </div>
                        </div>
                      </div>
                      <button className="w-full py-3 rounded-xl bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest">
                        Deploy Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="external-integrations" className="space-y-8 scroll-mt-32 border-t border-white/5 pt-16">
              <h3 className="text-2xl font-black text-white">Authentication & Integrations</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Connect your workspace to external identity providers to manage team access and secure your API consumers.
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
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Data and configurations never leak between workspaces. SOPO uses a multi-tenant kernel that ensures CPU, memory, and network resources are strictly partitioned. This ensures that a spike or misconfiguration in one workspace cannot degrade the performance of another.
              </p>
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
              <p className="text-xl text-[#94A3B8] leading-relaxed max-w-3xl">
                A Gateway is the physical deployment of the SOPO Data Plane. You can run a single node for simple apps or a Pro Cluster for global enterprise scale.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0B101B] hover:border-blue-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                    <Cpu className="h-6 w-6 text-blue-500" />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-4 tracking-tight">Single Node</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                    Perfect for development or small-scale applications. Run SOPO as a single container or binary.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Lightweight (20MB Binary)</li>
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Local Config Storage</li>
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Direct Admin API Access</li>
                  </ul>
                </div>

                <div className="p-8 rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent hover:border-primary/40 transition-all group relative overflow-hidden">
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-white text-[8px] font-black uppercase tracking-widest">Recommended</div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-4 tracking-tight">Pro Cluster</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                    Enterprise-grade high availability. Distributed state, multi-region sync, and advanced observability.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-primary" /> Multi-Region Data Sync</li>
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-primary" /> Distributed Rate Limiting</li>
                    <li className="flex items-center gap-3 text-xs font-bold text-[#94A3B8]"><CheckCircle2 className="h-4 w-4 text-primary" /> Global Pulse Monitoring</li>
                  </ul>
                </div>
              </div>

              {/* UI Mock: Gateway Node Health */}
              <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] p-10 mt-8">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-xl font-black text-white">Cluster Health (us-east-1)</h4>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Healthy</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { id: "node-01", cpu: "12%", mem: "1.2GB", status: "ONLINE" },
                    { id: "node-02", cpu: "14%", mem: "1.3GB", status: "ONLINE" },
                    { id: "node-03", cpu: "82%", mem: "2.4GB", status: "LOADED" }
                  ].map(node => (
                    <div key={node.id} className="p-6 rounded-2xl bg-[#050810] border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#475569]">{node.id}</span>
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black",
                          node.status === 'ONLINE' ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"
                        )}>{node.status}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-[#475569]">CPU</span>
                          <span className="text-white font-bold">{node.cpu}</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className={cn(
                            "h-full rounded-full",
                            parseInt(node.cpu) > 50 ? "bg-yellow-500" : "bg-primary"
                          )} style={{ width: node.cpu }} />
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
                    No more digging through text logs. The Workflow View allows you to visually trace any single request, seeing exactly which plugins it hit and where it was routed.
                  </p>
                </div>
                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5">
                  <h4 className="text-xl font-bold text-white mb-4">Real-time Topology</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    SOPO automatically builds a map of your microservices based on actual traffic patterns. Identify bottleneck services and circular dependencies instantly.
                  </p>
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
                Gain deep insights into your API performance with sub-second data aggregation and beautiful, interactive visualizations.
              </p>

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

              <div className="bg-[#0B101B] border border-white/5 rounded-[2.5rem] p-10 h-80 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,90,30,0.05)_0%,transparent_70%)]" />
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Activity className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <h4 className="text-xl font-black text-white">Advanced Charting Engine</h4>
                  <p className="text-sm text-[#475569] max-w-md">
                    Interactive time-series charts with percentile breakdowns (P50, P90, P99). Zoom, filter, and export data with native speeds.
                  </p>
                </div>
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
                    When defining a service, you specify the <strong>Communication Protocol</strong> (REST/HTTP or gRPC/Proto) and the <strong>Deployment Context</strong>.
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                      <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-blue-500" />
                        Balancing Strategies
                      </h5>
                      <p className="text-[10px] text-[#475569] leading-relaxed">
                        Choose between <strong>Round Robin</strong> for equal distribution, <strong>Least Connections</strong>, or <strong>Consistent Hashing</strong> for stateful workloads.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#0B101B] border border-white/5">
                      <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-emerald-500" />
                        Health Monitoring
                      </h5>
                      <p className="text-[10px] text-[#475569] leading-relaxed">
                        Configure <strong>Monitor Endpoints</strong> (e.g., <code>/healthz</code>) with custom intervals and timeouts to ensure traffic only hits healthy targets.
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
                      <span className="text-[8px] font-mono text-[#475569]">create-service.png</span>
                    </div>
                    <div className="aspect-video bg-[#050810] flex items-center justify-center relative">
                      <img
                        src="/docs/create-service.png"
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
                Routes define the entry points for your API. They map public-facing paths and HTTP methods to your internal Services, providing a powerful layer of abstraction and control.
              </p>
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
                      <span className="text-[8px] font-mono text-[#475569]">create-route.png</span>
                    </div>
                    <div className="aspect-video bg-[#050810] flex items-center justify-center relative">
                      <img
                        src="/docs/create-route.png"
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
                Plugins are the modular building blocks of SOPO's logic. They allow you to inject security, traffic control, and observability into specific <strong>Execution Phases</strong> of a request's lifecycle.
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
                    { phase: "Rate Limiting", desc: "Enforce traffic quotas and prevent abuse." },
                    { phase: "Request Transform", desc: "Modify headers or body before forwarding to upstream." },
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
              <p className="text-xl text-muted-foreground leading-relaxed">
                Modern software delivery requires isolated stages. SOPO Environments allow you to manage Development, Staging, and Production gateway states independently.
              </p>

              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "Development", color: "blue", desc: "Sandbox for testing new policies and routes. Connected to dev upstreams." },
                    { name: "Staging", color: "yellow", desc: "Pre-production mirror. Used for final QA and simulation verification." },
                    { name: "Production", color: "green", desc: "Live traffic environment. High availability and strict rollback rules." }
                  ].map(env => (
                    <div key={env.name} className={`p-8 rounded-3xl border border-border bg-card/20 border-l-4 border-l-${env.color}-500 group hover:bg-card/40 transition-all`}>
                      <h5 className="font-bold text-xl mb-3 text-foreground">{env.name}</h5>
                      <p className="text-sm text-muted-foreground leading-relaxed">{env.desc}</p>
                    </div>
                  ))}
                </div>

                <section id="promotion-flow" className="p-10 rounded-[40px] border border-border bg-gradient-to-br from-primary/5 to-transparent space-y-8 scroll-mt-32">
                  <h3 className="text-2xl font-bold text-foreground">The Promotion Workflow</h3>
                  <div className="space-y-6">
                    <p className="text-muted-foreground">SOPO uses a "Push to Staging, Promote to Prod" model. This ensures that every configuration change is versioned and audited.</p>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-background/50 border border-border">
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-500" /> <span>Save as Draft</span></div>
                      <ArrowRight className="hidden md:block h-4 w-4 text-zinc-700" />
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-yellow-500" /> <span>Deploy to Staging</span></div>
                      <ArrowRight className="hidden md:block h-4 w-4 text-zinc-700" />
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-green-500" /> <span>Promote to Production</span></div>
                    </div>
                  </div>
                </section>

                <section id="env-variables" className="space-y-8 pt-8 scroll-mt-32">
                  <h2 className="text-3xl font-display font-bold text-foreground dark:text-white border-l-4 border-blue-400 pl-6">Environment Variables</h2>
                  <div className="p-8 rounded-3xl bg-muted/50 dark:bg-secondary/10 border border-border space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      Manage dynamic configuration values using environment-specific variables. This allows you to use the same policy across all stages while pointing to different backends or using different credentials.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-background dark:bg-zinc-950 border border-border dark:border-white/5 space-y-4 shadow-sm">
                        <div className="text-[10px] text-muted-foreground dark:text-zinc-500 uppercase tracking-widest font-black">Staging Variable</div>
                        <div className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">UPSTREAM_URL: "https://stg-api.internal"</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-background dark:bg-zinc-950 border border-border dark:border-white/5 space-y-4 shadow-sm">
                        <div className="text-[10px] text-muted-foreground dark:text-zinc-500 uppercase tracking-widest font-black">Production Variable</div>
                        <div className="font-mono text-xs text-green-600 dark:text-green-400 font-bold">UPSTREAM_URL: "https://prod-api.internal"</div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-zinc-500 italic font-medium">"Refer to these in your policies using the syntax <code>{"{{"}env.UPSTREAM_URL{"}}"}</code>"</p>
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
                Offload authentication to the edge. SOPO integrates with any OIDC/OAuth2 provider to verify tokens before they reach your backend.
              </p>

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
                Protect your infrastructure from abuse and spikes with distributed, multi-tier rate limiting policies.
              </p>

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
                Transformations allow you to modify the request before it hits your upstream, or the response before it reaches the client. This is essential for maintaining backward compatibility or injecting tracing metadata.
              </p>

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
                When built-in plugins aren't enough, extend SOPO with custom logic. Use <strong>WebAssembly</strong> for native performance or <strong>Lua</strong> for rapid prototyping.
              </p>

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
              <p className="text-xl text-muted-foreground leading-relaxed">
                You can't manage what you can't measure. SOPO's observability suite provides real-time telemetry for every request flowing through your gateway.
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

              <div className="p-10 rounded-[40px] border border-border bg-primary/5 space-y-8">
                <h3 id="global-metrics" className="text-2xl font-bold text-foreground scroll-mt-32">Global Metric Aggregation</h3>
                <p className="text-muted-foreground text-lg">
                  Every Sopo Agent streams metrics to the Control Plane using a high-throughput time-series bridge. This data is then aggregated to give you a global view of your API health across all regions.
                </p>
                <div className="h-64 w-full bg-muted dark:bg-zinc-950/50 rounded-3xl border border-border flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,90,30,0.05)_0%,transparent_70%)]" />
                  <BarChart3 className="h-12 w-12 text-zinc-400 dark:text-zinc-800" />
                  <span className="text-xs font-bold text-muted-foreground dark:text-zinc-700 ml-4 tracking-widest">LIVE ANALYTICS ENGINE ACTIVE</span>
                </div>
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
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-zinc-500/10"><RotateCcw className="h-8 w-8 text-zinc-500" /></div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground">Disaster Recovery</h2>
                  <p className="text-muted-foreground">The ultimate safety switch for your gateway operations.</p>
                </div>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Rollbacks in SOPO are atomic version-state restorations. Every deployment across your environments is snapshot-versioned, allowing you to travel back in time to any known stable state rapidly.
              </p>

              <div className="space-y-10">
                <div className="p-10 rounded-[40px] border border-border bg-card/20 space-y-8">
                  <h3 id="how-it-works" className="text-2xl font-bold text-foreground scroll-mt-32">Atomic Restoration Process</h3>
                  <div className="space-y-8">
                    {[
                      { step: "1", title: "Global Snapshot", desc: "Every time you promote a change, SOPO creates a complete, immutable snapshot of the entire gateway configuration (routes, upstreams, policies)." },
                      { step: "2", title: "Local Cache", desc: "Agents maintain a local encrypted cache of several successful configurations. This allows for 'Air-gapped' rollbacks even if the Control Plane is offline." },
                      { step: "3", title: "Pointer Switch", desc: "When a rollback is triggered, agents simply switch their active configuration pointer. No process reload or traffic drop required." }
                    ].map(item => (
                      <div key={item.step} className="flex gap-6 items-start">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary font-black">{item.step}</div>
                        <div>
                          <h5 className="font-bold text-lg mb-1 text-foreground">{item.title}</h5>
                          <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl border border-red-500/20 bg-red-500/5 space-y-4">
                    <h4 id="auto-rollback" className="text-lg font-bold text-red-400 flex items-center gap-2 scroll-mt-32">
                      <AlertTriangle className="h-5 w-5" />
                      Auto-Rollback Rules
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Enable threshold-based rollbacks. If a new deployment causes a significant increase in errors or a latency spike, SOPO will automatically revert to the previous version.
                    </p>
                  </div>
                  <div className="p-8 rounded-3xl border border-border bg-secondary/20 space-y-4">
                    <h4 id="audit-trail" className="text-lg font-bold text-foreground flex items-center gap-2 scroll-mt-32">
                      <History className="h-5 w-5 text-primary" />
                      Full Audit History
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every rollback is logged with the user ID, timestamp, and a 'Diff' view showing exactly what changed between the failed and restored configuration.
                    </p>
                  </div>
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