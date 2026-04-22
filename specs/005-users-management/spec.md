# Feature Specification: Users Management

**Feature Branch**: `005-users-management`
**Created**: 2026-04-19
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browse & Search Team Members Table (Priority: P1)

Organization admins need to view all team members in a sortable, searchable table showing avatar, name, role badge, status, workspaces, MFA status, and last active time, so they can get a complete picture of their team at a glance.

**Why this priority**: The team members table is the main entry point for all user management work. Without it, no other user management action is accessible.

**Independent Test**: Navigate to `/settings/users`. The table renders 10 mock users. Typing "marcus" in the search box narrows to Marcus Chen only. Clicking "Last Active" header sorts by last active date. The empty state renders for a search that matches no one.

**Acceptance Scenarios**:

1. **Given** the Users page loads, **When** it renders, **Then** a stats row shows Total (10), Active (X), Pending (2), Admins (N) cards, and the table shows all 10 mock users.
2. **Given** a user has no `avatarUrl`, **When** their row renders, **Then** a colored initials avatar appears (color derived from user ID mod 6).
3. **Given** the "Last Active" column is clicked, **When** sorting applies, **Then** rows sort by `lastActive` descending; users with `lastActive=null` (pending) appear last.
4. **Given** a user with 3 workspaces is displayed, **When** the Workspaces cell renders, **Then** 2 workspace pills show and "+1 more" appears.
5. **Given** `isLoading=true`, **When** the table renders, **Then** animated skeleton rows appear.

---

### User Story 2 — Invite New Team Member (Priority: P1)

Admins need to invite one or more people to the organization by entering email addresses, selecting a role (Admin/Developer/Viewer/Billing), and optionally assigning workspaces, so new members can start collaborating quickly.

**Why this priority**: Inviting members is the primary CRUD action for user management. Without it, the feature is read-only and lacks core value.

**Independent Test**: Click "Invite Member". The modal opens with an email tag input, 4 role selection cards (Admin pre-selected as Developer), and workspace multi-select. Type "test@example.com" + Enter — an email tag appears. Select "Admin" role card. Click "Send Invitation" — the user is added to the list with "pending" status and the modal closes.

**Acceptance Scenarios**:

1. **Given** the "Invite Member" button is clicked, **When** the modal opens, **Then** the email tag input, 4 role selection cards (excluding Owner), and a workspace selector are visible.
2. **Given** the user types a valid email and presses Enter or comma, **When** the tag is created, **Then** the email appears as a blue pill in the input and the text field clears.
3. **Given** the user tries to submit with an invalid email, **When** validation runs, **Then** an error message shows "Invalid emails: [invalid@]" and submission is blocked.
4. **Given** the user selects the "Admin" role card, **When** it is selected, **Then** it highlights with a blue border, a checkmark appears, and the permissions visible in the card update to reflect Admin access.
5. **Given** "Send Invitation" is clicked with valid data, **When** the action completes, **Then** a new user appears in the table with "Pending" status badge and the modal closes.

---

### User Story 3 — Edit Member Role & Access (Priority: P2)

Admins need to edit an existing member's role and workspace access via a modal with Profile, Access, and API Keys tabs, so they can manage access as the team's responsibilities evolve.

**Why this priority**: Role and access management is a core admin function but less urgent than invite (the primary day-1 action).

**Independent Test**: Click the "⋯" menu on a Developer user → "Edit". The modal opens on the Profile tab showing their name/email (read-only) and a role dropdown. Switch to the Access tab — workspace checkboxes list all workspaces with current assignments pre-checked. Change role to Viewer, save — the table row's role badge updates to "Viewer".

**Acceptance Scenarios**:

1. **Given** "Edit" is clicked on a user row, **When** the edit modal opens, **Then** it shows 3 tabs: Profile, Access, API Keys; the Profile tab is active with name/email read-only and role editable.
2. **Given** the Access tab is active, **When** it renders, **Then** a workspace list with checkboxes appears, pre-checked per the user's `workspaceIds`, plus an MFA status toggle (Admin-only action).
3. **Given** the API Keys tab is active, **When** it renders, **Then** each API key shows name, last used date, and a "Revoke" button.
4. **Given** the admin changes role from Developer to Viewer and clicks "Save Changes", **When** the action fires, **Then** `updateUserRole` is called and the table row updates with the new role badge.
5. **Given** the "Deactivate User" button is clicked inside the modal, **When** the action confirms, **Then** the user's status changes to "Inactive" and the modal closes.

---

### User Story 4 — User Details Drawer (Priority: P2)

Admins need to click on a user row to open a right-side drawer showing the full user profile (avatar, status, last active, workspaces, activity timeline, API keys, and quick actions), so they get complete context without navigating away.

**Why this priority**: The drawer provides a comprehensive read view essential for audit and decision-making before taking action.

**Independent Test**: Click on a user row. A 400px right drawer slides in with: large avatar, role badge, last active time, workspace list, a 4-entry activity timeline, and API keys section. Clicking outside the drawer closes it. The "Edit Permissions" button in the footer opens the Edit modal.

**Acceptance Scenarios**:

1. **Given** a user row is clicked, **When** `onRowClick` fires, **Then** a right-side drawer animates in from the right at 400px width with an overlay backdrop.
2. **Given** the drawer is open, **When** it renders the activity timeline, **Then** at least 4 activity entries appear (Logged in, Created API, Modified Gateway, Invited by…).
3. **Given** the drawer is open, **When** the user clicks outside or presses Escape, **Then** the drawer closes with a sliding animation.
4. **Given** the "Remove from Organization" footer button is clicked, **When** a confirm dialog appears, **Then** the user must confirm before the removal fires.

