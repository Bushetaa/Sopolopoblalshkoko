# Tasks: Analytics Engine

**Input**: Design documents from `specs/002-analytics/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/component-api.md ✅, quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US7)
- Include exact file paths in descriptions

## Path Conventions

- **Dashboard Layout entry**: `app/(dashboard)/analytics/`
- **Dashboard components**: `components/dashboard/`
- **Analytics components**: `components/analytics/`
- **Hooks**: `hooks/`
- **Spec reference**: `specs/002-analytics/data-model.md` for all interfaces & constants

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and directory structure

- [x] T001 Create component directories: `components/analytics/` (verify `components/dashboard/` already exists from Spec 001)
- [x] T002 [P] Create analytics route structure: `app/(dashboard)/analytics/page.tsx`, `app/(dashboard)/analytics/traffic/page.tsx`, `app/(dashboard)/analytics/performance/page.tsx` as empty placeholder files
- [x] T003 [P] Verify Recharts, date-fns, and lucide-react are importable (already in package.json — import test only, no install needed)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data layer and shared utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create `hooks/useAnalyticsData.ts` — implement the hook returning `{ trafficData, distributionData, histogramData, statusCodeData, kpiCards, slaMetrics, isLoading }` per `contracts/component-api.md`; use `useMemo` keyed to `granularity + dateRange`; simulate 500ms loading delay on filter change; seed all constants from `data-model.md` (`KPI_CARDS`, `DISTRIBUTION_DATA`, `HISTOGRAM_DATA`, `SLA_METRICS`)
- [x] T005 [P] Create `hooks/useLiveLogs.ts` — implements `{ logs, isPaused, togglePause, levelFilter, setLevelFilter, filteredLogs }` per contracts; uses `setInterval` with random interval `[800, 2000]ms`; keeps max 50 entries via `.slice(0, 50)`; cleans up interval on unmount; derives `level` from statusCode (≥500 → ERROR, ≥400 → WARN, else SUCCESS)
- [x] T006 [P] Add chart design tokens to `app/globals.css` — add all CSS custom properties from `data-model.md` "Chart Design Tokens" section (`--chart-requests`, `--chart-success`, `--chart-errors`, `--chart-p95`, `--chart-warning`, `--chart-teal`, `--chart-orange`, `--chart-grid-stroke`, `--chart-text-fill`, `--chart-tooltip-bg`, `--chart-tooltip-border`)
- [x] T007 [P] Create `lib/analytics-utils.ts` — export `getKPIStatus(current, target, lowerIsBetter)` and `generateLogEntry()` utility functions per `contracts/component-api.md`; also export `TREND_STYLES`, `STATUS_STYLES`, `LOG_LEVEL_STYLES`, `STATUS_CODE_COLORS` constants from `data-model.md`

**Checkpoint**: Foundation ready — hooks, utilities, and tokens available. User story implementation can begin.

---

## Phase 3: User Story 1 — Live API Health Overview via KPI Cards (Priority: P1) 🎯 MVP

**Goal**: Render 4 KPI cards (Total Requests, Success Rate, Avg Response Time, Error Rate) with sparklines, trend badges, and loading skeletons on the Analytics page.

**Independent Test**: Navigate to `/analytics`. Four metric cards must render with numeric values, a colored trend badge (using `isPositive` polarity, NOT direction), and a 40px sparkline area chart. Set `isLoading=true` and confirm animated skeleton appears for all card content.

### Implementation for User Story 1

- [x] T008 [P] [US1] Create `components/dashboard/MetricCard.tsx` — full component with: icon + iconBg, value + unit display, trend badge (color from `TREND_STYLES[isPositive ? 'positive' : 'negative']`), 40px sparkline using Recharts `<AreaChart>` with `<Area>`, no axes, no tooltip, `isAnimationActive={false}`; animate-pulse skeleton when `isLoading=true`; `onClick` drilldown handler; size variants `sm|md|lg`; all props typed per `data-model.md` `MetricCardProps`
- [x] T009 [US1] Create `app/(dashboard)/analytics/page.tsx` — main page wrapping `useAnalyticsData(filterState)`; render Section 1 as `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">` mapping `kpiCards` to `<MetricCard>`; include `isLoading` prop pass-through; default `filterState` = last 7 days, `granularity: 'hourly'`; `useState` for `filterState` and `activeTab`

