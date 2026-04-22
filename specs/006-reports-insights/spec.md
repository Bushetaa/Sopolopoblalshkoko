# Feature Specification: Reports & Insights

**Feature Branch**: `006-reports-insights`
**Created**: 2026-04-19
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browse Pre-built Report Templates (Priority: P1)

Platform users need to browse a gallery of 6 pre-built report templates (API Performance, Traffic Analysis, Error & Incident, Gateway Health, SLA Compliance, Rate Limiting), each showing metrics covered and estimated generation time, so they can quickly identify and generate the reports they need.

**Why this priority**: The pre-built reports gallery is the entry point for the entire feature. It delivers immediate value without requiring users to configure anything.

**Independent Test**: Navigate to `/analytics/reports`. The Overview tab is active and shows 6 report template cards in a grid. Each card has an icon, title, description, metric tags (max 3 + overflow count), estimated time, and an Export dropdown button.

**Acceptance Scenarios**:

1. **Given** the Reports page loads on the Overview tab, **When** it renders, **Then** 6 report template cards display in a responsive grid with darkthemed cards (`bg-gray-900 border border-gray-800 rounded-xl`).
2. **Given** a template has more than 3 metrics, **When** the card renders, **Then** only 3 metric tags appear plus "+N more" overflow indicator.
3. **Given** a template is marked `isPremium=true`, **When** the card renders, **Then** a "Premium" amber badge appears in the card header.
4. **Given** the Export dropdown is clicked on the "API Performance Summary" card, **When** the dropdown opens, **Then** format options (PDF, CSV, JSON) are listed with format icons and a one-line description.

---

### User Story 2 — Generate & Export a Report (Priority: P1)

Users need to select an export format (PDF, CSV, JSON, Excel) for any report template and see a simulated progress modal that confirms generation before offering a download, so they can get data in their preferred format.

**Why this priority**: Export is the core action of the Reports feature. Without it, the gallery is just informational.

**Independent Test**: Click "Export → CSV" on the API Performance card. A modal appears with "Generating Report…" label, a spinning loader, and a progress bar that advances from 0% to 100% over ~3 seconds. At 100%, the label changes to "Report Ready!" and a "Download" button appears. Clicking "Download" triggers a CSV file download in the browser.

**Acceptance Scenarios**:

1. **Given** a user selects an export format, **When** the export modal opens, **Then** it shows a spinner, "Generating Report…" heading, progress bar at 0%, and a "Cancel" button.
2. **Given** the export job is processing, **When** the simulated progress completes (100%), **Then** the spinner is replaced by a green ✓ icon, heading changes to "Report Ready!", file size appears, and a "Download" button becomes active.
3. **Given** the export format is CSV, **When** "Download" is clicked, **Then** a `.csv` file is created client-side and downloaded using the `exportToCSV` utility with a timestamped filename.
4. **Given** the export format is JSON, **When** "Download" is clicked, **Then** a structured JSON file matching the `JSONExportStructure` interface is downloaded.
5. **Given** an export fails (simulated error), **When** the modal updates, **Then** a red ✗ icon appears with the error message and only a "Close" button.

---

### User Story 3 — Manage Scheduled Reports (Priority: P2)

Team leads and operators need to create, view, toggle (pause/resume), and delete scheduled reports that run automatically (daily/weekly/monthly) and are delivered via email, so they can receive regular insights without manual effort.

**Why this priority**: Scheduled reports automate recurring reporting workflows, delivering ongoing value after initial setup.

**Independent Test**: Navigate to the "Scheduled" tab. A table of mock scheduled reports renders with columns: name, frequency, delivery (email count), next run, and active toggle. Click "Schedule Report" — a modal opens. Fill in name, select weekly frequency, pick Monday 09:00, choose PDF format, enter "admin@company.com" as recipient, and click "Create Schedule" — a new row appears in the table.

**Acceptance Scenarios**:

