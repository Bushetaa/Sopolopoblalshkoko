"use client";

export type UserRole = "owner" | "admin" | "developer" | "viewer" | "billing";
export type UserStatus = "active" | "inactive" | "pending";
export type PermissionAction = "read" | "write" | "delete" | "admin";
export type PermissionResource =
  | "apis"
  | "gateways"
  | "workspaces"
  | "settings"
  | "billing";

export interface Permission {
  resource: PermissionResource;
  actions: PermissionAction[];
}

export interface Workspace {
  id: string;
  name: string;
  color: string;
}

export interface UserApiKey {
  id: string;
  name: string;
  createdAt: Date;
  lastUsedAt: Date | null;
}

export interface UserActivity {
  id: string;
  label: string;
  occurredAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  workspaceIds: string[];
  permissions: Permission[];
  lastActive: Date | null;
  joinedAt: Date;
  invitedBy?: string;
  mfaEnabled: boolean;
  apiKeys: UserApiKey[];
}

export interface InviteFormData {
  emails: string[];
  role: UserRole;
  workspaceIds: string[];
  message?: string;
}

export interface UserStats {
  totalMembers: number;
  activeMembers: number;
  pendingInvites: number;
  adminCount: number;
  mfaEnabled: number;
  mfaPercentage: number;
}

export interface RoleConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  description: string;
  permissions: Record<PermissionResource, PermissionAction[]>;
  isEditable: boolean;
  maxCount?: number;
}

export const MOCK_WORKSPACES: Workspace[] = [
  { id: "ws_1", name: "Core Platform", color: "bg-blue-400" },
  { id: "ws_2", name: "Billing APIs", color: "bg-emerald-400" },
  { id: "ws_3", name: "Gateway Ops", color: "bg-amber-400" },
  { id: "ws_4", name: "Sandbox", color: "bg-fuchsia-400" },
  { id: "ws_5", name: "Partner Hub", color: "bg-cyan-400" },
];

export const ROLES: Record<UserRole, RoleConfig> = {
  owner: {
    label: "Owner",
    color: "text-purple-300",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    description: "Full access including billing, settings, and team management.",
    permissions: {
      apis: ["read", "write", "delete", "admin"],
      gateways: ["read", "write", "delete", "admin"],
      workspaces: ["read", "write", "delete", "admin"],
      settings: ["read", "write", "admin"],
      billing: ["read", "write", "admin"],
    },
    isEditable: false,
    maxCount: 1,
  },
  admin: {
    label: "Admin",
    color: "text-blue-300",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    description: "Full operational access except ownership transfer.",
    permissions: {
      apis: ["read", "write", "delete"],
      gateways: ["read", "write", "delete"],
      workspaces: ["read", "write", "delete"],
      settings: ["read", "write"],
      billing: ["read"],
    },
    isEditable: true,
  },
  developer: {
    label: "Developer",
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    description: "Can build and edit APIs within assigned workspaces.",
    permissions: {
      apis: ["read", "write"],
      gateways: ["read", "write"],
      workspaces: ["read"],
      settings: ["read"],
      billing: [],
    },
    isEditable: true,
  },
  viewer: {
    label: "Viewer",
    color: "text-slate-300",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    description: "Read-only access to assigned resources.",
    permissions: {
      apis: ["read"],
      gateways: ["read"],
      workspaces: ["read"],
      settings: [],
      billing: [],
    },
    isEditable: true,
  },
  billing: {
    label: "Billing",
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    description: "Access to subscription and billing only.",
    permissions: {
      apis: [],
      gateways: [],
      workspaces: [],
      settings: ["read"],
      billing: ["read", "write"],
    },
    isEditable: true,
  },
};

function buildPermissions(role: UserRole): Permission[] {
  return Object.entries(ROLES[role].permissions).map(([resource, actions]) => ({
    resource: resource as PermissionResource,
    actions,
  }));
}

