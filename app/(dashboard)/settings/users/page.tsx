"use client";

import React from "react";
import { Users2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function UsersManagementPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
        <p className="text-muted-foreground">
          Manage your organization's team members and their roles.
        </p>
      </div>

      <Separator />

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="h-16 w-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
          <Users2 className="h-8 w-8 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
          Invite team members to collaborate on your API gateways. You can assign roles and manage permissions.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700" disabled>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
        <p className="text-xs text-muted-foreground mt-3">Coming soon</p>
      </div>
    </div>
  );
}
