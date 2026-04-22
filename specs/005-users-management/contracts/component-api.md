# Component API Contracts: Users Management

## UserCell

```typescript
interface UserCellProps { user: User; }
// Renders: avatar (initials colored by ID % 6, or img) + name + Crown icon for owner + email
```

## RoleBadge

```typescript
interface RoleBadgeProps { role: UserRole; }
// Renders: colored badge with role icon + label from ROLES[role]
```

## UserStatusBadge

```typescript
interface UserStatusBadgeProps { status: UserStatus; }
// active: green animate-ping | pending: yellow | inactive: gray
```

## WorkspacesPills

```typescript
interface WorkspacesPillsProps { workspaceIds: string[]; }
// Shows max 2 pills from MOCK_WORKSPACES lookup + "+N more"; "No workspaces" italic fallback
```

## UserStatsRow

```typescript
interface UserStatsRowProps { users: User[]; }
// Renders 4 stat cards: Total, Active, Pending, Admins — computed via getUserStats()
```

## SecurityHealthCard

```typescript
interface SecurityHealthCardProps { users: User[]; }
// MFA adoption % bar: green ≥80%, amber ≥50%, red <50%
```

## EmailTagInput

```typescript
interface EmailTagInputProps {
  emails: string[];
  onChange: (emails: string[]) => void;
}
// Enter/comma → add tag; Backspace (empty input) → remove last; onBlur → add pending text
```

## InviteUserModal

```typescript
interface InviteUserModalProps {
  onClose: () => void;
}
// Uses UsersContext.inviteUser; closes on success or Cancel
```

## EditUserModal

```typescript
interface EditUserModalProps {
  user: User;
  onClose: () => void;
}
// 3 tabs; calls updateUserRole + updateUserWorkspaces on Save
```

## UserDetailsDrawer

```typescript
interface UserDetailsDrawerProps {
  user: User;
  onClose: () => void;
}
// Fixed right panel 400px; overlay backdrop; closes on Escape or outside click
```

## PermissionsMatrix

```typescript
interface PermissionsMatrixProps { role: UserRole; }
// Read-only 5×4 table; green Check for granted, gray Minus for denied
```

## UsersContext

```typescript
// Provides UsersContextValue (see data-model.md)
// useUsers() hook access; must wrap page in <UsersProvider>
```
