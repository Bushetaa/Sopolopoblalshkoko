# Research & Architecture Decisions: Filters System

## Decision 1: Custom DateRangePicker (No External Lib)

- **Decision**: Build `DateRangePicker` using the existing Radix-based `ui/calendar.tsx` for the calendar grid; custom preset list built with `DATE_PRESETS` constant using `date-fns`.
- **Rationale**: No additional dependency; `date-fns` is already installed. Radix Calendar provides accessible keyboard navigation out of the box.
- **Alternatives considered**: `react-day-picker` (rejected — another dependency), `react-datepicker` (rejected — difficult to theme for dark mode).

## Decision 2: FilterBar as a Declarative Composer

- **Decision**: `FilterBar` accepts a `FilterBarConfig` object and dynamically renders the appropriate filter component for each category based on `type: 'single' | 'multi' | 'toggle'`.
- **Rationale**: Each page (API Manager, Gateway, Analytics, Users) needs different filter combinations. A config-driven approach eliminates code duplication.

## Decision 3: useFilters — Single Source of Truth

- **Decision**: `useFilters()` hook manages ALL filter state (date, categories, search). Pages call the hook and pass `{ filters, ...actions }` down to `FilterBar` and other consumers.
- **Rationale**: Prevents filter state being scattered across multiple `useState` calls in each page. One hook = one responsibility.

## Decision 4: getAutoGranularity

- **Decision**: Compute granularity automatically when a preset is selected; allow manual override. Thresholds: ≤1d → hour, ≤14d → day, ≤90d → week, else month.
- **Rationale**: Matches the Analytics Spec 02 granularity toggle UX; removes a decision from the user for preset selections.

## Decision 5: Filter Chip Default Hiding

- **Decision**: The default date preset ('7d') does NOT generate a chip. Only non-default values produce chips.
- **Rationale**: If the default filter shows a chip, users see it as noise since it's always there. Chips should represent intentional overrides.

## Decision 6: clearAll Scope

- **Decision**: `clearAll()` resets `categories` and `search` but NOT `dateRange`. Date range reverts to default (7d) only when its own chip is removed.
- **Rationale**: Date range is a structural filter (scope of all data); category filters are refinements. They have different "reset" semantics.
