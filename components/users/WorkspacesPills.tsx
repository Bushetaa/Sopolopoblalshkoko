"use client";

import React from "react";
import { MOCK_WORKSPACES } from "@/lib/users-mock";
import { cn } from "@/lib/utils";

export default function WorkspacesPills({ workspaceIds }: { workspaceIds: string[] }) {
  const userWorkspaces = workspaceIds.map((id) => {
    return MOCK_WORKSPACES.find((workspace) => workspace.id === id) ?? {
      id,
      name: "Unknown Workspace",
      color: "bg-slate-500",
    };
  });

  if (userWorkspaces.length === 0) {
    return <span className="text-xs italic text-gray-600">No workspaces</span>;
  }

  const visible = userWorkspaces.slice(0, 2);
  const remaining = userWorkspaces.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((workspace) => (
        <span
          key={workspace.id}
          className="inline-flex max-w-[120px] items-center gap-1.5 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-300"
        >
          <span className={cn("h-2 w-2 shrink-0 rounded-full", workspace.color)} />
          <span className="truncate">{workspace.name}</span>
        </span>
      ))}

      {remaining > 0 ? <span className="text-xs text-gray-500">+{remaining} more</span> : null}
    </div>
  );
}
