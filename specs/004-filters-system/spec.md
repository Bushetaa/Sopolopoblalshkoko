# Feature Specification: Filters System

**Feature Branch**: `004-filters-system`
**Created**: 2026-04-19
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Date Range Selection (Priority: P1)

All platform users need to select a time window for data views using both quick presets (Today, Last 7 days, etc.) and a custom calendar range, so they can scope analytics, reports, and table data to the period they care about.

**Why this priority**: The date range picker is the most fundamental filter on every data-rich page. Without it, all data is shown without temporal context.

**Independent Test**: Render `<DateRangePicker>` standalone. Click "Last 30 days" preset and confirm `onChange` fires with correct start/end dates. Click "Custom range", pick Jan 1 → Jan 31 from the calendar, click Apply, and confirm the trigger button label updates to "Jan 1 – Jan 31, 2024".

**Acceptance Scenarios**:

1. **Given** a user clicks the Date Range Picker trigger, **When** the dropdown opens, **Then** 8 preset options appear (Today, Yesterday, Last 7d, 14d, 30d, 90d, 6m, 1y) plus "Custom range…".
2. **Given** the user clicks "Last 7 days", **When** the selection fires, **Then** `onChange` is called with `{ preset: '7d', startDate: 7 days ago, endDate: today, granularity: 'day' }`.
3. **Given** the user selects "Custom range…", **When** the calendar appears, **Then** clicking a start date sets it (highlighted), hovering shows a preview range, and clicking an end date confirms the selection.
4. **Given** the end date selected is earlier than the start date, **When** the selection confirms, **Then** the dates are automatically swapped so start < end.
5. **Given** a preset is active, **When** the trigger button renders, **Then** it shows the preset label (e.g., "Last 7 days"). For custom ranges it shows "Jan 1 – Jan 31, 2024".

---

### User Story 2 — Category Filters: Multi-Select & Toggle (Priority: P1)

Users need to filter table data and charts by multiple categorical values simultaneously (API type, status, protocol, auth type) using both multi-select checkboxes and compact toggle button groups.

**Why this priority**: Category filters are the primary mechanism for narrowing down large datasets on all management pages (API Manager, Gateway, Users).

**Independent Test**: Render `<MultiSelectFilter label="Type" options={[REST, GraphQL, gRPC]}>`. Select REST then GraphQL — `onChange` fires with `["REST", "GraphQL"]`. A "Clear (2)" button appears in the dropdown footer. Clicking it resets to []. Render a `<ToggleFilter>` with 3 status options — toggling "Active" highlights it; toggling again deselects it.

**Acceptance Scenarios**:

1. **Given** a multi-select filter dropdown is open, **When** the user checks "REST" and "GraphQL", **Then** a "Clear (2)" button appears at the bottom of the dropdown and `onChange` is called with `["REST", "GraphQL"]`.
2. **Given** a filter option has a `count`, **When** the option renders, **Then** the count appears in a muted right-aligned span next to the label.
3. **Given** a toggle button group, **When** the user clicks a button to select it, **Then** the button styles switch to active (`bg-gray-700 text-gray-50`). Clicking again deselects it.
4. **Given** a multi-select filter has `searchable=true` and 20+ options, **When** the user types in the internal search input, **Then** the options list filters to matching entries only.

---

### User Story 3 — Active Filter Chips & Clear All (Priority: P1)

Users need to see all active filters displayed as removable chips below the filter bar, with a count badge and "Clear all" button, so they always know what filters are applied and can remove them individually or all at once.

**Why this priority**: Without visual feedback of active filters, users don't know why they're seeing a subset of data, causing confusion and distrust.

**Independent Test**: Apply 3 filters (date range = 30d, type = REST, status = Active). Three chips appear below the filter bar with "Filtered by:". Click the ✕ on the "Status: Active" chip — it disappears. Click "Clear all" — all chips disappear and the filter count badge vanishes.

**Acceptance Scenarios**:

1. **Given** the default date range ("Last 7 days") is active, **When** the chips render, **Then** no date range chip appears (default is hidden).
2. **Given** the user changes to "Last 30 days", **When** the chip renders, **Then** "Date: Last 30 days" chip appears with a ✕ button.
3. **Given** "Status: Active" is in the chips, **When** the user clicks its ✕, **Then** the status filter clears for that value only, and other active chips remain.
4. **Given** 3+ chips are visible, **When** the "Clear all" link renders, **Then** clicking it resets all category filters and search to empty (but NOT the date range, which reverts to default).

---

### User Story 4 — Filter Bar Composition (Priority: P2)

Developers integrating the filter system into any page need a single `<FilterBar>` component that accepts a `FilterBarConfig` object to declaratively specify which filters to show, so each page can have tailored filters without custom filter code.

**Why this priority**: The `FilterBar` is the integration point used by every page that has filters. Without it, each page must build its own filter layout.

**Independent Test**: Pass `API_MANAGER_FILTERS` config to `<FilterBar>`. Verify: search input, Type multi-select, Status toggle, and "Add API" extra action all render in a single horizontal bar. Pass `ANALYTICS_FILTERS` — date range picker and Environment single-select appear; search does not.

**Acceptance Scenarios**:

1. **Given** a `FilterBarConfig` with `showSearch=false`, **When** `<FilterBar>` renders, **Then** no search input appears.
2. **Given** `activeFiltersCount > 0`, **When** the filter bar renders, **Then** a blue count badge appears (e.g., "3 filters") with a "Clear all" link.
3. **Given** `extraActions` is provided, **When** the filter bar renders, **Then** the extra actions slot is pushed to the far right (`ml-auto`).

---

