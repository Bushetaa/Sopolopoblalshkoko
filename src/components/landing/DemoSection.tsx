import { motion } from "framer-motion";

const DemoSection = () => {
  const scrollTo = () => {
    document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="demo" className="relative py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Experience SOPO Simulation
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Try our interactive simulation and see how SOPO handles real API traffic.
          </p>

          <button
            onClick={scrollTo}
            className="mt-10 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent"
          >
            Start Simulation
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection;
