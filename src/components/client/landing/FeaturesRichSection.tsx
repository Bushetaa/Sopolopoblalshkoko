"use client";
import { motion } from "framer-motion";
import { Activity, Shield, KeyRound, BarChart3, Plug, Boxes } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Load Balancing",
    desc:
      "Distribute traffic with weighted and latency‑aware strategies that keep p99 tight. Outlier detection removes unhealthy nodes, active health checks validate targets, and circuit breaking prevents cascades. Retries with jitter and sensible timeouts deliver resilient routing under load.",
  },
  {
    icon: Shield,
    title: "Rate Limiting",
    desc:
      "Protect endpoints with precise per‑key, per‑plan, and per‑route limits. A Redis‑backed counter tracks RPM/RPS reliably with burst smoothing to reduce false throttling. Reports highlight top callers and hot paths so you can tune fair policies without surprises.",
  },
  {
    icon: KeyRound,
    title: "Authentication",
    desc:
      "Enable API Keys, JWT, or full OAuth2 with audience and scopes checks. Forward identity claims consistently and enforce token expiration and role‑based access. Secure public and internal endpoints without touching backend code.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc:
      "See per‑route latency (p50/p95/p99), error hotspots, and top consumers. Set alerts for spikes and follow traces that connect policy changes to impact. Actionable telemetry helps you fix bottlenecks on day one—not weeks later.",
  },
  {
    icon: Plug,
    title: "Plugins",
    desc:
      "Extend behavior with 100+ ready plugins: header transforms, payload sanitization, A/B routing, mirroring, token introspection, logging enrichers, and more. Build custom plugins, version them, and share across teams.",
  },
  {
    icon: Boxes,
    title: "Multi-Environment",
    desc:
      "Keep Dev, Staging, and Prod aligned with environment‑aware configs, safe previews, and gated promotions with approvals. Test in Dev, validate in Staging, and ship to Prod using the same pipeline—less drift, fewer surprises.",
  },
];

const FeaturesRichSection = () => (
  <section id="features" className="relative py-24 sm:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Powerful Features</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Everything you need to ship fast and stay safe.</p>
      </motion.div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-70" />
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              <f.icon size={22} />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesRichSection;
