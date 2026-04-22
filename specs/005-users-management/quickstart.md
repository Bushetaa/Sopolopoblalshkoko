# Quickstart: Users Management

## Page Entry Point

```tsx
// app/(dashboard)/settings/users/page.tsx
'use client';

import { UsersProvider, useUsers } from '@/context/UsersContext';
import { DataTable } from '@/components/data-table';
import { FilterBar } from '@/components/filters';
import { useFilters } from '@/hooks/useFilters';
import { USERS_FILTERS } from '@/lib/filter-configs';
import { UserStatsRow, SecurityHealthCard, InviteUserModal } from '@/components/users';
import { USER_TABLE_COLUMNS, USER_ROW_ACTIONS } from '@/lib/users-columns';

function UsersPageContent() {
  const { users } = useUsers();
  const { filters, ...filterActions } = useFilters();
  const [showInvite, setShowInvite] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = applyUserFilters(users, filters);

  return (
    <div className="flex flex-col gap-6 p-6">
      <UserStatsRow users={users} />
      <SecurityHealthCard users={users} />
      <FilterBar
        config={USERS_FILTERS}
        filters={filters}
        onFiltersChange={filterActions.setFilters}
        extraActions={
          <>
            <button onClick={() => setShowInvite(true)} className="btn-primary">Invite Member</button>
            <button className="btn-secondary">Export</button>
          </>
        }
      />
      <DataTable<User>
        data={filteredUsers}
        columns={USER_TABLE_COLUMNS}
        rowActions={USER_ROW_ACTIONS}
        selectable
        isLoading={false}
        onRowClick={setSelectedUser}
        searchKeys={['name', 'email']}
      />
      {showInvite && <InviteUserModal onClose={() => setShowInvite(false)} />}
      {selectedUser && <UserDetailsDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}

export default function UsersPage() {
  return (
    <UsersProvider>
      <UsersPageContent />
    </UsersProvider>
  );
}
```

## UsersContext CRUD

```tsx
const { inviteUser, updateUserRole, updateUserStatus, removeUser } = useUsers();

await inviteUser({ emails: ['new@co.com'], role: 'developer', workspaceIds: ['ws_1'] });
updateUserRole('user_3', 'viewer');
updateUserStatus('user_9', 'active');
removeUser('user_10');
```
