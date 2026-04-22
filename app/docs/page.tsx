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
import { 
  ChevronRight, Copy, Check, Menu, ExternalLink, Shield, Zap, 
  Activity, GitBranch, PlayCircle, Terminal, Layers, Lock, 
  Share2, RotateCcw, BarChart3, Globe, Cpu, Workflow, Search, 
  AlertTriangle, Code2, Database, Key, Server, BookOpen, Info,
  Settings, RefreshCw, Eye, ListFilter, Sliders, Layout, ShieldCheck, 
  Clock, History, MessageSquare, HelpCircle, ArrowRight, FileJson, 
  Network, ShieldAlert, Binary
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
    title: "Simulation & Testing",
    items: [
      { title: "Traffic Simulation", id: "simulation", category: "Simulation & Testing" },
      { title: "Policy Debugging", id: "debugging", category: "Simulation & Testing" },
    ]
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Routes & Upstreams", id: "routes", category: "Core Concepts" },
      { title: "Visual Policies", id: "policies", category: "Core Concepts" },
      { title: "Environments", id: "environments", category: "Core Concepts" },
    ]
  },
  {
    title: "Security & Control",
    items: [
      { title: "Authentication", id: "auth", category: "Security & Control" },
      { title: "Rate Limiting", id: "rate-limiting", category: "Security & Control" },
      { title: "Transformations", id: "transforms", category: "Security & Control" },
    ]
  },
  {
    title: "Operations",
    items: [
      { title: "Observability", id: "observability", category: "Operations" },
      { title: "Rollbacks", id: "rollbacks", category: "Operations" },
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
          <div className="space-y-12">
            <section className="space-y-8">
              <p className="text-2xl text-foreground/90 font-medium leading-relaxed">
                SOPO is a high-performance, cloud-native API Gateway that empowers engineering teams to manage complex API architectures through a visual, no-code interface.
              </p>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  In the modern era of microservices, managing API policies, security, and traffic has become increasingly complex. Engineering teams often find themselves buried under thousands of lines of YAML configuration, struggling to maintain consistency across environments, and facing high risks with every deployment.
                </p>
                <p>
                  SOPO was designed from the ground up to eliminate this "configuration chaos." By providing a unified Control Plane with a visual Policy Pipeline, SOPO allows you to design, simulate, and deploy sophisticated API rules without writing a single line of config.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-transparent shadow-sm">
                  <div className="text-3xl font-bold text-primary mb-2">Zero</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Latency Overhead</div>
                  <p className="text-xs text-muted-foreground dark:text-zinc-500 mt-2">Built on high-efficiency C++ for minimal processing time.</p>
                </div>
                <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-blue-500/5 to-transparent shadow-sm">
                  <div className="text-3xl font-bold text-blue-500 mb-2">Full</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Visual Policy Flow</div>
                  <p className="text-xs text-muted-foreground dark:text-zinc-500 mt-2">Manage auth, rate-limiting, and transforms visually.</p>
                </div>
                <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-green-500/5 to-transparent shadow-sm">
                  <div className="text-3xl font-bold text-green-500 mb-2">Instant</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Rollback Speed</div>
                  <p className="text-xs text-muted-foreground dark:text-zinc-500 mt-2">Rapid recovery from failed deployments across all nodes.</p>
                </div>
              </div>
            </section>
            
            <section id="why-sopo" className="space-y-8 scroll-mt-32 pt-8">
              <h2 className="text-3xl font-display font-bold text-foreground border-l-4 border-primary pl-6">Why Engineering Teams Choose SOPO?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 p-8 rounded-3xl bg-muted/50 dark:bg-secondary/20 border border-border hover:border-primary/20 transition-all">
                  <div className="p-3 rounded-xl bg-primary/10 w-fit"><Layout className="h-6 w-6 text-primary" /></div>
                  <h4 className="font-bold text-xl text-foreground">Zero Configuration Drift</h4>
                  <p className="text-muted-foreground leading-relaxed">Ensure that your Dev, Staging, and Production environments are always in sync. SOPO's environment promotion system guarantees that what you tested is exactly what goes live.</p>
                </div>
                <div className="space-y-4 p-8 rounded-3xl bg-muted/50 dark:bg-secondary/20 border border-border hover:border-blue-500/20 transition-all">
                  <div className="p-3 rounded-xl bg-blue-500/10 w-fit"><ShieldCheck className="h-6 w-6 text-blue-500" /></div>
                  <h4 className="font-bold text-xl text-foreground">Embedded Security</h4>
                  <p className="text-muted-foreground leading-relaxed">Offload Token verification, OAuth2 introspection, and IP filtering to the gateway. Let your developers focus on business logic while SOPO handles the perimeter.</p>
                </div>
              </div>
            </section>

            <section id="core-capabilities" className="space-y-8 scroll-mt-32 pt-8">
              <h2 className="text-3xl font-display font-bold text-foreground dark:text-white border-l-4 border-blue-500 pl-6">Core Capabilities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Dynamic Routing", desc: "Route traffic based on headers, cookies, query params, or API keys with zero downtime.", icon: Network },
                  { title: "Protocol Translation", desc: "Seamlessly bridge between REST, gRPC, and GraphQL at the edge.", icon: Cpu },
                  { title: "Visual Debugging", desc: "Trace every request through the policy pipeline with high precision.", icon: Eye },
                  { title: "Auto-Healing", desc: "Detect upstream failures and automatically reroute to healthy replicas.", icon: Activity },
                  { title: "Global Persistence", desc: "Sync rate limits and API keys across global regions in real-time.", icon: Globe },
                  { title: "Enterprise Auth", desc: "Integrate with Okta, Auth0, or any OIDC provider effortlessly.", icon: Key }
                ].map((cap, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-muted/30 dark:bg-zinc-900/50 border border-border dark:border-white/5 hover:border-border dark:hover:border-white/10 transition-all">
                    <cap.icon className="h-6 w-6 text-primary mb-4" />
                    <h5 className="font-bold text-foreground dark:text-white mb-2">{cap.title}</h5>
                    <p className="text-xs text-muted-foreground dark:text-zinc-500 leading-relaxed">{cap.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case "quickstart":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <p className="text-xl text-muted-foreground leading-relaxed">
                Start managing your APIs in minutes. This guide walks you through the initial setup, from workspace creation to deploying your first secure route.
              </p>
              
              <div className="space-y-12">
                {[
                  { 
                    step: "01", 
                    title: "Initialize Workspace", 
                    desc: "Your workspace is the central hub for all gateway configurations. It holds your environments, policies, and upstream definitions.",
                    tasks: ["Set workspace name", "Choose default region", "Invite team members"],
                    code: "sopo workspace create \"Global-API-Gateway\""
                  },
                  { 
                    step: "02", 
                    title: "Define Your Upstream", 
                    desc: "Tell SOPO where your backend services are located. An upstream can be a single URL or a group of servers for load balancing.",
                    tasks: ["Add target URLs", "Configure Health Checks", "Select Load Balancing algo"],
                    code: "sopo upstream add order-service \\\n  --url https://api.production.local/orders \\\n  --health-path /health"
                  },
                  { 
                    step: "03", 
                    title: "Create a Route", 
                    desc: "Map a public URL to your upstream service. This is where you define the entry point for your consumers.",
                    tasks: ["Set path prefix (e.g., /v1/orders)", "Select HTTP methods", "Attach base policies"],
                    code: "sopo route add /v1/orders --upstream order-service"
                  },
                  { 
                    step: "04", 
                    title: "Promotion to Production", 
                    desc: "Review your changes in the visual pipeline and promote them through your environment stages.",
                    tasks: ["Verify simulation results", "Push to Dev environment", "Promote to Production"],
                    code: "sopo promote dev production --tag v1.0.4"
                  }
                ].map((item) => (
                  <div key={item.step} className="group relative pl-8 border-l-2 border-border hover:border-primary/50 transition-all">
                    <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-background border-2 border-border group-hover:border-primary group-hover:bg-primary/10 flex items-center justify-center text-xs font-bold transition-all">
                      {item.step}
                    </div>
                    <div className="space-y-6 pb-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h4 className="text-2xl font-bold text-foreground">{item.title}</h4>
                        <div className="p-3 rounded-xl bg-muted dark:bg-zinc-950 font-mono text-[11px] text-primary/80 border border-border dark:border-white/5">
                          {item.code}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{item.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.tasks.map(t => (
                          <span key={t} className="px-3 py-1 rounded-full bg-muted dark:bg-secondary/50 border border-border text-[11px] font-medium text-muted-foreground dark:text-zinc-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case "architecture":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <h2 className="text-3xl font-display font-bold text-foreground">Design Principles</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                SOPO is built on the principle of **Separation of Concerns**. Our architecture decouples policy management from request processing to ensure that configuration updates never block live traffic.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl border border-border bg-gradient-to-br from-blue-500/5 to-transparent relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Cpu className="h-32 w-32 text-blue-500" />
                  </div>
                  <Cpu className="h-12 w-12 text-blue-500 mb-6" />
                  <h4 id="control-plane" className="text-2xl font-bold mb-4 scroll-mt-32">Control Plane</h4>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>The Control Plane acts as the central intelligence of your API network. It provides the visual interface, stores all configuration history, and handles API keys and secret management.</p>
                    <ul className="space-y-2 list-none p-0 text-sm">
                      <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-blue-500" /> Visual Policy Designer</li>
                      <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-blue-500" /> Environment Synchronizer</li>
                      <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-blue-500" /> Global Analytics Dashboard</li>
                    </ul>
                  </div>
                </div>

                <div className="p-8 rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Server className="h-32 w-32 text-primary" />
                  </div>
                  <Server className="h-12 w-12 text-primary mb-6" />
                  <h4 id="data-plane" className="text-2xl font-bold mb-4 scroll-mt-32">Data Plane (Agent)</h4>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>The Data Plane consists of distributed, high-performance agents. They are designed for low-memory footprint and sub-millisecond request processing.</p>
                    <ul className="space-y-2 list-none p-0 text-sm">
                      <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-primary" /> Policy Enforcement Engine</li>
                      <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-primary" /> Local In-memory Caching</li>
                      <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-primary" /> Real-time Metric Streaming</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section id="communication" className="space-y-8 scroll-mt-32">
              <h2 className="text-3xl font-display font-bold text-foreground">Agent Communication</h2>
              <div className="p-10 rounded-3xl border border-border bg-card/50 dark:bg-card/20 space-y-8 leading-relaxed">
                <p className="text-muted-foreground text-lg">Agents communicate with the Control Plane using a secure gRPC stream. This protocol ensures that any policy change you make in the UI is propagated to every agent node globally in real-time.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="space-y-3 p-6 rounded-2xl bg-muted/50 dark:bg-background/50 border border-border">
                    <div className="text-primary font-bold text-lg">Config Sync</div>
                    <p className="text-xs text-muted-foreground">Agents subscribe to a versioned config stream. They never pull stale data.</p>
                  </div>
                  <div className="space-y-3 p-6 rounded-2xl bg-muted/50 dark:bg-background/50 border border-border">
                    <div className="text-blue-500 font-bold text-lg">Heartbeat</div>
                    <p className="text-xs text-muted-foreground">Agents report health, capacity, and active connection counts regularly.</p>
                  </div>
                  <div className="space-y-3 p-6 rounded-2xl bg-muted/50 dark:bg-background/50 border border-border">
                    <div className="text-green-500 font-bold text-lg">Batch Metrics</div>
                    <p className="text-xs text-muted-foreground">Aggregated request metrics are streamed back continuously for real-time charts.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="security-model" className="space-y-8 scroll-mt-32 pt-8">
              <h2 className="text-3xl font-display font-bold text-foreground dark:text-white border-l-4 border-red-500 pl-6">Security & Isolation</h2>
              <div className="p-10 rounded-3xl bg-red-500/5 border border-red-500/10 space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Security is baked into the architecture. Sopo Agents run in highly isolated environments, using a custom-hardened runtime to prevent side-channel attacks and ensure tenant isolation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <h5 className="font-bold text-foreground dark:text-white flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-red-500" /> mTLS Everywhere</h5>
                    <p className="text-xs text-muted-foreground dark:text-zinc-500">All communication between the Control Plane and Agents is encrypted via mutual TLS (mTLS) with automatic certificate rotation.</p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-bold text-foreground dark:text-white flex items-center gap-2"><Lock className="h-4 w-4 text-red-500" /> Zero-Trust Config</h5>
                    <p className="text-xs text-muted-foreground dark:text-zinc-500">Agents only process configurations signed by the Control Plane's master key. Any tampered or unsigned config is immediately rejected.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      case "simulation":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <p className="text-xl text-muted-foreground leading-relaxed">
                The Simulation Engine is SOPO's "Safety Net." It allows you to model request behavior against your policies without sending real traffic or impacting production upstreams.
              </p>
              
              <div className="space-y-10">
                <div className="bg-muted dark:bg-zinc-950 rounded-[40px] border border-border dark:border-white/5 p-10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-all duration-500 rotate-12">
                    <PlayCircle className="h-48 w-48 text-primary" />
                  </div>
                  <div className="relative z-10 font-mono">
                    <div className="flex items-center gap-2 mb-8 border-b border-border dark:border-zinc-800 pb-6">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                      </div>
                      <span className="text-[10px] text-muted-foreground dark:text-zinc-600 uppercase tracking-widest ml-4">Simulation Environment vLatest</span>
                    </div>
                    <div className="space-y-6 text-sm">
                      <div className="flex gap-4"><span className="text-muted-foreground dark:text-zinc-500">[START]</span> <span className="text-blue-600 dark:text-blue-400 font-medium">INPUT: GET /api/v1/orders/7721</span></div>
                      <div className="flex gap-4 items-center">
                        <span className="text-muted-foreground dark:text-zinc-500">[STEP]</span> 
                        <span className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/20 text-[10px] font-bold">AUTH_LAYER</span>
                        <span className="text-foreground/80 dark:text-zinc-300">Evaluating Security Token (Issuer: auth.sopo.io)</span>
                      </div>
                      <div className="flex gap-4 pl-16 border-l-2 border-green-500/30 text-green-600 dark:text-green-400 italic font-medium">Result: Valid. Identity matched authorized scope.</div>
                      <div className="flex gap-4 items-center">
                        <span className="text-muted-foreground dark:text-zinc-500">[STEP]</span> 
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-bold">TRAFFIC_CONTROL</span>
                        <span className="text-foreground/80 dark:text-zinc-300">Evaluating RateLimit (Policy: Tier_Gold)</span>
                      </div>
                      <div className="flex gap-4 pl-16 border-l-2 border-green-500/30 text-green-600 dark:text-green-400 italic font-medium">Result: Pass. Current usage within defined limits.</div>
                      <div className="flex gap-4 items-center pt-4 border-t border-border dark:border-zinc-900">
                        <span className="text-muted-foreground dark:text-zinc-500">[FINAL]</span> 
                        <span className="text-primary font-black tracking-wider">ROUTED TO UPSTREAM: production-orders-cluster</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl bg-muted/50 dark:bg-secondary/10 border border-border space-y-4">
                    <h3 id="use-cases" className="text-xl font-bold text-foreground scroll-mt-32">Technical Use Cases</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold text-foreground flex items-center gap-2"><div className="w-1 h-3 bg-primary rounded-full" /> Path Regex Validation</h5>
                        <p className="text-xs text-muted-foreground">Verify that your complex path patterns correctly match intended traffic while ignoring noise.</p>
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold text-foreground flex items-center gap-2"><div className="w-1 h-3 bg-primary rounded-full" /> Header Mapping</h5>
                        <p className="text-xs text-muted-foreground">Test how the gateway injects new headers or modifies existing ones before sending them to upstreams.</p>
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold text-foreground flex items-center gap-2"><div className="w-1 h-3 bg-primary rounded-full" /> Error Propagation</h5>
                        <p className="text-xs text-muted-foreground">Simulate what happens when a policy fails (e.g., Auth fails) and how the error response looks to the client.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                    <h3 id="benchmarking" className="text-xl font-bold text-foreground scroll-mt-32">Performance Estimation</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The simulation engine doesn't just check logic; it estimates the processing time for each policy in your chain. This helps you identify "heavy" policies that might add latency to your critical paths.
                    </p>
                    <div className="p-4 rounded-xl bg-background/50 border border-border">
                       <div className="flex justify-between text-[10px] mb-2 font-bold"><span>POLICY OVERHEAD</span> <span className="text-primary">OPTIMIZED</span></div>
                       <div className="w-full bg-muted dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full w-[40%]" />
                       </div>
                    </div>
                  </div>
                </div>

                <section id="trace-filtering" className="space-y-8 scroll-mt-32 pt-8">
                  <h2 className="text-3xl font-display font-bold text-foreground dark:text-white border-l-4 border-green-500 pl-6">Advanced Trace Filtering</h2>
                  <div className="p-8 rounded-3xl bg-muted dark:bg-zinc-950 border border-border dark:border-white/5 space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      For large-scale API architectures, finding the right trace is like finding a needle in a haystack. Sopo Simulation allows you to filter traces using a powerful DSL (Domain Specific Language).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 rounded-xl bg-background/50 border border-border">
                        <div className="text-[10px] text-muted-foreground dark:text-zinc-500 mb-2 uppercase tracking-widest font-bold">Filter by Policy</div>
                        <code className="text-xs text-primary">policy.id == "auth-v1"</code>
                      </div>
                      <div className="p-4 rounded-xl bg-background/50 border border-border">
                        <div className="text-[10px] text-muted-foreground dark:text-zinc-500 mb-2 uppercase tracking-widest font-bold">Filter by Latency</div>
                        <code className="text-xs text-primary">trace.duration {">"} threshold</code>
                      </div>
                      <div className="p-4 rounded-xl bg-background/50 border border-border">
                        <div className="text-[10px] text-muted-foreground dark:text-zinc-500 mb-2 uppercase tracking-widest font-bold">Filter by Response</div>
                        <code className="text-xs text-primary">res.status == limit_code</code>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          </div>
        );

      case "debugging":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <p className="text-xl text-muted-foreground leading-relaxed">
                When traffic doesn't behave as expected, Policy Debugging provides the tools to inspect, trace, and resolve issues across your gateway pipeline.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl border border-border bg-card/50 dark:bg-card/20 space-y-4">
                  <h3 id="live-tail" className="text-xl font-bold text-foreground scroll-mt-32 flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    Live Trace Tail
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Similar to `tail -f`, this tool streams live request metadata to your dashboard. You can filter by Route ID, Source IP, or specific Policy tags to see exactly what's happening in real-time.
                  </p>
                </div>
                <div className="p-8 rounded-3xl border border-border bg-card/50 dark:bg-card/20 space-y-4">
                  <h3 id="execution-logs" className="text-xl font-bold text-foreground scroll-mt-32 flex items-center gap-2">
                    <FileJson className="h-5 w-5 text-blue-500" />
                    Policy Snapshots
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every rejected request generates a "Policy Snapshot." This includes the full state of the request object before and after the failing policy, making it easy to identify misconfigurations.
                  </p>
                </div>
              </div>

              <section id="common-issues" className="space-y-8 pt-8">
                <h2 className="text-3xl font-display font-bold text-foreground">Common Debugging Scenarios</h2>
                <div className="space-y-4">
                  {[
                    { issue: "Auth Unauthorized", solution: "Check if the Token issuer matches the policy config. Verify JWKS endpoint reachability from agent nodes." },
                    { issue: "Rate Limit Exceeded", solution: "Inspect the 'Bucket Key' used for limiting. Ensure IP-based limiting isn't incorrectly grouping users behind a proxy." },
                    { issue: "Upstream Unavailable", solution: "Verify upstream health check status. Check if the agent can resolve the upstream hostname via DNS." }
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-border bg-muted/50 dark:bg-secondary/10 flex flex-col md:flex-row md:items-center gap-4">
                      <div className="font-bold text-primary min-w-[180px]">{item.issue}</div>
                      <div className="text-sm text-muted-foreground">{item.solution}</div>
                    </div>
                  ))}
                </div>
              </section>
            </section>
          </div>
        );

      case "routes":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <p className="text-xl text-muted-foreground leading-relaxed">
                Routes and Upstreams are the core building blocks of SOPO. A Route defines how a client request is matched, and an Upstream defines where that request is ultimately sent.
              </p>
              
              <div className="space-y-12">
                <div className="p-10 rounded-[40px] border border-border bg-card/50 dark:bg-card/30 space-y-8">
                  <h3 id="upstreams" className="text-2xl font-bold text-foreground scroll-mt-32 flex items-center gap-3">
                    <Server className="h-7 w-7 text-primary" />
                    Managing Upstreams
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    An upstream represents your backend services. SOPO can handle static URLs, DNS-based discovery, or even dynamic replicas in a Kubernetes cluster.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-muted/50 dark:bg-background border border-border text-center space-y-2">
                      <div className="font-bold text-foreground">Round Robin</div>
                      <p className="text-[10px] text-muted-foreground">Distributes requests evenly across all replicas.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-muted/50 dark:bg-background border border-border text-center space-y-2">
                      <div className="font-bold text-foreground">Least Connections</div>
                      <p className="text-[10px] text-muted-foreground">Sends traffic to the node with fewer active requests.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-muted/50 dark:bg-background border border-border text-center space-y-2">
                      <div className="font-bold text-foreground">IP Hashing</div>
                      <p className="text-[10px] text-muted-foreground">Sticky sessions based on client source IP.</p>
                    </div>
                  </div>
                </div>

                <div className="p-10 rounded-[40px] border border-border bg-card/50 dark:bg-card/30 space-y-8">
                  <h3 id="route-matching" className="text-2xl font-bold text-foreground scroll-mt-32 flex items-center gap-3">
                    <Globe className="h-7 w-7 text-blue-500" />
                    Matching Logic
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    SOPO uses a high-performance trie-based matcher. You can define routes using multiple criteria:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h5 className="font-bold text-foreground">Path Matching</h5>
                      <ul className="space-y-2 text-sm text-muted-foreground list-none p-0">
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> <strong>Prefix:</strong> /api/v1/* matches all subpaths.</li>
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> <strong>Exact:</strong> /login matches only the exact path.</li>
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> <strong>Regex:</strong> /user/[0-9]+ for dynamic IDs.</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h5 className="font-bold text-foreground">Header & Method</h5>
                      <ul className="space-y-2 text-sm text-muted-foreground list-none p-0">
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Filter by <strong>HTTP Method</strong> (GET, POST).</li>
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Check for <strong>Custom Headers</strong> (e.g. x-api-version).</li>
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Match by <strong>Host / Domain</strong> name.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <section id="priority-matching" className="space-y-8 scroll-mt-32 pt-8">
                  <h2 className="text-3xl font-display font-bold text-foreground dark:text-white border-l-4 border-yellow-500 pl-6">Priority & Conflict Resolution</h2>
                  <div className="p-8 rounded-3xl bg-muted/50 dark:bg-secondary/10 border border-border space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      When multiple routes match the same request, Sopo uses a strict priority system to determine which route wins. This is essential for managing overlapping paths.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">1</div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-foreground dark:text-white">Specific Host {">"} Wildcard Host</div>
                          <p className="text-[10px] text-muted-foreground dark:text-zinc-500 italic">api.sopo.io takes precedence over *.sopo.io</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">2</div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-foreground dark:text-white">Longest Path Wins</div>
                          <p className="text-[10px] text-muted-foreground dark:text-zinc-500 italic">/v1/orders/7721 takes precedence over /v1/orders/*</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">3</div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-foreground dark:text-white">Explicit Priority Weight</div>
                          <p className="text-[10px] text-muted-foreground dark:text-zinc-500 italic">Manually set weight (0-100) to override defaults.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
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
              <p className="text-xl text-muted-foreground leading-relaxed">
                Centralize your authentication logic at the edge. By offloading security to SOPO, your backend services receive only verified, trusted requests.
              </p>
              
              <div className="space-y-12">
                <div className="p-10 rounded-[40px] border border-border bg-card/50 dark:bg-card/30 space-y-8">
                  <h3 id="jwt-validation" className="text-2xl font-bold text-foreground scroll-mt-32 flex items-center gap-3">
                    <Lock className="h-7 w-7 text-green-500" />
                    Security Token Validation
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Verify tokens signed with multiple cryptographic algorithms. SOPO handles public key rotation automatically by fetching from your authorization server.
                  </p>
                  <div className="space-y-4">
                    <h5 className="font-bold text-sm text-muted-foreground dark:text-zinc-400 uppercase tracking-widest">Example Configuration</h5>
                    <div className="p-8 rounded-3xl bg-muted dark:bg-zinc-950 border border-border dark:border-white/5 font-mono text-sm text-primary/90 space-y-2">
                      <div>issuer: "https://identity.sopo.io"</div>
                      <div>audience: ["api-gateway-prod"]</div>
                      <div>provider_url: "https://identity.sopo.io/.well-known/config.json"</div>
                      <div>clock_skew: "flexible"</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl border border-border bg-muted/50 dark:bg-secondary/10 space-y-4">
                    <h4 id="api-keys" className="font-bold text-xl text-foreground scroll-mt-32">API Key Management</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Manage thousands of unique API keys. Assign keys to specific "Plans" to enforce different rate limits and route access automatically.</p>
                  </div>
                  <div className="p-8 rounded-3xl border border-border bg-muted/50 dark:bg-secondary/10 space-y-4">
                    <h4 id="oauth2" className="font-bold text-xl text-foreground scroll-mt-32">OAuth2 Introspection</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Connect to any RFC7662-compliant introspection endpoint. Verify token validity and scopes against your existing Identity Provider in real-time.</p>
                  </div>
                </div>

                <section id="rbac-scopes" className="space-y-8 scroll-mt-32 pt-8">
                  <h2 className="text-3xl font-display font-bold text-foreground dark:text-white border-l-4 border-primary pl-6">RBAC & Scope Mapping</h2>
                  <div className="p-10 rounded-[40px] border border-border bg-card/50 dark:bg-card/20 space-y-8 leading-relaxed">
                    <p className="text-muted-foreground text-lg">
                      Go beyond simple authentication. SOPO allows you to map Token attributes to internal roles and enforce fine-grained access control (RBAC) directly at the gateway.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="p-6 rounded-2xl bg-muted dark:bg-zinc-950 border border-border dark:border-white/5 shadow-sm">
                        <div className="text-xs text-muted-foreground dark:text-zinc-500 mb-4 font-mono">Incoming Auth Attributes</div>
                        <div className="font-mono text-sm text-blue-600 dark:text-blue-400">"roles": ["editor", "billing"]</div>
                      </div>
                      <ArrowRight className="hidden sm:block h-6 w-6 self-center text-muted-foreground dark:text-zinc-700" />
                      <div className="p-6 rounded-2xl bg-muted dark:bg-zinc-950 border border-border dark:border-white/5 shadow-sm">
                        <div className="text-xs text-muted-foreground dark:text-zinc-500 mb-4 font-mono">Gateway Policy Action</div>
                        <div className="font-mono text-sm text-green-600 dark:text-green-400">Allow path /billing/*</div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          </div>
        );

      case "rate-limiting":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <p className="text-xl text-muted-foreground leading-relaxed">
                Protect your services from abuse and traffic spikes. SOPO provides a distributed rate-limiting engine that enforces quotas across all your gateway nodes.
              </p>
              
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl border border-border bg-card/20 space-y-4">
                    <h3 id="leaky-bucket" className="text-xl font-bold text-foreground scroll-mt-32 flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-primary" />
                      Leaky Bucket Algorithm
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Smooths out traffic bursts by processing requests at a constant rate. Best for protecting legacy upstreams that can't handle sudden spikes.
                    </p>
                  </div>
                  <div className="p-8 rounded-3xl border border-border bg-card/20 space-y-4">
                    <h3 id="fixed-window" className="text-xl font-bold text-foreground scroll-mt-32 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Fixed Window
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Simple quotas (e.g. 1000 req/hr). Best for tier-based monetization and limiting general API usage per user.
                    </p>
                  </div>
                </div>

                <section id="dynamic-quotas" className="p-10 rounded-[40px] border border-border bg-muted/50 dark:bg-secondary/10 space-y-8 scroll-mt-32">
                  <h3 className="text-2xl font-bold text-foreground">Dynamic Quota Injection</h3>
                  <p className="text-muted-foreground text-lg">
                    Don't hardcode limits. Use request metadata (like auth attributes) to set limits on the fly.
                  </p>
                  <div className="p-6 rounded-2xl bg-muted dark:bg-zinc-950 border border-border dark:border-white/5 font-mono text-xs text-muted-foreground dark:text-zinc-500 leading-loose">
                    <span className="text-primary">if</span> (request.user.is_premium) {"{"} <br/>
                    &nbsp;&nbsp;limit = high_tier_limit; <br/>
                    {"}"} <span className="text-primary">else</span> {"{"} <br/>
                    &nbsp;&nbsp;limit = standard_tier_limit; <br/>
                    {"}"}
                  </div>
                </section>
              </div>
            </section>
          </div>
        );

      case "transforms":
        return (
          <div className="space-y-16">
            <section className="space-y-8">
              <p className="text-xl text-muted-foreground leading-relaxed">
                Transformations allow you to modify the request before it hits your upstream, or the response before it reaches the client. This is essential for maintaining backward compatibility or injecting tracing metadata.
              </p>
              
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl border border-border bg-card/20 space-y-4">
                    <h3 id="header-transform" className="text-xl font-bold text-foreground scroll-mt-32 flex items-center gap-2">
                      <Binary className="h-5 w-5 text-primary" />
                      Header Transformation
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-2 list-none p-0">
                      <li><Check className="h-3.5 w-3.5 text-green-500 inline mr-2" /> Add <code>X-Sopo-Request-ID</code> for tracing.</li>
                      <li><Check className="h-3.5 w-3.5 text-green-500 inline mr-2" /> Strip <code>Authorization</code> before upstream.</li>
                      <li><Check className="h-3.5 w-3.5 text-green-500 inline mr-2" /> Rename legacy headers.</li>
                    </ul>
                  </div>
                  <div className="p-8 rounded-3xl border border-border bg-card/20 space-y-4">
                    <h3 id="path-rewrite" className="text-xl font-bold text-foreground scroll-mt-32 flex items-center gap-2">
                      <Network className="h-5 w-5 text-blue-500" />
                      Path Rewriting
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Remap public paths to internal structures. For example, change <code>/shop/orders</code> to <code>/api/internal/v2/orders</code> seamlessly.
                    </p>
                  </div>
                </div>

                <section id="body-transform" className="p-10 rounded-[40px] border border-border bg-muted/50 dark:bg-secondary/10 space-y-8 scroll-mt-32">
                  <h3 className="text-2xl font-bold text-foreground">Advanced Body Mapping</h3>
                  <p className="text-muted-foreground">SOPO can parse JSON payloads and restructure them using a visual mapping engine. Perfect for adapting new client formats to old backend structures.</p>
                  <div className="flex flex-col md:flex-row items-center gap-8 justify-center p-8 bg-background/50 rounded-3xl border border-border">
                     <div className="text-[10px] font-mono p-4 rounded bg-muted dark:bg-zinc-950 border border-border dark:border-white/5">{"{ \"user\": \"7721\" }"}</div>
                     <ArrowRight className="h-4 w-4 text-primary rotate-90 md:rotate-0" />
                     <div className="text-[10px] font-mono p-4 rounded bg-muted dark:bg-zinc-950 border border-border dark:border-white/5">{"{ \"id\": 7721, \"type\": \"legacy\" }"}</div>
                  </div>
                </section>
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
        { id: "why-sopo", label: "Why Engineering Teams?" },
        { id: "core-capabilities", label: "Core Capabilities" }
      ];
      case "quickstart": return [];
      case "architecture": return [
        { id: "control-plane", label: "Control Plane" },
        { id: "data-plane", label: "Data Plane" },
        { id: "communication", label: "Agent Communication" },
        { id: "security-model", label: "Security & Isolation" }
      ];
      case "simulation": return [
        { id: "use-cases", label: "Technical Use Cases" },
        { id: "benchmarking", label: "Performance Estimation" },
        { id: "trace-filtering", label: "Trace Filtering" }
      ];
      case "debugging": return [
        { id: "live-tail", label: "Live Trace Tail" },
        { id: "execution-logs", label: "Policy Snapshots" },
        { id: "common-issues", label: "Common Scenarios" }
      ];
      case "routes": return [
        { id: "upstreams", label: "Managing Upstreams" },
        { id: "route-matching", label: "Matching Logic" },
        { id: "priority-matching", label: "Priority & Conflict" }
      ];
      case "policies": return [
        { id: "pipeline-execution", label: "Pipeline Order" },
        { id: "custom-extensions", label: "Custom WASM/Lua" }
      ];
      case "environments": return [
        { id: "promotion-flow", label: "Promotion Workflow" },
        { id: "env-variables", label: "Environment Variables" }
      ];
      case "auth": return [
        { id: "jwt-validation", label: "Token Validation" },
        { id: "api-keys", label: "API Key Management" },
        { id: "oauth2", label: "OAuth2 Introspection" },
        { id: "rbac-scopes", label: "RBAC & Scopes" }
      ];
      case "rate-limiting": return [
        { id: "leaky-bucket", label: "Leaky Bucket" },
        { id: "fixed-window", label: "Fixed Window" },
        { id: "dynamic-quotas", label: "Dynamic Quotas" }
      ];
      case "transforms": return [
        { id: "header-transform", label: "Headers" },
        { id: "path-rewrite", label: "Path Rewriting" },
        { id: "body-transform", label: "Body Mapping" }
      ];
      case "observability": return [
        { id: "global-metrics", label: "Global Aggregation" },
        { id: "external-exports", label: "External Integrations" }
      ];
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
        <Sidebar className="border-r border-border dark:border-white/5 bg-background dark:bg-[#0B0E14] pt-20">
          <SidebarContent className="px-3">
            <div className="px-4 py-6 mb-2">
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

        <SidebarInset className="bg-background dark:bg-[#0B0E14] pt-24 md:pt-20 relative">
          <div className="absolute top-24 left-8 md:hidden z-20">
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

            <aside className="hidden xl:block w-80 shrink-0 px-10 py-16 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto border-l border-border dark:border-white/5 bg-background/50 dark:bg-[#0B0E14]/50 backdrop-blur-3xl">
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