**Checkpoint**: US1 fully functional — 4 KPI cards render with mock data, trend badges use correct polarity colors, skeletons appear on load, click handlers fire.

---

## Phase 4: User Story 7 — Time Range & Granularity Control (Priority: P1)

**Goal**: Add a global Date Range Picker and Granularity Toggle (Hourly/Daily/Weekly/Monthly) to the Analytics page header that updates all charts/KPIs simultaneously.

**Independent Test**: Change granularity to "Weekly" — X-axis labels on all charts must update to day names (Mon/Tue…), and trend labels in KPI cards must update to "vs. last week". Pick a custom date range and confirm `filterState.dateRange` changes (verified via console.log or React DevTools).

### Implementation for User Story 7

- [x] T010 [P] [US7] Create `components/analytics/GranularityToggle.tsx` — accepts `value: Granularity` + `onChange: (g: Granularity) => void`; renders 4 buttons (Hourly/Daily/Weekly/Monthly) styled per `quickstart.md` tab spec (`bg-gray-900 border border-gray-800 rounded-lg p-1`; active = `bg-gray-800 text-gray-50`; inactive = `text-gray-500 hover:text-gray-300`)
- [x] T011 [P] [US7] Create `components/analytics/DateRangePicker.tsx` — accepts `value: DateRange` + `onChange: (r: DateRange) => void`; renders a simple preset selector (Last 24h / Last 7d / Last 30d / Custom); uses `date-fns` `subDays`/`subMonths` to compute date ranges; "Custom" opens an inline date input pair; styled consistent with dark theme (`bg-gray-900 border border-gray-800`)
- [x] T012 [US7] Create `components/analytics/PageHeader.tsx` — assembles the Analytics page header: title "Analytics Engine", `<DateRangePicker>`, `<GranularityToggle>`, Export button placeholder; accepts `filterState: AnalyticsFilterState` + `onFilterChange: (f: AnalyticsFilterState) => void`; integrates into `app/(dashboard)/analytics/page.tsx` replacing any static header

**Checkpoint**: Global filter state controls all sections. Granularity change updates axis labels; date range change triggers `useAnalyticsData` to regenerate data with 500ms simulated delay and skeleton flash.

---

## Phase 5: User Story 2 — Traffic Trend Visualization (Priority: P1)

**Goal**: Render the Traffic Overview ComposedChart (Area + dashed Line) with dual Y-axes, Brush zoom, interactive tooltip, and toggleable legend.

**Independent Test**: The Traffic chart renders at 320px height with at least 24 data points. Dragging the Brush component updates the visible range. Hovering shows a tooltip with requests, errors, and p95 values. Clicking a legend item hides/shows the series.

### Implementation for User Story 2

- [x] T013 [P] [US2] Create `components/analytics/CustomTooltip.tsx` — renders the shared dark tooltip (`bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl`); accepts Recharts `TooltipProps`; renders series rows with color dot + name + formatted value; `formatValue(value, name)` applies units (ms for p95, K/M abbreviation for requests)
- [x] T014 [US2] Create `components/dashboard/TrafficChart.tsx` — full `ComposedChart` implementation per `contracts/component-api.md` and `02-ANALYTICS.md` §3.2: `<Area>` for requests (blue gradient fill), `<Line>` for p95 (purple dashed, `strokeDasharray="4 4"`, right Y-axis), `<Brush height={24} stroke="#374151" fill="#111827">`, `<CartesianGrid>` horizontal only, `<CustomTooltip>`, toggleable `<Legend>`; `<ResponsiveContainer height={320}>`; `isLoading` shows skeleton; `granularity` prop formats X-axis labels (time strings for hourly, day names for daily)
- [x] T015 [US2] Add Traffic chart to `app/(dashboard)/analytics/page.tsx` Section 2 grid — `<div className="grid grid-cols-1 xl:grid-cols-3 gap-4">`: `TrafficChart` in `xl:col-span-2`, placeholder `div` in `xl:col-span-1` (to be filled by US3)

