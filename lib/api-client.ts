"use client";

interface AuthSession {
  accessToken: string;
  refreshToken?: string;
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
  };
}

export interface Gateway {
  id?: string;
  name: string;
  description?: string;
  is_active: boolean;
  mode?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GatewayCollection {
  id?: string;
  name: string;
  description?: string;
  is_active: boolean;
  gateway_id?: string;
}

export interface Service {
  id?: string;
  name: string;
  gateway_id: string;
  protocol: string;
  lb_policy: string;
  collection_id?: string;
  health_check_path?: string;
  health_check_interval?: string;
  health_check_timeout?: string;
  health_check_fail_threshold?: number;
  health_check_pass_threshold?: number;
}

export interface ServiceTarget {
  id?: string;
  service_id: string;
  url: string;
  weight?: number;
}

export interface GatewayRoute {
  id?: string;
  gateway_id: string;
  service_id?: string;
  path: string;
  target_path?: string;
  method: string;
  protocol?: string;
  timeout?: string;
  collection_id?: string;
  is_aggregate?: boolean;
  retry_max_attempts?: number;
  retry_on_status?: string[];
  aggregate_merge_strategy?: string;
  aggregate_timeout?: string;
  allow_partial_failure?: boolean;
  websocket?: boolean;
}

export interface RouteSubRequest {
  id?: string;
  route_id: string;
  key_name: string;
  service_id: string;
  target_path: string;
  method?: string;
  is_required?: boolean;
  timeout?: string;
}

export interface GatewayPlugin {
  id?: string;
  name: string;
  phase: string;
  gateway_id?: string;
  route_id?: string;
  service_id?: string;
  enabled?: boolean;
  is_enabled?: boolean;
  fail_open?: boolean;
  sort_order?: number;
  config?: any;
  plugin_config?: any;
}

export interface RequestLog {
  timestamp: string;
  request_id: string;
  gateway_id: string;
  slug: string;
  method: string;
  path: string;
  status_code: number;
  latency_ms: number;
  client_ip: string;
  upstream_name: string;
  mode: string;
  user_agent: string;
  content_length: number;
}

export interface HourlyMetric {
  timestamp_hour: string;
  gateway_id: string;
  slug: string;
  total_requests: number;
  total_errors: number;
  sum_latency_ms: number;
  min_latency_ms: number;
  max_latency_ms: number;
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
         this.storeAccessToken(session.accessToken, session.refreshToken);
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
         this.storeAccessToken(session.accessToken, session.refreshToken);
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
      // The backend doesn't have a PUT /auth/user endpoint.
      // Profile display name/locale are managed by Nhost Auth directly.
      // The slug is managed separately via /api/v1/user-profiles.
      // Just return the current profile after "updating".
      const profile = await this.getProfile();
      return profile;
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
      let rToken = tokenFromUrl;
      if (!rToken && typeof window !== "undefined") {
        rToken = localStorage.getItem("sopo_refresh_token") || undefined;
      }
      
      // If we don't have a refresh token, we can't refresh
      if (!rToken) {
        this.clearAccessToken();
        return null;
      }

