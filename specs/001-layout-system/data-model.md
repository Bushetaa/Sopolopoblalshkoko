# Data Models: Layout System

The Layout System primarily relies on presentational models rather than backend databases. This file covers: TypeScript interfaces, the complete navigation config, Z-index system, CSS design tokens, and visual state specs — all derived from `../01-LAYOUT-SYSTEM.md`.

## Navigation System Models

```typescript
export interface SubMenuItem {
  name: string;
  path: string;
  icon?: any; // LucideIcon reference
}

export interface MenuItem {
  name: string;
  path: string;
  icon: any; // LucideIcon reference
  badge?: string;
  badgeVariant?: 'count' | 'label';
  subItems?: SubMenuItem[];
}

export interface MenuSection {
  title: string; // e.g. "Platform", "Monitoring", "Configuration"
  items: MenuItem[];
}
```

---

## Complete Navigation Config (`MENU_SECTIONS`)

This is the static data constant to be used directly in `Sidebar.tsx`. Derived from §2.10 of the master spec.

```typescript
import {
  LayoutDashboard, Code2, Globe, Briefcase,
  BarChart3, Zap, Settings,
  FolderOpen, Link2, FileText,
  Activity, Gauge, FileBarChart,
  SlidersHorizontal, Shield, Plug
} from 'lucide-react';

export const MENU_SECTIONS: MenuSection[] = [
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
          { name: "Collections",   path: "/api-manager/collections", icon: FolderOpen },
          { name: "Endpoints",     path: "/api-manager/endpoints",   icon: Link2 },
          { name: "Documentation", path: "/api-manager/docs",        icon: FileText }
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
          { name: "Traffic",     path: "/analytics/traffic",     icon: Activity },
          { name: "Performance", path: "/analytics/performance", icon: Gauge },
          { name: "Reports",     path: "/analytics/reports",     icon: FileBarChart }
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
          { name: "General",      path: "/settings/general",      icon: SlidersHorizontal },
          { name: "Security",     path: "/settings/security",     icon: Shield },
          { name: "Integrations", path: "/settings/integrations", icon: Plug }
        ]
      }
    ]
  }
];
```

---

## Topbar Models

```typescript
export interface Notification {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface HeaderProps {
  pageTitle?: string;
  breadcrumbs?: Array<{
    label: string;
    path?: string;
  }>;
  actions?: React.ReactNode;
}
```

## Layout Control Models

```typescript
export interface SidebarState {
  isCollapsed: boolean;
  width: '64' | '16'; // 256px or 64px (future collapsed state)
}

export interface LayoutState {
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}
```

---

## Z-Index Layering System

Derived from §1.3 of the master spec. Must be respected globally across all components.

| Layer             | z-index | Use Case                              |
|-------------------|---------|---------------------------------------|
| Modals / Dialogs  | `z-50`  | Above everything (alerts, confirmations) |
| Dropdowns / Popovers | `z-40` | Dropdown menus, date pickers         |
| Sidebar (mobile)  | `z-30`  | Slides over content on mobile         |
| Topbar            | `z-20`  | Sticky header, stays above content    |
| Floating elements | `z-10`  | Tooltips, badges                      |
| Base content      | `z-0`   | Normal page content                   |

```css
/* Recommended CSS custom properties */
--z-modal:    50;
--z-dropdown: 40;
--z-sidebar:  30;
--z-topbar:   20;
--z-floating: 10;
--z-base:      0;
```

---

## Design Tokens (CSS Variables)

Derived from §5.1 and §5.2 of the master spec. Define these in `globals.css` or a dedicated `tokens.css`.

### Spacing

```css
:root {
  /* Layout dimensions */
  --sidebar-width:     256px;  /* w-64 */
  --sidebar-collapsed: 64px;   /* w-16 — future collapsed state */
  --topbar-height:     64px;   /* h-16 */

  /* Content spacing */
  --content-padding: 24px;     /* p-6 */
  --section-gap:     24px;     /* gap-6 between sections */
  --card-gap:        16px;     /* gap-4 between cards */
}
```

### Transitions

```css
:root {
  /* Sidebar slide-in/out (mobile drawer) */
  --transition-sidebar:  transform 300ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Accordion expand/collapse */
  --transition-accordion: max-height 300ms ease-in-out, opacity 200ms ease;

  /* Menu item hover */
  --transition-hover: background-color 150ms ease, color 150ms ease;

  /* Chevron rotation */
  --transition-chevron: transform 200ms ease-out;
}
```

---

## Visual States — Styling Reference

Derived from §2.7 of the master spec. Must be applied consistently across `Sidebar.tsx`.

### Menu Item — Normal (Inactive)

```css
color:      text-gray-400;
background: transparent;
/* hover → */
background: bg-gray-800/60;
color:      text-gray-200;
```

### Menu Item — Active (Current Page)

```css
color:       text-blue-400;
background:  bg-blue-500/10;
border-left: 2px solid #3B82F6; /* blue-500 */
font-weight: font-medium;       /* 500 */
```

### Section Headers (Platform / Monitoring / Configuration labels)

```css
color:          text-gray-500;
font-size:      text-xs;
font-weight:    font-semibold;
letter-spacing: tracking-wider;
text-transform: uppercase;
padding:        px-3 pb-1 pt-4;
```

### Sub-items Container

```css
margin-left:  ml-3;
padding-left: pl-3;
border-left:  border-l border-gray-800; /* visual guide line */
margin-top:   mt-1;
spacing:      space-y-0.5;
```

### Chevron Rotation Animation

```tsx
// Collapsed → 0deg | Expanded → 90deg
<ChevronRight
  className={cn(
    "h-4 w-4 text-gray-500 transition-transform duration-200 ease-out",
    isExpanded && "rotate-90"
  )}
/>
```

### Accordion Content Reveal

```tsx
<div
  className={cn(
    "overflow-hidden transition-all duration-300 ease-in-out",
    isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
  )}
>
  {/* sub-items list */}
</div>
```

---

## Responsive Behavior Reference

Derived from §4.2 of the master spec.

| Element       | Mobile (<768px)             | Tablet (768–1024px)       | Desktop (>1024px)    |
|---------------|-----------------------------|---------------------------|----------------------|
| Sidebar       | Hidden → drawer overlay     | Collapsed (icons only)    | Full width (256px)   |
| Topbar        | Full width + hamburger icon | Full width                | Full width           |
| Main Content  | Full width                  | Full width                | flex-1               |
| Grid Columns  | 1 col                       | 2 cols                    | 3–4 cols             |
| Search Bar    | Hidden (icon only)          | Condensed                 | Full                 |

### Responsive Content Grid

```tsx
// Stats / metric cards
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {metrics.map(m => <MetricCard key={m.id} {...m} />)}
</div>

// Charts — 2/3 + 1/3 split
<div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
  <div className="xl:col-span-2"><TrafficChart /></div>
  <div className="xl:col-span-1"><TopAPIsPanel /></div>
</div>
```
