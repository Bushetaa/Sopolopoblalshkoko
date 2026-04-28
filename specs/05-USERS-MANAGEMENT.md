# 👥 Spec 05 — Users Management
## Sopo Platform | إدارة المستخدمين والصلاحيات

> **Spec ID**: SOPO-SPEC-05  
> **Priority**: 🟡 Medium (Enterprise Feature)  
> **Status**: ✅ Implemented  
> **Depends On**: Spec 01 (Layout), Spec 03 (Data Tables), Spec 04 (Filters)  
> **Required By**: None (leaf feature)  

---

## 🎯 Overview | نظرة عامة

صفحة Users Management هي قسم إدارة الفريق داخل المنصة. تتيح للـ Admins إضافة وتعديل وحذف الأعضاء، تعيين الأدوار والصلاحيات، وإدارة الوصول لكل Workspace. تعتمد على Role-Based Access Control (RBAC) لضمان أن كل مستخدم يصل فقط للموارد المسموح له بها.

---

## 🏗️ 1. Users Page Architecture

### 1.1 Page Layout Structure

```
USERS MANAGEMENT PAGE (/settings/users)
├── Page Header
│   ├── Title: "Team Members"
│   ├── Subtitle: "X members in your organization"
│   └── Actions: [Invite Member] [Export]
│
├── Filter Bar
│   ├── Search (by name, email, role)
│   ├── Role Filter (multi-select)
│   ├── Status Filter (Active / Inactive / Pending)
│   └── Workspace Filter (belongs to workspace)
│
├── Stats Row (quick summary)
│   ├── Total Members
│   ├── Active Now
│   ├── Pending Invites
│   └── Admins Count
│
├── Users Table
│   ├── Avatar + Name + Email
│   ├── Role Badge
│   ├── Status Badge
│   ├── Workspaces (pills)
│   ├── Last Active
│   ├── Joined Date
│   └── Row Actions (Edit / Permissions / Deactivate / Remove)
│
└── Modals
    ├── Invite User Modal
    ├── Edit User Modal (role, workspaces)
    ├── User Details Drawer (full profile)
    └── Confirm Deactivate / Delete Dialog
```

---

## 📊 2. Data Model

### 2.1 User TypeScript Interface

```typescript
interface User {
  id: string;                   // "user_1", "user_2", etc.
  name: string;                 // "Sarah Johnson"
  email: string;                // "sarah@company.com"
  avatarUrl?: string;           // URL or undefined (use initials)
  role: UserRole;               // 'admin' | 'developer' | 'viewer' | 'billing'
  status: UserStatus;           // 'active' | 'inactive' | 'pending'
  workspaceIds: string[];       // ['ws_1', 'ws_2'] — workspaces with access
  permissions: Permission[];    // Granular permissions
  lastActive: Date | null;      // null if pending/never logged in
  joinedAt: Date;               // When they were added
  invitedBy?: string;           // User ID of who invited them
  mfaEnabled: boolean;          // Two-factor auth status
  apiKeys?: number;             // Number of API keys they have
}

type UserRole = 'owner' | 'admin' | 'developer' | 'viewer' | 'billing';
type UserStatus = 'active' | 'inactive' | 'pending';

interface Permission {
  resource: string;             // 'apis', 'gateways', 'workspaces', 'settings', 'billing'
  actions: PermissionAction[];  // ['read', 'write', 'delete', 'admin']
}

type PermissionAction = 'read' | 'write' | 'delete' | 'admin';
```

### 2.2 Role Definitions & Permissions Matrix

