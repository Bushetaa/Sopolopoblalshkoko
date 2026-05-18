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

      // Hasura Auth may return the session nested under 'session' or at the top level
      const session: AuthSession = response.session || response;
      const accessToken = session.accessToken || response.accessToken;
      if (accessToken) {
         this.storeAccessToken(accessToken);
         session.accessToken = accessToken;
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
      const accessToken = session.accessToken || response.accessToken;
      if (accessToken) {
         this.storeAccessToken(accessToken);
         session.accessToken = accessToken;
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

  async updateProfile(changes: Partial<AuthSession["user"]>): Promise<AuthSession["user"]> {
    try {
      // Get current profile first to preserve fields like email and roles
      const currentProfile = await this.getProfile();
      
      const response = await this.patch<any>("/auth/user/profile", { changes });
      const updatedUser = response?.updateUsers?.returning?.[0];
      
      if (updatedUser) {
         this.profilePromise = null;
         return { ...currentProfile, ...updatedUser };
      }
      return currentProfile;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update profile");
    }
  }

  async getUserProviders(): Promise<any[]> {
    try {
      const response = await this.get<any>("/auth/user/providers");
      return response?.authUserProviders || [];
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch connected providers");
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
      // Hasura Auth /auth/token returns { accessToken, accessTokenExpiresIn, refreshToken }
      // at the top level, NOT nested under 'session'
      const newToken = response.accessToken || response.session?.accessToken;
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
      const mappedData = this.mapServiceToServer(data);
      // Explicitly add back for creation
      if (data.collection_id && data.collection_id !== "none") {
        mappedData.collection_id = data.collection_id;
      }
      if (data.gateway_id) {
        mappedData.gateway_id = data.gateway_id;
      }
      return this.post<Service>('/api/v1/services', mappedData);
    },
    update: async (id: string, data: Partial<Service>) => {
      const mappedData = this.mapServiceToServer(data);
      // mappedData is already cleaned by mapServiceToServer
      return this.patch<Service>(`/api/v1/services/${id}`, mappedData);
    },
    delete: (id: string) => this.delete<void>(`/api/v1/services/${id}`)
  };

  private mapServiceToServer(data: any): any {
    const mapped: any = {};
    
    // Whitelist allowed fields for service update/create
    if (data.name) mapped.name = data.name;
    if (data.protocol) mapped.protocol = data.protocol;
    if (data.lb_policy) mapped.lb_policy = data.lb_policy;
    
    // Health check mappings
    if (data.health_check_path) mapped.hc_path = data.health_check_path;
    if (data.health_check_interval) mapped.hc_interval = data.health_check_interval;
    if (data.health_check_timeout) mapped.hc_timeout = data.health_check_timeout;
    if (data.health_check_fail_threshold !== undefined) mapped.hc_fail_threshold = data.health_check_fail_threshold;
    if (data.health_check_pass_threshold !== undefined) mapped.hc_pass_threshold = data.health_check_pass_threshold;

    console.log("Mapped Service Data:", mapped);
    return mapped;
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
      const mappedData = this.mapRouteToServer(data);
      // Explicitly add back for creation
      if (data.gateway_id) mappedData.gateway_id = data.gateway_id;
      if (data.service_id) mappedData.service_id = data.service_id;
      if (data.collection_id && data.collection_id !== "none") {
        mappedData.collection_id = data.collection_id;
      }
      return this.post<GatewayRoute>('/api/v1/gateway-routes', mappedData);
    },
    update: async (id: string, data: Partial<GatewayRoute>) => {
      const mappedData = this.mapRouteToServer(data);
      // mappedData is already cleaned by mapRouteToServer
      return this.patch<GatewayRoute>(`/api/v1/gateway-routes/${id}`, mappedData);
    },
    delete: (id: string) => this.delete<void>(`/api/v1/gateway-routes/${id}`)
  };

  private mapRouteToServer(data: any): any {
    const mapped: any = {};
    
    // Whitelist allowed fields for route update/create
    if (data.path) mapped.path = data.path;
    if (data.target_path) mapped.target_path = data.target_path;
    if (data.method) mapped.method = data.method;
    if (data.protocol) mapped.protocol = data.protocol;
    if (data.timeout) mapped.timeout = data.timeout;
    if (data.is_aggregate !== undefined) mapped.is_aggregate = data.is_aggregate;
    if (data.retry_max_attempts !== undefined) mapped.retry_max_attempts = data.retry_max_attempts;
    if (data.retry_on_status) mapped.retry_on_status = data.retry_on_status;
    if (data.aggregate_merge_strategy) mapped.aggregate_merge_strategy = data.aggregate_merge_strategy;
    if (data.aggregate_timeout) mapped.aggregate_timeout = data.aggregate_timeout;
    if (data.allow_partial_failure !== undefined) {
      mapped.aggregate_allow_partial_failure = data.allow_partial_failure;
    }
    if (data.websocket !== undefined) mapped.websocket = data.websocket;

    console.log("Mapped Route Data:", mapped);
    return mapped;
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
