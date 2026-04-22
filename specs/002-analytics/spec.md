# Feature Specification: Analytics Engine

**Feature Branch**: `002-analytics`
**Created**: 2026-04-19
**Status**: Draft
**Input**: User description: "Analytics Engine based on 02-ANALYTICS.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Live API Health Overview via KPI Cards (Priority: P1)

Engineers and team leads need an immediate, at-a-glance snapshot of platform health when they open the Analytics page — covering total traffic volume, success rate, average response time, and error rate — so they can quickly detect anomalies without digging through raw logs.

**Why this priority**: This is the first thing a team sees when they open the Analytics page. If the KPI cards are broken or missing, no other section delivers value. It is the entire page's "heartbeat" indicator.

**Independent Test**: Navigate to the Analytics Engine page. Four metric cards must be visible, each showing a numeric value, a trend badge (green or red arrow), a mini sparkline chart, and a label. Can be tested with static mock data with no backend required.

**Acceptance Scenarios**:

1. **Given** a user opens the Analytics Engine page, **When** the page loads, **Then** four KPI cards render: *Total Requests*, *Success Rate*, *Avg Response Time*, and *Error Rate* — each displaying a current value, trend direction, and a mini sparkline.
2. **Given** a metric is improving (e.g., error rate going down), **When** the trend badge renders, **Then** it appears in green regardless of the arrow direction, because the metric is moving in a positive direction.
3. **Given** data is being fetched, **When** the page is loading, **Then** animated skeleton placeholders appear in place of each card's content without layout shift.
4. **Given** a user clicks on a KPI card, **When** the click is registered, **Then** the view drills down into the detailed breakdown for that metric.

---

### User Story 2 — Traffic Trend Visualization (Priority: P1)

Developers and DevOps engineers need to visualize API request traffic over time with the ability to zoom into specific time windows, so they can correlate traffic spikes with incidents or deployments.

**Why this priority**: Traffic charts are the most frequently referenced view in an API Gateway dashboard. Without them, the page fails its core promise of "analytics."

**Independent Test**: The Traffic Overview chart renders a multi-series area/line chart with at least 24 data points. A brush/zoom control is visible below the chart. Toggling legend items shows/hides the corresponding series.

**Acceptance Scenarios**:

1. **Given** a user views the Analytics page, **When** the Traffic Overview chart loads, **Then** an area chart displays total requests over time with an overlaid dashed line for p95 response time on a secondary Y-axis.
2. **Given** a user wants to zoom into a specific window, **When** they drag the brush component below the chart, **Then** the chart viewport adjusts to show only the selected time range.
3. **Given** a user hovers over a chart data point, **When** the crosshair tooltip appears, **Then** it shows formatted values for all visible series (requests, errors, p95) at that timestamp.
4. **Given** a user clicks a legend item, **When** the click is registered, **Then** that data series is hidden or shown on the chart without page reload.

---

### User Story 3 — Request Distribution Breakdown (Priority: P2)

Platform administrators need to understand how requests are distributed across API protocol types (REST, GraphQL, gRPC, WebSocket) so they can capacity-plan and identify underused integrations.

**Why this priority**: Important for deeper analysis but not blocking for core "is my system healthy?" use cases.

**Independent Test**: A donut chart renders with at least 3 distinct colored segments. Hovering over a segment shows the protocol name, count, and percentage. A center label shows the total request count.

**Acceptance Scenarios**:

1. **Given** a user views Section 2 of the Analytics page, **When** the donut chart loads, **Then** it displays colored segments for REST, GraphQL, gRPC, and WebSocket with labeled percentages.
2. **Given** a user hovers over a pie segment, **When** the tooltip appears, **Then** it shows the protocol name, request count, and percentage share.

---

### User Story 4 — Response Time & Status Code Distribution (Priority: P2)

Engineers investigating latency issues need a histogram showing how requests are distributed across response time buckets, alongside a stacked bar chart of HTTP status code categories, so they can pinpoint whether issues are latency-related or error-related.

**Why this priority**: Critical for incident investigation. Secondary to the main traffic chart but essential for diagnosis.

**Independent Test**: Two side-by-side charts render — a horizontal bar histogram of response time buckets (0-50ms, 50-100ms, etc.) and a stacked bar chart of status codes (2xx, 3xx, 4xx, 5xx) per time period. Bars exceeding warning thresholds render in amber/red.

**Acceptance Scenarios**:

1. **Given** a user views the secondary charts row, **When** the Response Time Histogram renders, **Then** it shows 5 time-range buckets with color coding: blue for normal ranges, amber for 200-500ms, and red for >500ms.
2. **Given** a user views the Status Code Distribution chart, **When** it renders, **Then** each bar is stacked with four color-coded segments: green (2xx), amber (3xx), orange (4xx), red (5xx).