```typescript
// Role configuration with labels, colors, and default permissions
const ROLES: Record<UserRole, RoleConfig> = {
  owner: {
    label: 'Owner',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    description: 'Full access to everything including billing and team management',
    permissions: { apis: ['read','write','delete','admin'], gateways: ['read','write','delete','admin'], workspaces: ['read','write','delete','admin'], settings: ['read','write','admin'], billing: ['read','write','admin'] },
    isEditable: false,          // Can't change owner role from UI
    maxCount: 1,                // Only one owner per org
  },
  admin: {
    label: 'Admin',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    description: 'Full access except billing and ownership transfer',
    permissions: { apis: ['read','write','delete'], gateways: ['read','write','delete'], workspaces: ['read','write','delete'], settings: ['read','write'], billing: ['read'] },
    isEditable: true,
  },
  developer: {
    label: 'Developer',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    description: 'Can create and edit APIs, gateways, and workspaces they belong to',
    permissions: { apis: ['read','write'], gateways: ['read','write'], workspaces: ['read'], settings: ['read'], billing: [] },
    isEditable: true,
  },
  viewer: {
    label: 'Viewer',
    color: 'text-gray-400',
    bg: 'bg-gray-700/50',
    border: 'border-gray-700',
    description: 'Read-only access to assigned workspaces',
    permissions: { apis: ['read'], gateways: ['read'], workspaces: ['read'], settings: [], billing: [] },
    isEditable: true,
  },
  billing: {
    label: 'Billing',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    description: 'Billing and subscription management only',
    permissions: { apis: [], gateways: [], workspaces: [], settings: ['read'], billing: ['read','write'] },
    isEditable: true,
  },
};
```

### 2.3 Mock Users Data (10 users)

```typescript
const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Alex Thompson',
    email: 'alex@company.com',
    role: 'owner',
    status: 'active',
    workspaceIds: ['ws_1', 'ws_2', 'ws_3', 'ws_4', 'ws_5'],
    mfaEnabled: true,
    lastActive: new Date(),
    joinedAt: new Date('2023-01-15'),
    apiKeys: 3,
  },
  {
    id: 'user_2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'admin',
    status: 'active',
    workspaceIds: ['ws_1', 'ws_2', 'ws_3'],
    mfaEnabled: true,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),   // 2h ago
    joinedAt: new Date('2023-03-20'),
    apiKeys: 2,
  },
  {
    id: 'user_3',
    name: 'Marcus Chen',
    email: 'marcus@company.com',
    role: 'developer',
    status: 'active',
    workspaceIds: ['ws_1', 'ws_3'],
    mfaEnabled: false,
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),   // 1d ago
    joinedAt: new Date('2023-06-10'),
    apiKeys: 5,
  },
  {
    id: 'user_4',
    name: 'Emily Rodriguez',
    email: 'emily@company.com',
    role: 'developer',
    status: 'active',
    workspaceIds: ['ws_2', 'ws_4'],
    mfaEnabled: true,
    lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3d ago
    joinedAt: new Date('2023-09-05'),
    apiKeys: 2,
  },
  {
    id: 'user_5',
    name: 'James Wilson',
    email: 'james@company.com',
    role: 'viewer',
    status: 'active',
    workspaceIds: ['ws_1'],
    mfaEnabled: false,
    lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7d ago
    joinedAt: new Date('2024-01-12'),
    apiKeys: 0,
  },
  {
    id: 'user_6',
    name: 'Priya Patel',
    email: 'priya@company.com',
    role: 'developer',
    status: 'pending',
    workspaceIds: [],
    mfaEnabled: false,
    lastActive: null,
    joinedAt: new Date('2024-04-10'),
    apiKeys: 0,
    invitedBy: 'user_2',
  },
  {
    id: 'user_7',
    name: 'David Kim',
    email: 'david@company.com',
    role: 'billing',
    status: 'active',
    workspaceIds: [],
    mfaEnabled: true,
    lastActive: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    joinedAt: new Date('2023-11-30'),
    apiKeys: 0,
  },
  {
    id: 'user_8',
    name: 'Olivia Brown',
    email: 'olivia@company.com',
    role: 'admin',
    status: 'active',
    workspaceIds: ['ws_3', 'ws_5'],
    mfaEnabled: true,
    lastActive: new Date(Date.now() - 60 * 60 * 1000),   // 1h ago
    joinedAt: new Date('2023-04-18'),
    apiKeys: 4,
  },
  {
    id: 'user_9',
    name: 'Tom Nakamura',
    email: 'tom@company.com',
    role: 'viewer',
    status: 'inactive',
    workspaceIds: ['ws_2'],
    mfaEnabled: false,
    lastActive: new Date('2024-01-01'),
    joinedAt: new Date('2023-08-22'),
    apiKeys: 0,
  },
  {
    id: 'user_10',
    name: 'Anna Mueller',
    email: 'anna@company.com',
    role: 'developer',
    status: 'pending',
    workspaceIds: [],
    mfaEnabled: false,
    lastActive: null,
    joinedAt: new Date('2024-04-15'),
    apiKeys: 0,
    invitedBy: 'user_1',
  },
];
```

