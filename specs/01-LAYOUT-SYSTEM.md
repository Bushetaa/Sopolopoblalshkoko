# 📐 Spec 01 — Layout System
## Sopo Platform | نظام التخطيط الهيكلي

> **Spec ID**: SOPO-SPEC-01  
> **Priority**: 🔴 Critical (Foundation for all other specs)  
> **Status**: ✅ Partially Implemented  
> **Depends On**: None (Base layer)  
> **Required By**: All other specs  

---

## 🎯 Overview | نظرة عامة

نظام التخطيط هو الهيكل الأساسي للمنصة الذي يحدد كيفية توزيع المساحات وترتيب العناصر الرئيسية. يتكون من ثلاثة أجزاء رئيسية: **Sidebar** (التنقل الجانبي)، **Topbar** (الشريط العلوي)، و**Main Content Area** (المنطقة الرئيسية للمحتوى). يجب أن يكون التخطيط متجاوبًا ويدعم جميع أحجام الشاشات.

---

## 🏗️ 1. Overall Layout Architecture

### 1.1 Layout Grid Structure

```
┌──────────────────────────────────────────────────┐
│                    TOPBAR                        │  h-16 (64px)
├───────────┬──────────────────────────────────────┤
│           │                                      │
│  SIDEBAR  │         MAIN CONTENT AREA            │
│           │                                      │
│  w-64     │         flex-1 (remainder)           │
│ (256px)   │                                      │
│           │                                      │
└───────────┴──────────────────────────────────────┘
```

### 1.2 CSS Grid / Flexbox Layout

```tsx
// Layout.tsx — Root structure
<div className="flex h-screen bg-gray-950 text-gray-50 overflow-hidden">
  <Sidebar />                          {/* w-64, fixed height */}
  <div className="flex flex-col flex-1 min-w-0">
    <Header />                         {/* h-16, sticky top */}
    <main className="flex-1 overflow-y-auto p-6">
      <Outlet />                       {/* React Router outlet */}
    </main>
  </div>
</div>
```

### 1.3 Z-Index Layering System

```
z-50   → Modals / Dialogs (above everything)
z-40   → Dropdown menus / Popovers
z-30   → Sidebar (on mobile: slides over content)
z-20   → Topbar (sticky header)
z-10   → Floating elements (tooltips, badges)
z-0    → Base content layer
```

---

## 🔲 2. Sidebar Component

### 2.1 Component Location & Files

```
src/app/components/dashboard/Sidebar.tsx   ← Main component
src/app/components/ui/sidebar.tsx          ← Radix-based primitives (reference)
```

### 2.2 Sidebar Dimensions & Positioning

| Property         | Value               | Tailwind Class      |
|------------------|---------------------|---------------------|
| Width            | 256px               | `w-64`              |
| Height           | 100vh               | `h-screen`          |
| Background       | `#030712` (Gray-950)| `bg-gray-950`       |
| Border Right     | `#1F2937` (Gray-800)| `border-r border-gray-800` |
| Position         | Sticky / Fixed      | `sticky top-0`      |
| Overflow         | Hidden, scrollable  | `overflow-y-auto`   |
| Z-Index          | 30                  | `z-30`              |

### 2.3 Sidebar Internal Structure

```
SIDEBAR
├── Logo Section (top)
│   ├── Sopo Logo SVG/Icon
│   ├── Brand Name ("Sopo")
│   └── Version Badge ("v2.0")
│
├── Navigation Menu (scrollable)
│   ├── Section: Platform
│   │   ├── Overview (no sub-items)
│   │   ├── API Manager (expandable) ▼
│   │   │   ├── Collections
│   │   │   ├── Endpoints
│   │   │   └── Documentation
│   │   ├── API Gateway (no sub-items)
│   │   └── Workspaces (no sub-items)
│   │
│   ├── Section: Monitoring
│   │   ├── Analytics Engine (expandable) ▼
│   │   │   ├── Traffic
│   │   │   ├── Performance
│   │   │   └── Reports
│   │   └── Rate Limiting (no sub-items)
│   │
│   └── Section: Configuration
│       └── Settings (expandable) ▼
│           ├── General
│           ├── Security
│           └── Integrations
│
└── User Profile Section (bottom)
    ├── Avatar + Name + Role
    └── Quick Actions (logout, etc.)
```

### 2.4 TypeScript Interfaces

