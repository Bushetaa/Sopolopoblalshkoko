# Research & Architecture Decisions: Data Table System

## Decision 1: No Third-Party Table Library

- **Decision**: Build the `DataTable` from scratch using native HTML `<table>` elements.
- **Rationale**: TanStack Table adds ~40KB and significant API complexity for client-side-only data. Spec requirements (sort, search, paginate, select, row actions, column visibility) are fully achievable with `useMemo` + `useState`.
- **Alternatives considered**: TanStack Table v8 (rejected — overkill for client-only mock data), shadcn/ui Table (rejected — presentational only, no logic).

## Decision 2: Generic TypeScript Design

- **Decision**: `DataTable<T extends { id: string }>` is a generic component; `ColumnDef<T>` is a generic interface. The `id: string` constraint enables row selection by ID.
- **Rationale**: Forces type safety at the usage site — no `any` casts needed in render functions.

## Decision 3: Client-Side Sort, Filter, Paginate Pipeline

- **Decision**: Data flows through a deterministic pipeline: `data → filtered → sorted → paginated`. Each step uses `useMemo` keyed to its inputs.
- **Rationale**: Prevents unnecessary recomputation; any input change triggers only the necessary downstream step.

## Decision 4: Search Debounce

- **Decision**: Use a 200ms debounce on the search input before updating `searchQuery` state (via `useEffect` + `setTimeout`).
- **Rationale**: Avoids filtering on every keystroke for large datasets. 200ms is imperceptible to users.

## Decision 5: StatusBadge Location

- **Decision**: `StatusBadge` lives in `components/shared/StatusBadge.tsx` and is exported independently from the DataTable.
- **Rationale**: StatusBadge is used on Gateway pages, API Manager pages, and User Management — none of which should import from `data-table/`.

## Decision 6: HighlightText Utility

- **Decision**: `HighlightText` uses `String.split` with a case-insensitive RegExp to split text into matching/non-matching parts; renders `<mark>` for matches.
- **Rationale**: Zero dependencies, instant, and produces semantically correct highlighted text. Must escape special regex characters via `escapeRegex()` helper.

## Decision 7: Column Visibility State Initialization

- **Decision**: Initialize `columnVisibility` state from `ColumnDef.hidden` defaults on mount; no localStorage persistence for v1.
- **Rationale**: Spec explicitly defers persistence. Initialization from `ColumnDef` ensures correct defaults without extra config.