---

## 📋 3. Users Table Specification

### 3.1 Column Definitions

```typescript
const USER_TABLE_COLUMNS: ColumnDef<User>[] = [
  {
    key: 'user',
    header: 'User',
    render: (_, row) => <UserCell user={row} />
  },
  {
    key: 'role',
    header: 'Role',
    sortable: true,
    render: (_, row) => <RoleBadge role={row.role} />
  },
  {
    key: 'status',
    header: 'Status',
    render: (_, row) => <UserStatusBadge status={row.status} />
  },
  {
    key: 'workspaceIds',
    header: 'Workspaces',
    render: (_, row) => <WorkspacesPills workspaceIds={row.workspaceIds} />
  },
  {
    key: 'mfaEnabled',
    header: 'MFA',
    align: 'center',
    render: (value) => (
      value
        ? <Shield className="h-4 w-4 text-green-400 mx-auto" />
        : <ShieldOff className="h-4 w-4 text-gray-600 mx-auto" />
    )
  },
  {
    key: 'lastActive',
    header: 'Last Active',
    sortable: true,
    render: (value) => value ? <span className="text-gray-400 text-sm">{formatRelativeTime(value)}</span> : <span className="text-gray-600 text-sm italic">Never</span>
  },
  {
    key: 'joinedAt',
    header: 'Joined',
    sortable: true,
    hidden: true,           // Hidden by default
    render: (value) => <span className="text-gray-400 text-sm">{formatDate(value)}</span>
  },
  {
    key: '_actions',
    header: '',
    render: (_, row) => <UserActionsMenu user={row} />
  }
];
```

### 3.2 User Cell Component (Avatar + Name + Email)

```tsx
const UserCell: React.FC<{ user: User }> = ({ user }) => {
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  
  // Avatar colors based on user ID (consistent)
  const avatarColors = [
    'bg-blue-600', 'bg-purple-600', 'bg-green-600',
    'bg-orange-600', 'bg-red-600', 'bg-teal-600',
  ];
  const colorIndex = parseInt(user.id.replace('user_', '')) % avatarColors.length;
  
  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0",
        avatarColors[colorIndex]
      )}>
        {user.avatarUrl
          ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
          : initials
        }
      </div>
      
      {/* Name + Email */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-gray-50 truncate">{user.name}</span>
          {user.role === 'owner' && (
            <Crown className="h-3 w-3 text-yellow-400 flex-shrink-0" title="Workspace Owner" />
          )}
        </div>
        <span className="text-xs text-gray-500 truncate block">{user.email}</span>
      </div>
    </div>
  );
};
```

### 3.3 Workspaces Pills Component

