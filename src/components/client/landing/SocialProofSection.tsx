"use client";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "We consolidated routing, auth, and limits in a single dashboard. Within a week, deploys went from stressful to routine—and rollbacks are now a non‑event.",
    author: "Ahmed S.",
    role: "Senior Engineer, Cairo",
  },
  {
    quote:
      "SOPO’s real‑time analytics revealed a hidden CORS misconfig. We fixed it in under an hour and added alerts on p99 spikes. It paid for itself day one.",
    author: "Mariam K.",
    role: "Platform Lead, Riyadh",
  },
  {
    quote:
      "JWT, rate limits, and approvals are standardized now. Security reviews are smoother, and staging behaves like prod. Our team ships faster with more confidence.",
    author: "Omar H.",
    role: "Engineering Manager, Dubai",
  },
];

const SocialProofSection = () => (
  <section id="social-proof" className="relative py-24 sm:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Real Developer Stories
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4 text-left">
            <div className="text-sm font-semibold text-foreground">80% less config time</div>
            <p className="mt-1 text-xs text-muted-foreground">Visual policies replace scattered YAML and manual diffs.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-left">
            <div className="text-sm font-semibold text-foreground">1‑click deploys</div>
            <p className="mt-1 text-xs text-muted-foreground">Gated promotions with previews and safe rollbacks.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-left">
            <div className="text-sm font-semibold text-foreground">Auditable changes</div>
            <p className="mt-1 text-xs text-muted-foreground">Versioned specs you can compare and review anytime.</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.author}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-6"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-70" />
            <blockquote className="text-sm leading-relaxed text-muted-foreground">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm text-foreground">
              <span className="font-semibold">{t.author}</span> — {t.role}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProofSection;
