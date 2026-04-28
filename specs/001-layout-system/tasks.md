# Tasks: Layout System

**Input**: Design documents from `/specs/001-layout-system/`
**Prerequisites**: plan.md (required), spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Dashboard Layout entry**: `app/(dashboard)/layout.tsx`
- **Dashboard components**: `components/dashboard/`
- **Shared layout wrappers**: `components/layout/`
- **Hooks**: `hooks/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create component directories for layout system per implementation plan (`components/dashboard/`, `components/layout/` — already partially exist; verify `dashboard/` subfolder is present)
- [x] T002 [P] Confirm `lucide-react` is installed (already in package.json — no action needed; verify import works)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create `app/(dashboard)/layout.tsx` — root dashboard layout with CSS grid/flex structure (`flex h-screen bg-gray-950 overflow-hidden`); this is separate from the marketing `app/layout.tsx`
- [x] T004 [P] Add Z-Index CSS custom properties and design tokens to `app/globals.css` per the specs in `specs/001-layout-system/data-model.md` (Z-index section + Design Tokens section)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Global Navigation via Expandable Sidebar (Priority: P1) 🎯 MVP

**Goal**: Establish the primary left-hand navigation with hierarchical Accordion data structure and User Profile section.

**Independent Test**: Load the page, sidebar should be visible, items expandable gracefully with 300ms transition.

### Implementation for User Story 1

- [x] T005 [P] [US1] Create `components/dashboard/Sidebar.tsx` — import `MENU_SECTIONS` const from `data-model.md` and define the TypeScript interfaces (`MenuItem`, `MenuSection`, `SubMenuItem`)
- [x] T006 [US1] Implement base Sidebar UI frame in `components/dashboard/Sidebar.tsx` — `w-64 flex flex-col h-screen bg-gray-950 border-r border-gray-800 z-30`
- [x] T007 [US1] Build Accordion toggle logic in `components/dashboard/Sidebar.tsx` using `useState<Set<string>>(new Set(['API Manager']))` — see `specs/001-layout-system/data-model.md` Visual States section
- [x] T008 [US1] Build the User Profile footer section in `components/dashboard/Sidebar.tsx` (Avatar + Name + Role + logout action)
- [x] T009 [US1] Integrate `<Sidebar />` inside `app/(dashboard)/layout.tsx` — desktop only via `hidden lg:block w-64`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Rapid Global Search & Actions (Priority: P1)

**Goal**: Implement the Topbar (`Header`) featuring a Command-K modal layer and basic action buttons.

**Independent Test**: User can hit Cmd+K at any time to focus global search, Bell icon shows unread counts.

### Implementation for User Story 2

- [x] T010 [P] [US2] Create `components/dashboard/Header.tsx` — `h-16 sticky top-0 z-20 bg-gray-950 border-b border-gray-800 px-6 flex items-center justify-between`; include hamburger (lg:hidden), breadcrumbs, search bar, Docs link, Notifications bell (with unread badge), and User avatar dropdown
- [x] T011 [P] [US2] Create `components/layout/CommandPalette.tsx` — `z-50` modal, accepts `isOpen` + `onClose` props; searches across APIs/Gateways/Workspaces/Collections with 300ms debounce
- [x] T012 [US2] Wire global `Cmd+K` / `Ctrl+K` `keydown` listener (via `useEffect`) in `app/(dashboard)/layout.tsx` to toggle CommandPalette open state
- [x] T013 [US2] Integrate `<Header />` inside `app/(dashboard)/layout.tsx` above the `<main>` outlet

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mobile/Responsive Access via Drawer (Priority: P2)

**Goal**: Guarantee <768px viewports use a hamburger menu controlling a slide-over mobile drawer instead of breaking layout.

**Independent Test**: Resize window below 768px, Sidebar collapses, click hamburger, Sidebar slides out over darkness overlay.

### Implementation for User Story 3

- [x] T014 [P] [US3] Create `components/layout/MobileSidebar.tsx` — `fixed inset-0 z-40 lg:hidden` wrapper with backdrop overlay (`bg-black/60 backdrop-blur-sm`) and slide-in panel (`w-64 bg-gray-950 transition-transform duration-300`); accepts `isOpen` + `onClose` props
- [x] T015 [US3] Add hamburger button to `components/dashboard/Header.tsx` — `lg:hidden` only, triggers `onMobileMenuOpen` prop callback
- [x] T016 [US3] Create `hooks/useLayout.ts` — manages `isMobileSidebarOpen` boolean state, exposes `openMobileSidebar`, `closeMobileSidebar`, `toggleMobileSidebar` per the contract in `specs/001-layout-system/contracts/component-api.md`
- [x] T017 [US3] Inject `<MobileSidebar isOpen={...} onClose={...} />` into `app/(dashboard)/layout.tsx`; wire to `useLayout` hook

**Checkpoint**: All core UI components function at all standard device sizes.

---

## Phase 6: User Story 4 - Breadcrumb Contextual Tracking (Priority: P3)

**Goal**: Dynamic trail mapping for nested navigation routes appearing on the left side of the Header.

**Independent Test**: Navigate to `/api-manager/endpoints`, header outputs "Platform > API Manager > Endpoints".

### Implementation for User Story 4

- [x] T018 [P] [US4] Create `hooks/useBreadcrumbs.ts` — use Next.js `usePathname()` to parse route segments and produce `Array<{ label: string; path?: string }>` as specified in `specs/001-layout-system/contracts/component-api.md`; e.g. `/api-manager/endpoints` → `["Platform", "API Manager", "Endpoints"]`
- [x] T019 [US4] Integrate `useBreadcrumbs()` hook into `components/dashboard/Header.tsx` replacing any static page title; render breadcrumb trail per `01-LAYOUT-SYSTEM.md` §3.4 styling

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T020 Review scroll behavior: `app/(dashboard)/layout.tsx` root must be `overflow-hidden`; Sidebar nav area uses `overflow-y-auto`; `<main>` uses `flex-1 overflow-y-auto p-6`
- [x] T021 Verify all CSS custom properties from `data-model.md` Design Tokens section are present in `app/globals.css` (`--sidebar-width`, `--topbar-height`, `--transition-sidebar`, etc.)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 & 2 can be developed entirely in parallel.
  - User Story 3 requires both Story 1 (Sidebar element) and Story 2 (Header Hamburger) to be fundamentally mapped out.
  - User Story 4 requires Story 2 (Header component)

### Implementation Strategy

#### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2
2. Complete Phase 3 (Sidebar + Layout skeleton)
3. STOP and VALIDATE functionality independently.

#### Incremental Delivery

1. Foundation ready
2. Add Sidebar (US1) -> Ship increment
3. Add Header + CmdK (US2) -> Ship increment
4. Hook up responsive logic (US3) -> Ship increment
5. Inject Breadcrumb tracking (US4) -> Finalize Layout Spec.