function createApiKeys(userId: string, count: number): UserApiKey[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${userId}_key_${index + 1}`,
    name: `Server Key ${index + 1}`,
    createdAt: new Date(2025, index, 10 + index),
    lastUsedAt: index % 2 === 0 ? new Date(Date.now() - (index + 2) * 86400000) : null,
  }));
}

function createUser(input: Omit<User, "permissions">): User {
  return {
    ...input,
    permissions: buildPermissions(input.role),
  };
}

export const MOCK_USERS: User[] = [
  createUser({
    id: "user_1",
    name: "Alex Thompson",
    email: "alex@company.com",
    role: "owner",
    status: "active",
    workspaceIds: ["ws_1", "ws_2", "ws_3", "ws_4", "ws_5"],
    mfaEnabled: true,
    lastActive: new Date(),
    joinedAt: new Date("2023-01-15"),
    apiKeys: createApiKeys("user_1", 3),
  }),
  createUser({
    id: "user_2",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "admin",
    status: "active",
    workspaceIds: ["ws_1", "ws_2", "ws_3"],
    mfaEnabled: true,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    joinedAt: new Date("2023-03-20"),
    apiKeys: createApiKeys("user_2", 2),
  }),
  createUser({
    id: "user_3",
    name: "Marcus Chen",
    email: "marcus@company.com",
    role: "developer",
    status: "active",
    workspaceIds: ["ws_1", "ws_3"],
    mfaEnabled: false,
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
    joinedAt: new Date("2023-06-10"),
    apiKeys: createApiKeys("user_3", 5),
  }),
  createUser({
    id: "user_4",
    name: "Emily Rodriguez",
    email: "emily@company.com",
    role: "developer",
    status: "active",
    workspaceIds: ["ws_2", "ws_4"],
    mfaEnabled: true,
    lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    joinedAt: new Date("2023-09-05"),
    apiKeys: createApiKeys("user_4", 2),
  }),
  createUser({
    id: "user_5",
    name: "James Wilson",
    email: "james@company.com",
    role: "viewer",
    status: "active",
    workspaceIds: ["ws_1"],
    mfaEnabled: false,
    lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    joinedAt: new Date("2024-01-12"),
    apiKeys: [],
  }),
  createUser({
    id: "user_6",
    name: "Priya Patel",
    email: "priya@company.com",
    role: "developer",
    status: "pending",
    workspaceIds: [],
    mfaEnabled: false,
    lastActive: null,
    joinedAt: new Date("2024-04-10"),
    invitedBy: "user_2",
    apiKeys: [],
  }),
  createUser({
    id: "user_7",
    name: "David Kim",
    email: "david@company.com",
    role: "billing",
    status: "active",
    workspaceIds: [],
    mfaEnabled: true,
    lastActive: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    joinedAt: new Date("2023-11-30"),
    apiKeys: [],
  }),
  createUser({
    id: "user_8",
    name: "Olivia Brown",
    email: "olivia@company.com",
    role: "admin",
    status: "active",
    workspaceIds: ["ws_3", "ws_5"],
    mfaEnabled: true,
    lastActive: new Date(Date.now() - 60 * 60 * 1000),
    joinedAt: new Date("2023-04-18"),
    apiKeys: createApiKeys("user_8", 4),
  }),
  createUser({
    id: "user_9",
    name: "Tom Nakamura",
    email: "tom@company.com",
    role: "viewer",
    status: "inactive",
    workspaceIds: ["ws_2"],
    mfaEnabled: false,
    lastActive: new Date("2024-01-01"),
    joinedAt: new Date("2023-08-22"),
    apiKeys: [],
  }),
  createUser({
    id: "user_10",
    name: "Anna Mueller",
    email: "anna@company.com",
    role: "developer",
    status: "pending",
    workspaceIds: [],
    mfaEnabled: false,
    lastActive: null,
    joinedAt: new Date("2024-04-15"),
    invitedBy: "user_1",
    apiKeys: [],
  }),
];

export function getUserStats(users: User[]): UserStats {
  const totalMembers = users.length;
  const activeMembers = users.filter((user) => user.status === "active").length;
  const pendingInvites = users.filter((user) => user.status === "pending").length;
  const adminCount = users.filter((user) => user.role === "admin" || user.role === "owner").length;
  const mfaEnabled = users.filter((user) => user.mfaEnabled).length;
  const mfaPercentage = totalMembers === 0 ? 0 : Math.round((mfaEnabled / totalMembers) * 100);

  return {
    totalMembers,
    activeMembers,
    pendingInvites,
    adminCount,
    mfaEnabled,
    mfaPercentage,
  };
}

export function buildInvitedUsers(data: InviteFormData, invitedBy = "user_1"): User[] {
  return data.emails.map((email, index) =>
    createUser({
      id: `user_${Date.now()}_${index + 1}`,
      name: email.split("@")[0]
        .split(/[._-]/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      email,
      role: data.role,
      status: "pending",
      workspaceIds: data.workspaceIds,
      mfaEnabled: false,
      lastActive: null,
      joinedAt: new Date(),
      invitedBy,
      apiKeys: [],
    })
  );
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getRolePermissions(role: UserRole) {
  return buildPermissions(role);
}
