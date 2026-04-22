# Research & Architecture Decisions: Analytics Engine

## Decision 1: Chart Library Selection

- **Decision**: Use **Recharts** (already in `package.json`) for all charts — Area, Bar, Pie, ComposedChart, and Sparklines.
- **Rationale**: Recharts is already installed, React-native, declarative, fully SSR-compatible with Next.js 16, and handles responsive containers via `ResponsiveContainer`. No additional install required.
- **Alternatives considered**:
  - Chart.js (rejected — requires canvas, less idiomatic in React, no tree-shaking)
  - Tremor (rejected — opinionated styling that conflicts with the Sopo dark theme)
  - Victory (rejected — smaller community, no `Brush` component out of the box)

---

## Decision 2: Mock Data Strategy (No Backend)

- **Decision**: Generate all analytics data **client-side** using deterministic seed functions + `setInterval` for live data. No API calls in v1.
- **Rationale**: Spec explicitly states mock data for v1. Using `useMemo` for static chart data ensures no unnecessary re-computation. A `useAnalyticsData` custom hook will centralize all data generation.
- **Alternatives considered**:
  - JSON fixture files (rejected — harder to simulate real-time updates)
  - MSW mock service worker (rejected — overkill for v1 client-only mock data)

---

## Decision 3: Global Time Filter State

- **Decision**: Use `useState` at the Analytics page level for `{ dateRange, granularity }` state, passed as props to all charts and KPI cards. No global state manager (Context/Redux).
- **Rationale**: All time-filter consumers live within the same Analytics page tree. Prop drilling is shallow (page → section → chart). Promotes component isolation and simplifies testing.
- **Alternatives considered**:
  - React Context (rejected — overkill for single-page scoped state)
  - URL search params (accepted as future enhancement, not v1)

---

## Decision 4: Live Activity Feed Update Mechanism

- **Decision**: Use `setInterval` with a random interval (800–2000ms) inside `useEffect` in a `useLiveLogs` hook, keeping max 50 entries in a `useState` array.
- **Rationale**: Simulates realistic event streams without WebSocket complexity. The hook encapsulates interval cleanup, preventing memory leaks on unmount.
- **Alternatives considered**:
  - WebSocket (rejected — no backend for v1)
  - Server-Sent Events (rejected — backend required)

---

## Decision 5: Trend Polarity Logic

- **Decision**: Each `MetricCardData` carries an explicit `isPositive: boolean` field that decouples the visual badge color from the numeric direction. E.g., Error Rate going DOWN is `isPositive: true` even though the arrow points down.
- **Rationale**: Prevents incorrect color coding (a rising error rate is bad; a dropping response time is good). The interface design from `02-ANALYTICS.md` §2.1 already specifies this pattern.
- **Alternatives considered**:
  - Inferring polarity from metric name string (rejected — fragile, breaks with i18n)

---

## Decision 6: SLA Status Thresholds

- **Decision**: Apply ratio-based status classification:
  - `ratio < 0.8` → **Healthy** (for "lower is better" metrics)
  - `ratio >= 0.8 && < 1.0` → **Warning**
  - `ratio >= 1.0` → **Critical**
  - For "higher is better": `ratio > 0.99` → Healthy, `> 0.95` → Warning, else Critical
- **Rationale**: Directly derived from `02-ANALYTICS.md` §4.2 `getKPIStatus` logic. Ensures consistent SLA evaluation across all 4 KPI metrics.

---

## Decision 7: Component File Placement

- **Decision**: Split components by concern:
  - `components/dashboard/` — page-level wrappers (MetricCard, LiveLogs, TrafficChart)
  - `components/analytics/` — chart-specific components (PieChart, ResponseHistogram, StatusCodeChart, KPICard, TopAPIsTable)
  - `hooks/` — data hooks (useAnalyticsData, useLiveLogs)
- **Rationale**: Mirrors the pattern established in `01-LAYOUT-SYSTEM.md` and the existing `components/` structure. Keeps dashboard-wide components separate from analytics-specific ones.
- **Alternatives considered**:
  - All in one `components/analytics/` folder (rejected — MetricCard and TrafficChart have cross-feature reuse potential)

---

## Decision 8: Loading Skeleton Strategy

- **Decision**: Use **inline `animate-pulse` Tailwind skeletons** within each component's conditional render — no external skeleton library.
- **Rationale**: Already used in `02-ANALYTICS.md` §2.6. Tailwind's `animate-pulse` is zero-dependency and consistent with the design system.
- **Alternatives considered**:
  - `react-loading-skeleton` (rejected — unnecessary dependency)

---

## Decision 9: Responsive Chart Layout

- **Decision**: All charts use Recharts' `<ResponsiveContainer width="100%" height={N}>` for automatic resizing. Page grid uses `grid-cols-1 xl:grid-cols-3` for the main chart row and `grid-cols-1 lg:grid-cols-2` for the secondary row.
- **Rationale**: Directly specified in `02-ANALYTICS.md` §8.2 acceptance criteria: "All charts are responsive (use ResponsiveContainer)."

---

## Decision 10: Next.js Route for Analytics Page

- **Decision**: Analytics pages live under `app/(dashboard)/analytics/` using Next.js file-based routing:
  - `app/(dashboard)/analytics/page.tsx` → main Analytics Engine page (Traffic tab default)
  - `app/(dashboard)/analytics/traffic/page.tsx` → Traffic sub-page
  - `app/(dashboard)/analytics/performance/page.tsx` → Performance sub-page
- **Rationale**: Matches the sidebar navigation paths defined in `data-model.md` MENU_SECTIONS (`/analytics`, `/analytics/traffic`, `/analytics/performance`).
- **Alternatives considered**:
  - Client-side tab state without URL changes (rejected — breaks browser back/forward navigation and deep-linking)
