export const metadata = {
  title: "SOPO API Gateway",
  description: "Manage your APIs visually: routing, auth, rate limits, analytics.",
  icons: {
    icon: "/sopo-logo.png",
  },
};

import "../src/index.css";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
