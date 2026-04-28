"use client";

import React, { createContext, useContext, useMemo, useReducer } from "react";
import {
  buildInvitedUsers,
  getRolePermissions,
  getUserStats,
  InviteFormData,
  MOCK_USERS,
  User,
  UserRole,
  UserStats,
  UserStatus,
} from "@/lib/users-mock";

interface UsersState {
  users: User[];
}

type UsersAction =
  | { type: "invite"; payload: User[] }
  | { type: "updateRole"; payload: { userId: string; role: UserRole } }
  | { type: "updateWorkspaces"; payload: { userId: string; workspaceIds: string[] } }
  | { type: "updateStatus"; payload: { userId: string; status: UserStatus } }
  | { type: "updateMfa"; payload: { userId: string; mfaEnabled: boolean } }
  | { type: "remove"; payload: { userId: string } };

interface UsersContextValue {
  users: User[];
  stats: UserStats;
  inviteUser: (data: InviteFormData) => Promise<User>;
  getUserById: (id: string) => User | undefined;
  getUsersByWorkspace: (workspaceId: string) => User[];
  getUsersByRole: (role: UserRole) => User[];
  updateUserRole: (userId: string, role: UserRole) => void;
  updateUserWorkspaces: (userId: string, workspaceIds: string[]) => void;
  updateUserStatus: (userId: string, status: UserStatus) => void;
  updateUserMfa: (userId: string, mfaEnabled: boolean) => void;
  removeUser: (userId: string) => void;
  activeUsersCount: number;
  pendingInvitesCount: number;
}

const UsersContext = createContext<UsersContextValue | null>(null);

function usersReducer(state: UsersState, action: UsersAction): UsersState {
  switch (action.type) {
    case "invite":
      return { users: [...action.payload, ...state.users] };
    case "updateRole":
      return {
        users: state.users.map((user) =>
          user.id === action.payload.userId
            ? {
                ...user,
                role: action.payload.role,
                permissions: getRolePermissions(action.payload.role),
              }
            : user
        ),
      };
    case "updateWorkspaces":
      return {
        users: state.users.map((user) =>
          user.id === action.payload.userId
            ? { ...user, workspaceIds: action.payload.workspaceIds }
            : user
        ),
      };
    case "updateStatus":
      return {
        users: state.users.map((user) =>
          user.id === action.payload.userId ? { ...user, status: action.payload.status } : user
        ),
      };
    case "updateMfa":
      return {
        users: state.users.map((user) =>
          user.id === action.payload.userId
            ? { ...user, mfaEnabled: action.payload.mfaEnabled }
            : user
        ),
      };
    case "remove":
      return { users: state.users.filter((user) => user.id !== action.payload.userId) };
    default:
      return state;
  }
}

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(usersReducer, { users: MOCK_USERS });

  const stats = useMemo(() => getUserStats(state.users), [state.users]);

  const value = useMemo<UsersContextValue>(
    () => ({
      users: state.users,
      stats,
      inviteUser: async (data) => {
        const createdUsers = buildInvitedUsers(data);
        dispatch({ type: "invite", payload: createdUsers });
        return createdUsers[0];
      },
      getUserById: (id) => state.users.find((user) => user.id === id),
      getUsersByWorkspace: (workspaceId) =>
        state.users.filter((user) => user.workspaceIds.includes(workspaceId)),
      getUsersByRole: (role) => state.users.filter((user) => user.role === role),
      updateUserRole: (userId, role) =>
        dispatch({ type: "updateRole", payload: { userId, role } }),
      updateUserWorkspaces: (userId, workspaceIds) =>
        dispatch({ type: "updateWorkspaces", payload: { userId, workspaceIds } }),
      updateUserStatus: (userId, status) =>
        dispatch({ type: "updateStatus", payload: { userId, status } }),
      updateUserMfa: (userId, mfaEnabled) =>
        dispatch({ type: "updateMfa", payload: { userId, mfaEnabled } }),
      removeUser: (userId) => dispatch({ type: "remove", payload: { userId } }),
      activeUsersCount: stats.activeMembers,
      pendingInvitesCount: stats.pendingInvites,
    }),
    [state.users, stats]
  );

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

export function useUsers() {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }

  return context;
}
