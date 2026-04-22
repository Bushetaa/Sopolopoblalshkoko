"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Twitter, Github, Send, ShieldCheck, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.02)_0%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all mb-12 md:mb-16 group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to Home
        </Link>

        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <header className="mb-16 md:mb-20 flex flex-col items-center text-center">
            <div className="glass-panel px-12 md:px-24 py-10 md:py-16 rounded-[2.5rem] md:rounded-[3.5rem] border-white/5 bg-white/[0.02] mb-8 md:mb-12 inline-flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <h1 className="text-3xl sm:text-4xl md:text-8xl font-display font-black tracking-tighter leading-[1.2] relative z-10 whitespace-nowrap py-6">
                Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 italic pr-[37px] tracking-normal ml-2">Support</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed font-light italic max-w-3xl">
              "Need systemic assistance or architectural consultation? Our engineering team is standing by to assist with your integration."
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
            
            {/* Left Column: Info Cards */}
            <div className="space-y-10 md:space-y-12">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 md:mb-12">
                {[
                  { icon: Mail, label: "Email Support", value: "support@sopo.io", color: "text-blue-400" },
                  { icon: MessageSquare, label: "Discord", value: "Join Community", color: "text-indigo-400" },
                  { icon: Twitter, label: "Twitter", value: "@sopo_io", color: "text-sky-400" },
                  { icon: Globe, label: "Status", value: "System Optimal", color: "text-emerald-400" }
                ].map((item, i) => (
                  <div key={i} className="glass-panel p-6 rounded-2xl border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                    <item.icon className={`w-5 h-5 ${item.color} mb-3`} />
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60 block mb-1">{item.label}</span>
                    <span className="text-foreground font-bold">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 rounded-3xl bg-primary/5 border border-primary/10">
                  <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="text-foreground font-bold mb-1">Priority Support</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Enterprise customers receive guaranteed 1-hour response times for critical systemic issues.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                  <Zap className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-foreground font-bold mb-1">Fast Integration</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Our technical architects can help you map your legacy routes to SOPO in minutes.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="glass-panel p-6 md:p-14 rounded-[2rem] md:rounded-[3.5rem] border-white/5 bg-white/[0.01] backdrop-blur-xl relative mt-8 lg:mt-0">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
              
              <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground ml-1">Identity</label>
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground ml-1">Terminal</label>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground ml-1">Objective</label>
                  <select className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-foreground focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer">
                    <option className="bg-background">Technical Support</option>
                    <option className="bg-background">Architectural Consultation</option>
                    <option className="bg-background">Enterprise Inquiry</option>
                    <option className="bg-background">Other Intent</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground ml-1">Message Intent</label>
                  <textarea 
                    placeholder="Describe your systemic requirements..." 
                    rows={5}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-6 py-5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full h-16 bg-primary text-primary-foreground font-black text-lg rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] group"
                >
                  Transmit Message
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
