"use client";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Create your project",
    desc:
      "Spin up a clean workspace with Dev, Staging, and Prod. Add upstreams with clear names and health checks, then bootstrap common route templates (public/internal/admin) with a secure baseline. A migration wizard imports legacy rules with automatic checks so you can start safely. Screenshot: Project dashboard showing environments, routes list on the left, and a central pipeline map with a Create Route button.",
  },
  {
    title: "Configure routes visually",
    desc:
      "Define paths, select upstreams, and drag‑and‑drop plugins: Auth (JWT/OAuth2), Rate Limits, CORS, Transforms, Retries/Timeouts, and Logging. Add per‑method conditions, group policies, and reuse presets across teams. Before deploying, review a clean diff with static checks and linting. Screenshot: Route editor with “/api/v1/*”, active plugins, and a preview diff panel.",
  },
  {
    title: "Deploy instantly",
    desc:
      "Use gated promotions: test in Staging, watch latency and error metrics, and promote to Prod with one click. Roll back in seconds when needed. Telemetry shows policy impact on real traffic, and you can tweak limits or retries without touching backend code. Screenshot: Deploy panel showing version v1.4.2, Staging Passed, Promote button, and latency charts.",
  },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="relative py-24 sm:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">How It Works</h2>
      </motion.div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-70" />
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              {i + 1}
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
