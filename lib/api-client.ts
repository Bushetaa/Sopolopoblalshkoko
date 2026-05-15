"use client";

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
    metadata?: {
      firstName?: string;
      lastName?: string;
      [key: string]: any;
    };
    createdAt?: string;
    activeMfaType?: string | null;
    isAnonymous?: boolean;
    locale?: string;
    phoneNumberVerified?: boolean;
    [key: string]: any;
  };
}

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  _retry?: boolean;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_BACKEND_URL || "") {
    this.baseURL = baseURL;
  }

  private async fetchWithAuth<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Default headers
    const headers = new Headers(options.headers as HeadersInit);
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    headers.set("Accept", "application/json");

    // Add access token
    const token = this.getStoredAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Format body if it's an object and not FormData
    let body = options.body;
    if (body && typeof body === 'object' && !(body instanceof FormData)) {
      body = JSON.stringify(body);
    }

    const config: RequestInit = {
      ...options,
      headers,
      body,
      credentials: "include", // Send cookies (refresh token)
    };

    try {
      let response = await fetch(url, config);

      // Handle 401 Unauthorized - Token Refresh
      const isAuthEndpoint = url.includes('/auth/signin') || url.includes('/auth/signup') || url.includes('/auth/token');
      if (response.status === 401 && !options._retry && !isAuthEndpoint) {
        options._retry = true;
        try {
          const newToken = await this.refreshToken();
          if (newToken) {
            // Retry the original request with the new token
            headers.set("Authorization", `Bearer ${newToken}`);
            config.headers = headers;
            // Since we're retrying, we might need to recreate the Request or just fetch again with same config
            response = await fetch(url, config);
          } else {
            this.redirectToLogin();
            throw new Error("Session expired");
          }
        } catch (refreshError) {
          this.redirectToLogin();
          throw refreshError;
        }
      }

      const isJson = response.headers.get("content-type")?.includes("application/json");
      let data = null;
      
      if (response.status !== 204) {
        data = isJson ? await response.json() : await response.text();
      }

      if (!response.ok) {
        throw new Error(data?.message || data?.error?.message || `Request failed with status ${response.status}`);
      }

      return data as T;
    } catch (error) {
      throw error;
    }
  }

  private redirectToLogin() {
    this.clearAccessToken();
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
  }

  // Auth Methods
  async login(email: string, password: string): Promise<AuthSession> {
    try {
      const response = await this.post<any>("/auth/signin/email-password", {
        email,
        password,
      });

      const session: AuthSession = response.session || response;
      if (session && session.accessToken) {
         this.storeAccessToken(session.accessToken);
      }
      return session;
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign in");
    }
  }

  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ email: string }> {
    try {
      const response = await this.post<any>("/auth/signup/email-password", {
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

      return { email: response.email || email };
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign up");
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await this.post("/auth/user/password/reset", { email });
    } catch (error: any) {
      throw new Error(error.message || "Failed to request password reset");
    }
  }

  async signInOTP(email: string): Promise<void> {
    try {
      await this.post("/auth/signin/otp/email", { email });
    } catch (error: any) {
      throw new Error(error.message || "Failed to send OTP");
    }
  }

  async verifyOTP(email: string, otp: string): Promise<AuthSession> {
    try {
      const response = await this.post<any>("/auth/signin/otp/email/verify", { email, otp });
      const session: AuthSession = response.session || response;
      if (session && session.accessToken) {
         this.storeAccessToken(session.accessToken);
      }
      return session;
    } catch (error: any) {
      throw new Error(error.message || "Failed to verify OTP");
    }
  }

  async logout(): Promise<void> {
    try {
      await this.post("/auth/signout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.redirectToLogin();
    }
  }

  private profilePromise: Promise<any> | null = null;
  async getProfile(): Promise<AuthSession["user"]> {
    if (this.profilePromise) return this.profilePromise;
    this.profilePromise = (async () => {
      try {
        const response = await this.get<any>("/auth/user");
        return response.user || response;
      } catch (error: any) {
        throw new Error(error.message || "Failed to fetch profile");
      } finally {
        setTimeout(() => { this.profilePromise = null; }, 1000); // Cache for 1 second
      }
    })();
    return this.profilePromise;
  }

  async updateProfile(data: Partial<AuthSession["user"]>): Promise<AuthSession["user"]> {
    try {
      const response = await this.put<any>("/auth/user", data);
      return response.user || response;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update profile");
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await this.post("/auth/user/password", {
        oldPassword: currentPassword,
        newPassword,
      });
    } catch (error: any) {
      throw new Error(error.message || "Failed to change password");
    }
  }

  async changeEmail(newEmail: string): Promise<void> {
    try {
      await this.post("/auth/user/email/change", {
        newEmail,
      });
    } catch (error: any) {
      throw new Error(error.message || "Failed to change email");
    }
  }

  async sendVerificationEmail(): Promise<void> {
    try {
      await this.post("/auth/user/email/send-verification-email");
    } catch (error: any) {
      throw new Error(error.message || "Failed to send verification email");
    }
  }

  async generateMFATotp(): Promise<{ secret: string; qrCode: string }> {
    try {
      const response = await this.get<any>("/auth/mfa/totp/generate");
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Failed to generate MFA");
    }
  }

  async verifyMFA(code: string): Promise<void> {
    try {
      await this.post("/auth/user/mfa", {
        code,
      });
    } catch (error: any) {
      throw new Error(error.message || "Failed to verify MFA");
    }
  }

  async generatePAT(displayName: string): Promise<{ token: string }> {
    try {
      const response = await this.post<any>("/auth/pat", {
        displayName,
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Failed to generate PAT");
    }
  }

  async verifyToken(token: string): Promise<{ valid: boolean }> {
    try {
      const response = await this.post<any>("/auth/token/verify", {
        token,
      });
      return response;
    } catch (error: any) {
      return { valid: false };
    }
  }

  async refreshToken(tokenFromUrl?: string): Promise<string | null> {
    try {
      // It will use the refresh token from body if provided, else from cookies since credentials: "include"
      const body = tokenFromUrl ? { refreshToken: tokenFromUrl } : undefined;
      const response = await this.post<any>("/auth/token", body, { _retry: true });
      const newToken = response.session?.accessToken;
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
  async get<T>(url: string, config?: FetchOptions): Promise<T> {
    return this.fetchWithAuth<T>(url, { ...config, method: "GET" });
  }

  async post<T>(url: string, data?: any, config?: FetchOptions): Promise<T> {
    return this.fetchWithAuth<T>(url, { ...config, method: "POST", body: data });
  }

  async put<T>(url: string, data?: any, config?: FetchOptions): Promise<T> {
    return this.fetchWithAuth<T>(url, { ...config, method: "PUT", body: data });
  }

  async delete<T>(url: string, config?: FetchOptions): Promise<T> {
    return this.fetchWithAuth<T>(url, { ...config, method: "DELETE" });
  }

  // Token management
  private storeAccessToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("sopo_access_token", token);
      document.cookie = "sopo_is_auth=true; path=/; max-age=2592000; SameSite=Lax";
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
      document.cookie = "sopo_is_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }
  }
}

// Export singleton instance
export const apiClient = new APIClient();

export default APIClient;
