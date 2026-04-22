# Tasks: Users Management

**Input**: Design documents from `specs/005-users-management/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [ ] T001 Create `app/(dashboard)/settings/users/page.tsx` as an empty placeholder
- [ ] T002 [P] Create `components/users/` directory with barrel `index.ts`
- [ ] T003 [P] Create `lib/users-mock.ts` — export `MOCK_USERS` (10 users), `ROLES` config, `MOCK_WORKSPACES` (5 workspaces with name/color/id), `getUserStats()` function per `data-model.md`

---

## Phase 2: Foundational

- [ ] T004 Create `context/UsersContext.tsx` — wraps `MOCK_USERS` in `useReducer`; exposes `UsersContextValue`: `users`, `inviteUser`, `updateUserRole`, `updateUserWorkspaces`, `updateUserStatus`, `removeUser`, `activeUsersCount` (computed), `pendingInvitesCount` (computed)
- [ ] T005 [P] Create `components/users/RoleBadge.tsx` — renders role badge using `ROLES[role]` config; `owner`+Crown, `admin`+Shield, `developer`+Code2, `viewer`+Eye, `billing`+CreditCard icons; styled `rounded-full border text-xs`
- [ ] T006 [P] Create `components/users/UserStatusBadge.tsx` — 3 statuses: active (green animate-ping dot), pending (yellow), inactive (gray); same pattern as `StatusBadge` from Spec 03

**Checkpoint**: Mock data, context, and shared badges ready.

---

## Phase 3: User Story 1 — Users Table (P1) 🎯 MVP

**Goal**: Full users table with stats row, search/filter bar, and all columns.

**Independent Test**: `/settings/users` renders 10 users in DataTable. Stats row shows totals. Search "marcus" narrows to 1 user. Sort by Last Active. Skeleton shows on `isLoading`.

- [ ] T007 [P] [US1] Create `components/users/UserCell.tsx` — avatar (initials + deterministic color from user ID, or `<img>` if `avatarUrl`), name (with Crown icon for owner), email in second line; all per spec §3.2
- [ ] T008 [P] [US1] Create `components/users/WorkspacesPills.tsx` — looks up workspace names from `MOCK_WORKSPACES` by IDs; renders up to 2 pills (`bg-gray-800 border border-gray-700 rounded text-xs`) + "+N more"
- [ ] T009 [P] [US1] Create `components/users/UserStatsRow.tsx` — 4 stat cards: Total Members, Active, Pending Invites, Admin Count; each `bg-gray-900 border border-gray-800 rounded-xl p-4` with Lucide icon
- [ ] T010 [P] [US1] Create `components/users/SecurityHealthCard.tsx` — MFA percentage progress bar; colored green/amber/red per threshold (≥80/≥50/<50); "X of Y members have MFA enabled" caption
- [ ] T011 [US1] Wire `app/(dashboard)/settings/users/page.tsx` — `UsersContext` provider wraps page; renders `UserStatsRow`, `SecurityHealthCard`, `<FilterBar config={USERS_FILTERS} ...>`, `<DataTable<User> columns={USER_TABLE_COLUMNS} ...>`

**Checkpoint**: US1 functional — full users table page with stats and filter bar.

---

## Phase 4: User Story 2 — Invite Member Modal (P1)

**Goal**: Invite modal with email tag input, role cards, workspace select, validation.

**Independent Test**: Open invite modal. Add "test@example.com", select Developer, click Send — new pending user appears in table. Submitting invalid email shows error inline.

- [ ] T012 [P] [US2] Create `components/users/EmailTagInput.tsx` — tag-style multi-email input per spec §4.4: Enter/comma adds tag, Backspace removes last, `onBlur` adds pending text, blue tag pills with ✕; `onChange(emails: string[])` per change
- [ ] T013 [US2] Create `components/users/InviteUserModal.tsx` — Radix Dialog; `EmailTagInput`, 4 `RoleSelectionCard` components (Admin/Developer/Viewer/Billing; Owner excluded), workspace multi-select checkboxes, optional message textarea; validation on submit (required emails, no Owner role); on success calls `UsersContext.inviteUser` and closes modal

**Checkpoint**: US2 functional — invite modal adds user to table with pending status.

---

## Phase 5: User Story 3 — Edit User Modal (P2)

**Goal**: 3-tab edit modal with Profile, Access, API Keys tabs.

**Independent Test**: Open Edit for a Developer user. Profile tab shows name (read-only), email (read-only), role dropdown. Access tab shows workspace checkboxes (pre-checked) + MFA toggle. API Keys tab shows mock keys with Revoke buttons. Change role to Viewer, Save — table row badge updates.

- [ ] T014 [P] [US3] Create `components/users/PermissionsMatrix.tsx` — 5×4 table (resources: APIs/Gateways/Workspaces/Settings/Billing; actions: Read/Write/Delete/Admin); green `<Check>` for granted, gray `<Minus>` for denied; derives permissions from `ROLES[role].permissions`; re-renders when role prop changes
- [ ] T015 [US3] Create `components/users/EditUserModal.tsx` — Radix Dialog with 3 tabs; Profile tab: read-only name/email + role `<select>`; Access tab: workspace checkboxes (pre-checked from `workspaceIds`) + MFA toggle + `<PermissionsMatrix role={selectedRole}>` preview; API Keys tab: list of mock API key rows with Revoke button; footer: Deactivate User (amber) + Cancel + Save Changes; on Save calls `updateUserRole` + `updateUserWorkspaces`

**Checkpoint**: US3 functional — edit modal updates role and workspace correctly.

---

## Phase 6: User Story 4 — User Details Drawer (P2)

**Goal**: Right-side drawer with full user profile, timeline, API keys, and quick actions.

**Independent Test**: Click a user row. Drawer slides in from right at 400px. Shows avatar, role badge, status, last active, workspace list, 4-entry activity timeline, API keys with "last used", footer buttons. Clicking outside closes.

- [ ] T016 [US4] Create `components/users/UserActionsMenu.tsx` — RowActionsMenu wrapper with 4 actions: "View Details" (opens drawer), "Edit" (opens edit modal), "Deactivate"/"Activate" (toggles status via `updateUserStatus`), "Remove" (confirm dialog → `removeUser`)
- [ ] T017 [US4] Create `components/users/UserDetailsDrawer.tsx` — fixed right-side panel 400px (`translate-x-full → translate-x-0` CSS transition); overlay backdrop; large avatar + name + role badge + email; Activity section showing last active, joined date, MFA status; Workspace Access list with colored dots; Activity Timeline (4 mock entries per user); API Keys section (mock entries with "last used" + Revoke button); footer with "Edit Permissions" + "Send Reset Email" + "Remove from Organization" (red); `onClose` on Escape or overlay click

**Checkpoint**: US4 functional — drawer opens on row click, closes on outside click.

---

## Phase 7: User Story 5 — Permissions Matrix (P3)

- [ ] T018 [US5] Verify `<PermissionsMatrix>` is wired to role dropdown in Edit modal (live updates when role changes); standalone test: render matrix for all 5 roles and check no incorrect checkmarks

**Checkpoint**: US5 functional — matrix reflects exact permissions from ROLES constant.

---

## Phase N: Polish

- [ ] T019 [P] Verify `UserDetailsDrawer` slide animation — CSS `transition-transform duration-300` completes in ≤300ms
- [ ] T020 [P] Zero console warnings — no key errors on table rows, no missing prop types on modals
- [ ] T021 [P] Export barrel `components/users/index.ts`
