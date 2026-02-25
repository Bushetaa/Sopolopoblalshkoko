"use client";
import { motion } from "framer-motion";

const BackgroundBand = () => (
  <div className="relative">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
      aria-hidden
      className="bg-grid pointer-events-none relative h-64 w-full overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
    </motion.div>
  </div>
);

export default BackgroundBand;
