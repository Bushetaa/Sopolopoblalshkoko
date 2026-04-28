"use client";

import React from "react";
import { Check, Minus } from "lucide-react";
import { ROLES, PermissionAction, UserRole } from "@/lib/users-mock";

const RESOURCES = ["APIs", "Gateways", "Workspaces", "Settings", "Billing"] as const;
const ACTIONS = ["Read", "Write", "Delete", "Admin"] as const;

export default function PermissionsMatrix({ role }: { role: UserRole }) {
  const rolePermissions = ROLES[role].permissions;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full min-w-[520px] text-xs">
        <thead className="bg-gray-950/70">
          <tr>
            <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-gray-500">
              Resource
            </th>
            {ACTIONS.map((action) => (
              <th
                key={action}
                className="w-16 px-3 py-3 text-center font-bold uppercase tracking-wider text-gray-500"
              >
                {action}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 bg-gray-900/40">
          {RESOURCES.map((resource) => {
            const key = resource.toLowerCase() as keyof typeof rolePermissions;
            const permissions = rolePermissions[key] ?? [];

            return (
              <tr key={resource}>
                <td className="px-4 py-3 font-medium text-gray-200">{resource}</td>
                {ACTIONS.map((action) => {
                  const allowed = permissions.includes(action.toLowerCase() as PermissionAction);

                  return (
                    <td key={action} className="px-3 py-3 text-center">
                      {allowed ? (
                        <Check className="mx-auto h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Minus className="mx-auto h-3.5 w-3.5 text-gray-700" />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
