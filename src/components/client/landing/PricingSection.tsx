"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const PricingSection = () => (
  <section id="pricing" className="relative py-24 sm:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Choose Your Plan</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          ابدأ بخطة المجتمع مجانًا، أو اختر قدرات المؤسسة عندما تحتاج لحوكمة متقدمة ودعم رسمي.
        </p>
      </motion.div>

      <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-muted/30 text-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Feature</th>
                <th className="px-6 py-4 font-semibold">Community</th>
                <th className="px-6 py-4 font-semibold">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-6 py-4">Load Balancing</td>
                <td className="px-6 py-4">Standard round robin</td>
                <td className="px-6 py-4">Latency‑aware + outlier detection</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4">Rate Limiting</td>
                <td className="px-6 py-4">Per‑route & per‑key limits</td>
                <td className="px-6 py-4">Dynamic plans + burst smoothing</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4">Authentication</td>
                <td className="px-6 py-4">API Keys, JWT</td>
                <td className="px-6 py-4">OAuth2, SSO, token introspection</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4">Analytics</td>
                <td className="px-6 py-4">Route‑level metrics</td>
                <td className="px-6 py-4">Tracing, alerts, anomaly detection</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4">Plugins</td>
                <td className="px-6 py-4">Community plugins</td>
                <td className="px-6 py-4">Custom plugins, private registry</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4">Environments</td>
                <td className="px-6 py-4">Staging + Production</td>
                <td className="px-6 py-4">Multi‑env, gated promotions, approvals</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4">Support</td>
                <td className="px-6 py-4">Email support</td>
                <td className="px-6 py-4">Priority support, 99.99% uptime SLA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/login" className="btn-shine rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent">
          Start Free
        </Link>
        <Link href="/pricing" className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
          See Pricing
        </Link>
        <Link href="/login" className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
          Talk to Us
        </Link>
      </div>
    </div>
  </section>
);

export default PricingSection;
