# Implementation Plan: Filters System

**Branch**: `004-filters-system` | **Date**: 2026-04-19 | **Spec**: [spec.md](./spec.md)

## Summary

Build the shared Filters System for the Sopo Platform — a composable set of filter components (`DateRangePicker`, `MultiSelectFilter`, `ToggleFilter`, `StatusFilter`, `FilterChips`, `FilterBar`) plus a `useFilters` hook that provides centralized filter state management. The system is consumed by Analytics (Spec 02), Data Tables (Spec 03), Users (Spec 05), and Reports (Spec 06).

## Technical Context

**Language/Version**: React 19, Next.js 16, TypeScript  
**Primary Dependencies**: date-fns (installed), Tailwind CSS v4, Lucide React, Radix DropdownMenu  
**Storage**: N/A — ephemeral session state only; no URL sync or localStorage for v1  
**Testing**: N/A  
**Target Platform**: All dashboard pages; responsive to 320px (stack vertically on mobile)  
**Project Type**: Shared component library — `components/filters/` + `hooks/useFilters.ts`  
**Performance Goals**: Filter application < 100ms; DateRangePicker preset selection < 50ms  
**Constraints**: No external date picker lib (react-day-picker, etc.) — build with Radix Calendar or custom  
**Scale/Scope**: Single shared system for all filter contexts; FilterBarConfig drives per-page customization

## Constitution Check

No project constitution defined. Follows Sopo dark theme and React hook composition patterns.

## Project Structure

### Documentation (this feature)

```text
specs/004-filters-system/
├── plan.md, spec.md, research.md, data-model.md, quickstart.md
├── contracts/component-api.md
├── checklists/requirements.md  ✅
└── tasks.md
```

### Source Code

```text
components/filters/
├── DateRangePicker.tsx       ← [CREATE] Preset + custom calendar
├── MultiSelectFilter.tsx     ← [CREATE] Checkbox dropdown + internal search
├── ToggleFilter.tsx          ← [CREATE] Pill button toggles
├── StatusFilter.tsx          ← [CREATE] Colored badge toggles
├── FilterChips.tsx           ← [CREATE] Active filter chips + clear all
├── FilterBar.tsx             ← [CREATE] Declarative filter bar composer
└── index.ts                  ← [CREATE] Barrel export

hooks/
└── useFilters.ts             ← [CREATE] Centralized filter state hook

lib/
├── date-presets.ts           ← [CREATE] DATE_PRESETS constant + getAutoGranularity
└── filter-utils.ts           ← [CREATE] getActiveFilterChips, computeFilterCount
```