```typescript
interface SubMenuItem {
  name: string;
  path: string;
  icon?: LucideIcon;
}

interface MenuItem {
  name: string;
  path: string;
  icon: LucideIcon;
  badge?: string;               // e.g., "New", "12"
  badgeVariant?: 'count' | 'label';
  subItems?: SubMenuItem[];
}

interface MenuSection {
  title: string;                // "Platform" | "Monitoring" | "Configuration"
  items: MenuItem[];
}

interface SidebarProps {
  isCollapsed?: boolean;        // For future collapse feature
  onToggleCollapse?: () => void;
}
```

### 2.5 Accordion State Management

```typescript
// State
const [expandedItems, setExpandedItems] = useState<Set<string>>(
  new Set(['API Manager'])       // Default open item
);

// Toggle function
const toggleItem = (itemName: string) => {
  setExpandedItems(prev => {
    const next = new Set(prev);
    next.has(itemName) ? next.delete(itemName) : next.add(itemName);
    return next;
  });
};

// Usage in render
const isExpanded = expandedItems.has(item.name);
```

### 2.6 Active State Logic

```typescript
const pathname = useLocation().pathname;

// Parent is active if current path starts with its path
const isParentActive = (item: MenuItem): boolean => {
  if (item.subItems) {
    return item.subItems.some(sub => pathname === sub.path);
  }
  return pathname === item.path;
};

// Sub-item is active if exact match
const isSubItemActive = (path: string): boolean => pathname === path;
```

### 2.7 Visual States & Styling Rules

#### Normal State (inactive)
```css
color: text-gray-400
background: transparent
hover → background: bg-gray-800/60, color: text-gray-200
```

#### Active State (current page)
```css
color: text-blue-400
background: bg-blue-500/10
border-left: 2px solid #3B82F6 (blue-500)
font-weight: font-medium (500)
```

#### Section Headers
```css
color: text-gray-500
font-size: text-xs
font-weight: font-semibold
letter-spacing: tracking-wider
text-transform: uppercase
padding: px-3 pb-1 pt-4
```

#### Sub-items Container
```css
margin-left: ml-3
padding-left: pl-3
border-left: border-l border-gray-800  /* Visual guide line */
margin-top: mt-1
space-y-0.5
```

### 2.8 Chevron Animation Spec

```tsx
// Animated chevron icon
<ChevronRight
  className={cn(
    "h-4 w-4 text-gray-500 transition-transform duration-200 ease-out",
    isExpanded && "rotate-90"          // 90° rotation when open
  )}
/>
```

### 2.9 Expand/Collapse Animation

```tsx
// Smooth accordion content reveal
<div
  className={cn(
    "overflow-hidden transition-all duration-300 ease-in-out",
    isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
  )}
>
  {/* Sub-items list */}
</div>
```

### 2.10 Sidebar — Complete Navigation Map

```typescript
const MENU_SECTIONS: MenuSection[] = [
  {
    title: "Platform",
    items: [
      {
        name: "Overview",
        path: "/",
        icon: LayoutDashboard
      },
      {
        name: "API Manager",
        path: "/api-manager",
        icon: Code2,
        subItems: [
          { name: "Collections", path: "/api-manager/collections", icon: FolderOpen },
          { name: "Endpoints", path: "/api-manager/endpoints", icon: Link2 },
          { name: "Documentation", path: "/api-manager/docs", icon: FileText }
        ]
      },
      {
        name: "API Gateway",
        path: "/api-gateway",
        icon: Globe
      },
      {
        name: "Workspaces",
        path: "/workspaces",
        icon: Briefcase
      }
    ]
  },
  {
    title: "Monitoring",
    items: [
      {
        name: "Analytics Engine",
        path: "/analytics",
        icon: BarChart3,
        badge: "Live",
        badgeVariant: "label",
        subItems: [
          { name: "Traffic", path: "/analytics/traffic", icon: Activity },
          { name: "Performance", path: "/analytics/performance", icon: Gauge },
          { name: "Reports", path: "/analytics/reports", icon: FileBarChart }
        ]
      },
      {
        name: "Rate Limiting",
        path: "/rate-limiting",
        icon: Zap
      }
    ]
  },
  {
    title: "Configuration",
    items: [
      {
        name: "Settings",
        path: "/settings",
        icon: Settings,
        subItems: [
          { name: "General", path: "/settings/general", icon: SlidersHorizontal },
          { name: "Security", path: "/settings/security", icon: Shield },
          { name: "Integrations", path: "/settings/integrations", icon: Plug }
        ]
      }
    ]
  }
];
```

### 2.11 Future: Collapsible Sidebar

```typescript
// Collapsed state: w-64 → w-16
// Show only icons, hide text labels
// Hover to expand (mini-sidebar)
interface SidebarState {
  isCollapsed: boolean;          // false by default
  width: '64' | '16';           // 256px or 64px
}
```

---

## 🔝 3. Topbar (Header) Component