**Checkpoint**: US2 independently testable — Traffic chart renders, Brush zoom works, tooltip shows on hover, legend toggles series.

---

## Phase 6: User Story 3 — Request Distribution Breakdown (Priority: P2)

**Goal**: Render the Request Distribution donut chart showing REST/GraphQL/gRPC/WebSocket traffic shares.

**Independent Test**: A donut chart renders with 4 colored segments. Hovering shows protocol name, count (formatted), and percentage. Center label shows "2.4M / Total".

### Implementation for User Story 3

- [x] T016 [P] [US3] Create `components/analytics/PieTooltip.tsx` — specialized donut tooltip: shows `name`, formatted `value` (abbreviate with K/M), and `percentage%`; same dark card styling as `CustomTooltip`
- [x] T017 [US3] Create `components/analytics/PieChart.tsx` — Recharts `<PieChart>` with `<Pie innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">`; renders `<Cell>` per entry using `entry.color`; `<Label>` custom center component showing total formatted value + "Total" sub-label; `<PieTooltip>`; `<ResponsiveContainer>`; `isLoading` skeleton; all interfaces per `data-model.md` `RequestDistributionData`; also renders a legend list below the chart (protocol name + color dot + percentage)
- [x] T018 [US3] Wire `<RequestDistributionChart>` into Section 2 of `app/(dashboard)/analytics/page.tsx` replacing the `xl:col-span-1` placeholder

**Checkpoint**: Section 2 complete — Traffic chart (2/3) + Donut chart (1/3) render side-by-side on desktop, stack on mobile.

---

## Phase 7: User Story 4 — Response Time & Status Code Distribution (Priority: P2)

**Goal**: Render the Response Time Histogram (horizontal bar, color-coded by severity) and Status Code Distribution (stacked bar, 2xx/3xx/4xx/5xx).

**Independent Test**: Two charts render side-by-side in Section 3. Histogram shows 5 buckets — the ">500ms" bar is red, "200-500ms" amber, rest blue. Each bar has a % label on the right. Status code chart shows stacked colored segments per time period.

### Implementation for User Story 4

- [x] T019 [P] [US4] Create `components/analytics/ResponseHistogram.tsx` — Recharts `<BarChart layout="vertical">`; `<YAxis type="category" dataKey="range" width={70}>`; `<XAxis type="number">`; `<Bar dataKey="count" radius={[0,4,4,0]}>` with `<Cell>` colored by `severity` (`normal`→`#60A5FA`, `warning`→`#FBBF24`, `critical`→`#F87171`); `<LabelList dataKey="percentage" position="right" formatter={v => v + '%'}>`;  card wrapper with title "Response Time Distribution"; `isLoading` skeleton; typed per `data-model.md` `ResponseTimeBucket`
- [x] T020 [P] [US4] Create `components/analytics/StatusCodeChart.tsx` — Recharts `<BarChart>`; 4 stacked `<Bar>` components with `stackId="a"`: `2xx` green `#4ADE80`, `3xx` amber `#FBBF24`, `4xx` orange `#FB923C`, `5xx` red `#F87171` with `radius={[4,4,0,0]}`; `<CartesianGrid>` horizontal only; custom `<Tooltip>`; `<Legend>`; card wrapper with title "Status Code Distribution"; `isLoading` skeleton; typed per `data-model.md` `StatusCodeData`
- [x] T021 [US4] Add Section 3 grid to `app/(dashboard)/analytics/page.tsx` — `<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">` containing `<ResponseHistogram>` and `<StatusCodeChart>`, both receiving `data` and `isLoading` from `useAnalyticsData`

