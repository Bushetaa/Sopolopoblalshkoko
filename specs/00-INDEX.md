# 📚 Sopo Platform — Spec-Kit Index
## فهرس الـ Spec Files الكاملة

> **Project**: Sopo — Enterprise API Lifecycle Automation Dashboard  
> **Stack**: React 18 + TypeScript + Tailwind CSS v4 + Recharts  
> **Theme**: Dark Mode (Gray + Blue/Purple accent)  
> **Last Updated**: April 2026  

---

## 📁 Spec Files Overview

| Spec ID        | File                         | Feature              | Priority    | Status              | Dependencies      |
|----------------|------------------------------|----------------------|-------------|---------------------|-------------------|
| SOPO-SPEC-01   | `01-LAYOUT-SYSTEM.md`        | Layout System        | 🔴 Critical | ✅ Partial          | None (Base)       |
| SOPO-SPEC-02   | `02-ANALYTICS.md`            | Analytics & Charts   | 🔴 Critical | 🟡 Partial          | Spec 01           |
| SOPO-SPEC-03   | `03-DATA-TABLE-SYSTEM.md`    | Data Tables          | 🟠 High     | 🟡 Partial          | Spec 01           |
| SOPO-SPEC-04   | `04-FILTERS-SYSTEM.md`       | Filters              | 🟠 High     | 🔴 Not Started      | Spec 01, 03       |
| SOPO-SPEC-05   | `05-USERS-MANAGEMENT.md`     | Users & Permissions  | 🟡 Medium   | 🔴 Not Started      | Spec 01, 03, 04   |
| SOPO-SPEC-06   | `06-REPORTS-INSIGHTS.md`     | Reports & Export     | 🟡 Medium   | 🔴 Not Started      | Spec 01, 02, 03   |

---

## 🗺️ Implementation Order (Recommended)

```
Phase 1 — Foundation (Week 1-2)
  └── SPEC-01: Layout System
        ├── Sidebar improvements (user profile, fully working accordion)
        ├── Topbar (breadcrumbs, command-K search)
        └── Responsive mobile drawer

Phase 2 — Core Features (Week 2-3)
  ├── SPEC-03: Data Table System
  │     └── Generic reusable DataTable with sort + pagination + search + selection
  └── SPEC-04: Filters System
        └── DateRangePicker + CategoryFilters + FilterChips

Phase 3 — Analytics (Week 3-4)
  └── SPEC-02: Analytics Page
        ├── KPI Cards with sparklines
        ├── Traffic Area Chart (enhanced)
        ├── Pie/Donut + Bar charts
        └── Live Logs improvements

Phase 4 — Advanced Features (Week 4-5)
  ├── SPEC-05: Users Management
  │     └── Full CRUD with invite, roles, permissions
  └── SPEC-06: Reports & Insights
        ├── Export system (CSV, JSON)
        ├── Scheduled reports
        └── Auto-generated insights
```

---

## 🔗 Dependency Graph

```
                    SPEC-01: Layout
                    (Foundation ✅)
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    SPEC-02:        SPEC-03:         SPEC-04:
    Analytics       Data Tables      Filters
    🟡 Partial      🟡 Partial       🔴 TODO
         │               │               │
         └───────────────┴───────────────┤
                         ▼               │
                    SPEC-05:            SPEC-06:
                    Users Mgmt    ◄─────Reports
                    🔴 TODO            🔴 TODO
```

---

## 📊 Coverage Summary Per Spec

### SPEC-01: Layout System
- **Sidebar**: Accordion ✅ | Responsive 🟡 | User Profile 🔴 | Collapse 🔴
- **Topbar**: Basic ✅ | Breadcrumbs 🔴 | Command-K 🔴
- **Mobile**: Not implemented 🔴

### SPEC-02: Analytics
- **KPI Cards**: Basic ✅ | Sparklines 🔴 | Skeleton 🔴
- **Traffic Chart**: Basic ✅ | Brush/Zoom 🔴 | Dual-axis 🔴
- **Pie Chart**: 🔴 | Bar/Histogram: 🔴 | Live Logs: ✅

### SPEC-03: Data Table System
- **Basic Tables**: ✅ | Generic Component: 🔴
- **Sorting**: 🟡 (per-page) | Pagination: 🟡 | Selection: 🔴
- **Bulk Actions**: 🔴 | Status Badges: 🟡

