import { motion } from "framer-motion";

const tech = ["Vite", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"];

const TechnologySection = () => (
  <section id="technology" className="relative py-24 sm:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Built With Modern Technology
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          SOPO uses modern technologies and a powerful gateway architecture with plugin extensibility.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default TechnologySection;
