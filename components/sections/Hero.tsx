"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { SopoLogoCSS } from "@/components/ui/SopoLogoCSS";

type Point3D = { x: number; y: number; z: number };

const generateFlowParticles = (count: number): { id: number; offset: number; angle: number; radiusSpread: number; speed: number; }[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    offset: Math.random(),
    angle: Math.random() * Math.PI * 2,
    radiusSpread: 0.2 + Math.random() * 0.6, // Tighter spread
    speed: 0.2 + Math.random() * 0.3, // Slower speed
  }));
};

const project = (p: Point3D, center: { x: number; y: number }, scale: number) => {
  const fov = 800;
  const distance = fov / (fov - p.z);
  return {
    x: p.x * distance + center.x,
    y: p.y * distance + center.y,
    scale: distance,
    opacity: Math.max(0.1, (p.z + scale) / (scale * 2) + 0.2),
  };
};

const Globe = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [time, setTime] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dotCount, setDotCount] = useState(140);

  const VIEW = { w: 600, h: 400 };
  const center = { x: VIEW.w / 2, y: VIEW.h / 2 };
  const DOT_COUNT = 200;

  const [particles, setParticles] = useState<{ id: number; offset: number; angle: number; radiusSpread: number; speed: number; }[]>([]);

  useEffect(() => {
    setParticles(generateFlowParticles(dotCount));
  }, [dotCount]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    const updateViewport = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      const base = mobile ? 30 : 50;
      setDotCount(media.matches ? Math.max(40, Math.floor(base * 0.6)) : base);
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => {
      media.removeEventListener("change", updateMotion);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  const timeFactor = reduceMotion ? 0.00004 : 0.0001;
  useAnimationFrame((t) => setTime(t * timeFactor));

  const flowLines = useMemo<{ id: string; d: string }[]>(() => {
    return [];
  }, [center]);

  const projectedPoints = particles.map((p) => {
    const progress = (p.offset + time * p.speed) % 1;
    const xRel = (progress - 0.5) * VIEW.w * 1.5;
    const dist = Math.abs(xRel) / (VIEW.w * 0.7);
    const lanes = isMobile ? 2 : 3;
    const laneIndex = p.id % lanes;
    const laneOffset = (laneIndex - (lanes - 1) / 2) * (isMobile ? 18 : 24);
    const theta = p.angle + time * 0.5;
    const yRel = laneOffset + Math.sin(theta) * (isMobile ? 2 : 3);
    const zRel = 0;

    let color = "#00B7FF";
    let opacity = 0.6;

    return {
      ...project({ x: xRel, y: yRel, z: zRel }, center, 180),
      id: p.id,
      originalZ: zRel,
      color,
      opacity: Math.max(0.1, opacity * (1 - dist * 0.5)),
      angle: theta,
      progress,
      trailDelay: (p.id % 12) * 0.1
    };
  }).sort((a, b) => a.originalZ - b.originalZ);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      <svg ref={svgRef} viewBox="0 0 600 400" className="w-full h-full max-w-4xl overflow-visible" aria-hidden="true">
        <defs>
          <filter id="glow-visualizer">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="line-gradient-in" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#00E8FF" stopOpacity="0" />
            <stop offset="1" stopColor="#00E8FF" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="line-gradient-out" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#00FF85" stopOpacity="0.3" />
            <stop offset="1" stopColor="#00FF85" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Flow Lines */}
        {flowLines.map(line => (
          <path
            key={line.id}
            d={line.d}
            stroke={line.id.startsWith('in') ? "url(#line-gradient-in)" : "url(#line-gradient-out)"}
            strokeWidth="1"
            fill="none"
          />
        ))}

        {/* Core (Simplified Gateway) */}
        <g transform={`translate(${center.x}, ${center.y})`}>
          <motion.circle
            r="40"
            fill="none"
            stroke="#00E8FF"
            strokeWidth="1"
            strokeOpacity="0.25"
            animate={reduceMotion ? undefined : { opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            r="12"
            fill="url(#hub)"
            animate={reduceMotion ? undefined : { scale: [0.95, 1.05, 0.95], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </g>

        {/* Particles (Simplified) */}
        {projectedPoints.map(p => {
          const isCore = p.progress > 0.45 && p.progress < 0.55;
          const x1 = p.x - Math.cos(p.angle) * p.scale * 8;
          const y1 = p.y - Math.sin(p.angle) * p.scale * 8;

          // Ensure values are finite numbers
          if (!Number.isFinite(x1) || !Number.isFinite(y1) || !Number.isFinite(p.x) || !Number.isFinite(p.y)) {
            return null;
          }

          return (
            <g key={p.id}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={p.scale * (isCore ? 1.8 : 1)}
                fill={p.color}
                opacity={p.opacity}
                filter={isCore ? "url(#glow-visualizer)" : undefined}
                animate={!reduceMotion && isCore ? { scale: [1, 1.2, 1] } : undefined}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </g>
          );
        })}

      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 flex items-center justify-center">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <SopoLogoCSS />
        </div>
      </div>
    </div>
  );
};

export function Hero() {
  return (
    <section className="relative w-full min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-20 md:pt-24 pb-12 md:pb-20">
      {/* Background Grid Pattern - matching the landing page */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,hsl(var(--foreground)/0.05)_1px,transparent_0)] bg-[size:30px_30px] md:size-[40px_40px] opacity-50"></div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/10 blur-[80px] md:blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-primary/5 blur-[60px] md:blur-[120px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 md:mb-8 w-full"
          >
            <span className="inline-block py-1.5 px-3 md:py-2 md:px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-black mb-6 md:mb-8 font-display tracking-[0.3em] md:tracking-[0.4em] uppercase">
              SOPO APIGateway • NEXT-GEN API GATEWAY
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-8xl font-bold font-display tracking-tight mb-6 md:mb-8 leading-[1.1] max-w-5xl mx-auto px-2">
              Manage Your APIs Without <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/40 italic inline-block px-[11px] py-[11px] relative -left-[11px]">Config Hell</span>
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed px-6">
              A clear, unified pipeline for routes, auth, limits, and transforms—fast to change and safe to ship.
            </p>
          </motion.div>

          <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] flex items-center justify-center mb-8 md:mb-12 overflow-visible">
            <Globe />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center relative z-20 w-full px-6"
          >
            <Link href="/signup" data-testid="button-get-started" className="w-full sm:w-auto group relative px-8 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground font-display font-black tracking-[0.1em] md:tracking-[0.2em] rounded-xl md:rounded-2xl hover:scale-105 transition-all duration-300 shadow-[0_15px_40px_rgba(var(--primary-rgb),0.2)] md:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)]">
              <span className="relative z-10 flex items-center justify-center gap-3 md:gap-4 text-sm md:text-base">
                START NOW
                <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl md:rounded-2xl"></div>
            </Link>
            <Link href="/solution" data-testid="button-learn-more" className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 glass-panel font-display font-black tracking-[0.1em] md:tracking-[0.2em] rounded-xl md:rounded-2xl hover:bg-white/10 transition-all duration-300 border-white/10 text-sm md:text-base text-center">
              LEARN MORE
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}


