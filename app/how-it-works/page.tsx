export const metadata = {
  title: "How It Works",
  description:
    "Create your project, configure routes visually, and deploy instantly with safe promotions.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-[60vh] py-24 bg-background">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
          How It Works
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="glass-panel p-6 rounded-xl">
            <div className="text-primary font-display text-2xl mb-2">1</div>
            <h3 className="font-semibold mb-2">Create your project</h3>
            <p className="text-muted-foreground">
              Spin up Dev, Staging, and Prod. Add upstreams with health checks
              and bootstrap secure route templates.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-xl">
            <div className="text-primary font-display text-2xl mb-2">2</div>
            <h3 className="font-semibold mb-2">Configure routes visually</h3>
            <p className="text-muted-foreground">
              Drag‑and‑drop Auth, Limits, CORS, Transforms, Retries/Timeouts,
              and Logging. Review diffs before deploy.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-xl">
            <div className="text-primary font-display text-2xl mb-2">3</div>
            <h3 className="font-semibold mb-2">Deploy instantly</h3>
            <p className="text-muted-foreground">
              Use gated promotions. Watch latency and errors. Promote to Prod
              and roll back in seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
