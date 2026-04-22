import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, Zap, Server, Key, CheckCircle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03)_0%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all mb-12 md:mb-16 group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to Home
        </Link>

        <div className="max-w-5xl mx-auto">
          <header className="mb-16 md:mb-24 text-center md:text-left">
            <h1 className="text-4xl md:text-8xl font-display font-black tracking-tighter mb-[34px] md:mb-[42px] leading-[1.3] pb-8">
              Privacy <span className="relative inline-block italic ml-2 py-4">
                <span className="absolute inset-x-[-35px] top-[-15px] bottom-[-35px] bg-primary/5 rounded-[3rem] -z-15"></span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 pr-4">Philosophy</span>
              </span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed max-w-3xl font-light italic mx-auto md:mx-0">
              "Trust is the fundamental substrate of distributed systems. We do not just protect data; we ensure its digital dignity."
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20 md:mb-32">
            {[
              { icon: Shield, title: "Sovereignty", desc: "Total jurisdiction over traffic logic." },
              { icon: Lock, title: "Zero-Knowledge", desc: "Architecture designed for absolute isolation." },
              { icon: Globe, title: "Universal", desc: "Seamless encryption across the digital fabric." },
              { icon: Database, title: "Ephemeral", desc: "Optimized for momentary state existence." }
            ].map((item, i) => (
              <div key={i} className="glass-panel p-[34px] md:p-[42px] rounded-[1.5rem] md:rounded-[2rem] border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-primary/20 transition-all group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-foreground tracking-tight">{item.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-20 md:space-y-32">
            <section className="relative">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                <div className="md:w-1/3 md:sticky md:top-32">
                  <span className="text-primary/40 font-mono text-[10px] md:text-sm tracking-[0.3em] uppercase mb-2 md:mb-4 block italic">Manifesto</span>
                  <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight">Data <span className="italic">Minimization</span></h2>
                </div>
                <div className="md:w-2/3 glass-panel p-[34px] md:p-[66px] rounded-[2rem] md:rounded-[3rem] border-white/5 bg-white/[0.01] backdrop-blur-sm">
                  <div className="prose prose-invert prose-sm md:prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4 md:space-y-6">
                    <p>
                      In an era of relentless surveillance, we embrace the path of <strong>Minimal Viable Context</strong>. 
                      The SOPO Gateway is not a repository of information, but a transparent conduit for logic.
                    </p>
                    <p>
                      We strictly avoid the accumulation of identifiers. When the digital pulse passes through our orchestrator, 
                      we capture only the essential essence required for routing and the preservation of systemic health.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-10 not-prose">
                      <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-primary/5 border border-primary/10">
                        <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary mb-2 md:mb-3" />
                        <span className="text-foreground font-bold block mb-1 text-sm md:text-base">Active Flow</span>
                        <p className="text-[10px] md:text-xs">Processing without permanent retention of payload content.</p>
                      </div>
                      <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-blue-500/5 border border-blue-500/10">
                        <Server className="w-4 h-4 md:w-5 md:h-5 text-blue-400 mb-2 md:mb-3" />
                        <span className="text-foreground font-bold block mb-1 text-sm md:text-base">State Isolation</span>
                        <p className="text-[10px] md:text-xs">Logical separation of intent and runtime execution.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                <div className="md:w-1/3 md:sticky md:top-32">
                  <span className="text-primary/40 font-mono text-[10px] md:text-sm tracking-[0.3em] uppercase mb-2 md:mb-4 block italic">Manifesto</span>
                  <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight">Algorithmic <span className="italic">Integrity</span></h2>
                </div>
                <div className="md:w-2/3 glass-panel p-[34px] md:p-[66px] rounded-[2rem] md:rounded-[3rem] border-white/5 bg-white/[0.01] backdrop-blur-sm">
                  <div className="prose prose-invert prose-sm md:prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4 md:space-y-6">
                    <p>
                      Our protocols are deterministic. Your data is never subjected to opaque models or hidden transformations 
                      that could leak business intelligence or compromise user patterns.
                    </p>
                    <p>
                      We provide the substrate for <strong>Zero-Trust Architecture</strong>. By enforcing security at the absolute edge, 
                      we ensure your backend remains a sanctuary, invisible to the noise of the open web.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="md:w-1/3 sticky top-32">
                  <span className="text-primary/40 font-mono text-sm tracking-[0.3em] uppercase mb-4 block italic">Manifesto</span>
                  <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight">Infrastructure <span className="italic">Hardening</span></h2>
                </div>
                <div className="md:w-2/3 glass-panel p-[42px] md:p-[66px] rounded-[3rem] border-white/5 bg-white/[0.01] backdrop-blur-sm">
                  <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
                    <p>
                      Your configurations are treated as sacred assets. Every policy definition and authentication parameter 
                      is shielded by multiple layers of cryptographic reinforcement.
                    </p>
                    <ul className="list-none p-0 space-y-4 not-prose">
                      {[
                        "Hardware-backed systemic management.",
                        "Absolute audit trails of administrative intent.",
                        "Fluid rotation of cryptographic foundations.",
                        "Isolated execution of request logic."
                      ].map((text, i) => (
                        <li key={i} className="flex items-center gap-4 text-foreground/80">
                          <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-sm font-medium">{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="pt-20 text-center">
              <div className="glass-panel p-12 md:p-20 rounded-[4rem] border-white/5 bg-gradient-to-b from-primary/5 to-transparent">
                <h3 className="text-3xl md:text-5xl font-display font-black mb-8 tracking-tight">The <span className="text-primary italic">Eternal</span> Commitment</h3>
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
                  We envision a web where architecture empowers digital dignity. Our team is available for deep systemic consultations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/contact" 
                    className="h-14 px-10 flex items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-all shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
                  >
                    Discuss Privacy Architecture
                  </Link>
                  <Link 
                    href="/docs" 
                    className="h-14 px-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-foreground font-bold hover:bg-white/10 transition-all"
                  >
                    Technical Whitepaper
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
