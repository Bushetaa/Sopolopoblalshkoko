"use client";
import { motion } from "framer-motion";
import { Gauge, ShieldCheck, Zap, Repeat, GitBranch, Eye } from "lucide-react";

const reasons = [
  { icon: Gauge, title: "Developer Velocity", desc: "Ship policies in minutes, not days—no YAML wrestling." },
  { icon: ShieldCheck, title: "Stronger Governance", desc: "Versioned changes, clean diffs, and safe approvals." },
  { icon: Zap, title: "One‑Click Deploys", desc: "Promote with confidence and roll back without drama." },
  { icon: Repeat, title: "Zero Drift", desc: "Environment‑aware configs keep Dev, Staging, and Prod aligned." },
  { icon: GitBranch, title: "Composable Plugins", desc: "100+ ready plugins plus your own, versioned and reusable." },
  { icon: Eye, title: "Built‑in Observability", desc: "Per‑route latency and errors, with alerts and traces." },
];

const WhySopoSection = () => (
  <section id="why-sopo" className="relative py-24 sm:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Why SOPO</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Clear ownership, fast iterations, and safe releases—without dragging your team through config chaos.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.08 * i }}
            className="group rounded-xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <r.icon size={22} />
            </div>
            <div className="text-lg font-semibold text-foreground">{r.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhySopoSection;
