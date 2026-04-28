"use client";

import React, { useMemo, useState } from "react";
import { Eye, MoreHorizontal, Pencil, Power, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUsers } from "@/context/UsersContext";
import { User } from "@/lib/users-mock";
import { cn } from "@/lib/utils";

function isSoleAdmin(user: User, users: User[]) {
  if (user.role !== "admin" && user.role !== "owner") {
    return false;
  }

  return (
    users.filter(
      (member) => member.status === "active" && (member.role === "admin" || member.role === "owner")
    ).length <= 1
  );
}

export default function UserActionsMenu({
  user,
  onView,
  onEdit,
}: {
  user: User;
  onView: () => void;
  onEdit: () => void;
}) {
  const { users, removeUser, updateUserStatus } = useUsers();
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  const soleAdmin = useMemo(() => isSoleAdmin(user, users), [user, users]);
  const nextStatus = user.status === "inactive" ? "active" : "inactive";

  return (
    <>
      <div onClick={(event) => event.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover/row:opacity-100 data-[state=open]:opacity-100 hover:bg-gray-800 text-gray-500 hover:text-gray-200"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 border-gray-800 bg-gray-900">
            <DropdownMenuItem
              onClick={onView}
              className="gap-2 text-xs font-bold text-gray-200 focus:bg-gray-800 focus:text-white"
            >
              <Eye className="h-3.5 w-3.5" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onEdit}
              className="gap-2 text-xs font-bold text-gray-200 focus:bg-gray-800 focus:text-white"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={soleAdmin && nextStatus === "inactive"}
              onClick={() => updateUserStatus(user.id, nextStatus)}
              className="gap-2 text-xs font-bold text-gray-200 focus:bg-gray-800 focus:text-white"
            >
              <Power className="h-3.5 w-3.5" />
              {user.status === "inactive" ? "Activate" : "Deactivate"}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={soleAdmin}
              onClick={() => setConfirmRemoveOpen(true)}
              className={cn(
                "gap-2 text-xs font-bold focus:bg-rose-500/10",
                soleAdmin ? "text-gray-600" : "text-rose-300 focus:text-rose-200"
              )}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={confirmRemoveOpen} onOpenChange={setConfirmRemoveOpen}>
        <AlertDialogContent className="border-gray-800 bg-gray-900 text-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              {user.name} will lose access to every workspace in this mock organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 bg-gray-950 text-gray-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removeUser(user.id)}
              className="bg-rose-600 text-white hover:bg-rose-500"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
