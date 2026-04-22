import { motion } from "framer-motion";
import { Activity, Shield, Puzzle, Rocket } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Load Balancing",
    description: "Distribute traffic across multiple backends for high availability and optimal performance.",
  },
  {
    icon: Shield,
    title: "Rate Limiting",
    description: "Protect your APIs from abuse with configurable rate limits and throttling policies.",
  },
  {
    icon: Puzzle,
    title: "Plugin System",
    description: "Extend gateway functionality with a modular plugin architecture for custom logic.",
  },
  {
    icon: Rocket,
    title: "Instant Deployment",
    description: "Deploy configuration changes in seconds without any downtime or code pushes.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="relative py-24 sm:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Core Features
        </h2>
      </motion.div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              <f.icon size={24} />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
