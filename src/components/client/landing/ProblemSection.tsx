"use client";
import { motion } from "framer-motion";
import { AlertTriangle, Shuffle, Clock4 } from "lucide-react";

const chips = ["Config sprawl", "Auth drift", "CORS headaches", "Hidden bottlenecks", "Slow rollbacks"];

const ProblemSection = () => (
  <section id="problem" className="relative py-24 sm:py-32">
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-10 top-1/2 h-40 w-40 rounded-full bg-accent/20 blur-2xl" />
    </div>
    <div className="container mx-auto px-6">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">The Problem</h2>
          <p className="text-base leading-7 text-muted-foreground">
            Manual API management spreads routing, auth, rate limits, and transforms across tools and teams.
            That fragmentation creates drift between environments, risky releases, and longer incident cycles.
          </p>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><AlertTriangle size={16} className="text-accent" /> Risky deploys from opaque configs</li>
            <li className="flex items-center gap-2"><Shuffle size={16} className="text-primary" /> Inconsistent behavior across environments</li>
            <li className="flex items-center gap-2"><Clock4 size={16} className="text-primary" /> Slow rollbacks and long mean‑time‑to‑restore</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span key={c} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                {c}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-xl" />
          <div className="grid gap-3">
            {["Routing rules scattered", "Auth policies drift", "Rate limit inconsistencies"].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: 0.05 * i }}
                className="rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-sm dark:border-primary/40 dark:bg-primary/10"
              >
                <div className="text-sm font-semibold text-primary">{t}</div>
                <p className="mt-1 text-xs text-muted-foreground">A tiny change in one place causes chaos elsewhere.</p>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-sm dark:border-primary/40 dark:bg-primary/10"
            >
              <div className="text-sm font-semibold text-primary">Opaque rollout and rollback</div>
              <p className="mt-1 text-xs text-muted-foreground">Hard to preview diffs, slow to revert safely.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ProblemSection;