### SPEC-04: Filters System
- **Inline Filters**: 🟡 (per-page, not reusable)
- **DateRangePicker**: 🔴 | FilterChips: 🔴
- **Filter Persistence**: 🔴

### SPEC-05: Users Management
- **Page**: 🔴 | **Table**: 🔴 | **CRUD**: 🔴
- **Invite Flow**: 🔴 | **Permissions**: 🔴

### SPEC-06: Reports & Insights
- **Report Templates**: 🔴 | **Export (CSV/JSON)**: 🔴
- **Scheduled Reports**: 🔴 | **Insights**: 🔴

---

## 🧩 Reusable Components Across Specs

| Component              | Used In Specs      | File Path                                      |
|------------------------|--------------------|------------------------------------------------|
| `DataTable`            | 03, 05, 06         | `components/table/DataTable.tsx`               |
| `StatusBadge`          | 02, 03, 05         | `components/table/StatusBadge.tsx`             |
| `FilterBar`            | 03, 04, 05         | `components/filters/FilterBar.tsx`             |
| `DateRangePicker`      | 02, 04, 06         | `components/filters/DateRangePicker.tsx`       |
| `ExportDropdown`       | 03, 06             | `components/reports/ExportDropdown.tsx`        |
| `MetricCard`           | 02, 05             | `components/dashboard/MetricCard.tsx`          |
| `ConfirmDialog`        | 03, 05, 06         | `components/ui/alert-dialog.tsx` (existing)    |
| `FilterChips`          | 04, 05             | `components/filters/FilterChips.tsx`           |

---

## 📐 Design System Quick Reference

### Colors
```
Primary Background:  #030712  (gray-950)
Card Background:     #111827  (gray-900)
Border:              #1F2937  (gray-800)
Hover:               #374151  (gray-700)
Text Primary:        #F9FAFB  (gray-50)
Text Secondary:      #9CA3AF  (gray-400)
Text Muted:          #6B7280  (gray-500)
Accent Blue:         #60A5FA  (blue-400)
Accent Purple:       #A855F7  (purple-500)
Success:             #4ADE80  (green-400)
Warning:             #FBBF24  (yellow-400)
Error:               #F87171  (red-400)
```

### Typography
```
Page Title:    text-xl  | font-semibold | text-gray-50
Section Title: text-sm  | font-semibold | text-gray-50
Body:          text-sm  | font-normal   | text-gray-300
Muted:         text-xs  | font-normal   | text-gray-500
Labels:        text-xs  | font-medium   | text-gray-500 | uppercase | tracking-wider
```

### Spacing
```
Page padding:    p-6  (24px)
Section gap:     gap-6 (24px)
Card gap:        gap-4 (16px)
Card padding:    p-5 (20px)
Sidebar width:   w-64 (256px)
Topbar height:   h-16 (64px)
```

---

## 📝 How to Use These Specs

1. **Start with SPEC-01** — Foundation must be solid before building on top
2. **Each spec is self-contained** — It references other specs but can be read independently
3. **Acceptance criteria are checkboxes** — Use them to verify implementation
4. **Mock data is provided** — Use the exact data structures defined in each spec
5. **Files to Create/Modify** — Each spec has a table of files to change
6. **Copy TypeScript interfaces** — They are ready to paste into code directly

---

## 🔍 Quick Search Guide

| I need to...                             | See Spec    | Section          |
|------------------------------------------|-------------|------------------|
| Add sidebar navigation item              | Spec 01     | §2.10            |
| Style a sortable table column header     | Spec 03     | §3.2             |
| Add a date range picker                  | Spec 04     | §2              |
| Create a new chart with dark theme       | Spec 02     | §3.1             |
| Add role-based access control            | Spec 05     | §6               |
| Export data to CSV                       | Spec 06     | §3.5             |
| Style a status badge                     | Spec 03     | §8.4             |
| Generate auto insights                   | Spec 06     | §5.2             |
| Handle pagination state                  | Spec 03     | §4.1             |
| Show filter chips for active filters     | Spec 04     | §4              |

---

*Spec-Kit Version: 1.0.0 | Project: Sopo Platform | April 2026*
