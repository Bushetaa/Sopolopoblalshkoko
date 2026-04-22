import { Features } from "@/components/sections/Features";

export const metadata = {
  title: "Features",
  description:
    "Ultra-low latency, advanced security, intelligent routing, analytics, and more.",
};

export default function FeaturesPage() {
  return (
    <main className="min-h-[60vh] bg-background pt-24">
      <Features />
    </main>
  );
}
