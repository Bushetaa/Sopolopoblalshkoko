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
  metadata?: Record<string, any>;
  locale?: string;
  createdAt?: string;
  activeMfaType?: string;
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
        const token = localStorage.getItem("sopo_access_token");
        if (token) {
          const profile = await apiClient.getProfile();
          setUser(profile);
        }
      } catch (error) {
        localStorage.removeItem("sopo_access_token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

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

  return {
    user,
    isLoading,
    isAuthenticating,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
  };
}
