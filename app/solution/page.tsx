export const metadata = {
  title: "The Solution",
  description:
    "SOPO: a no‑code API gateway that turns policy chaos into a clear, unified pipeline.",
};

export default function SolutionPage() {
  return (
    <div className="min-h-[60vh] py-24 bg-background">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
          The Solution
        </h1>
        <p className="text-muted-foreground max-w-3xl mb-10">
          SOPO is a no‑code API gateway that turns policy chaos into a clear,
          unified pipeline—fast to change and safe to ship.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="font-semibold text-lg">Visual Policies</h3>
            <p className="text-muted-foreground mt-2">
              Define routes, auth, limits, and transforms in one place. Review
              diffs before deploy and keep behavior consistent across
              environments.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="font-semibold text-lg">Safe Delivery</h3>
            <p className="text-muted-foreground mt-2">
              Gated promotions and one‑click rollbacks. Test in Staging, promote
              to Prod with confidence, and recover in seconds.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="font-semibold text-lg">Ship Faster</h3>
            <p className="text-muted-foreground mt-2">
              Observability built‑in: per‑route latency and errors. Fix
              bottlenecks quickly and focus on product, not plumbing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
