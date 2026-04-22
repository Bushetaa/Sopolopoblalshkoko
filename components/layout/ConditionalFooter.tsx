"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Hide footer on signin, signup, verification and dashboard pages
  const dashboardRoutes = [
    "/dashboard", 
    "/api-manager", 
    "/api-gateway", 
    "/workspaces", 
    "/analytics", 
    "/rate-limiting", 
    "/settings"
  ];
  const isDashboard = dashboardRoutes.some(route => pathname?.startsWith(route));
  const hideFooterRoutes = ["/signin", "/signup", "/auth/v-auth-721", "/docs"];
  const isInternalVerify = pathname?.startsWith("/_internal/verify") || pathname?.startsWith("/internal/verify");
  
  if (!mounted || hideFooterRoutes.includes(pathname) || isInternalVerify || isDashboard) {
    return null;
  }

  return <Footer />;
}
