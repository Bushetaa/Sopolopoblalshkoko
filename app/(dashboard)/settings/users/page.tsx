"use client";

import React, { useMemo, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Download, Plus, Users2 } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filters";
import {
  EditUserModal,
  InviteUserModal,
  RoleBadge,
  SecurityHealthCard,
  UserActionsMenu,
  UserCell,
  UserDetailsDrawer,
  UserStatsRow,
  UserStatusBadge,
  WorkspacesPills,
} from "@/components/users";
import { Button } from "@/components/ui/button";
import { UsersProvider, useUsers } from "@/context/UsersContext";
import { useFilters } from "@/hooks/useFilters";
import { ColumnDef } from "@/lib/table-utils";
import { User } from "@/lib/users-mock";
import { FilterBarConfig } from "@/types/filters";

const USERS_FILTER_CONFIG: FilterBarConfig = {
  showSearch: true,
  searchPlaceholder: "Search by name, email, or role...",
  categories: [
    {
      key: "role",
      label: "Role",
      type: "multi",
      options: [
        { label: "Owner", value: "owner" },
        { label: "Admin", value: "admin" },
        { label: "Developer", value: "developer" },
        { label: "Viewer", value: "viewer" },
        { label: "Billing", value: "billing" },
      ],
    },
    {
      key: "userStatus",
      label: "Status",
      type: "multi",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
      ],
    },
    {
      key: "environment",
      label: "Workspace",
      type: "multi",
      options: [
        { label: "Core Platform", value: "ws_1" },
        { label: "Billing APIs", value: "ws_2" },
        { label: "Gateway Ops", value: "ws_3" },
        { label: "Sandbox", value: "ws_4" },
        { label: "Partner Hub", value: "ws_5" },
      ],
    },
  ],
};

function UsersPageContent() {
  const { users, stats } = useUsers();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [detailsUser, setDetailsUser] = useState<User | null>(null);
  const {
    filters,
    setFilters,
    activeFiltersCount,
    filterChips,
    clearAll,
    toggleCategoryValue,
    setCategory,
    clearCategory,
  } = useFilters(USERS_FILTER_CONFIG);

  const filteredUsers = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    const selectedRoles = (filters.categories.role as string[] | undefined) ?? [];
    const selectedStatuses = (filters.categories.userStatus as string[] | undefined) ?? [];
    const selectedWorkspaces = (filters.categories.environment as string[] | undefined) ?? [];

    return users.filter((user) => {
      if (
        query &&
        ![user.name, user.email, user.role].some((value) => value.toLowerCase().includes(query))
      ) {
        return false;
      }

      if (selectedRoles.length > 0 && !selectedRoles.includes(user.role)) {
        return false;
      }

      if (selectedStatuses.length > 0 && !selectedStatuses.includes(user.status)) {
        return false;
      }

      if (
        selectedWorkspaces.length > 0 &&
        !selectedWorkspaces.some((workspaceId) => user.workspaceIds.includes(workspaceId))
      ) {
        return false;
      }

      return true;
    });
  }, [filters, users]);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        key: "user",
        header: "User",
        render: (_, row) => <UserCell user={row} />,
      },
      {
        key: "role",
        header: "Role",
        sortable: true,
        render: (_, row) => <RoleBadge role={row.role} />,
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        render: (_, row) => <UserStatusBadge status={row.status} />,
      },
      {
        key: "workspaceIds",
        header: "Workspaces",
        render: (_, row) => <WorkspacesPills workspaceIds={row.workspaceIds} />,
      },
      {
        key: "mfaEnabled",
        header: "MFA",
        align: "center",
        sortable: true,
        render: (value: boolean) => (
          <span className={value ? "text-emerald-300" : "text-gray-500"}>
            {value ? "Enabled" : "Disabled"}
          </span>
        ),
      },
      {
        key: "lastActive",
        header: "Last Active",
        sortable: true,
        render: (value: Date | null) =>
          value ? (
            <span className="text-sm text-gray-400">{formatDistanceToNow(value, { addSuffix: true })}</span>
          ) : (
            <span className="text-sm italic text-gray-600">Never</span>
          ),
      },
      {
        key: "joinedAt",
        header: "Joined",
        sortable: true,
        hidden: true,
        render: (value: Date) => <span className="text-sm text-gray-400">{format(value, "MMM d, yyyy")}</span>,
      },
      {
        key: "_actions",
        header: "",
        align: "right",
        render: (_, row) => (
          <UserActionsMenu
            user={row}
            onView={() => setDetailsUser(row)}
            onEdit={() => setEditingUser(row)}
          />
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-blue-400">
              <Users2 className="h-3.5 w-3.5" />
              Settings
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-50">Team Members</h1>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  {stats.totalMembers} members in your organization
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" className="border-gray-700 bg-gray-900 text-gray-200">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button onClick={() => setInviteOpen(true)} className="bg-blue-600 text-white hover:bg-blue-500">
                  <Plus className="h-4 w-4" />
                  Invite Member
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
            <UserStatsRow stats={stats} />
            <SecurityHealthCard stats={stats} />
          </div>
        </div>

        <FilterBar
          config={USERS_FILTER_CONFIG}
          filters={filters}
          onFiltersChange={setFilters}
          activeFiltersCount={activeFiltersCount}
          filterChips={filterChips}
          onClearAll={clearAll}
          onToggleCategory={toggleCategoryValue}
          onSetCategory={setCategory}
          onClearCategory={clearCategory}
        />

        <DataTable
          data={filteredUsers}
          columns={columns}
          selectable
          density="default"
          hideToolbarSearch
          emptyMessage="No team members match the current filters."
          onRowClick={(row) => setDetailsUser(row)}
        />
      </div>

      <InviteUserModal open={inviteOpen} onOpenChange={setInviteOpen} />
      <EditUserModal user={editingUser} open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)} />
      <UserDetailsDrawer
        user={detailsUser}
        open={!!detailsUser}
        onOpenChange={(open) => !open && setDetailsUser(null)}
        onEdit={() => {
          if (detailsUser) {
            setDetailsUser(null);
            setEditingUser(detailsUser);
          }
        }}
      />
    </>
  );
}

export default function UsersManagementPage() {
  return (
    <UsersProvider>
      <UsersPageContent />
    </UsersProvider>
  );
}
