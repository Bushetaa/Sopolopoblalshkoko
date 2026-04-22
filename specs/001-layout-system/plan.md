# Implementation Plan: Layout System

**Branch**: `001-layout-system` | **Date**: 2026-04-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-layout-system/spec.md`

## Summary

Implement the overarching Layout System for the Sopo Platform (Enterprise API Lifecycle Automation Dashboard). The objective is to build a responsive, Dark Theme-based (Gray-950/Gray-900) UI containing a global Topbar with Breadcrumbs and Command-K universal search, and a complex Sidebar with nested navigation submenus (Accordion) and dynamic mobile-drawer state handling. 

## Technical Context

**Language/Version**: React 19, Next.js 16, TypeScript  
**Primary Dependencies**: Tailwind CSS v4, Lucide React (for icons), Framer Motion (available but prefer CSS transitions for layout)  
**Storage**: N/A `[Layout system handles UI state only]`  
**Testing**: Jest, React Testing Library  
**Target Platform**: Web browsers (Chrome, Firefox, Safari) and mobile web views  
**Project Type**: Next.js App Router (route groups) — dashboard lives under `app/(dashboard)/`  
**Performance Goals**: Sidebar animations 300ms, Interactions <50ms p95  
**Constraints**: UI must strictly enforce Dark Mode styling (`bg-gray-950`), 100% responsive up to 320px width without horizontal scroll  
**Scale/Scope**: Frontend foundation serving all subsequent modules

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No specific project constitution rules are defined; the layout system conforms to modern enterprise React design principles using standard atomic components.

## Project Structure

### Documentation (this feature)

```text
specs/001-layout-system/
├── plan.md              # This file
├── spec.md              # Feature specification (User Stories, FRs, Success Criteria)
├── research.md          # Architecture decisions (routing, accordion state, mobile drawer)
├── data-model.md        # TypeScript interfaces, MENU_SECTIONS const, Z-index, Design Tokens, Visual States
├── quickstart.md        # Integration code sample for Layout wrapping
├── contracts/           # ✅ Created
│   └── component-api.md # Public props/contracts for Sidebar, Header, MobileSidebar, CommandPalette, hooks
├── checklists/
│   └── requirements.md  # Spec quality checklist (all checked)
└── tasks.md             # Implementation task list (T001–T021)
```

### Source Code (repository root — actual project structure)

```text
(project root)/
├── app/
│   ├── layout.tsx                    ← Marketing root layout (Navbar + Footer) — DO NOT MODIFY
│   ├── globals.css                   ← Add design tokens here (T004)
│   ├── (dashboard)/
│   │   └── layout.tsx                ← [CREATE] Dashboard shell (T003) — Sidebar + Header + main
│   └── ... (marketing pages)
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.tsx               ← [CREATE] (T005–T009)
│   │   └── Header.tsx                ← [CREATE] (T010, T013, T015, T019)
│   └── layout/
│       ├── MobileSidebar.tsx         ← [CREATE] (T014, T017)
│       ├── CommandPalette.tsx        ← [CREATE] (T011, T012)
│       ├── Navbar.tsx                ← Existing marketing navbar
│       └── ConditionalFooter.tsx     ← Existing footer
└── hooks/
    ├── useLayout.ts                  ← [CREATE] (T016)
    ├── useBreadcrumbs.ts             ← [CREATE] (T018)
    ├── use-mobile.tsx                ← Existing
    └── use-toast.ts                  ← Existing
```

**Structure Decision**: Next.js App Router with Route Groups — `(dashboard)` group allows a separate layout shell for the dashboard without affecting the marketing site.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       | N/A        | N/A                                 |