```tsx
const WorkspacesPills: React.FC<{ workspaceIds: string[] }> = ({ workspaceIds }) => {
  const { workspaces } = useAppData();
  const userWorkspaces = workspaces.filter(ws => workspaceIds.includes(ws.id));
  
  const maxVisible = 2;
  const visible = userWorkspaces.slice(0, maxVisible);
  const remaining = userWorkspaces.length - maxVisible;
  
  if (userWorkspaces.length === 0) {
    return <span className="text-xs text-gray-600 italic">No workspaces</span>;
  }
  
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visible.map(ws => (
        <span
          key={ws.id}
          className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-800 border border-gray-700 
                     rounded text-xs text-gray-300 max-w-[100px] truncate"
        >
          <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", ws.color)} />
          <span className="truncate">{ws.name}</span>
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-xs text-gray-500 px-1">+{remaining} more</span>
      )}
    </div>
  );
};
```

---

## ✉️ 4. Invite User Modal

### 4.1 Modal Structure

```
INVITE USER MODAL
├── Header: "Invite Team Member"
│
├── Form Fields:
│   ├── Email Address* (input, supports multiple comma-separated)
│   ├── Role* (select dropdown with role descriptions)
│   ├── Workspaces (multi-select, optional)
│   └── Personal Message (textarea, optional)
│
├── Role Selection Panel (inline cards)
│   ├── Admin
│   ├── Developer (pre-selected)
│   ├── Viewer
│   └── Billing
│
└── Actions
    ├── [Cancel]
    └── [Send Invitation →]
```

### 4.2 Invite Form Validation

```typescript
interface InviteFormData {
  emails: string[];           // Validated email addresses
  role: UserRole;
  workspaceIds: string[];
  message?: string;           // Optional personal message
}

// Validation rules
const inviteSchema = {
  emails: {
    required: true,
    validate: (emails: string[]) => {
      if (emails.length === 0) return 'At least one email is required';
      const invalid = emails.filter(e => !isValidEmail(e));
      if (invalid.length > 0) return `Invalid emails: ${invalid.join(', ')}`;
      return true;
    }
  },
  role: {
    required: true,
    validate: (role: UserRole) => {
      if (!role) return 'Please select a role';
      if (role === 'owner') return 'Cannot invite as Owner'; // Restricted
      return true;
    }
  }
};
```

### 4.3 Role Selection Cards

```tsx
const RoleSelectionCard: React.FC<{
  role: UserRole;
  config: RoleConfig;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ role, config, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={cn(
      "w-full text-left p-3 rounded-lg border transition-all duration-150",
      isSelected
        ? "bg-blue-500/10 border-blue-500/30"
        : "bg-gray-900 border-gray-800 hover:border-gray-700"
    )}
  >
    <div className="flex items-center justify-between mb-1">
      <span className={cn("text-sm font-medium", isSelected ? "text-blue-400" : "text-gray-200")}>
        {config.label}
      </span>
      <div className={cn(
        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
        isSelected ? "border-blue-400 bg-blue-400" : "border-gray-700"
      )}>
        {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
      </div>
    </div>
    <p className="text-xs text-gray-500 leading-relaxed">{config.description}</p>
  </button>
);
```

### 4.4 Bulk Invite (Multiple Emails)

```tsx
// Email tag input — type email + Enter or comma to add
const EmailTagInput: React.FC<{
  emails: string[];
  onChange: (emails: string[]) => void;
}> = ({ emails, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  
  const addEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (isValidEmail(trimmed) && !emails.includes(trimmed)) {
      onChange([...emails, trimmed]);
    }
    setInputValue('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail(inputValue);
    }
    if (e.key === 'Backspace' && !inputValue && emails.length > 0) {
      onChange(emails.slice(0, -1));
    }
  };
  
  return (
    <div className="min-h-[42px] bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 
                    flex flex-wrap gap-1.5 focus-within:border-blue-500/50 cursor-text"
         onClick={() => inputRef.current?.focus()}>
      {emails.map(email => (
        <span key={email} className="flex items-center gap-1 bg-blue-500/10 text-blue-300 
                                     border border-blue-500/20 rounded px-2 py-0.5 text-xs">
          {email}
          <X className="h-3 w-3 cursor-pointer hover:text-blue-100" onClick={() => removeEmail(email)} />
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => inputValue && addEmail(inputValue)}
        placeholder={emails.length === 0 ? "Enter email addresses..." : ""}
        className="flex-1 min-w-[200px] bg-transparent text-sm text-gray-300 
                   placeholder:text-gray-600 focus:outline-none"
      />
    </div>
  );
};
```

