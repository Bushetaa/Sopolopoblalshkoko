import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

export function SopoLogoCSS() {
  return (
    <div className="relative w-full h-full flex items-center justify-center scale-75 md:scale-100">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full" />
      
      {/* Left Bracket Shape */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1 translate-x-4">
        <div className="w-16 h-2 bg-gradient-to-l from-primary to-transparent rounded-full shadow-[0_0_15px_rgba(0,183,255,0.6)]" />
        <div className="w-24 h-2 bg-gradient-to-l from-primary to-transparent rounded-full shadow-[0_0_15px_rgba(0,183,255,0.6)]" />
        <div className="w-20 h-2 bg-gradient-to-l from-primary to-transparent rounded-full shadow-[0_0_15px_rgba(0,183,255,0.6)]" />
      </div>

      {/* Right Bracket Shape */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-start gap-1 -translate-x-4">
        <div className="w-16 h-2 bg-gradient-to-r from-primary to-transparent rounded-full shadow-[0_0_15px_rgba(0,183,255,0.6)]" />
        <div className="w-24 h-2 bg-gradient-to-r from-primary to-transparent rounded-full shadow-[0_0_15px_rgba(0,183,255,0.6)]" />
        <div className="w-20 h-2 bg-gradient-to-r from-primary to-transparent rounded-full shadow-[0_0_15px_rgba(0,183,255,0.6)]" />
      </div>

      {/* Central Ring */}
      <div className="relative w-40 h-40 rounded-full border-4 border-primary flex items-center justify-center bg-black/40 backdrop-blur-sm shadow-[0_0_40px_rgba(0,183,255,0.4)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <Code2 className="w-20 h-20 text-primary drop-shadow-[0_0_10px_rgba(0,183,255,0.8)]" />
        
        {/* Animated Inner Shine */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 w-[200%]"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating Mechanical Accents */}
      <div className="absolute -top-4 w-32 h-8 border-t-2 border-x-2 border-primary/40 rounded-t-xl" />
      <div className="absolute -bottom-4 w-32 h-8 border-b-2 border-x-2 border-primary/40 rounded-b-xl" />
    </div>
  );
}