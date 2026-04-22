# Component API Contracts: Layout System

Derived from `../01-LAYOUT-SYSTEM.md` §2.4, §3.7, §4.3.  
These define the **public surface** of each component — props, emitted events, and constraints.

---

## `<Sidebar />` Contract

**File**: `src/app/components/dashboard/Sidebar.tsx`

```typescript
interface SidebarProps {
  // Future: support collapsed mini-sidebar mode
  isCollapsed?: boolean;          // default: false
  onToggleCollapse?: () => void;

  // Mobile: callback to close drawer from within the sidebar
  onClose?: () => void;
}
```

**Internal state** (not exposed as props):
```typescript
const [expandedItems, setExpandedItems] = useState<Set<string>>(
  new Set(['API Manager'])   // Default: API Manager open on first load
);
```

**Active state logic**:
```typescript
// Parent is active if any of its children match the current path
const isParentActive = (item: MenuItem): boolean => {
  if (item.subItems) return item.subItems.some(sub => pathname === sub.path);
  return pathname === item.path;
};

// Sub-item: exact path match only
const isSubItemActive = (path: string): boolean => pathname === path;
```

**Constraints**:
- Must consume `MENU_SECTIONS` from `../data-model.md`
- Must NOT manage mobile-open state internally (owned by parent Layout)
- Width: `w-64` (256px) on desktop, full-height `h-screen`

---

## `<Header />` Contract

**File**: `src/app/components/dashboard/Header.tsx`

```typescript
interface HeaderProps {
  pageTitle?: string;           // Auto-derived from route if omitted
  breadcrumbs?: Array<{
    label: string;
    path?: string;              // Clickable if provided
  }>;
  actions?: React.ReactNode;    // Slot for per-page action buttons
  onMobileMenuOpen?: () => void; // Triggers MobileSidebar to open
}
```

**Right section items** (fixed, always rendered):
```
[Docs Link]  →  external link to documentation
[Notifications Bell]  →  badge with unread count
[User Avatar]  →  dropdown menu with:
    - Profile Settings
    - Organization Settings
    - Switch Workspace
    - Keyboard Shortcuts
    ─────────────────
    - Sign Out
```

**Constraints**:
- Height: `h-16` (64px), `sticky top-0 z-20`
- Hamburger icon: visible only on `lg:hidden` breakpoints
- Search bar: visible in full on desktop; condensed on tablet; icon-only on mobile

---

## `<MobileSidebar />` Contract

**File**: `src/app/components/layout/MobileSidebar.tsx`

```typescript
interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Rendering**:
```tsx
// Only active below lg breakpoint (lg:hidden)
<div className={cn(
  "fixed inset-0 z-40 lg:hidden",
  isOpen ? "pointer-events-auto" : "pointer-events-none"
)}>
  {/* Backdrop */}
  <div
    className={cn(
      "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
      isOpen ? "opacity-100" : "opacity-0"
    )}
    onClick={onClose}
  />
  {/* Sidebar Panel */}
  <div className={cn(
    "absolute left-0 top-0 h-full w-64 bg-gray-950 transition-transform duration-300",
    isOpen ? "translate-x-0" : "-translate-x-full"
  )}>
    <Sidebar onClose={onClose} />
  </div>
</div>
```

**Constraints**:
- `z-40` (above topbar at `z-20`, below modals at `z-50`)
- Backdrop click → triggers `onClose`
- Slide-in duration: `300ms`

---

## `<CommandPalette />` Contract

**File**: `src/app/components/layout/CommandPalette.tsx`

```typescript
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Trigger**: Global `keydown` listener for `Cmd+K` (Mac) / `Ctrl+K` (Windows).  
**Search scope**: APIs, Gateways, Workspaces, Collections.  
**Debounce**: 300ms.  
**z-index**: `z-50` (topmost layer — modal).

---

## Hooks Contracts

### `useLayout.ts`

```typescript
export function useLayout(): {
  isMobileSidebarOpen: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;
}
```

### `useBreadcrumbs.ts`

```typescript
export function useBreadcrumbs(): Array<{
  label: string;
  path?: string;
}>
// Derives breadcrumb segments from usePathname() (Next.js)
// e.g. /api-manager/endpoints → ["Platform", "API Manager", "Endpoints"]
```
