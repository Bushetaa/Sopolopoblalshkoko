# Tasks: Reports & Insights

**Input**: Design documents from `specs/006-reports-insights/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [ ] T001 Create `app/(dashboard)/analytics/reports/page.tsx` as empty placeholder with 4 tab navigation (Overview/My Reports/Scheduled/Insights)
- [ ] T002 [P] Create `components/reports/` directory with barrel `index.ts`
- [ ] T003 [P] Create `lib/reports-mock.ts` — export `REPORT_TEMPLATES` (6 templates), `MOCK_SCHEDULES` (2 scheduled reports), `EXPORT_FORMATS` config per `data-model.md`

---

## Phase 2: Foundational

- [ ] T004 [P] Create `lib/export-utils.ts` — export `exportToCSV(data, filename)` and `exportToJSON(data, filename)` per spec §3.5/3.6; both use `Blob + URL.createObjectURL + link.click`; `exportToCSV` handles comma/quote escaping
- [ ] T005 [P] Create `lib/insight-rules.ts` — export `INSIGHT_RULES` array (6 rules: high-error-rate, response-time-spike, rate-limit-approaching, traffic-growth, deprecated-api-traffic, mfa-security) + `runInsightRules(metrics, apis, users): Insight[]` function
- [ ] T006 [P] Create `components/reports/ExportDropdown.tsx` — Radix DropdownMenu; renders each format with its icon + label + one-line description; Excel option shows `toast("Excel export coming soon")` and suppresses download; PDF shows progress modal only (no real download); CSV/JSON trigger export util

**Checkpoint**: Utilities and export dropdown ready.

---

## Phase 3: User Story 1 — Pre-built Reports Gallery (P1) 🎯 MVP

**Goal**: Overview tab with 6 template cards in a responsive grid.

**Independent Test**: Overview tab renders 6 cards in `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`. Each card has icon + title + description + ≤3 metric tags + "+N more" overflow + estimated time + Schedule button + Export dropdown.

- [ ] T007 [US1] Create `components/reports/ReportTemplateCard.tsx` — `bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col`; icon in `iconBg` container; optional Premium badge; title + description; metric tags (max 3 + overflow count); footer with estimated time + Schedule button + `ExportDropdown`; `hover:border-gray-700 transition-all`
- [ ] T008 [US1] Wire Overview tab in `app/(dashboard)/analytics/reports/page.tsx` — responsive grid mapping `REPORT_TEMPLATES` to `<ReportTemplateCard>`

**Checkpoint**: US1 functional — gallery renders all 6 cards with correct data.

---

## Phase 4: User Story 2 — Export Progress Modal (P1)

**Goal**: Progress modal that simulates generation and offers a download button.

**Independent Test**: Click "Export → CSV" — modal opens with spinner + 0% bar. Bar advances to 100% in 2–5 seconds. "Report Ready!" + file size appear. "Download" triggers CSV file. Simulated failure shows red ✗ + error text.

- [ ] T009 [US2] Create `components/reports/ExportProgressModal.tsx` — Radix Dialog; uses `setInterval` every 150ms to increment `progress` by random 3–8% until 100%; status-dependent rendering: `processing` (Loader2 spin + progress bar), `complete` (CheckCircle + file size + Download button), `failed` (XCircle + error message + Close); `onDownload` triggers `exportToCSV` or `exportToJSON` based on format
- [ ] T010 [US2] Wire `ExportDropdown` → `ExportProgressModal` in `ReportTemplateCard` — selecting CSV/JSON opens the modal; passing `ExportConfig` with template + format

**Checkpoint**: US2 functional — full export flow from dropdown click to file download.

---

## Phase 5: User Story 3 — Scheduled Reports (P2)

**Goal**: Scheduled tab with DataTable, active toggle, and create schedule modal.

**Independent Test**: Schedules tab shows 2 mock schedules in DataTable. Toggle switch changes isActive. Click "Schedule Report" → modal → fill → Create → new row in table.

- [ ] T011 [P] [US3] Create `components/reports/ScheduleReportModal.tsx` — Radix Dialog; report template selector dropdown, schedule name input, frequency tabs (Daily/Weekly/Monthly) with conditional day-of-week or day-of-month inputs, time input + timezone, date range for report selector (Last Day/Week/Month/Quarter), format selector, email recipient `EmailTagInput` (reuse from Spec 05 or rebuild inline), webhook URL optional input; "Create Schedule" submits locally
- [ ] T012 [US3] Wire Scheduled tab in `app/(dashboard)/analytics/reports/page.tsx` — local state `schedules` initialized from `MOCK_SCHEDULES`; `<DataTable columns={SCHEDULE_COLUMNS}>` with `Switch` toggle per row calling `toggleSchedule`; "Schedule Report" button opens `ScheduleReportModal`; on submit appends new schedule to state

**Checkpoint**: US3 functional — schedule table renders, toggle works, create adds new row.

---

## Phase 6: User Story 4 — Auto-Generated Insights (P2)

**Goal**: Insights tab runs rules and renders insight cards with severity, dismiss action.

**Independent Test**: Insights tab renders at least 1 triggered card (MFA rule always triggers). Critical severity badge is red. Clicking "Dismiss" removes card. Action button navigates to specified path.

- [ ] T013 [P] [US4] Create `components/reports/InsightCard.tsx` — card with severity-colored left border (critical: red, warning: amber, info: blue, success: green); severity badge + InsightType icon; title + summary text; metric display if present (current value + unit + % change); detail text (collapsible); recommendation text in italic; action button (uses Next.js `router.push(actionPath)`) + Dismiss button; `isDismissed` in local state
- [ ] T014 [US4] Wire Insights tab in `app/(dashboard)/analytics/reports/page.tsx` — call `runInsightRules(mockMetrics, mockApis, mockUsers)` on mount; manage `dismissedIds: string[]` in state; filter out dismissed insights; render remaining as `<InsightCard>`; show success empty state when all dismissed

**Checkpoint**: US4 functional — insights render from rules, dismiss removes cards, action links work.

---

## Phase 7: User Story 5 — Custom Report Builder (P3)

**Goal**: My Reports tab with report list and 3-step builder wizard.

**Independent Test**: My Reports tab with no reports shows empty state with CTA. Click "New Report" → 3-step modal: type → date range → metrics. Click Generate → progress modal → report appears in table with Download button.

- [ ] T015 [US5] Create `components/reports/ReportBuilderModal.tsx` — 3-step Radix Dialog: Step 1 report type (Performance/Traffic/Errors toggle), Step 2 date range (uses `DateRangePicker` from Spec 04) + granularity, Step 3 metric checkboxes; Next/Back navigation; Generate triggers `ExportProgressModal`; on completion adds to My Reports local state
- [ ] T016 [US5] Wire My Reports tab — local state `myReports: CustomReportRecord[]`; when empty shows empty state (`"No custom reports yet"` + CTA button); when populated shows DataTable with name/date range/format/generated-at/fileSize/Download columns

**Checkpoint**: US5 functional — custom builder flow works end-to-end.

---

## Phase N: Polish

- [ ] T017 [P] Wire tab routing via URL query param (`?tab=...`) using `useSearchParams` + `useRouter` in the reports page
- [ ] T018 [P] Export all components from `components/reports/index.ts` barrel
- [ ] T019 [P] Verify progress simulation never exceeds 100% and always reaches exactly 100% before switching to `complete` state
- [ ] T020 Zero console warnings — no key errors, no missing Dialog accessibility attributes
