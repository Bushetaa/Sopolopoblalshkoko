# Feature Specification: Data Table System

**Feature Branch**: `003-data-table-system`
**Created**: 2026-04-19
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browsable, Sortable Data Table (Priority: P1)

Engineers and platform operators need to browse any list of platform entities (APIs, Gateways, Workspaces, Users) in a consistent, well-styled dark-mode table with clear column headers, so they can quickly scan and orient themselves in the data.

**Why this priority**: A readable, scrollable table is the absolute minimum for any data management page. Without this, no other table capability delivers value.

**Independent Test**: Render a `<DataTable>` with 30 rows of mock data and basic column definitions. All rows appear, headers are visible, density variants (compact/default/comfortable) change row height, and the empty state renders when data=[] is passed.

**Acceptance Scenarios**:

1. **Given** a page renders `<DataTable data={rows} columns={cols}>`, **When** it loads, **Then** all rows display in a dark-themed table with sticky header, `border-gray-800` dividers, and `hover:bg-gray-800/40` row hover.
2. **Given** rows are provided, **When** the user clicks a sortable column header, **Then** the column sorts ascending, clicking again sorts descending, and an arrow icon reflects the current sort direction.
3. **Given** no data is provided (`data=[]`), **When** the table renders, **Then** an empty state displays with a configurable icon and message.
4. **Given** `isLoading=true`, **When** the table renders, **Then** 5 animated skeleton rows appear instead of real data.
5. **Given** `density="compact"`, **When** the table renders, **Then** row padding is `py-2` and font is `text-xs`.

---

### User Story 2 — Search & Filter Within Table (Priority: P1)

Users need to quickly find specific rows by typing in a search box that matches across multiple fields simultaneously, so they don't have to scroll through hundreds of rows.

**Why this priority**: Search is the most commonly used interaction on any data table page and directly drives time-to-action for operators.

**Independent Test**: Render a table with 30 rows. Type a name in the search box and confirm only matching rows appear. Clear the search and confirm all rows return. Matching text should be highlighted in yellow.

**Acceptance Scenarios**:

1. **Given** a table has 30 rows, **When** the user types "prod" in the search box, **Then** only rows where any `searchKeys` field contains "prod" (case-insensitive) are shown, and the match is highlighted in yellow (`bg-yellow-400/20 text-yellow-300`).
2. **Given** a search is active, **When** the user clicks the ✕ button, **Then** the search clears and all rows return.
3. **Given** a search returns no results, **When** the empty state renders, **Then** it shows "No results for [query]" rather than the default empty message.

---

### User Story 3 — Pagination (Priority: P1)

Users dealing with large datasets (100+ rows) need client-side pagination with a configurable page size selector and smart page number navigation, so they can browse through data without performance issues.

**Why this priority**: Without pagination, large datasets make the table unusable and cause performance degradation.

**Independent Test**: Render a table with 55 rows and `pageSize=10`. The footer shows "Showing 1–10 of 55 results". Clicking page 3 shows rows 21–30. Changing page size to 20 shows 55 rows across 3 pages.

**Acceptance Scenarios**:

1. **Given** 55 rows with pageSize=10, **When** the table renders, **Then** only 10 rows appear and the footer shows "Showing 1–10 of 55 results" with page navigation buttons.
2. **Given** the user is on page 1, **When** they click page 3, **Then** rows 21-30 appear and the page 3 button is highlighted in blue.
3. **Given** the user selects "50" from the rows-per-page selector, **When** the selection is applied, **Then** 50 rows appear and the page count updates accordingly.
4. **Given** the first/last page is active, **When** the previous/next buttons render, **Then** they appear disabled (`opacity-30`) and are not clickable.

---

### User Story 4 — Row Selection & Bulk Actions (Priority: P2)

Admins and operators need to select multiple rows and execute bulk operations (export, delete) efficiently without acting on each row individually.

**Why this priority**: Bulk operations dramatically reduce repetitive work for operators managing large inventories. Important but not blocking for basic table usability.

**Independent Test**: Enable `selectable=true` on a table. Check the header checkbox and confirm all visible rows are selected. A blue bulk actions bar appears with row count + Export + Delete buttons. Uncheck one row — the header checkbox shows indeterminate state.

**Acceptance Scenarios**:

1. **Given** `selectable=true`, **When** the user checks the header checkbox, **Then** all rows on the current page are selected, the header checkbox is checked, and a blue bulk actions bar slides in.
2. **Given** 3 rows are selected, **When** the bulk actions bar renders, **Then** it shows "3 rows selected" with Export Selected and Delete Selected buttons.
3. **Given** some but not all rows are selected, **When** the header checkbox renders, **Then** it shows an indeterminate state (dash icon).
4. **Given** the user clicks "Clear selection", **When** the action fires, **Then** all checkboxes deselect and the bulk action bar hides.

---

### User Story 5 — Row Action Menu (Priority: P2)

Users need a per-row contextual action dropdown (View, Edit, Delete, etc.) that appears on row hover, with support for conditional show/hide and destructive action styling.

**Why this priority**: Row-level actions are essential for any CRUD workflow in the dashboard.

**Independent Test**: Render a table with configured `rowActions`. Hover a row — a `...` icon button becomes visible. Clicking it opens a dropdown. A "Delete" action with `variant="destructive"` renders in red. A conditionally hidden action doesn't appear for rows where `hidden(row)=true`.

**Acceptance Scenarios**:

