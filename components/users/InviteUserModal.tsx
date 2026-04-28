"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight, Check, MailPlus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import EmailTagInput from "./EmailTagInput";
import { useUsers } from "@/context/UsersContext";
import { isValidEmail, InviteFormData, MOCK_WORKSPACES, ROLES, UserRole } from "@/lib/users-mock";
import { cn } from "@/lib/utils";

const INVITABLE_ROLES = (["admin", "developer", "viewer", "billing"] as const).map((role) => ({
  role,
  config: ROLES[role],
}));

function RoleSelectionCard({
  role,
  selected,
  onSelect,
}: {
  role: UserRole;
  selected: boolean;
  onSelect: () => void;
}) {
  const config = ROLES[role];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "rounded-xl border p-3 text-left transition-colors",
        selected
          ? "border-blue-500/40 bg-blue-500/10"
          : "border-gray-800 bg-gray-950 hover:border-gray-700"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={cn("text-sm font-semibold", selected ? "text-blue-300" : "text-gray-100")}>
            {config.label}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{config.description}</p>
        </div>
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
            selected ? "border-blue-400 bg-blue-500 text-white" : "border-gray-700 text-transparent"
          )}
        >
          <Check className="h-3 w-3" />
        </span>
      </div>
    </button>
  );
}

const INITIAL_STATE: InviteFormData = {
  emails: [],
  role: "developer",
  workspaceIds: [],
  message: "",
};

export default function InviteUserModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { inviteUser, users } = useUsers();
  const [form, setForm] = useState<InviteFormData>(INITIAL_STATE);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const existingEmails = useMemo(() => new Set(users.map((user) => user.email.toLowerCase())), [users]);

  const resetState = () => {
    setForm(INITIAL_STATE);
    setError("");
    setSubmitting(false);
  };

  const handleSubmit = async () => {
    if (form.emails.length === 0) {
      setError("At least one email is required.");
      return;
    }

    const invalidEmails = form.emails.filter((email) => !isValidEmail(email));
    if (invalidEmails.length > 0) {
      setError(`Invalid emails: ${invalidEmails.join(", ")}`);
      return;
    }

    const duplicates = form.emails.filter((email) => existingEmails.has(email.toLowerCase()));
    if (duplicates.length > 0) {
      setError(`User already exists: ${duplicates.join(", ")}`);
      return;
    }

    if (form.role === "owner") {
      setError("Cannot invite as Owner.");
      return;
    }

    setSubmitting(true);
    await inviteUser(form);
    resetState();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          resetState();
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-3xl border-gray-800 bg-gray-900 p-0 text-gray-100">
        <DialogHeader className="border-b border-gray-800 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-xl text-gray-50">
            <MailPlus className="h-5 w-5 text-blue-300" />
            Invite Team Member
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Add one or more teammates with a role and optional workspace access.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 px-6 py-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Email Addresses</label>
              <EmailTagInput
                emails={form.emails}
                onChange={(emails) => {
                  setError("");
                  setForm((current) => ({ ...current, emails }));
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Workspace Access</label>
              <div className="grid gap-2 rounded-xl border border-gray-800 bg-gray-950 p-3">
                {MOCK_WORKSPACES.map((workspace) => {
                  const checked = form.workspaceIds.includes(workspace.id);

                  return (
                    <label
                      key={workspace.id}
                      className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-gray-900"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(nextChecked) => {
                            setForm((current) => ({
                              ...current,
                              workspaceIds: nextChecked
                                ? [...current.workspaceIds, workspace.id]
                                : current.workspaceIds.filter((id) => id !== workspace.id),
                            }));
                          }}
                          className="border-gray-700 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-600"
                        />
                        <div className="flex items-center gap-2">
                          <span className={cn("h-2.5 w-2.5 rounded-full", workspace.color)} />
                          <span className="text-sm text-gray-200">{workspace.name}</span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Personal Message</label>
              <Textarea
                value={form.message}
                onChange={(event) =>
                  setForm((current) => ({ ...current, message: event.target.value }))
                }
                placeholder="Optional welcome note..."
                className="min-h-[110px] border-gray-800 bg-gray-950 text-gray-200 placeholder:text-gray-600"
              />
            </div>

            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-200">Assign Role</p>
              <p className="mt-1 text-xs text-gray-500">Owner is intentionally excluded from invites.</p>
            </div>

            <div className="grid gap-3">
              {INVITABLE_ROLES.map(({ role }) => (
                <RoleSelectionCard
                  key={role}
                  role={role}
                  selected={form.role === role}
                  onSelect={() => {
                    setError("");
                    setForm((current) => ({ ...current, role }));
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-gray-800 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-700 bg-gray-950 text-gray-200"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 text-white hover:bg-blue-500"
          >
            Send Invitation
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