---

## ✏️ 5. Edit User Modal

### 5.1 Modal Structure

```
EDIT USER MODAL
├── Header: User Avatar + Name + "Edit Member"
│
├── Tabs: [Profile] [Access] [API Keys]
│
├── Profile Tab:
│   ├── Display Name (read-only, managed by user)
│   ├── Email (read-only)
│   └── Role (editable select)
│
├── Access Tab:
│   ├── Organization Access: [Role Badge]
│   ├── Workspace Access (multi-select with role per workspace)
│   └── MFA Status indicator + "Require MFA" toggle (admin only)
│
├── API Keys Tab:
│   ├── List of user's API keys (name, last used, created)
│   └── [Revoke Key] per key
│
└── Actions:
    ├── [Deactivate User] (warning button)
    ├── [Cancel]
    └── [Save Changes]
```

### 5.2 CRUD Operations

```typescript
interface UsersContextValue {
  users: User[];
  
  // Create
  inviteUser: (data: InviteFormData) => Promise<User>;
  
  // Read
  getUserById: (id: string) => User | undefined;
  getUsersByWorkspace: (workspaceId: string) => User[];
  getUsersByRole: (role: UserRole) => User[];
  
  // Update
  updateUserRole: (userId: string, role: UserRole) => void;
  updateUserWorkspaces: (userId: string, workspaceIds: string[]) => void;
  updateUserStatus: (userId: string, status: UserStatus) => void;
  
  // Delete
  removeUser: (userId: string) => void;
  
  // Computed
  activeUsersCount: number;
  pendingInvitesCount: number;
}
```

---

## 🔐 6. Permissions System

### 6.1 Permissions Matrix Display

```tsx
// Visual permissions matrix in Edit User Modal
const PermissionsMatrix: React.FC<{ role: UserRole }> = ({ role }) => {
  const resources = ['APIs', 'Gateways', 'Workspaces', 'Settings', 'Billing'];
  const actions = ['Read', 'Write', 'Delete', 'Admin'];
  const rolePermissions = ROLES[role].permissions;
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left text-gray-500 py-2 pr-4">Resource</th>
            {actions.map(a => (
              <th key={a} className="text-center text-gray-500 py-2 px-3 w-16">{a}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {resources.map(resource => {
            const key = resource.toLowerCase() as keyof typeof rolePermissions;
            const perms = rolePermissions[key] ?? [];
            
            return (
              <tr key={resource}>
                <td className="text-gray-300 py-2 pr-4 font-medium">{resource}</td>
                {actions.map(action => {
                  const hasPermission = perms.includes(action.toLowerCase() as PermissionAction);
                  return (
                    <td key={action} className="text-center py-2 px-3">
                      {hasPermission
                        ? <Check className="h-3.5 w-3.5 text-green-400 mx-auto" />
                        : <Minus className="h-3.5 w-3.5 text-gray-700 mx-auto" />
                      }
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
```

---

## 📱 7. User Details Drawer

### 7.1 Drawer Structure

```
USER DETAILS SIDE DRAWER (right side, 400px)
├── Header
│   ├── Large Avatar + Name + Role Badge
│   ├── Email
│   └── [Close X]
│
├── Status & Activity
│   ├── Account Status pill
│   ├── Last Active: "2 hours ago"
│   ├── Member Since: "March 2023"
│   └── MFA: Enabled ✅ / Disabled ❌
│
├── Workspace Access
│   └── List of workspaces with color indicators
│
├── Activity Timeline
│   ├── "Logged in" (2h ago)
│   ├── "Created API: User Auth v3" (1d ago)
│   ├── "Modified Gateway: Auth Gateway" (3d ago)
│   └── "Invited by: Sarah Johnson" (when joined)
│
├── API Keys Section
│   ├── Key 1: "Production Key" — last used 2h ago
│   ├── Key 2: "Staging Key" — last used 5d ago
│   └── [+ Generate New Key]
│
└── Footer Actions
    ├── [Edit Permissions]
    ├── [Send Reset Password Email]
    └── [Remove from Organization] (red)
```

