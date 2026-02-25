"use client";
import { motion } from "framer-motion";

const useCases = [
  {
    title: "Public APIs",
    desc:
      "Publish stable, secure endpoints with authenticated access keys or JWT. Add fair limits, CORS, and transforms without changing backend code.",
  },
  {
    title: "Internal Microservices",
    desc:
      "Standardize identity, rate limits, and retries across services. Remove per‑team drift with reusable presets and auditable changes.",
  },
  {
    title: "Admin & Backoffice",
    desc:
      "Protect sensitive admin routes with stricter auth, lower timeouts, and request mirroring for safe previews.",
  },
];

const UseCasesSection = () => (
  <section id="use-cases" className="relative py-24 sm:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Use Cases</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Clear patterns for real‑world work—ship public APIs, tame microservices, and secure backoffice flows.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map((u, i) => (
          <motion.div
            key={u.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-70" />
            <h3 className="font-display text-lg font-semibold text-foreground">{u.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default UseCasesSection;
