# Implementation Plan: Reports & Insights

**Branch**: `006-reports-insights` | **Date**: 2026-04-19 | **Spec**: [spec.md](./spec.md)

## Summary

Build the Reports & Insights page (`/analytics/reports`) with 4 tabs: Overview (6 pre-built report template cards with export dropdown), My Reports (custom report builder with 3-step wizard), Scheduled (schedule management table with toggle + create modal), and Insights (auto-generated insight cards from mock rule engine). Export system delivers client-side CSV and JSON downloads with a simulated progress modal.

## Technical Context

**Language/Version**: React 19, Next.js 16, TypeScript  
**Primary Dependencies**: DataTable (Spec 03), FilterBar (Spec 04), Lucide React, Tailwind CSS v4, Radix DropdownMenu/Dialog/Switch, date-fns  
**Storage**: N/A — all mock data and state in local/context; no backend for v1  
**Testing**: N/A  
**Target Platform**: `/analytics/reports` (sub-page of Analytics route group); desktop-first  
**Project Type**: Dashboard page + shared export utilities  
**Performance Goals**: Gallery renders < 500ms; export simulation completes 2–5 seconds; insight cards render < 300ms  
**Constraints**: PDF = simulation only; Excel = "Coming soon" toast; no real email delivery  
**Scale/Scope**: 6 templates, 6 insight rules, 2 mock scheduled reports; self-contained page

## Constitution Check

No project constitution defined. Follows Sopo dark theme tokens and React composition patterns.

## Project Structure

### Documentation (this feature)

```text
specs/006-reports-insights/
├── plan.md, spec.md, research.md, data-model.md, quickstart.md
├── contracts/component-api.md
├── checklists/requirements.md  ✅
└── tasks.md
```

### Source Code

```text
app/(dashboard)/analytics/reports/
└── page.tsx                        ← [CREATE] Reports & Insights page

components/reports/
├── ReportTemplateCard.tsx          ← [CREATE] Pre-built template card
├── ExportDropdown.tsx              ← [CREATE] Format selector dropdown
├── ExportProgressModal.tsx         ← [CREATE] Progress + download modal
├── InsightCard.tsx                 ← [CREATE] Auto-generated insight card
├── ScheduleReportModal.tsx         ← [CREATE] Create schedule modal
├── ReportBuilderModal.tsx          ← [CREATE] 3-step custom report wizard
└── ReportTabContent.tsx            ← [CREATE] Per-tab content wrapper

lib/
├── export-utils.ts                 ← [CREATE] exportToCSV + exportToJSON utilities
├── insight-rules.ts                ← [CREATE] INSIGHT_RULES array + rule runner
└── reports-mock.ts                 ← [CREATE] REPORT_TEMPLATES + MOCK_SCHEDULES + MOCK_INSIGHTS
```
