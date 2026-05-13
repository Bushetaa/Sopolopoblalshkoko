"use client";
import { useTheme } from "@teispace/next-themes";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

export function AnimatedThemeToggler() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [pulseKey, setPulseKey] = React.useState(0);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const [reveal, setReveal] = React.useState<null | { x: number; y: number; to: "light" | "dark"; key: number }>(null);
  React.useEffect(() => setMounted(true), []);
  const isDark = theme !== "light";

  const rotateVariants = {
    light: { rotate: 180 },
    dark: { rotate: 0 },
  };

  const iconEnter = { opacity: 0, scale: 0.6, rotate: isDark ? -90 : 90 };
  const iconCenter = { opacity: 1, scale: 1, rotate: 0 };
  const iconExit = { opacity: 0, scale: 0.6, rotate: isDark ? 90 : -90 };

  return (
    <motion.button
      aria-label="Toggle theme"
      whileTap={{ scale: 0.95 }}
      ref={btnRef}
      onClick={(e) => {
        if (!mounted) return;
        const targetTheme: "light" | "dark" = isDark ? "light" : "dark";
        const rect = btnRef.current?.getBoundingClientRect();
        const x = rect ? rect.left + rect.width / 2 : (e.clientX || window.innerWidth / 2);
        const y = rect ? rect.top + rect.height / 2 : (e.clientY || window.innerHeight / 2);
        const key = Date.now();
        setReveal({ x, y, to: targetTheme, key });
        // trigger pulse for button
        setPulseKey((k) => k + 1);
        // switch theme near the end of reveal to avoid flash
        const durationMs = 500;
        window.setTimeout(() => setTheme(targetTheme), Math.floor(durationMs * 0.8));
        window.setTimeout(() => setReveal(null), durationMs + 30);
      }}
      className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent"
    >
      {/* container rotation for a more dynamic feel */}
      <motion.div
        className="relative h-4 w-4"
        initial={false}
        animate={mounted ? (isDark ? "dark" : "light") : undefined}
        variants={rotateVariants}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        {!mounted ? (
          <span className="absolute inset-0">
            <Sun size={16} />
          </span>
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {isDark ? (
              <motion.span
                key="sun"
                initial={iconEnter}
                animate={iconCenter}
                exit={iconExit}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute inset-0"
              >
                <Sun size={16} />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={iconEnter}
                animate={iconCenter}
                exit={iconExit}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute inset-0"
              >
                <Moon size={16} />
              </motion.span>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      {/* subtle pulse ring on toggle */}
      {mounted && (
        <motion.span
          key={pulseKey}
          className="pointer-events-none absolute inset-0 rounded-md"
          initial={{ opacity: 0.0, scale: 0.9 }}
          animate={{ opacity: 0.25, scale: 1.1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            boxShadow: "0 0 0 6px hsl(var(--ring) / 0.15) inset",
          }}
        />
      )}

      {/* circular reveal overlay from button position */}
      <AnimatePresence>
        {mounted && reveal && (
          <motion.div
            key={reveal.key}
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[9999]"
            initial={{
              clipPath: `circle(0px at ${reveal.x}px ${reveal.y}px)`,
            }}
            animate={{
              clipPath: `circle(150vmax at ${reveal.x}px ${reveal.y}px)`,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              background: reveal.to === "light" ? "#ffffff" : "#000000",
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
