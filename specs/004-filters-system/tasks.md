# Tasks: Filters System

**Input**: Design documents from `specs/004-filters-system/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [x] T001 Create `components/filters/` directory with barrel `index.ts`
- [x] T002 [P] Create `lib/date-presets.ts` — export `DATE_PRESETS`, `DEFAULT_DATE_RANGE`, `getAutoGranularity`, `getPresetLabel` per `data-model.md`
- [x] T003 [P] Create `lib/filter-utils.ts` — export `getActiveFilterChips(filters, actions): FilterChip[]` and `computeActiveFiltersCount(filters): number`

---

## Phase 2: Foundational

- [x] T004 [P] Create `lib/status-config.ts` — export `STATUS_CONFIG` (shared between Spec 03 and Spec 04); 5 statuses with label/dot/bg/text/border
- [x] T005 [P] Create `hooks/useFilters.ts` — all filter state + action creators + computed `activeFiltersCount` + `filterChips` per `data-model.md` `useFilters` spec; default state: `preset='7d'`, `categories={}`, `search=''`

**Checkpoint**: Hook and utilities ready — all user story components can begin.

---

## Phase 3: User Story 1 — Date Range Picker (P1) 🎯 MVP

**Goal**: A trigger button + dropdown with 8 presets and a custom calendar range selector.

**Independent Test**: Click trigger — dropdown shows 8 presets. Click "Last 30 days" — `onChange` fires with correct dates, trigger label updates. Click "Custom range…", pick start→end in calendar, click Apply — trigger label shows "Jan 1 – Jan 31, 2024".

- [x] T006 [P] [US1] Create calendar sub-component in `DateRangePicker.tsx` — either wraps existing `ui/calendar.tsx` or builds a custom month grid; supports range selection (click start, hover preview, click end); date swapping when end < start
- [x] T007 [US1] Create `components/filters/DateRangePicker.tsx` — trigger button (`bg-gray-900 border border-gray-800 rounded-lg`, `CalendarDays` icon, chevron rotates when open); dropdown with 8 preset list (highlighting active) and conditional calendar for "Custom"; calls `onChange(DateRangeFilter)` on selection

**Checkpoint**: US1 functional — all 8 presets work, custom range calendar works, trigger label updates.

---

## Phase 4: User Story 2 — Category Filters (P1)

**Goal**: Multi-select checkbox filter, toggle pill filter, status filter, and single-select dropdown.

**Independent Test**: MultiSelectFilter with 3 options — select 2, "Clear (2)" appears. ToggleFilter — click button activates it (bg-gray-700), click again deactivates. StatusFilter — colored badge toggles active/inactive.

- [x] T008 [P] [US2] Create `components/filters/MultiSelectFilter.tsx` — Radix DropdownMenu trigger button with label + active count badge; dropdown with optional internal search, checkbox options (label + count + color dot), "Clear (N)" footer; `onChange(string[])` fires on each toggle
- [x] T009 [P] [US2] Create `components/filters/ToggleFilter.tsx` — renders options as pill buttons in a `bg-gray-900 border rounded-lg p-1` container; active = `bg-gray-700 text-gray-50 shadow-sm`; inactive = `text-gray-500 hover:text-gray-300`; multi-select (can have multiple active)
- [x] T010 [P] [US2] Create `components/filters/StatusFilter.tsx` — renders status options as colored `border-radius: full` badge toggles; active = full color bg/text; inactive = ghost `border-gray-800`; shares `STATUS_CONFIG` from `lib/status-config.ts`

**Checkpoint**: US2 functional — all 3 filter types work independently with correct active/inactive styles.

---

## Phase 5: User Story 3 — Filter Chips (P1)

**Goal**: Active filter chips bar with individual remove and "Clear all" button.

**Independent Test**: Apply date (30d) + 2 statuses → 3 chips appear. Click ✕ on one → only that chip disappears. Click "Clear all" → all chips gone, filter count badge gone.

- [x] T011 [US3] Create `components/filters/FilterChips.tsx` — renders `null` when `chips.length === 0`; otherwise "Filtered by:" label + chips row; each chip: `bg-blue-500/10 border-blue-500/20 text-blue-300 rounded-full px-2.5 py-1 text-xs` + `color` dot + label + `X` button; "Clear all" link when `chips.length > 1`

**Checkpoint**: US3 functional — chips appear/disappear correctly, individual remove and clear all work.

---

## Phase 6: User Story 4 — Filter Bar (P2)

**Goal**: Declarative `FilterBar` that assembles filters from a `FilterBarConfig`.

**Independent Test**: Pass `API_MANAGER_FILTERS` → search + Type multi-select + Status toggle + "Add API" extra action render in one bar. Pass `ANALYTICS_FILTERS` → date range + Environment single-select only.

- [x] T012 [US4] Create `components/filters/FilterBar.tsx` — renders search input, `|` separator, `DateRangePicker` (if showDateRange), category filters by type mapping (multi→`MultiSelectFilter`, toggle→`ToggleFilter`, single→`<select>`), active count badge, extra actions on right via `ml-auto`; `FilterChips` below the bar; accepts `filters: FilterState`, `onFiltersChange: (f: FilterState) => void`, `config: FilterBarConfig`

**Checkpoint**: US4 functional — any page can pass a FilterBarConfig and get a fully wired filter bar.

---

## Phase 7: User Story 5 — useFilters Hook (P2)

**Goal**: Hook exposes all filter actions with correct computed values.

- [x] T013 [US5] Complete `hooks/useFilters.ts` — verify all 7 return values: `filters`, `setDateRange`, `setDatePreset`, `setCategory`, `toggleCategoryValue`, `clearAll`, `activeFiltersCount`, `filterChips`; confirm `clearAll` does NOT reset `dateRange`; confirm `toggleCategoryValue` removes key from categories when value array becomes empty (sets to `undefined`)

**Checkpoint**: US5 functional — hook works as a drop-in for all page filter integrations.

---

## Phase N: Polish

- [x] T014 [P] Verify `FilterBar` stacks vertically at 320px viewport without horizontal overflow
- [x] T015 [P] Export all components from `components/filters/index.ts` barrel
- [x] T016 Export `API_MANAGER_FILTERS`, `ANALYTICS_FILTERS`, `USERS_FILTERS` from `data-model.md` as `lib/filter-configs.ts`
