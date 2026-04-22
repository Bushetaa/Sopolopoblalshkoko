"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const cards = [
  {
    title: "Connect Your Services",
    desc:
      "Point SOPO at your upstreams with clear health checks and names. Import existing routes and start from safe presets.",
    cta: { href: "/docs", label: "Read Docs" },
  },
  {
    title: "Secure in Minutes",
    desc:
      "Turn on API keys or JWT/OAuth, add fair limits, and apply CORS—without touching backend code.",
    cta: { href: "/docs", label: "Security Guide" },
  },
  {
    title: "Ship with Confidence",
    desc:
      "Preview changes, deploy with one click, and observe latency and errors in real time. Promote when you’re ready.",
    cta: { href: "/demo", label: "Live Demo" },
  },
];

const GettingStartedSection = () => (
  <section id="getting-started" className="relative py-24 sm:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Get Started in Minutes</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          A clean path from zero to policy‑driven gateway—no yak‑shaving required.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-70" />
            <h3 className="font-display text-lg font-semibold text-foreground">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            <div className="mt-5">
              <Link href={c.cta.href} className="rounded-lg border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
                {c.cta.label}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default GettingStartedSection;
