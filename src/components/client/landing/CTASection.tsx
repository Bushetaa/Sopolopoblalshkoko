"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const CTASection = () => (
  <section id="cta" className="relative py-24 sm:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <div className="rounded-2xl border border-border bg-card/60 p-10 backdrop-blur">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Start Managing Your APIs Today
          </h2>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent"
            >
              Start Now
            </Link>
            <Link
              href="/simulation"
              className="rounded-lg border border-border px-8 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Go to Demo
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
