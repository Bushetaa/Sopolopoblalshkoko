"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * Client component that checks if the URL contains a refreshToken.
 * If it does, it means Nhost redirected here after verifying a password reset ticket,
 * so we redirect to /reset-password where the user can enter a new password.
 */
export function ForgotPasswordRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const refreshToken = searchParams.get("refreshToken");
    const type = searchParams.get("type");

    if (refreshToken) {
      // Build the redirect URL with all query params
      const params = new URLSearchParams();
      params.set("refreshToken", refreshToken);
      if (type) params.set("type", type);
      
      router.replace(`/reset-password?${params.toString()}`);
    }
  }, [searchParams, router]);

  return null;
}
