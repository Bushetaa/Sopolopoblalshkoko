"use client";

import React, { useMemo, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { AlertTriangle, Clock3, KeyRound, ShieldCheck, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUsers } from "@/context/UsersContext";
import { MOCK_WORKSPACES, User } from "@/lib/users-mock";
import RoleBadge from "./RoleBadge";
import UserStatusBadge from "./UserStatusBadge";

function isSoleAdmin(user: User, users: User[]) {
  if (user.role !== "admin" && user.role !== "owner") {
    return false;
  }

  return (
    users.filter(
      (member) => member.status === "active" && (member.role === "admin" || member.role === "owner")
    ).length <= 1
  );
}

export default function UserDetailsDrawer({
  user,
  open,
  onOpenChange,
  onEdit,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}) {
  const { users, removeUser } = useUsers();
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  const activities = useMemo(() => {
    if (!user) {
      return [];
    }

    return [
      {
        id: `${user.id}_activity_1`,
        label: user.status === "pending" ? "Invitation sent to team member" : "Logged in from dashboard",
        occurredAt: user.lastActive ?? user.joinedAt,
      },
      {
        id: `${user.id}_activity_2`,
        label: "Created API deployment draft",
        occurredAt: new Date(user.joinedAt.getTime() + 86400000 * 4),
      },
      {
        id: `${user.id}_activity_3`,
        label: "Updated gateway configuration",
        occurredAt: new Date(user.joinedAt.getTime() + 86400000 * 10),
      },
      {
        id: `${user.id}_activity_4`,
        label: user.invitedBy ? `Invited by ${user.invitedBy}` : "Joined organization",
        occurredAt: user.joinedAt,
      },
    ].sort((a, b) => +b.occurredAt - +a.occurredAt);
  }, [user]);

  if (!user) {
    return null;
  }

  const userWorkspaces = user.workspaceIds.map((workspaceId) => {
    return (
      MOCK_WORKSPACES.find((workspace) => workspace.id === workspaceId) ?? {
        id: workspaceId,
        name: "Unknown Workspace",
        color: "bg-slate-500",
      }
    );
  });

  const soleAdmin = isSoleAdmin(user, users);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full border-gray-800 bg-gray-900 p-0 text-gray-100 sm:max-w-[400px]"
        >
          <SheetHeader className="border-b border-gray-800 px-6 py-5 text-left">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-lg font-bold text-blue-200">
                {user.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <SheetTitle className="truncate text-xl text-gray-50">{user.name}</SheetTitle>
                <SheetDescription className="truncate text-sm text-gray-500">
                  {user.email}
                </SheetDescription>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <RoleBadge role={user.role} />
                  <UserStatusBadge status={user.status} />
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6 overflow-y-auto px-6 py-5">
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                <Clock3 className="h-3.5 w-3.5 text-blue-300" />
                Status & Activity
              </div>
              <div className="grid gap-3">
                <div className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Last Active</p>
                  <p className="mt-1 text-sm text-gray-100">
                    {user.lastActive ? `${formatDistanceToNow(user.lastActive, { addSuffix: true })}` : "Never"}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Member Since</p>
                  <p className="mt-1 text-sm text-gray-100">{format(user.joinedAt, "MMMM yyyy")}</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">MFA</p>
                  <p className="mt-1 text-sm text-gray-100">
                    {user.mfaEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                <Users className="h-3.5 w-3.5 text-emerald-300" />
                Workspace Access
              </div>
              {userWorkspaces.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-800 bg-gray-950 px-4 py-4 text-sm text-gray-500">
                  No workspaces assigned.
                </div>
              ) : (
                <div className="space-y-2">
                  {userWorkspaces.map((workspace) => (
                    <div
                      key={workspace.id}
                      className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-950 px-4 py-3"
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${workspace.color}`} />
                      <span className="text-sm text-gray-200">{workspace.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
                Activity Timeline
              </div>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3">
                    <p className="text-sm text-gray-100">{activity.label}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatDistanceToNow(activity.occurredAt, { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                <KeyRound className="h-3.5 w-3.5 text-fuchsia-300" />
                API Keys
              </div>
              {user.apiKeys.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-800 bg-gray-950 px-4 py-4 text-sm text-gray-500">
                  No API keys yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {user.apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3"
                    >
                      <p className="text-sm font-medium text-gray-100">{apiKey.name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Last used {apiKey.lastUsedAt ? format(apiKey.lastUsedAt, "MMM d, yyyy") : "Never"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {soleAdmin ? (
              <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                Cannot remove the sole admin from the organization.
              </div>
            ) : null}
          </div>

          <div className="border-t border-gray-800 px-6 py-4">
            <div className="flex flex-col gap-3">
              <Button onClick={onEdit} className="bg-blue-600 text-white hover:bg-blue-500">
                Edit Permissions
              </Button>
              <Button variant="outline" className="border-gray-700 bg-gray-950 text-gray-200">
                Send Reset Email
              </Button>
              <Button
                variant="outline"
                disabled={soleAdmin}
                onClick={() => setConfirmRemoveOpen(true)}
                className="border-rose-500/20 bg-rose-500/10 text-rose-200"
              >
                Remove from Organization
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmRemoveOpen} onOpenChange={setConfirmRemoveOpen}>
        <AlertDialogContent className="border-gray-800 bg-gray-900 text-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              This removes {user.name} from the organization. This action cannot be undone in v1.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 bg-gray-950 text-gray-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                removeUser(user.id);
                onOpenChange(false);
              }}
              className="bg-rose-600 text-white hover:bg-rose-500"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
