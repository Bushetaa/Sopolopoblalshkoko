"use client";

import React from "react";
import { Activity, ShieldCheck, UserCog, Users } from "lucide-react";
import { UserStats } from "@/lib/users-mock";

const ITEMS = [
  { key: "totalMembers", label: "Total Members", icon: Users, accent: "text-blue-300" },
  { key: "activeMembers", label: "Active Now", icon: Activity, accent: "text-emerald-300" },
  { key: "pendingInvites", label: "Pending Invites", icon: ShieldCheck, accent: "text-amber-300" },
  { key: "adminCount", label: "Admins", icon: UserCog, accent: "text-fuchsia-300" },
] as const;

export default function UserStatsRow({ stats }: { stats: UserStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {ITEMS.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="rounded-2xl border border-gray-800 bg-gray-900 p-4 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-gray-50">{stats[item.key]}</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-950 p-2.5">
                <Icon className={`h-4 w-4 ${item.accent}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
