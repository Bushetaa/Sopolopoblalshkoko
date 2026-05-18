import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { Suspense } from "react";

export const metadata = {
  title: {
    default: "SOPO API Gateway",
    template: "%s • SOPO API Gateway"
  },
  description: "Manage your APIs without config chaos. Visual routes, auth, rate limits, transforms—versioned and safe to ship.",
  applicationName: "SOPO API Gateway",
  keywords: [
    "API Gateway",
    "no-code gateway",
    "rate limiting",
    "OAuth2",
    "JWT",
    "CORS",
    "traffic management",
    "observability",
    "rollback",
    "visual policies",
    "reverse proxy",
    "microservices",
    "load balancing",
    "circuit breaking",
    "retries with jitter",
    "latency",
    "error monitoring",
    "policy pipeline",
    "API Gateway Portal",
    "no-code",
    "request rate",
    "JWT Authentication",
    "OAuth2",
    "reverse proxy",
    "performance monitoring"
  ],
  metadataBase: new URL("https://sopo.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SOPO API Gateway",
    description: "Turn policy chaos into a clear, versioned pipeline—fast to change and safe to ship.",
    url: "https://sopo.dev",
    siteName: "SOPO API Gateway",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "SOPO API Gateway",
    description: "Visual policies, safe delivery, and built‑in observability.",
    creator: "@sopo"
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: "/assets/sopo_logo_1771857176169.png",
    shortcut: "/assets/sopo_logo_1771857176169.png",
    apple: "/assets/sopo_logo_1771857176169.png",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          {children}
          <Suspense fallback={null}>
            <ConditionalFooter />
          </Suspense>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "SOPO API Gateway",
              applicationCategory: "WebApplication",
              operatingSystem: "All",
              description:
                "No‑code API gateway for visual policies, safe delivery, and built‑in observability.",
              url: "https://sopo.dev",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
          }}
        />
      </body>
    </html>
  );
}
