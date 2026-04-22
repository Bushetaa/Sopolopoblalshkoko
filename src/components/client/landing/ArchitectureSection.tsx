"use client";
import { motion } from "framer-motion";

const ArchitectureSection = () => (
  <section id="architecture" className="relative py-24 sm:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Architecture at a Glance</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          A deterministic pipeline: routing, auth, rate limits, transforms, and telemetry — all applied consistently
          in the data plane, with a visual control plane for versioned deploys.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Client Requests", desc: "Incoming HTTP traffic from browsers, mobiles, and services." },
          { title: "SOPO Gateway", desc: "Fast data plane executes a deterministic pipeline for every request." },
          { title: "Auth & Identity", desc: "JWT/OAuth2 validation with audience and scopes; claims propagated." },
          { title: "Rate Limit & QoS", desc: "Redis‑backed limits with burst smoothing and fair throttling." },
          { title: "Transforms & CORS", desc: "Header/body transforms, CORS policies, retries with jitter." },
          { title: "Upstreams & Observability", desc: "Healthy services get traffic; metrics, logs, and traces flow back." },
        ].map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 30, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group relative rounded-xl border border-border bg-card p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)]"
          >
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="text-lg font-semibold text-foreground">{b.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
            <div className="mt-4 h-2 w-14 rounded bg-gradient-to-r from-primary via-accent to-primary opacity-60" />
          </motion.div>
        ))}
      </div>

      {/* Removed long paragraph per request */}
    </div>
  </section>
);

export default ArchitectureSection;
