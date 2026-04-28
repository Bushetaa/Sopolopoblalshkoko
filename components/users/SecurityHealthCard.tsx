"use client";

import React from "react";
import { LockKeyhole } from "lucide-react";
import { UserStats } from "@/lib/users-mock";
import { cn } from "@/lib/utils";

function getProgressColor(percentage: number) {
  if (percentage >= 80) return "bg-emerald-500";
  if (percentage >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

export default function SecurityHealthCard({ stats }: { stats: UserStats }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
            <LockKeyhole className="h-3.5 w-3.5 text-blue-300" />
            Security Health
          </div>
          <h3 className="mt-2 text-xl font-bold text-gray-50">{stats.mfaPercentage}% MFA Adoption</h3>
          <p className="mt-1 text-sm text-gray-500">
            {stats.mfaEnabled} of {stats.totalMembers} members have MFA enabled.
          </p>
        </div>

        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
            stats.mfaPercentage >= 80
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : stats.mfaPercentage >= 50
                ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                : "border-rose-500/20 bg-rose-500/10 text-rose-300"
          )}
        >
          {stats.mfaPercentage >= 80 ? "Healthy" : stats.mfaPercentage >= 50 ? "Watch" : "Risk"}
        </span>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-800">
        <div
          className={cn("h-full rounded-full transition-all duration-300", getProgressColor(stats.mfaPercentage))}
          style={{ width: `${stats.mfaPercentage}%` }}
        />
      </div>
    </div>
  );
}