1. **Given** the Scheduled tab is active, **When** it renders, **Then** a DataTable shows mock scheduled reports with columns for name, frequency, delivery, next run, and an active/paused toggle switch.
2. **Given** a schedule has `isActive=true`, **When** the toggle renders, **Then** the switch is checked and "Active" label shows in green. Toggling it changes to "Paused" in gray.
3. **Given** the "Create Schedule" modal is open, **When** "Weekly" frequency is selected, **Then** a day-of-week selector appears (Mon–Sun). With "Monthly", a day-of-month number input appears.
4. **Given** the form is submitted with at least one email recipient, a report template, frequency, and format, **When** "Create Schedule" is clicked, **Then** a new row appears in the schedules table with correct next-run date.

---

### User Story 4 — Auto-Generated Insights (Priority: P2)

All platform users need a curated list of auto-generated insights (anomalies, degradations, improvements, recommendations, security findings) derived from mock data, each with a severity badge, detail text, and an actionable recommendation, so they can proactively address issues without manual analysis.

**Why this priority**: Insights provide proactive value by surfacing issues users may not know to look for.

**Independent Test**: Navigate to the "Insights" tab. Insight cards render for each triggered rule (e.g., "Low MFA Adoption" if <60% of users have MFA). Each card shows a severity badge (info/warning/critical/success), a title, summary, detail text, and either an "action" button or "Dismiss" option. Clicking "Dismiss" removes the card from the list.

**Acceptance Scenarios**:

1. **Given** the mock data triggers the "Low MFA Adoption" rule, **When** the Insights tab renders, **Then** an insight card appears with `severity: 'warning'`, the title "Low MFA Adoption", and a "Security Settings" action button.
2. **Given** an insight has `severity: 'critical'`, **When** its card renders, **Then** the severity badge is red and the card may have a subtle red left border.
3. **Given** a user clicks "Dismiss" on an insight card, **When** the action fires, **Then** the card disappears from the list (sets `isDismissed=true` in state) without a page reload.
4. **Given** an insight has `actionLabel` and `actionPath`, **When** the action button is clicked, **Then** it navigates to the provided path using Next.js router.

---

### User Story 5 — Custom Report Builder (Priority: P3)

Advanced users need a "My Reports" tab with a list of previously created custom reports and a "New Report" builder modal that lets them configure which metrics, date range, and filters to include, so they can create bespoke reports for specific needs.

**Why this priority**: Custom reports are a power-user feature. The gallery and scheduling provide enough value for most users.

**Independent Test**: Click "New Report" on the My Reports tab. A multi-step modal opens: Step 1 selects report type (Performance, Traffic, Errors); Step 2 configures date range and granularity; Step 3 picks specific metrics to include. Clicking "Generate" adds the report to the My Reports table with a "Generated" status badge and a download button.

**Acceptance Scenarios**:

1. **Given** the My Reports tab is active with no reports, **When** it renders, **Then** an empty state shows "No custom reports yet" with a "Create your first report" call-to-action.
2. **Given** a custom report was previously created, **When** it appears in the table, **Then** it shows report name, date range, format, generated date, file size, and a download button.
3. **Given** the Report Builder modal completes all steps, **When** "Generate" is clicked, **Then** a progress modal appears (same as US2), and on completion the report appears in the My Reports table.

---

### Edge Cases

