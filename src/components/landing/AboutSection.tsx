import { motion } from "framer-motion";

const team = ["Sherif Thabit", "Amr Sherif", "Omar Ayman"];

const AboutSection = () => (
  <section id="about" className="relative py-24 sm:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          About SOPO
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          SOPO is a graduation project designed to simplify API management through a powerful and easy-to-use gateway dashboard.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-6"
      >
        {team.map((name) => (
          <div
            key={name}
            className="flex h-14 items-center rounded-xl border border-border bg-card px-6 font-display text-sm font-medium text-foreground"
          >
            {name}
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default AboutSection;