1. **Given** `rowActions` are configured, **When** a user hovers a row, **Then** a `MoreHorizontal` icon button becomes visible (`opacity-0 → opacity-100`).
2. **Given** the dropdown is open, **When** a destructive action (variant="destructive") renders, **Then** it appears in red text with `focus:bg-red-500/10`.
3. **Given** an action has `disabled: (row) => row.status === 'active'`, **When** that row is displayed, **Then** the action appears grayed out and is not clickable.

---

### User Story 6 — Column Visibility Toggle (Priority: P3)

Power users need to show/hide table columns to tailor the view to their specific workflow, with some columns hidden by default.

**Why this priority**: Nice-to-have customization that improves power user experience. Columns with `hidden: true` in `ColumnDef` must not appear by default.

**Independent Test**: Open the Columns dropdown in the toolbar. Toggle "Joined Date" from hidden to visible and confirm the column appears. Toggle it back off and confirm it disappears. Refresh and confirm state resets.

**Acceptance Scenarios**:

1. **Given** a column is defined with `hidden: true`, **When** the table renders, **Then** that column is not visible.
2. **Given** the Columns dropdown is open, **When** a user checks a hidden column, **Then** the column immediately appears in the table.
3. **Given** a column is toggled visible, **When** the user toggles it off, **Then** the column disappears without page reload.

---

### Edge Cases

- What happens when `searchKeys` is empty and the search query is non-empty? (Should fall back to searching all string fields.)
- What happens if a sort is applied and then the user changes pages? (Page resets to 1 on filter/sort change.)
- What if `data` changes externally while the user is on page 5? (Reset to page 1 silently.)
- What if all rows on the current page are selected and the user changes page size? (Selection is scoped to current page; changing page size resets selection.)
- What if `render` throws an error for a cell? (Wrap in error boundary; fallback to raw value display.)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render a generic `<DataTable<T>>` component accepting `data: T[]`, `columns: ColumnDef<T>[]`, and all optional props per the interface.
- **FR-002**: Sortable columns MUST toggle between `asc`/`desc` on click; the active sort column MUST show a directional arrow icon; non-active sortable columns MUST show `ArrowUpDown` on header hover.
- **FR-003**: The search input MUST filter rows across all `searchKeys` (case-insensitive substring match) with matching text highlighted in yellow.
- **FR-004**: Pagination MUST display "Showing X–Y of Z results", a rows-per-page selector (10/20/50/100), first/prev/next/last buttons, and smart page numbers with ellipsis for large page counts.
- **FR-005**: When `selectable=true`, each row MUST have a checkbox; selecting all rows on the current page MUST show a bulk actions bar with row count, Export Selected, and Delete Selected.
- **FR-006**: `rowActions` MUST render as a `MoreHorizontal` dropdown, visible only on row hover; destructive actions MUST use red styling; `hidden(row)` MUST conditionally remove the action from the list.
- **FR-007**: When `isLoading=true`, the table body MUST render 5 animated skeleton rows instead of data.
- **FR-008**: When `data=[]` and `isLoading=false`, the table MUST render an empty state with configurable icon and message.
- **FR-009**: The Columns dropdown MUST allow toggling each column's visibility; columns with `hidden: true` in `ColumnDef` MUST be hidden by default.
- **FR-010**: The `StatusBadge` component MUST support 5 statuses: `active` (green with `animate-ping` dot), `inactive` (gray), `maintenance` (yellow), `deprecated` (orange), `error` (red).
- **FR-011**: The `DataTable` MUST support three density modes: `compact` (py-2, text-xs), `default` (py-3, text-sm), `comfortable` (py-4, text-sm).
- **FR-012**: The table container MUST have `overflow-x-auto` with `min-w-[640px]` on the inner table to prevent column crushing.

### Key Entities

- **ColumnDef<T>**: Defines a column — key, header, width, sortable, filterable, hidden, align, render, renderHeader.
- **RowAction<T>**: A row-level action — label, icon, variant (default/destructive), onClick, hidden(), disabled().
- **SortState**: Current sort column key and direction (asc/desc).
- **PaginationState**: Current page (1-indexed), page size, total items count.
- **ColumnVisibility**: Map of column key → boolean (visible/hidden).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The `DataTable` renders 100 rows without visible lag (< 16ms render time on a modern browser).
- **SC-002**: Typing in the search box filters results within 50ms (debounced to 200ms for UX smoothness).
- **SC-003**: All 6 user stories are independently testable — a page with only the table component and mock data fully exercises each story.
- **SC-004**: The component produces zero React console warnings (no key errors, no defaultProps issues, no ref warnings).
- **SC-005**: The table is fully responsive — no horizontal overflow at 768px viewport with default column set visible.
- **SC-006**: `StatusBadge` correctly renders all 5 status variants with correct colors, and the `active` variant's dot animates.

---

## Assumptions

- The `DataTable` is a **presentational, reusable** component — it contains no business logic specific to any entity type (APIs, Users, etc.).
- All data filtering and sorting happens **client-side** — no server-side pagination for v1.
- The `DropdownMenu` and `DropdownMenuCheckboxItem` components are available from the existing Radix/shadcn UI setup already installed in the project.
- The `HighlightText` utility component is part of this spec and lives in `components/data-table/`.
- Column visibility state is **ephemeral** (resets on page reload) in v1; localStorage persistence is out of scope.
- The `StatusBadge` component is shared and lives in `components/shared/StatusBadge.tsx` for reuse across all pages.
- The `DataTable` is used by Spec 05 (Users) and is a dependency for Spec 04 (Filters integration) and Spec 06 (Reports schedules table).
