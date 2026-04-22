export const metadata = {
  title: "The Problem",
  description:
    "Why manual API management creates drift, risky releases, and slow incident recovery.",
};

export default function ProblemPage() {
  const items = [
    "Risky deploys from opaque configs",
    "Inconsistent behavior across environments",
    "Slow rollbacks and long mean‑time‑to‑restore",
    "Config sprawl",
    "Auth drift",
    "CORS headaches",
    "Hidden bottlenecks",
    "Slow rollbacks",
    "Routing rules scattered",
  ];
  return (
    <div className="min-h-[60vh] py-24 bg-background">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
          The Problem
        </h1>
        <p className="text-muted-foreground max-w-3xl mb-10">
          Manual API management scatters routing, auth, limits, and transforms
          across tools and teams—causing drift, risky releases, and slow
          incident recovery.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="glass-panel p-6 rounded-xl">
              <h3 className="font-semibold">{item}</h3>
              <p className="text-muted-foreground mt-2">
                A tiny change in one place causes chaos elsewhere.
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="font-semibold">Auth policies drift</h3>
            <p className="text-muted-foreground mt-2">A tiny change in one place causes chaos elsewhere.</p>
          </div>
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="font-semibold">Rate limit inconsistencies</h3>
            <p className="text-muted-foreground mt-2">A tiny change in one place causes chaos elsewhere.</p>
          </div>
          <div className="glass-panel p-6 rounded-xl md:col-span-2">
            <h3 className="font-semibold">Opaque rollout and rollback</h3>
            <p className="text-muted-foreground mt-2">Hard to preview diffs, slow to revert safely.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
