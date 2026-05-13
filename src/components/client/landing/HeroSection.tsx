"use client";
import { motion } from "framer-motion";
import { Hyperspeed } from "@/src/components/ui/hyperspeed";
import { hyperspeedPresets } from "@/src/components/ui/hyperspeed-presets";
import Link from "next/link";
import { useTheme } from "@teispace/next-themes";
import { useMemo } from "react";

const HeroSection = () => {
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const effectOptions = useMemo(() => {
    if (isDark) return hyperspeedPresets.one;
    // لايت مود: خلفية فاتحة وألوان طريق أخف
    return {
      ...hyperspeedPresets.one,
      colors: {
        ...hyperspeedPresets.one.colors,
        background: 0xffffff,
        roadColor: 0xf3f4f6, // slate-100
        islandColor: 0xf9fafb, // slate-50
        shoulderLines: 0xd1d5db, // slate-300
        brokenLines: 0xd1d5db, // slate-300
      },
    };
  }, [isDark]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Hyperspeed effectOptions={effectOptions} />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-5xl"
        >
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Manage Your APIs Without Drowning in Config Hell
          </h1>
          <div className="mt-6 text-left text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8" />
        </motion.div>

        {/* Removed secondary block per request */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/simulation"
            className="btn-shine rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent"
          >
            Get Started
          </Link>
          <button
            onClick={() => scrollTo("#problem")}
            className="relative overflow-hidden rounded-lg border border-border px-8 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <span className="relative z-10">Learn More</span>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