**Checkpoint**: Section 3 complete — both charts render correctly with color-coded bars and proper severity indicators.

---

## Phase 8: User Story 5 — SLA KPI Tracking (Priority: P2)

**Goal**: Render 4 SLA KPI cards (Uptime, p95 Response Time, Error Rate, Throughput) each with health status badge and animated progress bar.

**Independent Test**: 4 KPI cards render. "Uptime" and "Error Rate" show green "Healthy" badge. "Throughput" (8750 vs 10000 target) shows yellow "Warning" badge. Changing `current` to exceed `target` causes badge to turn red "Critical". Progress bars animate on mount.

### Implementation for User Story 5

- [x] T022 [US5] Create `components/analytics/KPICard.tsx` — renders metric name + category icon, current value + unit, SLA target, status badge (from `STATUS_STYLES[metric.status]`), progress bar (`Math.min((current/target)*100, 100)%` width, color matches status); calls `getKPIStatus` from `lib/analytics-utils.ts` to compute live status; `isLoading` skeleton; card wrapper `bg-gray-900 border border-gray-800 rounded-xl p-4`; typed per `data-model.md` `KPIMetric`
- [x] T023 [US5] Add Section 4 SLA grid to `app/(dashboard)/analytics/page.tsx` — `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">` mapping `slaMetrics` to `<KPICard>`, passing `isLoading`

**Checkpoint**: SLA section complete — 4 KPI cards render with correct health statuses and animated progress bars reflecting mock data thresholds.

---

## Phase 9: User Story 6 — Real-time Live Activity Feed (Priority: P3)

**Goal**: Render the live log feed that auto-updates every 1–2 seconds, supports Pause/Resume, level filtering, and auto-scroll behavior.

**Independent Test**: Feed renders and new entries appear at the top every ~1-2 seconds. Max 50 entries enforced (check length after 60s). "Pause" stops updates, "Resume" restarts. Selecting "ERROR" filter shows only error entries. Scrolling up pauses auto-scroll; scrolling to bottom resumes it.

### Implementation for User Story 6

- [x] T024 [US6] Create `components/dashboard/LiveLogs.tsx` — renders: filter bar (log level dropdown + Pause/Resume button), scrollable log entries list using `useLiveLogs` hook; each log row shows: timestamp (formatted `HH:mm:ss.SSS`), method badge (`GET`/`POST`/etc in styled pill), path, status code (colored via `STATUS_CODE_COLORS`), latency (`Xms`), API name; `level` indicator colored via `LOG_LEVEL_STYLES`; auto-scroll logic using `useRef` + `useEffect` (scroll to bottom when `autoScroll && !isPaused`); pauses auto-scroll on manual upward scroll (`onScroll` event); card wrapper with title "Live Activity Feed" + entry count badge; no props needed (self-contained via `useLiveLogs`)
- [x] T025 [US6] Add Section 5 Live Feed to `app/(dashboard)/analytics/page.tsx` — add `<LiveLogs />` below Section 4 SLA grid as the final section

**Checkpoint**: Full Analytics page complete end-to-end — all 5 sections functional with live data simulation.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple sections

