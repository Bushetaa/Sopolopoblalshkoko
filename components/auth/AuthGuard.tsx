"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isProcessingRef = useRef(false);

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
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      // Token found in URL (e.g. from OAuth redirect), establish session via API
      apiClient.refreshToken(token).then((newToken) => {
        if (newToken) {
          // Clean up the URL to remove the sensitive tokens
          if (typeof window !== "undefined") {
            window.history.replaceState(null, "", window.location.pathname);
          }
          setIsAuthenticated(true);
        } else {
          router.replace("/signin");
        }
      }).catch((err) => {
        console.error("AuthGuard token refresh failed:", err);
        router.replace("/signin");
      });
      return;
    }

    // 3. No token in URL, check localStorage for access token
    const storedToken = localStorage.getItem("sopo_access_token");
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
