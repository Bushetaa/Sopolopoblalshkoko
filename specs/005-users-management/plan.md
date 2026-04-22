# Implementation Plan: Users Management

**Branch**: `005-users-management` | **Date**: 2026-04-19 | **Spec**: [spec.md](./spec.md)

## Summary

Build the Users Management page (`/settings/users`) for the Sopo Platform — a full team member management interface with a stats row, filterable/sortable user table (using DataTable from Spec 03), invite modal with email-tag input and role selection cards, edit modal with 3 tabs, a right-side user details drawer with activity timeline, and a permissions matrix visualization. All data is mock (`MOCK_USERS`) managed via `UsersContext`.

## Technical Context

**Language/Version**: React 19, Next.js 16, TypeScript  
**Primary Dependencies**: DataTable (Spec 03), FilterBar (Spec 04), Lucide React, Tailwind CSS v4, Radix DropdownMenu/Dialog  
**Storage**: N/A — `MOCK_USERS` array in React Context  
**Testing**: N/A  
**Target Platform**: `/settings/users` dashboard page; desktop-first but responsive  
**Project Type**: Dashboard page + components + context  
**Performance Goals**: Table renders 10 users < 300ms; invite flow < 5 interactions  
**Constraints**: Owner role is non-assignable via UI; deactivation is status change only  
**Scale/Scope**: 10 mock users; self-contained page dependent on Spec 01, 03, 04

## Constitution Check

No project constitution defined. Follows Sopo design tokens and React Context patterns.

## Project Structure

### Documentation (this feature)

```text
specs/005-users-management/
├── plan.md, spec.md, research.md, data-model.md, quickstart.md
├── contracts/component-api.md
├── checklists/requirements.md  ✅
└── tasks.md
```

### Source Code

```text
app/(dashboard)/settings/users/
└── page.tsx                     ← [CREATE] Users Management page

components/users/
├── UserCell.tsx                 ← [CREATE] Avatar + name + email cell
├── RoleBadge.tsx                ← [CREATE] Role badge (5 roles)
├── UserStatusBadge.tsx          ← [CREATE] Active/Inactive/Pending badge
├── WorkspacesPills.tsx          ← [CREATE] Workspace pills + overflow
├── UserStatsRow.tsx             ← [CREATE] 4 stats cards summary
├── SecurityHealthCard.tsx       ← [CREATE] MFA adoption progress bar
├── InviteUserModal.tsx          ← [CREATE] Email tag input + role cards + workspace select
├── EditUserModal.tsx            ← [CREATE] 3-tab modal (Profile/Access/API Keys)
├── UserDetailsDrawer.tsx        ← [CREATE] Right-side drawer with timeline
├── PermissionsMatrix.tsx        ← [CREATE] 5×4 resource/action matrix
├── EmailTagInput.tsx            ← [CREATE] Tag-style email input
└── UserActionsMenu.tsx          ← [CREATE] Row actions dropdown

context/
└── UsersContext.tsx             ← [CREATE] Mock data + CRUD operations

lib/
└── users-mock.ts                ← [CREATE] MOCK_USERS (10 users) + ROLES config
```