- [x] T026 [P] Verify zero horizontal scroll at 320px, 768px, 1024px, and 1440px — check all `<ResponsiveContainer>` usages have `width="100%"` and no fixed `minWidth` values; check grid containers have `min-w-0`
- [x] T027 [P] Audit all charts for console warnings — suppress Recharts `defaultProps` warnings if present (wrap in `<ChartErrorBoundary>` or use Recharts 2.x compatible prop syntax)
- [x] T028 Validate `useAnalyticsData` filter reactivity — confirm changing granularity from Hourly → Weekly → Monthly cycles correctly regenerates `trafficData` with appropriate time labels (hourly: "00:00"–"23:00", daily: "Mon"–"Sun", weekly: "Week 1"–"Week 4", monthly: "Jan"–"Dec")
- [x] T029 [P] Verify all loading skeletons appear on simulated slow load — temporarily increase the `useAnalyticsData` delay to 2000ms and confirm skeletons render for all 4 sections before data appears
- [ ] T030 Add `app/(dashboard)/analytics/traffic/page.tsx` content — simple 30-day traffic trend area chart using `trafficData` with daily granularity; reuses `TrafficChart` with `granularity="daily"` and 30 data points
- [ ] T031 [P] Add `app/(dashboard)/analytics/performance/page.tsx` content — performance metrics page showing `PerformanceMetrics` per-API data in a simple table (API name + p50/p75/p90/p95/p99 columns); styled consistent with dark theme

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories; T004, T005, T006, T007 can all run in parallel
- **US1 (Phase 3)**: Depends on Foundational (needs `useAnalyticsData` from T004)
- **US7 (Phase 4)**: Depends on US1 (wires into the page created by T009) — can be developed alongside US1
- **US2 (Phase 5)**: Depends on Foundational — can start after Phase 2 even before US1 is done (different files)
- **US3 (Phase 6)**: Depends on US2 (fills the `xl:col-span-1` placeholder in Section 2)
- **US4 (Phase 7)**: Depends on Foundational — fully parallel with US2 and US3 (different files)
- **US5 (Phase 8)**: Depends on Foundational + T007 (`getKPIStatus` utility)
- **US6 (Phase 9)**: Depends on Foundational + T005 (`useLiveLogs` hook)
- **Polish (Phase N)**: Depends on all desired user stories being complete

### Parallel Opportunities

- T004, T005, T006, T007 → run in parallel (all Foundational, all different files)
- T008, T010, T011 → run in parallel after Foundational (MetricCard, GranularityToggle, DateRangePicker — different files)
- T013, T016, T019, T020 → run in parallel (CustomTooltip, PieTooltip, ResponseHistogram, StatusCodeChart — different files, all only need Foundational)
- T026, T027, T029, T031 → run in parallel in Polish phase

---

## Parallel Example: Foundational Phase (Phase 2)

```
Parallel batch — all can run simultaneously:
  T004: hooks/useAnalyticsData.ts
  T005: hooks/useLiveLogs.ts
  T006: app/globals.css (design tokens)
  T007: lib/analytics-utils.ts
```

## Parallel Example: After Foundational (Cross-story)

```
Parallel batch — different team members or agents:
  Developer A: T008 + T009 + T010 + T011 + T012  (US1 + US7)
  Developer B: T013 + T014 + T015                 (US2 Traffic chart)
  Developer C: T019 + T020                        (US4 Histogram + Status chart)
```

---

## Implementation Strategy

### MVP First (US1 + US7 Only — KPI Cards + Filter Control)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational — especially T004 and T006)
3. Complete Phase 3 (US1 — MetricCard + page skeleton)
4. Complete Phase 4 (US7 — GranularityToggle + DateRangePicker wired to page)
5. **STOP and VALIDATE**: 4 KPI cards display, filter changes trigger data refresh, skeletons appear

### Incremental Delivery

1. Foundation (T004–T007) → hooks & utils ready
2. US1 + US7 → KPI cards + filter → ship increment (visible, interactive page)
3. US2 → Traffic chart → ship increment (primary chart visible)
4. US3 → Donut chart → ship increment (Section 2 complete)
5. US4 → Histogram + Status bar → ship increment (Section 3 complete)
6. US5 → SLA KPIs → ship increment (Section 4 complete)
7. US6 → Live Feed → ship increment (full page)
8. Polish → zero warnings, responsive validation → final ship
