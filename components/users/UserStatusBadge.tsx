"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { UserStatus } from "@/lib/users-mock";

const STATUS_STYLES: Record<
  UserStatus,
  { label: string; dot: string; bg: string; text: string; border: string; animated: boolean }
> = {
  active: {
    label: "Active",
    dot: "bg-emerald-400",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    border: "border-emerald-500/20",
    animated: true,
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    border: "border-amber-500/20",
    animated: false,
  },
  inactive: {
    label: "Inactive",
    dot: "bg-slate-400",
    bg: "bg-slate-500/10",
    text: "text-slate-300",
    border: "border-slate-500/20",
    animated: false,
  },
};

export default function UserStatusBadge({
  status,
  className,
}: {
  status: UserStatus;
  className?: string;
}) {
  const config = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {config.animated ? (
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full", config.dot)} />
        ) : null}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", config.dot)} />
      </span>
      {config.label}
    </span>
  );
}