---

## 📊 8. Users Stats Cards

### 8.1 Quick Stats Row

```typescript
interface UserStats {
  totalMembers: number;         // 10
  activeMembers: number;        // 8 (active status)
  pendingInvites: number;       // 2 (pending status)
  adminCount: number;           // owner + admin roles
  mfaEnabled: number;           // users with MFA on
  mfaPercentage: number;        // mfaEnabled / totalMembers * 100
}

const getUserStats = (users: User[]): UserStats => ({
  totalMembers: users.length,
  activeMembers: users.filter(u => u.status === 'active').length,
  pendingInvites: users.filter(u => u.status === 'pending').length,
  adminCount: users.filter(u => ['owner', 'admin'].includes(u.role)).length,
  mfaEnabled: users.filter(u => u.mfaEnabled).length,
  mfaPercentage: Math.round((users.filter(u => u.mfaEnabled).length / users.length) * 100),
});
```

### 8.2 Security Health Indicator

```tsx
// MFA adoption progress bar
<div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <ShieldCheck className="h-4 w-4 text-blue-400" />
      <span className="text-sm text-gray-300 font-medium">Security Health</span>
    </div>
    <span className="text-sm font-semibold text-gray-50">{mfaPercentage}%</span>
  </div>
  
  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
    <div
      className={cn(
        "h-full rounded-full transition-all duration-500",
        mfaPercentage >= 80 ? "bg-green-400" :
        mfaPercentage >= 50 ? "bg-yellow-400" : "bg-red-400"
      )}
      style={{ width: `${mfaPercentage}%` }}
    />
  </div>
  
  <p className="mt-2 text-xs text-gray-500">
    {mfaEnabled} of {totalMembers} members have MFA enabled
  </p>
</div>
```

---

## 🎨 9. Design Specifications

### 9.1 Role Badge Component

```tsx
const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const config = ROLES[role];
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
      config.bg, config.color, config.border
    )}>
      {role === 'owner' && <Crown className="h-3 w-3" />}
      {role === 'admin' && <Shield className="h-3 w-3" />}
      {role === 'developer' && <Code2 className="h-3 w-3" />}
      {role === 'viewer' && <Eye className="h-3 w-3" />}
      {role === 'billing' && <CreditCard className="h-3 w-3" />}
      {config.label}
    </span>
  );
};
```

### 9.2 User Status Badge

```tsx
const USER_STATUS_CONFIG = {
  active: {
    label: 'Active',
    dotColor: 'bg-green-400',
    animate: true,
    textColor: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  inactive: {
    label: 'Inactive',
    dotColor: 'bg-gray-500',
    animate: false,
    textColor: 'text-gray-400',
    bg: 'bg-gray-700/50',
    border: 'border-gray-700',
  },
  pending: {
    label: 'Pending',
    dotColor: 'bg-yellow-400',
    animate: true,
    textColor: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
};
```

### 9.3 Confirm Delete Dialog