### 3.1 Component Location

```
src/app/components/dashboard/Header.tsx
```

### 3.2 Topbar Dimensions & Styling

| Property         | Value              | Tailwind Class                        |
|------------------|--------------------|---------------------------------------|
| Height           | 64px               | `h-16`                                |
| Position         | Sticky top         | `sticky top-0 z-20`                   |
| Background       | `#030712`          | `bg-gray-950`                         |
| Border Bottom    | `#1F2937`          | `border-b border-gray-800`            |
| Padding          | 24px horizontal    | `px-6`                                |
| Layout           | Flexbox, centered  | `flex items-center justify-between`   |

### 3.3 Topbar Internal Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Page Title + Breadcrumb]    [Search Bar]    [Actions + Avatar] │
└─────────────────────────────────────────────────────────────────┘
  ← LEFT SECTION →           ← CENTER →        ← RIGHT SECTION → 
```

### 3.4 Left Section — Page Context

```tsx
// Dynamic page title from route
<div className="flex flex-col">
  {/* Breadcrumb */}
  <nav className="flex items-center gap-1.5 text-xs text-gray-500">
    <span>Platform</span>
    <ChevronRight className="h-3 w-3" />
    <span className="text-gray-300">API Manager</span>
  </nav>
  
  {/* Page Title */}
  <h1 className="text-lg font-semibold text-gray-50">
    API Manager
  </h1>
</div>
```

### 3.5 Center Section — Global Search

```tsx
// Command-K shortcut search
<div className="relative max-w-sm w-full">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
  <input
    type="text"
    placeholder="Search APIs, Gateways... ⌘K"
    className="
      w-full bg-gray-900 border border-gray-800 
      rounded-lg pl-9 pr-4 py-2
      text-sm text-gray-300 placeholder:text-gray-600
      focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20
      transition-all duration-150
    "
  />
</div>
```

**Search Spec:**
- Keyboard shortcut: `⌘K` (Mac) / `Ctrl+K` (Windows)
- Opens a modal Command Palette on shortcut trigger
- Searches across: APIs, Gateways, Workspaces, Collections
- Debounce: 300ms

### 3.6 Right Section — Actions Bar

```
[Docs Link] [Notifications Bell] [Avatar Dropdown]
```

#### Notifications Bell

```tsx
interface Notification {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Badge shows unread count
<div className="relative">
  <Bell className="h-5 w-5 text-gray-400" />
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs
                     rounded-full w-4 h-4 flex items-center justify-center">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  )}
</div>
```

#### User Avatar & Dropdown

```tsx
interface UserProfile {
  name: string;            // "John Doe"
  email: string;           // "john@company.com"
  role: string;            // "Admin" | "Developer" | "Viewer"
  avatarUrl?: string;      // Fallback to initials
}

// Dropdown menu items:
// - Profile Settings
// - Organization Settings
// - Switch Workspace (if multiple)
// - Keyboard Shortcuts
// - Separator
// - Sign Out
```

### 3.7 Topbar TypeScript Interface

```typescript
interface HeaderProps {
  pageTitle?: string;           // Auto-derived from route if not provided
  breadcrumbs?: Array<{
    label: string;
    path?: string;
  }>;
  actions?: React.ReactNode;    // Custom action buttons per page
}
```

---

## 📱 4. Responsive Layout System

### 4.1 Breakpoints Reference

```
Mobile:   < 768px   (sm breakpoint)
Tablet:   768-1024px (md breakpoint)
Desktop:  > 1024px  (lg breakpoint)
Wide:     > 1280px  (xl breakpoint)
```

### 4.2 Responsive Behavior Per Breakpoint

| Element        | Mobile (<768px)        | Tablet (768-1024px)     | Desktop (>1024px)    |
|----------------|------------------------|--------------------------|----------------------|
| Sidebar        | Hidden, drawer overlay | Collapsed (icons only)   | Full width (256px)   |
| Topbar         | Full width, hamburger  | Full width               | Full width           |
| Main Content   | Full width             | Full width               | Flex-1               |
| Grid Columns   | 1 col                  | 2 cols                   | 3-4 cols             |
| Search Bar     | Hidden (icon only)     | Condensed                | Full width           |

### 4.3 Mobile Sidebar Implementation

```typescript
// Mobile: Sidebar as Drawer
const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

// Hamburger in Topbar triggers it
// Sidebar overlays content with backdrop blur
```

```tsx
// Mobile Drawer Overlay
<div className={cn(
  "fixed inset-0 z-40 lg:hidden",
  isMobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
)}>
  {/* Backdrop */}
  <div
    className={cn(
      "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
      isMobileSidebarOpen ? "opacity-100" : "opacity-0"
    )}
    onClick={() => setIsMobileSidebarOpen(false)}
  />
  
