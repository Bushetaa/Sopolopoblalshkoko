"use client";

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

interface AuthSession {
  accessToken: string;
  accessTokenExpiresIn: number;
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    emailVerified: boolean;
    roles: string[];
    defaultRole: string;
    metadata?: Record<string, any>;
    [key: string]: any;
  };
}

class APIClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001") {
    this.baseURL = baseURL;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      withCredentials: true, // Enable sending cookies with requests
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Add interceptor to include access token in Authorization header
    this.client.interceptors.request.use((config) => {
      const token = this.getStoredAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for handling token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // Try to refresh token
            const newToken = await this.refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Redirect to login if refresh fails
            if (typeof window !== "undefined") {
              window.location.href = "/signin";
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth Methods
  async login(email: string, password: string): Promise<AuthSession> {
    try {
      const response = await this.client.post("/auth/signin/email-password", {
        email,
        password,
      });

      const session: AuthSession = response.data.session;
      this.storeAccessToken(session.accessToken);
      return session;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to sign in");
    }
  }

  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ email: string }> {
    try {
      const response = await this.client.post("/auth/signup/email-password", {
        email,
        password,
        options: {
          allowedRoles: ["me", "user"],
          defaultRole: "user",
          displayName: `${firstName} ${lastName}`,
          locale: "en",
          metadata: {
            firstName,
            lastName,
          },
        },
      });

      return { email: response.data.email || email };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to sign up");
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.post("/auth/signout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearAccessToken();
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
    }
  }

  async getProfile(): Promise<AuthSession["user"]> {
    try {
      const response = await this.client.get("/auth/user");
      return response.data.user || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch profile");
    }
  }

  async updateProfile(data: Partial<AuthSession["user"]>): Promise<AuthSession["user"]> {
    try {
      const response = await this.client.put("/auth/user", data);
      return response.data.user || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update profile");
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await this.client.post("/auth/user/password", {
        oldPassword: currentPassword,
        newPassword,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to change password");
    }
  }

  async changeEmail(newEmail: string): Promise<void> {
    try {
      await this.client.post("/auth/user/email/change", {
        newEmail,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to change email");
    }
  }

  async sendVerificationEmail(): Promise<void> {
    try {
      await this.client.post("/auth/user/email/send-verification-email");
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to send verification email");
    }
  }

  async generateMFATotp(): Promise<{ secret: string; qrCode: string }> {
    try {
      const response = await this.client.get("/auth/mfa/totp/generate");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to generate MFA");
    }
  }

  async verifyMFA(code: string): Promise<void> {
    try {
      await this.client.post("/auth/user/mfa", {
        code,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to verify MFA");
    }
  }

  async generatePAT(displayName: string): Promise<{ token: string }> {
    try {
      const response = await this.client.post("/auth/pat", {
        displayName,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to generate PAT");
    }
  }

  async verifyToken(token: string): Promise<{ valid: boolean }> {
    try {
      const response = await this.client.post("/auth/token/verify", {
        token,
      });
      return response.data;
    } catch (error: any) {
      return { valid: false };
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const response = await this.client.post("/auth/token");
      const newToken = response.data.session?.accessToken;
      if (newToken) {
        this.storeAccessToken(newToken);
        return newToken;
      }
      return null;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Token management
  private storeAccessToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("sopo_access_token", token);
    }
  }

  private getStoredAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sopo_access_token");
    }
    return null;
  }

  private clearAccessToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sopo_access_token");
    }
  }
}

// Export singleton instance
export const apiClient = new APIClient();

export default APIClient;