---

### User Story 5 — SLA KPI Tracking (Priority: P2)

Engineering managers need a dedicated section showing whether the platform is meeting its SLA targets for uptime, response time, error rate, and throughput — with clear visual health status indicators (healthy / warning / critical).

**Why this priority**: SLA tracking directly maps to business obligations and is reviewed in team standups and management reports.

**Independent Test**: A KPI section renders with at least 4 metrics. Each shows a current value, a target value, a progress bar, and a color-coded status badge (green/yellow/red). Status changes correctly when values cross thresholds.

**Acceptance Scenarios**:

1. **Given** a KPI metric is within SLA target, **When** the status badge renders, **Then** it shows green with the label "Healthy."
2. **Given** a metric is approaching but not breaching its SLA threshold (80–100% of target), **When** the status renders, **Then** it shows amber "Warning."
3. **Given** a metric has breached its SLA target, **When** the status renders, **Then** it shows red "Critical."
4. **Given** KPI data refreshes every 30 seconds, **When** the refresh fires, **Then** the progress bars animate to their new values without page reload.

---

### User Story 6 — Real-time Live Activity Feed (Priority: P3)

On-call engineers and developers need a live stream of recent API requests to trace specific calls, identify error patterns, and confirm that fixes are taking effect — without leaving the Analytics page.

**Why this priority**: Highly useful for incident response but not core to the primary analytics workflow; can be added after core charts are working.

**Independent Test**: A scrollable log panel shows entries appearing automatically every 1–2 seconds. Each entry shows: timestamp, HTTP method, path, status code, latency, API name. Color coding reflects log level. A pause/resume button stops and restarts the stream. A level filter hides/shows entries.

**Acceptance Scenarios**:

1. **Given** a user views the Live Activity Feed, **When** the feed is running, **Then** new log entries appear at the top every 1–2 seconds, and the feed maintains at most 50 entries (oldest are removed).
2. **Given** a user clicks the "Pause" button, **When** the feed is paused, **Then** no new entries appear and the button label changes to "Resume."
3. **Given** a user selects "ERROR" in the log level filter, **When** the filter is applied, **Then** only log entries with ERROR level are visible in the feed.
4. **Given** auto-scroll is enabled, **When** new entries arrive, **Then** the feed scrolls to the newest entry. If the user manually scrolls up, auto-scroll pauses until they return to the bottom.

---

### User Story 7 — Time Range & Granularity Control (Priority: P1)

All users need to control the time window and data granularity for the entire analytics page (hourly, daily, weekly, monthly), so that all charts and KPIs update to reflect the selected period.

**Why this priority**: A global time filter is the primary control mechanism that affects all analytics data. Without it, the page shows static, meaningless mock data.

**Independent Test**: A date range picker and a granularity toggle (Hourly / Daily / Weekly / Monthly) are visible in the Page Header. Changing the granularity updates axis labels and data points in all charts simultaneously.

**Acceptance Scenarios**:

1. **Given** a user selects "Weekly" granularity, **When** the selection is applied, **Then** all charts update their X-axis to show week labels (Mon–Sun) and all KPI trend labels update to "vs. last week."
2. **Given** a user selects a custom date range via the date picker, **When** the selection is confirmed, **Then** all charts and KPI cards reflect only data from the selected window.

---

### Edge Cases

