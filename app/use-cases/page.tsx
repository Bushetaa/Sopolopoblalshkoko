export const metadata = {
  title: "Use Cases",
  description:
    "Clear patterns for real‑world work—public APIs, microservices, and backoffice flows.",
};

export default function UseCasesPage() {
  return (
    <div className="min-h-[60vh] py-24 bg-background">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
          Use Cases
        </h1>
        <p className="text-muted-foreground max-w-3xl mb-10">
          Ship public APIs, tame microservices, and secure backoffice flows.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="font-semibold text-lg">Public APIs</h3>
            <p className="text-muted-foreground mt-2">
              Publish secure endpoints with keys or JWT. Add limits, CORS,
              transforms without backend changes.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="font-semibold text-lg">Internal Microservices</h3>
            <p className="text-muted-foreground mt-2">
              Standardize identity, rate limits, and retries. Remove per‑team
              drift with reusable presets.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="font-semibold text-lg">Admin & Backoffice</h3>
            <p className="text-muted-foreground mt-2">
              Protect sensitive routes with stricter auth, lower timeouts, and
              request mirroring for safe previews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