```tsx
// Dangerous action confirmation
<AlertDialog>
  <AlertDialogContent className="bg-gray-900 border-gray-700 max-w-md">
    <AlertDialogHeader>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-red-500/10 rounded-lg">
          <UserX className="h-5 w-5 text-red-400" />
        </div>
        <AlertDialogTitle className="text-gray-50">Remove Team Member</AlertDialogTitle>
      </div>
      <AlertDialogDescription className="text-gray-400">
        Are you sure you want to remove <strong className="text-gray-200">{user.name}</strong> from 
        your organization? They will lose access to all workspaces and APIs immediately.
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    
    <AlertDialogFooter>
      <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300">
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white">
        Remove Member
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 🧪 10. Acceptance Criteria

### 10.1 Users Table ✅
- [ ] Displays all 10 mock users
- [ ] Avatar shows initials with consistent color per user
- [ ] Role badge shows with correct color
- [ ] Status badge shows with animated dot for active/pending
- [ ] Workspace pills show max 2 + overflow count
- [ ] Last active shows relative time (e.g., "2h ago")
- [ ] Table is sortable by name, role, lastActive, joinedAt
- [ ] Row hover reveals action menu

### 10.2 Invite Flow ✅
- [ ] Invite modal opens from "Invite Member" button
- [ ] Email tag input accepts multiple emails
- [ ] Invalid emails are rejected with error
- [ ] Role selection cards are mutually exclusive
- [ ] Cannot select "Owner" role
- [ ] Workspace selection is optional
- [ ] On submit: creates pending user, shows success toast
- [ ] Cancel closes without saving

### 10.3 Edit User ✅
- [ ] Edit modal pre-fills current user data
- [ ] Role change shows confirmation if reducing permissions
- [ ] Workspace changes saved correctly
- [ ] Cannot edit own role (current logged-in user)
- [ ] Cannot change owner's role
- [ ] Save updates user in list immediately

### 10.4 Delete/Deactivate ✅
- [ ] Confirmation dialog appears before destructive actions
- [ ] Deactivate changes status to 'inactive', user remains
- [ ] Remove deletes user from list
- [ ] Cannot deactivate/remove yourself
- [ ] Cannot remove the only owner

### 10.5 Permissions ✅
- [ ] Permissions matrix renders correctly for each role
- [ ] Current role's permissions are highlighted
- [ ] Permission changes reflect in matrix immediately

---

## 📁 11. Files to Create / Modify

| File Path                                              | Action | Notes                                       |
|--------------------------------------------------------|--------|---------------------------------------------|
| `src/app/pages/Users.tsx`                              | Create | Main users management page                  |
| `src/app/components/users/UsersTable.tsx`              | Create | Users data table (uses DataTable)           |
| `src/app/components/users/UserCell.tsx`                | Create | Avatar + name + email cell component        |
| `src/app/components/users/RoleBadge.tsx`               | Create | Role badge with icon                        |
| `src/app/components/users/WorkspacesPills.tsx`         | Create | Workspace access pills                      |
| `src/app/components/users/InviteModal.tsx`             | Create | Invite user modal with email tags           |
| `src/app/components/users/EditUserModal.tsx`           | Create | Edit role/workspaces modal with tabs        |
| `src/app/components/users/UserDetailsDrawer.tsx`       | Create | Right-side user details drawer              |
| `src/app/components/users/PermissionsMatrix.tsx`       | Create | Role permissions visual matrix              |
| `src/app/components/users/UserStatsCards.tsx`          | Create | 4 stats cards for user overview             |
| `src/app/components/users/EmailTagInput.tsx`           | Create | Multi-email tag input component             |
| `src/app/context/UsersContext.tsx`                     | Create | Users CRUD context (or add to AppDataContext)|
| `src/app/routes.tsx`                                   | Modify | Add `/settings/users` route                 |
| `src/app/components/dashboard/Sidebar.tsx`             | Modify | Add "Team" link under Settings              |

---

## 🔗 12. Dependencies on Other Specs

| Spec                  | Dependency Type | Notes                                        |
|-----------------------|-----------------|----------------------------------------------|
| Spec 01 — Layout      | Hard            | Users page uses standard layout              |
| Spec 03 — Tables      | Hard            | Users table uses DataTable component         |
| Spec 04 — Filters     | Hard            | Role/status/workspace filters                |

---

*Spec Version: 1.0.0 | Last Updated: April 2026 | Owner: Sopo Platform Team*
