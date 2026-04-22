export const metadata = {
  title: "Architecture",
  description:
    "A deterministic pipeline with a fast data plane and visual control plane.",
};

export default function ArchitecturePage() {
  return (
    <div className="min-h-[60vh] py-24 bg-background">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
          Architecture at a Glance
        </h1>
        <p className="text-muted-foreground max-w-3xl mb-10">
          Routing, auth, limits, transforms, and telemetry—applied consistently
          in the data plane, with a visual control plane for unified deploys.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="font-semibold mb-2">Data Plane</h3>
            <p className="text-muted-foreground">
              Executes a deterministic pipeline per request: routing, auth, rate
              limits, transforms, CORS, retries, logging.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="font-semibold mb-2">Control Plane</h3>
            <p className="text-muted-foreground">
              Visual editor, unified changes, gated promotions, and one‑click
              rollbacks. Metrics and traces included.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
