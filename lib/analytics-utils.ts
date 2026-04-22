import { KPIStatus, LogEntry, LogLevel, HttpMethod } from "@/types/layout";

export const TREND_STYLES = {
  positive: "bg-green-500/10 text-green-400",
  negative: "bg-red-500/10 text-red-400",
  neutral: "bg-gray-800 text-gray-400",
};

export const STATUS_STYLES = {
  healthy: "bg-green-500/10 text-green-400",
  warning: "bg-yellow-500/10 text-yellow-400",
  critical: "bg-red-500/10 text-red-400",
};

export const LOG_LEVEL_STYLES = {
  INFO: "bg-blue-500/10 text-blue-400",
  WARN: "bg-yellow-500/10 text-yellow-400",
  ERROR: "bg-red-500/10 text-red-400",
  DEBUG: "bg-gray-800 text-gray-400",
  SUCCESS: "bg-green-500/10 text-green-400",
};

export const STATUS_CODE_COLORS: Record<number, string> = {
  200: "text-green-400",
  201: "text-green-400",
  400: "text-yellow-400",
  401: "text-yellow-400",
  403: "text-red-400",
  404: "text-yellow-400",
  500: "text-red-400",
  502: "text-red-400",
};

export function getKPIStatus(current: number, target: number, lowerIsBetter: boolean): KPIStatus {
  if (lowerIsBetter) {
    if (current <= target) return 'healthy';
    if (current <= target * 1.2) return 'warning';
    return 'critical';
  } else {
    if (current >= target) return 'healthy';
    if (current >= target * 0.8) return 'warning';
    return 'critical';
  }
}

const MOCK_PATHS = ["/api/v1/users", "/api/v1/auth/login", "/api/v1/products", "/api/v2/orders", "/api/v1/analytics"];
const MOCK_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const MOCK_APIS = ["User Service", "Auth Gateway", "Inventory API", "Order Manager"];

export function generateLogEntry(): LogEntry {
  const statusCode = [200, 201, 200, 400, 401, 500, 200, 200][Math.floor(Math.random() * 8)];
  let level: LogLevel = 'INFO';
  if (statusCode >= 500) level = 'ERROR';
  else if (statusCode >= 400) level = 'WARN';
  else if (statusCode === 201) level = 'SUCCESS';

  return {
    id: Math.random().toString(36).substring(2, 10),
    timestamp: new Date().toISOString(),
    level,
    method: MOCK_METHODS[Math.floor(Math.random() * MOCK_METHODS.length)],
    path: MOCK_PATHS[Math.floor(Math.random() * MOCK_PATHS.length)],
    statusCode,
    latency: Math.floor(Math.random() * 500) + 20,
    apiName: MOCK_APIS[Math.floor(Math.random() * MOCK_APIS.length)],
    clientIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
    requestId: Math.random().toString(36).substring(2, 10).toUpperCase(),
  };
}