  {/* Sidebar Panel */}
  <div className={cn(
    "absolute left-0 top-0 h-full w-64 bg-gray-950 transition-transform duration-300",
    isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
  )}>
    <Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
  </div>
</div>
```

### 4.4 Responsive Grid System for Content Areas

```tsx
// Stats cards grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {metrics.map(metric => <MetricCard key={metric.id} {...metric} />)}
</div>

// Charts grid
<div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
  <div className="xl:col-span-2">      {/* Main chart: 2/3 width */}
    <TrafficChart />
  </div>
  <div className="xl:col-span-1">      {/* Side panel: 1/3 width */}
    <TopAPIsPanel />
  </div>
</div>
```

---

## 🎨 5. Layout Design Tokens

### 5.1 Spacing System

```css
/* Layout-specific spacings */
--sidebar-width: 256px          /* 16rem / w-64 */
--sidebar-collapsed: 64px       /* 4rem / w-16 (future) */
--topbar-height: 64px           /* 4rem / h-16 */
--content-padding: 24px         /* 1.5rem / p-6 */
--section-gap: 24px             /* gap-6 between content sections */
--card-gap: 16px                /* gap-4 between cards */
```

### 5.2 Transitions

```css
/* Sidebar expand/collapse */
--transition-sidebar: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* Accordion items */
--transition-accordion: max-height 300ms ease-in-out, opacity 200ms ease;

/* Menu items hover */
--transition-hover: background-color 150ms ease, color 150ms ease;

/* Chevron rotation */
--transition-chevron: transform 200ms ease-out;
```

---

## 🧪 6. Acceptance Criteria

### 6.1 Sidebar ✅ Requirements

- [ ] Renders 3 named sections (Platform, Monitoring, Configuration)
- [ ] Each expandable item shows/hides sub-items on click
- [ ] Chevron rotates 90° when expanded
- [ ] Active page highlights correct menu item
- [ ] Parent highlights when any child is active
- [ ] Expand/collapse animation is smooth (300ms)
- [ ] Sidebar doesn't push content on mobile (uses overlay)
- [ ] Logo + brand name visible at top
- [ ] User profile section at bottom

### 6.2 Topbar ✅ Requirements

- [ ] Displays dynamic page title matching current route
- [ ] Breadcrumb updates on navigation
- [ ] Search input is functional with debounce
- [ ] Notification bell shows unread count badge
- [ ] User avatar dropdown has correct menu items
- [ ] Topbar stays sticky on scroll
- [ ] Hamburger menu appears on mobile (< 768px)

### 6.3 Responsive ✅ Requirements

- [ ] Layout renders correctly on 320px, 768px, 1024px, 1440px widths
- [ ] Sidebar converts to drawer on mobile
- [ ] Content grid collapses to 1 column on mobile
- [ ] No horizontal scroll on any breakpoint
- [ ] Touch-friendly interactions on mobile (min 44px tap targets)

---

## 📁 7. Files to Create / Modify

| File Path                                         | Action   | Notes                              |
|---------------------------------------------------|----------|------------------------------------|
| `src/app/Layout.tsx`                              | Modify   | Add responsive wrapper + mobile drawer |
| `src/app/components/dashboard/Sidebar.tsx`        | Modify   | Add user profile section, improve accordion |
| `src/app/components/dashboard/Header.tsx`         | Modify   | Add breadcrumbs, command-K search  |
| `src/app/components/layout/MobileSidebar.tsx`     | Create   | Mobile drawer wrapper              |
| `src/app/components/layout/CommandPalette.tsx`    | Create   | Global search modal (⌘K)           |
| `src/app/hooks/useLayout.ts`                      | Create   | Layout state hook (sidebar open/closed) |
| `src/app/hooks/useBreadcrumbs.ts`                 | Create   | Auto-generate breadcrumbs from route |

---

## 🔗 8. Dependencies on Other Specs

| Spec                    | Dependency Type  | Notes                                       |
|-------------------------|------------------|---------------------------------------------|
| Spec 02 — Analytics     | Soft             | Analytics page renders in main content area |
| Spec 03 — Data Tables   | Soft             | Tables render in main content area          |
| Spec 04 — Filters       | Soft             | Filters render inside page content          |
| Spec 05 — Users Mgmt   | Soft             | Users page uses same layout wrapper         |
| Spec 06 — Reports       | Soft             | Reports modal uses z-index from this spec   |

---

*Spec Version: 1.0.0 | Last Updated: April 2026 | Owner: Sopo Platform Team*