---

### User Story 5 — Permissions Matrix View (Priority: P3)

Admins and developers need a visual permissions matrix showing which actions (Read/Write/Delete/Admin) each role has on each resource (APIs/Gateways/Workspaces/Settings/Billing), so they can quickly understand access model differences between roles.

**Why this priority**: Informational view that aids decision-making when assigning roles. Non-blocking for core user management flows.

**Independent Test**: Open the Edit User modal, navigate to the Access tab. A table renders with resources as rows and actions as columns. "Owner" row shows green checkmarks for all cells. "Viewer" row shows checkmarks only for Read columns. Changing the role dropdown updates the matrix instantly.

**Acceptance Scenarios**:

1. **Given** the permissions matrix renders for "Developer" role, **When** it displays, **Then** `APIs: Read ✓, Write ✓, Delete ✗, Admin ✗` matches the `ROLES.developer.permissions` constant exactly.
2. **Given** the role selection changes in the Edit modal, **When** the matrix re-renders, **Then** it reflects the new role's permissions immediately without page reload.

---

### Edge Cases

- What if an admin tries to invite an email that already exists in the organization? (Show "User already exists" validation error inline, don't create a duplicate.)
- What if the last Admin or Owner is being deactivated? (Show a blocking error: "Cannot deactivate the sole admin.")
- What if `workspaceIds` references a workspace that no longer exists? (Render a placeholder "Unknown Workspace" pill instead of crashing.)
- What if `lastActive` is null for a pending user? (Display "Never" in italic gray text.)
- What if the user has 0 API keys and visits the API Keys tab? (Show an empty state with "No API keys yet" message.)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Users page at `/settings/users` MUST render a stats row (Total, Active, Pending, Admins count cards) and a `<DataTable>` with the 7-column layout defined in the spec.
- **FR-002**: Each user row MUST render an avatar (initials with consistent color from user ID, or `avatarUrl` if present), name, email, role badge, status badge, workspace pills, MFA icon, and last active time.
- **FR-003**: The "Invite Member" modal MUST include: email tag input (Enter/comma adds email, Backspace removes last), role selection cards (4 roles, Owner excluded), workspace multi-select, and form validation.
- **FR-004**: The "Edit User" modal MUST have 3 tabs (Profile/Access/API Keys); the Access tab MUST show workspace checkboxes and MFA toggle; the API Keys tab MUST list keys with revoke buttons.
- **FR-005**: The permissions matrix MUST render a table of 5 resources × 4 actions with green checkmarks (✓) for granted permissions and gray dashes (–) for denied.
- **FR-006**: Clicking a user row MUST open a right-side drawer (400px, overlay backdrop) with: avatar, role badge, status, last active, membership date, MFA status, workspace list, 4-entry activity timeline, and API keys section.
- **FR-007**: The `getUserStats()` function MUST compute: `totalMembers`, `activeMembers`, `pendingInvites`, `adminCount`, `mfaEnabled`, `mfaPercentage` from the users array.
- **FR-008**: The `UsersContext` MUST expose CRUD operations: `inviteUser`, `updateUserRole`, `updateUserWorkspaces`, `updateUserStatus`, `removeUser` — all operating on the mock `MOCK_USERS` array in state.
- **FR-009**: The security health card MUST show an MFA adoption progress bar colored green (≥80%), amber (≥50%), or red (<50%).
- **FR-010**: Row actions per user MUST include: "View Details" (opens drawer), "Edit" (opens edit modal), "Deactivate" (changes status), "Remove" (with confirm dialog).

### Key Entities

- **User**: Full user record — id, name, email, avatarUrl?, role, status, workspaceIds[], permissions[], lastActive, joinedAt, invitedBy?, mfaEnabled, apiKeys?.
- **UserRole**: Enum — `owner | admin | developer | viewer | billing`.
- **UserStatus**: Enum — `active | inactive | pending`.
- **Permission**: Resource + actions — `{ resource: string, actions: PermissionAction[] }`.
- **InviteFormData**: Invite payload — emails[], role, workspaceIds[], message?.
- **UserStats**: Computed stats — totalMembers, activeMembers, pendingInvites, adminCount, mfaEnabled, mfaPercentage.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 10 mock users render in the table in under 300ms on initial page load.
- **SC-002**: The invite flow from button click to new user appearing in the table completes within 5 user interactions (click button, enter email, select role, optionally select workspace, click send).
- **SC-003**: Role changes take effect in the table immediately after saving (< 200ms UI update, no page reload).
- **SC-004**: The permissions matrix renders correctly for all 5 roles with zero incorrect checkmarks.
- **SC-005**: The drawer opens with a CSS slide animation completing in under 300ms.
- **SC-006**: The component produces zero React console warnings or errors.

---

## Assumptions

- All data is mock (`MOCK_USERS` array in a `UsersContext`) — no real backend calls for v1.
- The `<DataTable>` component from Spec 03 is used directly; Users Management does NOT re-implement table logic.
- The `<FilterBar>` from Spec 04 is used for search + role/status filters; `useFilters()` manages filter state.
- Workspace data is mock — a `MOCK_WORKSPACES` constant provides workspace names and colors for the workspace pills.
- MFA "Require MFA" toggle is a UI-only action in v1 — no actual enforcement logic.
- The Owner role is displayed but NOT assignable via the invite flow; Owner transfer is out of scope for v1.
- Deactivation is a status change (`status: 'inactive'`) — no actual session termination for v1.