      const url = `${this.baseURL}/auth/token`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ refreshToken: rToken })
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      const session = data.session || data;
      const newToken = session?.accessToken;
      
      if (newToken) {
        this.storeAccessToken(newToken, session?.refreshToken);
        return newToken;
      }
      return null;
    } catch (error) {
      // Silently fail and clear token to prevent console spam
      this.clearAccessToken();
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

  async patch<T>(url: string, data?: any, config?: FetchOptions): Promise<T> {
    return this.fetchWithAuth<T>(url, { ...config, method: "PATCH", body: data });
  }

  // API Gateway CRUD operations
  private createCrudClient<T>(basePath: string) {
    return {
      getAll: () => this.get<T[]>(basePath),
      getById: async (id: string) => {
        const allItems = await this.get<T[]>(basePath);
        const item = allItems.find((item: any) => item.id === id);
        if (!item) throw new Error(`Item with id ${id} not found`);
        return item as T;
      },
      create: (data: Partial<T>) => this.post<T>(basePath, data),
      update: (id: string, data: Partial<T>) => this.patch<T>(`${basePath}/${id}`, data),
      delete: (id: string) => this.delete<void>(`${basePath}/${id}`)
    };
  }

  public readonly gateways = this.createCrudClient<Gateway>('/api/v1/gateways');
  public readonly collections = this.createCrudClient<GatewayCollection>('/api/v1/collections');

  // Custom client for services to handle mapping health_check_* to hc_*
  public readonly services = {
    getAll: async () => {
      const items = await this.get<any[]>('/api/v1/services');
      return items.map(this.mapServiceFromServer);
    },
    getById: async (id: string) => {
      const allItems = await this.get<any[]>('/api/v1/services');
      const item = allItems.find((item: any) => item.id === id);
      if (!item) throw new Error(`Item with id ${id} not found`);
      return this.mapServiceFromServer(item);
    },
    create: async (data: Partial<Service>) => {
      return this.post<Service>('/api/v1/services', this.mapServiceToServer(data));
    },
    update: async (id: string, data: Partial<Service>) => {
      return this.patch<Service>(`/api/v1/services/${id}`, this.mapServiceToServer(data));
    },
    delete: (id: string) => this.delete<void>(`/api/v1/services/${id}`)
  };

  private mapServiceToServer(data: any): any {
    const {
      health_check_path, health_check_interval, health_check_timeout,
      health_check_fail_threshold, health_check_pass_threshold,
      collection_id,
      ...rest
    } = data;
    
    return {
      ...rest,
      ...(collection_id && collection_id !== "" && { collection_id }),
      ...(health_check_path && health_check_path !== "" && { hc_path: health_check_path }),
      ...(health_check_interval && health_check_interval !== "" && { hc_interval: health_check_interval }),
      ...(health_check_timeout && health_check_timeout !== "" && { hc_timeout: health_check_timeout }),
      ...(health_check_fail_threshold !== undefined && health_check_fail_threshold !== 0 && { hc_fail_threshold: health_check_fail_threshold }),
      ...(health_check_pass_threshold !== undefined && health_check_pass_threshold !== 0 && { hc_pass_threshold: health_check_pass_threshold }),
    };
  }

  private mapServiceFromServer(item: any): Service {
    return {
      ...item,
      health_check_path: item.hc_path,
      health_check_interval: item.hc_interval,
      health_check_timeout: item.hc_timeout,
      health_check_fail_threshold: item.hc_fail_threshold,
      health_check_pass_threshold: item.hc_pass_threshold,
    };
  }
  public readonly serviceTargets = this.createCrudClient<ServiceTarget>('/api/v1/service-targets');
  
  public readonly gatewayRoutes = {
    getAll: async () => {
      const items = await this.get<any[]>('/api/v1/gateway-routes');
      return items.map(this.mapRouteFromServer);
    },
    getById: async (id: string) => {
      const allItems = await this.get<any[]>('/api/v1/gateway-routes');
      const item = allItems.find((item: any) => item.id === id);
      if (!item) throw new Error(`Item with id ${id} not found`);
      return this.mapRouteFromServer(item);
    },
    create: async (data: Partial<GatewayRoute>) => {
      return this.post<GatewayRoute>('/api/v1/gateway-routes', this.mapRouteToServer(data));
    },
    update: async (id: string, data: Partial<GatewayRoute>) => {
      return this.patch<GatewayRoute>(`/api/v1/gateway-routes/${id}`, this.mapRouteToServer(data));
    },
    delete: (id: string) => this.delete<void>(`/api/v1/gateway-routes/${id}`)
  };

  private mapRouteToServer(data: any): any {
    const {
      service_id, collection_id, allow_partial_failure,
      ...rest
    } = data;
    
    return {
      ...rest,
      ...(service_id && service_id !== "" && { service_id }),
      ...(collection_id && collection_id !== "" && { collection_id }),
      aggregate_allow_partial_failure: allow_partial_failure
    };
  }

  private mapRouteFromServer(item: any): GatewayRoute {
    return {
      ...item,
      allow_partial_failure: item.aggregate_allow_partial_failure
    };
  }
  public readonly routeSubRequests = this.createCrudClient<RouteSubRequest>('/api/v1/route-sub-requests');
  public readonly gatewayPlugins = this.createCrudClient<GatewayPlugin>('/api/v1/gateway-plugins');
  
  public readonly userProfiles = {
    getAll: () => this.get<any[]>('/api/v1/user-profiles'),
    create: (data: { slug: string }) => this.post<any>('/api/v1/user-profiles', data),
    update: (data: { slug: string }) => this.patch<any>('/api/v1/user-profiles', data),
    delete: () => this.delete<void>('/api/v1/user-profiles')
  };

  public readonly logs = {
    getRequests: () => this.get<RequestLog[]>('/api/v1/logs/requests'),
    getHourlyMetrics: () => this.get<HourlyMetric[]>('/api/v1/logs/hourly-metrics'),
    getHourlyMetricsMV: () => this.get<HourlyMetric[]>('/api/v1/logs/hourly-metrics-mv'),
  };
  // Token management
  private storeAccessToken(token: string, refreshToken?: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("sopo_access_token", token);
      if (refreshToken) {
        localStorage.setItem("sopo_refresh_token", refreshToken);
      }
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
      localStorage.removeItem("sopo_refresh_token");
      document.cookie = "sopo_is_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }
  }
}

// Export singleton instance
export const apiClient = new APIClient();

export default APIClient;