- What happens when all API calls return errors for 100% of the requests? (Error Rate card must show red "Critical" and still render correctly without division-by-zero issues.)
- What happens when traffic is zero for a time period? (Charts must render a flat baseline rather than empty/broken.)
- What if the user rapidly switches granularity multiple times? (All charts must debounce and only render once per settled selection, no flickering or stacked animations.)
- What if the user's screen is narrow (tablet/mobile)? (The 4-card KPI grid must collapse to 2×2, and charts must remain readable with horizontal scroll disabled.)
- What happens if the Live Feed generates a STATUS 0 or unexpected status code? (The feed must gracefully display the raw status code without crashing the component.)
- What if a pie chart segment has a 0% value? (The segment must be hidden or rendered as a negligible arc rather than causing layout errors.)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display four KPI cards on the Analytics Engine page: Total Requests, Success Rate, Avg Response Time, and Error Rate — each with a current value, trend badge, and mini sparkline.
- **FR-002**: Each KPI card trend badge MUST use green styling when the metric moves in a positive direction and red when it moves in a negative direction, independently of whether the numeric value is increasing or decreasing.
- **FR-003**: The system MUST display a Traffic Overview chart (area + line composite) with dual Y-axes: one for request volume and one for response time percentiles (p95).
- **FR-004**: The Traffic Overview chart MUST include a brush/zoom control allowing users to select and inspect a sub-range of the displayed time period.
- **FR-005**: The system MUST display a Request Distribution donut chart showing traffic breakdown by protocol type (REST, GraphQL, gRPC, WebSocket) with a center total label.
- **FR-006**: The system MUST display a Response Time Histogram as a horizontal bar chart with color-coded buckets: normal (0–200ms), warning (200–500ms), and critical (>500ms).
- **FR-007**: The system MUST display a Status Code Distribution chart as a stacked bar chart with color-coded HTTP status categories (2xx green, 3xx amber, 4xx orange, 5xx red).
- **FR-008**: The system MUST display an SLA KPI section with at least 4 metrics (uptime, response time, error rate, throughput), each showing current value, SLA target, progress bar, and a health status badge (Healthy / Warning / Critical).
- **FR-009**: SLA health status MUST be automatically determined: "Healthy" when within target, "Warning" when 80–100% of acceptable threshold, "Critical" when breached.
- **FR-010**: The system MUST display a Live Activity Feed showing the most recent 50 API requests, updating every 1–2 seconds.
- **FR-011**: The Live Activity Feed MUST support Pause/Resume control and a filter by log level (INFO, WARN, ERROR, DEBUG, SUCCESS).
- **FR-012**: The system MUST provide a global Date Range Picker and Granularity Toggle (Hourly / Daily / Weekly / Monthly) in the page header that simultaneously updates all charts and KPI data.
- **FR-013**: The system MUST show animated loading skeletons for all data-driven sections while data is being fetched.
- **FR-014**: All charts MUST be fully responsive and adapt to container widths without horizontal scroll.
- **FR-015**: Chart tooltips MUST display formatted, human-readable values with appropriate units (e.g., "142ms", "2.4M requests", "99.2%").

### Key Entities

- **MetricCard**: Represents a single KPI — holds current value, trend direction, trend magnitude, sparkline data series, and a positive/negative polarity flag.
- **TrafficDataPoint**: A single time-series measurement — contains timestamp, total request count, successful request count, error count, p50 latency, and p95 latency.
- **RequestDistribution**: Breakdown of request volume by protocol type — holds protocol name, count, percentage share, and display color.
- **ResponseTimeBucket**: A latency histogram bucket — holds a time range label, request count, and percentage of total.
- **StatusCodeData**: A per-period HTTP status distribution record — holds period label and counts for 2xx, 3xx, 4xx, and 5xx categories.
- **KPIMetric**: An SLA-tracked metric — holds category, current value, SLA target, health status, and 30-point history array.
- **LogEntry**: A single real-time API request record — holds timestamp, HTTP method, path, status code, latency, API name, client IP, log level, and request ID.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All four KPI cards render within 1 second of page load under normal conditions, using mock data.
- **SC-002**: All charts are interactive — tooltip, legend toggle, and brush/zoom respond to user input within 50ms of interaction.
- **SC-003**: Switching granularity (Hourly → Daily → Weekly → Monthly) updates all charts simultaneously within 300ms with no visible layout shift.
- **SC-004**: The Live Activity Feed displays a new log entry every 1–2 seconds with no dropped frames or UI freezes, and the entry count never exceeds 50.
- **SC-005**: All charts are fully readable and scroll-free on viewports as narrow as 768px (tablet), collapsing to single-column layout without horizontal overflow.
- **SC-006**: KPI loading skeletons appear for every data section before content loads, with no "empty state flash" (blank screen without skeleton).
- **SC-007**: SLA health status badges correctly reflect threshold logic with 100% accuracy: green below 80% of critical threshold, amber at 80–100%, red above 100%.
- **SC-008**: The page produces zero console errors or React warnings during normal operation (no `defaultProps` warnings, no key errors, no failed rendering).

---

## Assumptions

- Analytics data for this feature is powered by **mock/simulated data** generated client-side; no real backend API is required for v1.
- The Analytics Engine page renders inside the Layout System (Spec 01) — it assumes the dashboard layout shell (`Sidebar`, `Header`, `app/(dashboard)/layout.tsx`) is already in place.
- The Date Range Picker component will reuse the Filters System (Spec 04) date range picker when that spec is implemented; for v1, a simplified date selector is acceptable.
- The Reports tab within the Analytics page is **out of scope** for this spec — it is defined in Spec 06 (Reports/Insights).
- Real-time data will be simulated using `setInterval` generating random log entries and incrementally updating KPI values; WebSocket integration is out of scope for v1.
- The Top APIs Performance Table (Section 4 in the master spec) is **deferred** to a future iteration; v1 focuses on the 4 KPI cards, 4 charts, SLA section, and live feed.
- Charts use the Recharts library (already in `package.json`) — no additional charting library installation is needed.
- All chart color tokens must follow the Sopo dark theme palette defined in Spec 01 design tokens (`bg-gray-900`, `border-gray-800`, accent colors per spec).
