# Tasks: Data Table System

**Input**: Design documents from `specs/003-data-table-system/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [ ] T001 Create component directory `components/data-table/` with barrel `index.ts`
- [ ] T002 [P] Create `components/shared/` directory for `StatusBadge.tsx`
- [ ] T003 [P] Add utility functions to `lib/table-utils.ts`: `sortData`, `searchData`, `getPageNumbers`, `escapeRegex` per `data-model.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: All user stories depend on these foundations.

- [ ] T004 [P] Create `components/shared/StatusBadge.tsx` — renders 5 statuses (active/inactive/maintenance/deprecated/error) from `STATUS_CONFIG`; active status has `animate-ping` dot; exports `STATUS_CONFIG` constant
- [ ] T005 [P] Create `components/data-table/HighlightText.tsx` — splits text by query using `escapeRegex` + RegExp; wraps matches in `<mark className="bg-yellow-400/20 text-yellow-300 rounded px-0.5">`
- [ ] T006 [P] Create `components/data-table/TableEmptyState.tsx` — custom icon + message for empty data; separate display for "no results for [query]" vs generic empty

**Checkpoint**: Shared utilities and StatusBadge ready.

---

## Phase 3: User Story 1 — Sortable Table (P1) 🎯 MVP

**Goal**: Render a generic sortable table with headers, rows, skeleton, and density modes.

**Independent Test**: Render `<DataTable data={rows} columns={cols}>`. All rows display, sortable column headers show sort icons, clicking toggles sort direction, `density="compact"` changes padding, `isLoading=true` shows 5 skeleton rows.

- [ ] T007 [P] [US1] Create `components/data-table/TableHeader.tsx` — renders `<thead>` with `SortableHeader` per column; active sort shows `ArrowUp`/`ArrowDown` in blue; non-active sortable shows `ArrowUpDown` on hover; non-sortable is plain text
- [ ] T008 [P] [US1] Create `components/data-table/TableBody.tsx` — renders `<tbody>` rows; accepts `density` for padding; `isLoading=true` renders 5 `<SkeletonRow>` with `animate-pulse` cells; selected rows get `bg-blue-500/5`; `onRowClick` adds `cursor-pointer`; renders `<TableEmptyState>` when empty
- [ ] T009 [US1] Create `components/data-table/DataTable.tsx` — main container; wires sort state, filtered/sorted/paginated data pipeline; `bg-gray-900 border border-gray-800 rounded-xl overflow-hidden`; inner table has `overflow-x-auto` wrapper + `min-w-[640px]`

**Checkpoint**: US1 functional — sortable table renders with mock data, density works, skeleton appears.

---

## Phase 4: User Story 2 — Search (P1)

**Goal**: Search box that filters rows across multiple fields with text highlighting.

**Independent Test**: Type "prod" in search — only matching rows appear; matching text is highlighted yellow; clearing the ✕ restores all rows; no-results state shows "No results for 'prod'".

- [ ] T010 [US2] Create search input portion of `components/data-table/TableToolbar.tsx` — renders `<Search>` icon, input with `w-72`, ✕ clear button; 200ms debounce via `useEffect`+`setTimeout`; wire into `DataTable` pipeline
- [ ] T011 [US2] Wire `HighlightText` into the default `render` fallback in `TableBody.tsx` for text cells when `searchQuery` is active

**Checkpoint**: US2 functional — typing filters rows, highlighting works, clear button works.

---

## Phase 5: User Story 3 — Pagination (P1)

**Goal**: Paginated footer with rows-per-page selector, page navigation, and smart ellipsis.

**Independent Test**: 55 rows with pageSize=10 shows "Showing 1–10 of 55". Page 6 shows correct rows. Changing rows-per-page to 50 shows all 55 on one page. First/last page buttons are disabled when on those pages.

- [ ] T012 [US3] Create `components/data-table/TableFooter.tsx` — "Showing X–Y of Z results" text, rows-per-page `<select>` [10,20,50,100], ChevronsLeft/ChevronLeft/ChevronRight/ChevronsRight nav buttons (disabled on boundary), smart page numbers via `getPageNumbers()` with ellipsis, active page highlighted `bg-blue-500/20 text-blue-400 border border-blue-500/30`

**Checkpoint**: US3 functional — pagination shows correct range, smart ellipsis works, size selector changes rows.

---

## Phase 6: User Story 4 — Row Selection & Bulk Actions (P2)

**Goal**: Checkboxes for row selection with Bulk Actions bar when rows are selected.

**Independent Test**: Enable `selectable=true`. Header checkbox selects all current-page rows; blue bulk bar slides in with count + Export + Delete. Partial selection shows indeterminate header.

- [ ] T013 [US4] Add selection state (`Set<string>`, `handleSelectAll`, `handleSelectRow`) to `DataTable.tsx`; add checkbox column to `TableBody.tsx`; header checkbox in `TableHeader.tsx` shows checked/indeterminate based on selection
- [ ] T014 [US4] Create `BulkActionsBar` section in `TableToolbar.tsx` — appears when `selectedRows.size > 0`; shows count badge + Export Selected button + Delete Selected button (red) + "Clear selection" link; styled `bg-blue-500/10 border-b border-blue-500/20`

**Checkpoint**: US4 functional — select all, partial, clear; bulk bar appears/disappears correctly.

---

## Phase 7: User Story 5 — Row Action Menu (P2)

**Goal**: Per-row `…` dropdown with contextual actions, destructive styling, conditional hide/disable.

**Independent Test**: Hover a row — `MoreHorizontal` becomes visible. Click opens dropdown. Destructive action (Delete) is red. Conditionally hidden action is absent. Disabled action is grayed out.

- [ ] T015 [US5] Create `components/data-table/RowActionsMenu.tsx` — filters `rowActions` by `hidden(row)`, renders Radix `DropdownMenu`; `MoreHorizontal` trigger `opacity-0 group-hover:opacity-100`; `variant='destructive'` items use `text-red-400 focus:bg-red-500/10`; `disabled(row)` items are grayed and non-clickable

**Checkpoint**: US5 functional — row actions render correctly with all variants.

---

## Phase 8: User Story 6 — Column Visibility (P3)

**Goal**: Columns dropdown in toolbar to toggle column visibility; `hidden: true` default is honored.

**Independent Test**: Open Columns dropdown — all columns listed with checkboxes. Toggle a hidden column on — it appears. Toggle it off — it disappears.

- [ ] T016 [US6] Add column visibility state to `DataTable.tsx` (initialized from `ColumnDef.hidden` defaults); add `ColumnVisibilityToggle` Radix `DropdownMenuCheckboxItem` panel to `TableToolbar.tsx`; filter visible columns in `TableHeader.tsx` and `TableBody.tsx`

**Checkpoint**: US6 functional — hidden-by-default columns absent, toggle works.

---

## Phase N: Polish

- [ ] T017 [P] Export barrel `components/data-table/index.ts` — export: `DataTable`, `ColumnDef`, `RowAction`, `DataTableProps`
- [ ] T018 [P] Export `components/shared/StatusBadge.tsx` + `STATUS_CONFIG` from `components/shared/index.ts`
- [ ] T019 Verify zero horizontal scroll at 640px viewport — confirm `overflow-x-auto` + `min-w-[640px]` on all usages
- [ ] T020 [P] Audit `animate-ping` on `StatusBadge` active variant — verify dot oscillates without layout shift
