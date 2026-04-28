"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, KeyRound, ShieldCheck, UserCog } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/context/UsersContext";
import { MOCK_WORKSPACES, ROLES, User, UserRole } from "@/lib/users-mock";
import PermissionsMatrix from "./PermissionsMatrix";
import RoleBadge from "./RoleBadge";

function isSoleAdmin(user: User, users: User[]) {
  if (user.role !== "admin" && user.role !== "owner") {
    return false;
  }

  const activeAdmins = users.filter(
    (member) => member.status === "active" && (member.role === "admin" || member.role === "owner")
  );

  return activeAdmins.length <= 1;
}

export default function EditUserModal({
  user,
  open,
  onOpenChange,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { users, updateUserRole, updateUserStatus, updateUserWorkspaces, updateUserMfa } = useUsers();
  const [selectedRole, setSelectedRole] = useState<UserRole>("developer");
  const [workspaceIds, setWorkspaceIds] = useState<string[]>([]);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setSelectedRole(user.role);
    setWorkspaceIds(user.workspaceIds);
    setMfaRequired(user.mfaEnabled);
    setError("");
  }, [user]);

  const soleAdmin = useMemo(() => (user ? isSoleAdmin(user, users) : false), [user, users]);

  if (!user) {
    return null;
  }

  const canEditRole = ROLES[user.role].isEditable;

  const handleSave = () => {
    updateUserRole(user.id, selectedRole);
    updateUserWorkspaces(user.id, workspaceIds);
    updateUserMfa(user.id, mfaRequired);
    onOpenChange(false);
  };

  const handleDeactivate = () => {
    if (soleAdmin) {
      setError("Cannot deactivate the sole admin.");
      return;
    }

    updateUserStatus(user.id, "inactive");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-gray-800 bg-gray-900 p-0 text-gray-100">
        <DialogHeader className="border-b border-gray-800 px-6 py-5">
          <DialogTitle className="flex items-center gap-3 text-xl text-gray-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-200">
              {user.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <span>Edit Member</span>
              <DialogDescription className="mt-1 text-gray-500">
                Manage role, workspace access, and API keys for {user.name}.
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-950 text-gray-400">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="access">Access</TabsTrigger>
              <TabsTrigger value="keys">API Keys</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-5 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Display Name</p>
                  <p className="mt-2 text-sm text-gray-100">{user.name}</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Email</p>
                  <p className="mt-2 text-sm text-gray-100">{user.email}</p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-blue-300" />
                  <p className="text-sm font-medium text-gray-100">Organization Role</p>
                </div>

                <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-start">
                  <Select
                    value={selectedRole}
                    onValueChange={(value) => setSelectedRole(value as UserRole)}
                    disabled={!canEditRole}
                  >
                    <SelectTrigger className="border-gray-800 bg-gray-900 text-gray-100">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-800 bg-gray-900 text-gray-100">
                      {Object.entries(ROLES).map(([role, config]) => (
                        <SelectItem
                          key={role}
                          value={role}
                          disabled={role === "owner" && user.role !== "owner"}
                          className="focus:bg-gray-800 focus:text-white"
                        >
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                    <RoleBadge role={selectedRole} />
                    <p className="mt-3 text-sm text-gray-400">{ROLES[selectedRole].description}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="access" className="mt-5 space-y-5">
              <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  <p className="text-sm font-medium text-gray-100">Workspace Access</p>
                </div>

                <div className="grid gap-2">
                  {MOCK_WORKSPACES.map((workspace) => (
                    <label
                      key={workspace.id}
                      className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-gray-900"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={workspaceIds.includes(workspace.id)}
                          onCheckedChange={(checked) =>
                            setWorkspaceIds((current) =>
                              checked
                                ? [...current, workspace.id]
                                : current.filter((id) => id !== workspace.id)
                            )
                          }
                          className="border-gray-700 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-600"
                        />
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${workspace.color}`} />
                          <span className="text-sm text-gray-200">{workspace.name}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-100">Require MFA</p>
                    <p className="mt-1 text-xs text-gray-500">UI-only control for v1 security enforcement.</p>
                  </div>
                  <Switch
                    checked={mfaRequired}
                    onCheckedChange={setMfaRequired}
                    className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-700"
                  />
                </div>
              </div>

              <PermissionsMatrix role={selectedRole} />
            </TabsContent>

            <TabsContent value="keys" className="mt-5">
              <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-amber-300" />
                  <p className="text-sm font-medium text-gray-100">API Keys</p>
                </div>

                {user.apiKeys.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/40 p-6 text-center text-sm text-gray-500">
                    No API keys yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {user.apiKeys.map((apiKey) => (
                      <div
                        key={apiKey.id}
                        className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/40 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-100">{apiKey.name}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            Created {apiKey.createdAt.toLocaleDateString()} · Last used{" "}
                            {apiKey.lastUsedAt ? apiKey.lastUsedAt.toLocaleDateString() : "Never"}
                          </p>
                        </div>
                        <Button variant="outline" className="border-gray-700 bg-gray-950 text-gray-200">
                          Revoke
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {error ? (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          ) : null}
        </div>

        <DialogFooter className="border-t border-gray-800 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleDeactivate}
            className="border-amber-500/20 bg-amber-500/10 text-amber-200"
          >
            Deactivate User
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-700 bg-gray-950 text-gray-200"
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-500">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