- What happens if the CSV export utility receives an empty dataset? (Show a user-visible "No data available for this date range" message and cancel the download.)
- What if two schedules have the same name? (Allow duplicates — no uniqueness constraint on schedule names for v1.)
- What if a scheduled report's template no longer exists? (Show "[Deleted Template]" placeholder in the schedule table row, disable the Run Now action.)
- What if the Insights tab has no triggered rules (all metrics are healthy)? (Show a "No insights at this time — all metrics are within normal ranges" success state with a green checkmark.)
- What if a JSON export produces a circular reference? (Wrap `JSON.stringify` in a try-catch; show "Export failed: circular reference detected" in the error modal.)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Reports page at `/analytics/reports` MUST render 4 tabs: Overview, My Reports, Scheduled, Insights. Tab state persists in URL query parameter (`?tab=scheduled`).
- **FR-002**: The Overview tab MUST render 6 pre-built report template cards matching the `REPORT_TEMPLATES` constant, in a responsive `grid-cols-1 md:grid-cols-2 xl:grid-cols-3` grid.
- **FR-003**: Each report card MUST have: icon + iconBg, title, description, up to 3 metric tags + overflow, estimated time, optional Premium badge, a Schedule button (calendar icon), and an Export dropdown.
- **FR-004**: The `ExportDropdown` MUST render each format with its icon, label, and description. Selecting a format MUST open the `ExportProgressModal`.
- **FR-005**: The `ExportProgressModal` MUST simulate progress from 0% to 100% over a random 2–5 second interval; on completion it MUST show file size and a "Download" button; failure state MUST show error message.
- **FR-006**: `exportToCSV` and `exportToJSON` MUST create files client-side using `Blob` + `URL.createObjectURL` with timestamped filenames.
- **FR-007**: The Scheduled tab MUST render a `<DataTable>` with scheduled reports and an active/paused `<Switch>` toggle per row; toggling MUST update the schedule's `isActive` state.
- **FR-008**: The "Create Schedule" modal MUST have: report selector, schedule name input, frequency toggle (Daily/Weekly/Monthly) with conditional day/time selectors, date range for report, format selector, and email recipient tag input.
- **FR-009**: The Insights tab MUST run all `INSIGHT_RULES` against mock data and render an `InsightCard` for each triggered rule; each card MUST have severity badge, title, summary, detail, optional metric display, recommendation text, optional action button, and a Dismiss option.
- **FR-010**: Dismissing an insight MUST set `isDismissed=true` in local state and remove the card from the visible list without page reload.

### Key Entities

- **ReportTemplate**: Pre-built report definition — id, title, description, category, icon, iconColor, iconBg, metrics[], defaultDateRange, estimatedTime, formats[], isPremium?.
- **ExportFormat**: Enum — `pdf | csv | json | excel | png`.
- **ExportJob**: Export job state — id, status (queued/processing/complete/failed), progress (0-100), config, downloadUrl?, fileSize?, error?.
- **ScheduledReport**: Recurring report schedule — id, name, templateId, format, schedule (frequency/day/time/timezone), delivery (method/emails/webhookUrl), dateRange, isActive, nextRunAt, runCount.
- **Insight**: Auto-generated finding — id, type, severity, title, summary, detail, metric?, affectedEntities?, recommendation?, actionLabel?, actionPath?, isDismissed.
- **InsightType**: Enum — `anomaly | degradation | improvement | threshold | recommendation | security | cost`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 6 report template cards render within 500ms of page navigation to the Reports tab.
- **SC-002**: The export progress simulation completes and shows "Report Ready!" in under 6 seconds in all cases.
- **SC-003**: A CSV file downloaded via `exportToCSV` opens correctly in Excel/Google Sheets with proper column headers and no encoding errors.
- **SC-004**: Creating a scheduled report (modal → form fill → submit) takes no more than 8 user interactions and results in a new table row within 300ms.
- **SC-005**: Insight cards for at least 1 triggered rule appear on the Insights tab on every load using the mock dataset (MFA adoption rule always triggers given the 60% threshold and mock data).
- **SC-006**: The component produces zero React console warnings or errors.

---

## Assumptions

- All report generation is **simulated client-side** — no server-side PDF generation; PDF export shows "Preview only" placeholder for v1 (actual PDF library integration is out of scope).
- CSV and JSON exports are **fully implemented client-side** using Blob API.
- Excel export is **deferred** — clicking Excel shows a "Coming soon" toast notification for v1.
- The Custom Report Builder (US5) is a **lower-fidelity MVP** — basic 3-step wizard with limited metric selection, not a fully configurable report engine.
- Insights are generated by running `INSIGHT_RULES` against the same mock data constants used in Spec 02 (Analytics) and Spec 05 (Users) — no separate data layer.
- Scheduled reports run on the server in production; for v1, "Run Now" trigger is a UI-only simulation with a progress modal and no actual delivery.
- The Reports page lives at `/analytics/reports` — it is an existing placeholder created as a sub-page of the Analytics route group from Spec 02.
- Spec 01 (Layout), Spec 02 (Analytics), Spec 03 (DataTable), and Spec 04 (Filters) MUST be implemented before this spec.
