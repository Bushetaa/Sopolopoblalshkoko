"use client";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const benefits = ["High Performance", "Easy Deployment", "Secure", "Scalable", "Visual Control"];

const BenefitsSection = () => (
  <section id="benefits" className="relative py-24 sm:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Why Use SOPO</h2>
      </motion.div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
        {benefits.map((b, i) => (
          <motion.div
            key={b}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative flex items-center gap-3 overflow-hidden rounded-lg border border-border bg-card p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">{b}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
