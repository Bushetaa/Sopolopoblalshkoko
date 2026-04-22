"use client";
import { motion } from "framer-motion";
import { Plug, CheckCircle2, Rocket } from "lucide-react";

const cards = [
  {
    title: "Visual Policies",
    desc:
      "Define routes, auth, limits, and transforms in one place. Review diffs before deploy and keep behavior consistent across environments.",
    icon: Plug,
  },
  {
    title: "Safe Delivery",
    desc:
      "Gated promotions and one‑click rollbacks. Test in Staging, promote to Prod with confidence, and recover in seconds.",
    icon: CheckCircle2,
  },
  {
    title: "Ship Faster",
    desc:
      "Observability built‑in: per‑route latency and errors. Fix bottlenecks quickly and focus on product, not plumbing.",
    icon: Rocket,
  },
];

const SolutionSection = () => (
  <section id="solution" className="relative py-24 sm:py-32">
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-8 top-12 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
      <div className="absolute bottom-8 right-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
    </div>
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">The Solution</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          SOPO is a no‑code API gateway that turns policy chaos into a clear, versioned pipeline—fast to change and safe to ship.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.08 * i }}
            className="group rounded-xl border border-border bg-card p-6 text-left"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <c.icon size={22} />
            </div>
            <div className="text-lg font-semibold text-foreground">{c.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionSection;
