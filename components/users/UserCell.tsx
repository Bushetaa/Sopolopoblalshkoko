"use client";

import React from "react";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@/lib/users-mock";

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-purple-600",
  "bg-emerald-600",
  "bg-orange-600",
  "bg-rose-600",
  "bg-cyan-600",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(userId: string) {
  const numeric = Number.parseInt(userId.replace(/\D/g, ""), 10) || 0;
  return AVATAR_COLORS[numeric % AVATAR_COLORS.length];
}

export default function UserCell({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white",
          getAvatarColor(user.id)
        )}
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
        ) : (
          getInitials(user.name)
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-gray-100">{user.name}</span>
          {user.role === "owner" ? <Crown className="h-3.5 w-3.5 shrink-0 text-amber-400" /> : null}
        </div>
        <span className="block truncate text-xs text-gray-500">{user.email}</span>
      </div>
    </div>
  );
}