### User Story 5 — useFilters Hook (Priority: P2)

Page-level components need a single `useFilters()` hook that encapsulates all filter state, action creators, computed values (chips, count), so pages don't manage filter state manually.

**Why this priority**: Without this hook, every page duplicates filter state management logic.

**Independent Test**: Call `useFilters()`. Verify `filters.dateRange.preset === '7d'` as default. Call `setDatePreset('30d')` and confirm `filters.dateRange.startDate` is 30 days ago. Call `toggleCategoryValue('apiType', 'REST')` twice and confirm REST is toggled in and then out. Call `clearAll()` and confirm all categories are empty.

**Acceptance Scenarios**:

1. **Given** the hook initializes, **When** no `initialFilters` are provided, **Then** defaults are: preset `'7d'`, categories `{}`, search `''`.
2. **Given** `setDatePreset('30d')` is called, **When** the state updates, **Then** `granularity` is automatically set to `'day'` (via `getAutoGranularity`).
3. **Given** a category has one value selected, **When** `toggleCategoryValue` is called with the same value, **Then** the category array becomes empty (not an empty array in the state, but `undefined`).
4. **Given** multiple categories are active, **When** `clearAll()` is called, **Then** `categories` resets to `{}` and `search` resets to `''`, but `dateRange` is NOT reset.

---

### Edge Cases

- What if a user picks a custom date range where start === end? (Single day selection — both start and end should be the same day with startOfDay/endOfDay respectively.)
- What if `options` array is empty for a multi-select filter? (Show "No options available" state instead of an empty dropdown.)
- What if the user types only spaces in the search field? (Treat as empty search — `trim()` before matching.)
- What if `getAutoGranularity` receives a date range spanning 0 days? (Default to 'hour'.)
- What if `clearAll()` is called when no filters are active? (No-op, no state change, no re-render.)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `DateRangePicker` MUST offer 8 preset options; "Custom range" MUST open a calendar with 2-click range selection, preview on hover, and date swapping if end < start.
- **FR-002**: `MultiSelectFilter` MUST support checkbox multi-selection, an optional internal search field (`searchable=true`), option counts, color dots, and a "Clear (N)" footer button.
- **FR-003**: `ToggleFilter` MUST render options as pill buttons; selected items show `bg-gray-700 text-gray-50`; toggling a selected item deselects it.
- **FR-004**: `StatusFilter` MUST render status options as colored badge toggles that match the `STATUS_CONFIG` colors; active badges show full bg/text, inactive show ghost border.
- **FR-005**: `FilterChips` MUST render one chip per active filter value; each chip has a ✕ that removes only that value; "Clear all" removes ALL category filters and search; the default date preset must NOT generate a chip.
- **FR-006**: `FilterBar` MUST accept a `FilterBarConfig` and declaratively render: optional search, optional date range, N category filters (each of type single/multi/toggle), a filter count badge, and extra actions right-aligned.
- **FR-007**: `useFilters` hook MUST expose: `filters`, `setDateRange`, `setDatePreset`, `setCategory`, `toggleCategoryValue`, `clearAll`, `activeFiltersCount` (computed), `filterChips` (computed).
- **FR-008**: `getAutoGranularity` MUST compute granularity automatically: ≤1 day → hour, ≤14 days → day, ≤90 days → week, else month.
- **FR-009**: The `DATE_PRESETS` constant MUST use `date-fns` functions (`startOfDay`, `endOfDay`, `subDays`, `subMonths`, `startOfMonth`, `startOfYear`) — no manual date arithmetic.

### Key Entities

- **FilterState**: Top-level filter state — `dateRange`, `categories`, `search`, `activeFiltersCount` (computed).
- **DateRangeFilter**: Date range — `preset`, `startDate`, `endDate`, `granularity`.
- **CategoryFilters**: Map of category key → selected values array (per API Manager, Gateway, Analytics, Users contexts).
- **FilterChip**: A single active-filter display pill — `id`, `label`, `category`, `value`, `color?`, `onRemove`.
- **FilterBarConfig**: Declarative filter bar configuration — `showDateRange`, `showSearch`, `categories[]`, `extraActions`.
- **FilterOption**: A single option in a multi/toggle filter — `label`, `value`, `count?`, `color?`, `icon?`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Selecting any date preset updates `DateRangePicker` trigger label and fires `onChange` within 50ms.
- **SC-002**: Applying a multi-select filter and triggering `clearAll()` both happen without page reload, with the UI updating in under 100ms.
- **SC-003**: Any page can integrate the full filter system by passing a `FilterBarConfig` object + using `useFilters()` hook — requiring no more than 10 lines of integration code.
- **SC-004**: All filter components render correctly at 320px viewport width (stack vertically, no overflow).
- **SC-005**: `activeFiltersCount` computes correctly: default date = 0 chips, each category value = 1 chip, search text = 1 chip.
- **SC-006**: The component produces zero React console warnings.

---

## Assumptions

- The Filters System is a **shared component library** — it does not contain page-specific logic; pages pass configs and use the hook.
- `date-fns` is already installed (confirmed in `package.json`).
- The existing `ui/calendar.tsx` (Radix Calendar) may be reused for the calendar component inside the DateRangePicker, or a custom implementation can be built.
- Filter state is **ephemeral per session** — no URL sync or localStorage persistence for v1; URL param persistence is a future enhancement.
- The Filters System is consumed by Spec 02 (Analytics), Spec 03 (Data Tables), Spec 05 (Users), and Spec 06 (Reports).
- The `STATUS_CONFIG` object is shared between the Filters System and the Data Table System (Spec 03) — it lives in `lib/status-config.ts`.
