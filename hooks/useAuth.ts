"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  emailVerified: boolean;
  roles: string[];
  defaultRole: string;
  metadata?: {
    firstName?: string;
    lastName?: string;
    [key: string]: any;
  };
  locale?: string;
  createdAt?: string;
  activeMfaType?: string | null;
  isAnonymous?: boolean;
  phoneNumberVerified?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        let token = localStorage.getItem("sopo_access_token");

        // Handle OAuth callback URL containing refreshToken
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          const urlRefreshToken = urlParams.get('refreshToken');

          if (urlRefreshToken) {
            token = await apiClient.refreshToken(urlRefreshToken);
            // Clean up the URL to hide the token
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }

        if (token) {
          const profile = await apiClient.getProfile();
          setUser(profile);
        }
      } catch (error) {
        localStorage.removeItem("sopo_access_token");
        localStorage.removeItem("sopo_refresh_token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Note: Auto-refresh interval removed.
  // Token refreshing is now handled exclusively by the APIClient interceptor
  // which catches 401s and deduplicates refresh requests to avoid race conditions.


  const login = useCallback(
    async (email: string, password: string) => {
      setIsAuthenticating(true);
      try {
        const session = await apiClient.login(email, password);
        setUser(session.user);
        toast({
          title: "Success",
          description: "Welcome back!",
        });
        router.push("/dashboard");
        return session;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to sign in",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [router]
  );

  const signup = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      setIsAuthenticating(true);
      try {
        await apiClient.signup(email, password, firstName, lastName);
        toast({
          title: "Success",
          description: "Signup successful! Please check your email to verify your account.",
        });
        return { email };
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to sign up",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsAuthenticating(true);
    try {
      await apiClient.logout();
      setUser(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      try {
        const updated = await apiClient.updateProfile(data);
        setUser(updated);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        return updated;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to update profile",
          variant: "destructive",
        });
        throw error;
      }
    },
    []
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        await apiClient.changePassword(currentPassword, newPassword);
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to change password",
          variant: "destructive",
        });
        throw error;
      }
    },
    []
  );

  const resetPassword = useCallback(
    async (email: string) => {
      setIsAuthenticating(true);
      try {
        await apiClient.resetPassword(email);
        toast({
          title: "Email Sent",
          description: "If an account exists, a password reset link has been sent.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to request password reset",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    []
  );

  const signInOTP = useCallback(
    async (email: string) => {
      setIsAuthenticating(true);
      try {
        await apiClient.signInOTP(email);
        toast({
          title: "OTP Sent",
          description: "Check your email for the one-time passcode.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to send OTP",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    []
  );

  const verifyOTP = useCallback(
    async (email: string, otp: string) => {
      setIsAuthenticating(true);
      try {
        const session = await apiClient.verifyOTP(email, otp);
        setUser(session.user);
        toast({
          title: "Success",
          description: "Welcome back!",
        });
        router.push("/dashboard");
        return session;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to verify OTP",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [router]
  );

  return {
    user,
    isLoading,
    isAuthenticating,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    signInOTP,
    verifyOTP,
    isAuthenticated: !!user,
  };
}
