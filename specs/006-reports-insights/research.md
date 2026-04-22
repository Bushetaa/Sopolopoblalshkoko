# Research & Architecture Decisions: Reports & Insights

## Decision 1: Client-Side CSV/JSON Export Only (No Server)

- **Decision**: CSV and JSON exports are generated entirely client-side using `Blob` + `URL.createObjectURL`. PDF export is simulated (progress only, no actual PDF for v1).
- **Rationale**: No backend API layer exists for v1. Client-side export is sufficient for the data volumes in mock mode.
- **Alternatives considered**: jsPDF (rejected — large bundle, complex API); server-side generation (rejected — no backend).

## Decision 2: Progress Simulation Strategy

- **Decision**: Simulate export progress using `setInterval` that increments `progress` by a random `3–8%` every `150ms` until 100%.
- **Rationale**: Creates realistic UX without a real async operation. Simulates variable report generation times (fast CSV vs slow PDF).

## Decision 3: Insight Rules Engine — Rule Array Pattern

- **Decision**: `INSIGHT_RULES` is an array of `{ id, check(metrics): boolean, generate(metrics): Omit<Insight, 'id'|'generatedAt'|'isDismissed'> }` objects. The runner iterates all rules and generates insights for triggered ones.
- **Rationale**: Declarative; new rules can be added by appending to the array. No complex state machine needed.

## Decision 4: Tab Routing via URL Query Param

- **Decision**: The active tab is stored in `?tab=overview|my-reports|scheduled|insights` URL query param using Next.js `useSearchParams` + `useRouter`.
- **Rationale**: Allows deep-linking to specific tabs (e.g., "View Insights" from the sidebar navigates directly to the Insights tab). Mentioned in FR-001.

## Decision 5: Schedule Mock Data

- **Decision**: 2 mock scheduled reports are pre-loaded from `MOCK_SCHEDULES` constant. Creating a new schedule appends to local state (no persistence).
- **Rationale**: Demonstrates the full scheduling UI without a backend.

## Decision 6: Excel Deferred

- **Decision**: Clicking Excel format shows a shadcn/ui `toast()` notification: "Excel export coming soon". No download occurs.
- **Rationale**: Requires `exceljs` or `xlsx` library integration that adds bundle size without core value. Deferred per spec Assumptions.
