"use client";

import React from "react";
import { Code2, CreditCard, Crown, Eye, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLES, UserRole } from "@/lib/users-mock";

const ROLE_ICONS = {
  owner: Crown,
  admin: Shield,
  developer: Code2,
  viewer: Eye,
  billing: CreditCard,
} as const;

export default function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  const config = ROLES[role];
  const Icon = ROLE_ICONS[role];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
        config.bg,
        config.border,
        config.color,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
