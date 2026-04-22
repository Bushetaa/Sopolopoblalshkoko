import Link from "next/link";
import { ArrowLeft, Gavel, Scale, FileText, CheckCircle, ShieldAlert, Cpu, Network, Zap } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-primary/10 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-cyan-500/10 blur-[160px] rounded-full" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(var(--primary-rgb),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb),0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all mb-16 group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to Home
        </Link>

        <div className="max-w-5xl mx-auto">
          <header className="mb-24 text-center md:text-left">
            <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter mb-8 leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-blue-400">
              Operational <span className="italic text-foreground">Framework</span>
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl leading-relaxed max-w-3xl font-light italic">
              "Systemic integrity is not an option; it is the protocol. We define the boundaries of the digital frontier."
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
            {[
              { icon: Gavel, title: "Jurisdiction", desc: "Governance of digital assets and runtime rights." },
              { icon: Scale, title: "Equilibrium", desc: "Systemic balance for global stability." },
              { icon: Cpu, title: "Autonomy", desc: "Absolute execution of user-defined logic." },
              { icon: ShieldAlert, title: "Responsibility", desc: "Defined boundaries of systemic action." }
            ].map((item, i) => (
              <div key={i} className="glass-panel p-8 rounded-[2rem] border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-primary/20 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-32">
            <section className="relative">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="md:w-1/3 sticky top-32">
                  <span className="text-primary/40 font-mono text-sm tracking-[0.3em] uppercase mb-4 block italic">Protocol</span>
                  <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight">The Service <span className="italic">Covenant</span></h2>
                </div>
                <div className="md:w-2/3 glass-panel p-10 md:p-14 rounded-[3rem] border-white/5 bg-white/[0.01] backdrop-blur-sm">
                  <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
                    <p>
                      SOPO establishes a high-performance, deterministic environment. Our covenant is to provide 
                      a stable substrate for microservice orchestration. The <strong>Functional Logic</strong>—the 
                      definitions of intent and movement—remain under the absolute authority of the orchestrator.
                    </p>
                    <p>
                      We guarantee the <strong>Integrity of the Pipeline</strong>, ensuring that movement is processed exactly 
                      as configured, without unauthorized mutation or systemic interference.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 not-prose">
                      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                        <Zap className="w-5 h-5 text-primary mb-3" />
                        <span className="text-foreground font-bold block mb-1">Determinism</span>
                        <p className="text-xs">Consistent execution of logic across the edge fabric.</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                        <Network className="w-5 h-5 text-cyan-400 mb-3" />
                        <span className="text-foreground font-bold block mb-1">Global Scale</span>
                        <p className="text-xs">Elastic throughput for infinite digital demands.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="md:w-1/3 sticky top-32">
                  <span className="text-primary/40 font-mono text-sm tracking-[0.3em] uppercase mb-4 block italic">Protocol</span>
                  <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight">Systemic <span className="italic">Boundaries</span></h2>
                </div>
                <div className="md:w-2/3 glass-panel p-10 md:p-14 rounded-[3rem] border-white/5 bg-white/[0.01] backdrop-blur-sm">
                  <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
                    <p>
                      Usage is subject to <strong>Equilibrium Constraints</strong>. We implement automated safeguards 
                      to maintain the collective health of the infrastructure, preventing runaway processes from compromising 
                      the shared substrate.
                    </p>
                    <p>
                      You are the sole custodian of your cryptographic foundations. Our architecture follows a 
                      <strong> Non-Custodial Pattern</strong>—we provide the enforcement, but you retain the authority.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="md:w-1/3 sticky top-32">
                  <span className="text-primary/40 font-mono text-sm tracking-[0.3em] uppercase mb-4 block italic">Protocol</span>
                  <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight">Evolutive <span className="italic">Clause</span></h2>
                </div>
                <div className="md:w-2/3 glass-panel p-10 md:p-14 rounded-[3rem] border-white/5 bg-white/[0.01] backdrop-blur-sm">
                  <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
                    <p>
                      As distributed systems shift, so too must our operational framework. We reserve the authority to 
                      refine these protocols to adapt to emerging vectors and infrastructure evolution.
                    </p>
                    <ul className="list-none p-0 space-y-4 not-prose">
                      {[
                        "Proactive systemic updates without logic disruption.",
                        "Transparent communication of infrastructure shifts.",
                        "Continuous hardening of the gateway substrate.",
                        "Adherence to emerging global standards."
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

            <section className="relative">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="md:w-1/3 sticky top-32">
                  <span className="text-primary/40 font-mono text-sm tracking-[0.3em] uppercase mb-4 block italic">Protocol</span>
                  <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight">Systemic <span className="italic">Equilibrium</span></h2>
                </div>
                <div className="md:w-2/3 glass-panel p-10 md:p-14 rounded-[3rem] border-white/5 bg-white/[0.01] backdrop-blur-sm">
                  <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
                    <p>
                      The SOPO mesh maintains a state of <strong>Dynamic Equilibrium</strong>. This balance is not static 
                      but a continuous negotiation between resource availability and processing intent. 
                    </p>
                    <p>
                      We monitor the health of the collective fabric. Any action that threatens to disrupt this balance—whether 
                      through excessive throughput or non-deterministic logic loops—will be automatically moderated to preserve 
                      the stability of the shared substrate for all orchestrators.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="md:w-1/3 sticky top-32">
                  <span className="text-primary/40 font-mono text-sm tracking-[0.3em] uppercase mb-4 block italic">Protocol</span>
                  <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight">The Distributed <span className="italic">Clause</span></h2>
                </div>
                <div className="md:w-2/3 glass-panel p-10 md:p-14 rounded-[3rem] border-white/5 bg-white/[0.01] backdrop-blur-sm">
                  <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
                    <p>
                      By utilizing SOPO, you acknowledge the <strong>Decentralized Nature of Processing</strong>. 
                      Our gateway operates as a non-localized entity, distributing intent across a global mesh of nodes.
                    </p>
                    <p>
                      This distribution ensures resilience but also requires a shared understanding of 
                      <strong> Systemic Fluidity</strong>. We reserve the right to evolve the underlying infrastructure 
                      to maintain peak performance without compromising the integrity of your visual policy definitions.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="md:w-1/3 sticky top-32">
                  <span className="text-primary/40 font-mono text-sm tracking-[0.3em] uppercase mb-4 block italic">Protocol</span>
                  <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight">Logic <span className="italic">Sovereignty</span></h2>
                </div>
                <div className="md:w-2/3 glass-panel p-10 md:p-14 rounded-[3rem] border-white/5 bg-white/[0.01] backdrop-blur-sm">
                  <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
                    <p>
                      You maintain absolute <strong>Intellectual Sovereignty</strong> over the routing logic and 
                      transformation scripts deployed on our substrate. 
                    </p>
                    <p>
                      SOPO acts as a non-localized executor of your intent. We do not claim ownership, nor do we 
                      analyze the business logic embedded within your visual policy definitions. Your algorithms 
                      are yours to own, evolve, and deploy.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="md:w-1/3 sticky top-32">
                  <span className="text-primary/40 font-mono text-sm tracking-[0.3em] uppercase mb-4 block italic">Protocol</span>
                  <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight">Systemic <span className="italic">Resilience</span></h2>
                </div>
                <div className="md:w-2/3 glass-panel p-10 md:p-14 rounded-[3rem] border-white/5 bg-white/[0.01] backdrop-blur-sm">
                  <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
                    <p>
                      Resilience is an inherent property of the <strong>Collective Mesh</strong>. While individual 
                      nodes may undergo temporal shifts or resets, the systemic integrity of your orchestrator 
                      is maintained through redundant, non-localized execution.
                    </p>
                    <p>
                      By utilizing SOPO, you acknowledge the <strong>Stochastic Nature of Edge Computing</strong>. 
                      We provide the mechanisms for fault tolerance, but the ultimate resilience of your 
                      architecture depends on the robustness of the policies you define.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="md:w-1/3 sticky top-32">
                  <span className="text-primary/40 font-mono text-sm tracking-[0.3em] uppercase mb-4 block italic">Protocol</span>
                  <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight">Algorithmic <span className="italic">Consensus</span></h2>
                </div>
                <div className="md:w-2/3 glass-panel p-10 md:p-14 rounded-[3rem] border-white/5 bg-white/[0.01] backdrop-blur-sm">
                  <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
                    <p>
                      The movement of data across our mesh is governed by <strong>Deterministic Consensus</strong>. 
                      Every node in the infrastructure operates under the same set of universal rules, ensuring that 
                      your intent is processed consistently regardless of its physical location.
                    </p>
                    <p>
                      This consensus is the foundation of our stability. Any attempt to introduce non-deterministic 
                      variables or opaque logic that could disrupt this consensus will be moderated by the 
                      <strong>Systemic Equilibrium Protocols</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="pt-20 text-center">
              <div className="glass-panel p-12 md:p-20 rounded-[4rem] border-white/5 bg-gradient-to-b from-primary/5 to-transparent">
                <h3 className="text-3xl md:text-5xl font-display font-black mb-8 tracking-tight">The <span className="text-primary italic">Universal</span> Agreement</h3>
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
                  Our framework is designed to empower orchestrators, not restrict them. 
                  For custom systemic agreements, our architecture team is available.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/contact" 
                    className="h-14 px-10 flex items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-all shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
                  >
                    Discuss Systemic Framework
                  </Link>
                  <Link 
                    href="/docs/compliance" 
                    className="h-14 px-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-foreground font-bold hover:bg-white/10 transition-all"
                  >
                    Compliance Matrix
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
