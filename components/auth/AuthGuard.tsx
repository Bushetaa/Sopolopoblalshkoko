"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Check if token is in URL Query Parameters
    const queryRefreshToken = searchParams.get("refreshToken");
    const queryAccessToken = searchParams.get("accessToken");
    
    // 2. Check if token is in URL Hash Parameters (Hasura Auth often uses this)
    let hashRefreshToken = null;
    let hashAccessToken = null;
    
    if (typeof window !== "undefined" && window.location.hash) {
      // Remove the '#' and parse as URLSearchParams
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      hashRefreshToken = hashParams.get("refreshToken");
      hashAccessToken = hashParams.get("accessToken");
    }

    const token = queryRefreshToken || queryAccessToken || hashRefreshToken || hashAccessToken;

    if (token) {
      // Token found in URL, save it to localStorage
      localStorage.setItem("sopo_auth_token", token);
      
      // Clean up the URL to remove the sensitive tokens
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", window.location.pathname);
      }
      
      setIsAuthenticated(true);
      return;
    }

    // 3. No token in URL, check localStorage
    const storedToken = localStorage.getItem("sopo_auth_token");
    if (storedToken) {
      setIsAuthenticated(true);
    } else {
      // No token anywhere, redirect to signin
      router.replace("/signin");
    }
  }, [router, searchParams]);

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-950">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
