# Implementation Plan: Data Table System

**Branch**: `003-data-table-system` | **Date**: 2026-04-19 | **Spec**: [spec.md](./spec.md)

## Summary

Build a fully generic, reusable `<DataTable<T>>` React component for the Sopo Platform — the single shared table used across all dashboard pages (API Manager, Gateway, Workspaces, Users, Rate Limiting). Delivers sorting, client-side search with highlight, pagination with smart page numbers, row selection with bulk actions, row action dropdowns, column visibility toggling, density modes, loading skeletons, and empty states. Also delivers the shared `StatusBadge` component used on every management page.

## Technical Context

**Language/Version**: React 19, Next.js 16, TypeScript  
**Primary Dependencies**: Radix DropdownMenu (already installed via shadcn), Lucide React, Tailwind CSS v4  
**Storage**: N/A — purely presentational component; all state is local  
**Testing**: N/A (no tests requested)  
**Target Platform**: All dashboard pages; responsive to 640px+ with `overflow-x-auto`  
**Project Type**: Shared component library — `components/data-table/`  
**Performance Goals**: Renders 100 rows < 16ms; search debounce 200ms  
**Constraints**: No external table library (e.g., TanStack Table) — build from scratch per spec  
**Scale/Scope**: Used by Spec 04, 05, 06; must be fully generic via TypeScript generics `<T extends { id: string }>`

## Constitution Check

No project constitution is defined. Component design follows React composition patterns and Sopo dark theme tokens from Spec 01.

## Project Structure

### Documentation (this feature)

```text
specs/003-data-table-system/
├── plan.md              # This file
├── spec.md              # Feature specification (6 user stories, 12 FRs, 6 SCs)
├── research.md          # Architecture decisions
├── data-model.md        # TypeScript interfaces + constants
├── quickstart.md        # Integration example
├── contracts/
│   └── component-api.md # Component props contracts
├── checklists/
│   └── requirements.md  # All passed ✅
└── tasks.md             # Implementation tasks
```

### Source Code

```text
components/
├── data-table/
│   ├── DataTable.tsx            ← [CREATE] Main generic container
│   ├── TableToolbar.tsx         ← [CREATE] Search + Columns + BulkActions
│   ├── TableHeader.tsx          ← [CREATE] Sortable column headers
│   ├── TableBody.tsx            ← [CREATE] Rows + cells + skeleton
│   ├── TableFooter.tsx          ← [CREATE] Pagination
│   ├── TableEmptyState.tsx      ← [CREATE] Empty / no-results states
│   ├── RowActionsMenu.tsx       ← [CREATE] Per-row dropdown
│   ├── HighlightText.tsx        ← [CREATE] Search match highlighter
│   └── index.ts                 ← [CREATE] Barrel export
└── shared/
    └── StatusBadge.tsx          ← [CREATE] Shared status badge (5 variants)
```
