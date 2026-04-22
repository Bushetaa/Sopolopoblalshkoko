# Research & Architecture Decisions: Users Management

## Decision 1: UsersContext for CRUD

- **Decision**: Use React Context (`UsersContext`) with `useReducer` for all user CRUD operations. The mock `MOCK_USERS` array is the initial state.
- **Rationale**: Allows the Invite modal, Edit modal, Drawer, and Table to all share the same user state without prop drilling.
- **Alternatives considered**: Local `useState` in the page (rejected — Invite/Edit modals need to write to the same state the table reads).

## Decision 2: DataTable from Spec 03

- **Decision**: The users table is NOT a custom table — it uses `<DataTable<User>>` from Spec 03 with `USER_TABLE_COLUMNS` column defs.
- **Rationale**: Avoids code duplication; validates the reusability of the DataTable system.

## Decision 3: FilterBar from Spec 04

- **Decision**: The filter bar above the users table uses `<FilterBar config={USERS_FILTERS}>` from Spec 04 + `useFilters()` hook.
- **Rationale**: Consistent filter UX across all pages; zero custom filter code in the Users feature.

## Decision 4: Avatar Color Derivation

- **Decision**: `avatarColor = avatarColors[parseInt(user.id.replace('user_', '')) % avatarColors.length]` — deterministic and consistent.
- **Rationale**: Same user always gets the same color; no random generation needed.

## Decision 5: Permissions Matrix — Read-Only

- **Decision**: The `PermissionsMatrix` is read-only (displays permissions for the selected role) — it is NOT an editable permission editor for v1.
- **Rationale**: Spec §6.1 defines it as a visual display; granular permission editing is a future feature.

## Decision 6: Email Tag Input — Backspace Deletes Last

- **Decision**: Pressing Backspace when input is empty removes the last email tag (`onChange(emails.slice(0, -1))`).
- **Rationale**: Standard UX pattern for tag inputs (used by Gmail, Linear, etc.).

## Decision 7: Drawer Overlay Strategy

- **Decision**: The `UserDetailsDrawer` uses `position: fixed` with a translucent overlay backdrop. Clicking outside closes the drawer.
- **Rationale**: Consistent with the mobile sidebar approach from Spec 01; avoids layout shift from content pushes.
