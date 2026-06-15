# Chapter: Implementation of Sopo Frontend (Control Plane)

## 1. Introduction and Implemented Scope
This chapter details the implementation of `sopo-frontend`, the visual Control Plane for the Sopo Enterprise API Lifecycle Automation Platform. Built with Next.js 15 (App Router), Tailwind CSS 4.0, and React 19, this subsystem focuses on providing an intuitive management dashboard. The implemented scope includes the Gateway Management interface, Service & Target Mesh orchestration, Advanced Routing forms, and a high-fidelity Analytics & KPI Dashboard.

## 2. Design Techniques and Justifications
### 2.1 Decoupled Control Plane Architecture
The frontend is architecturally decoupled from the Data Plane (the Go-based Gateway). It communicates exclusively via the Backend-For-Frontend (BFF) REST APIs.
*   **Justification:** This strict separation ensures that the heavy data-processing engine of the proxy is never hindered by administrative UI queries or analytics rendering. It allows the frontend to scale independently and utilize specialized edge caching networks (like Vercel or AWS Amplify).

### 2.2 Server Components (RSC) and Client-Side Caching (TanStack Query)
The application leverages the Next.js App Router to mix React Server Components for static layouts with Client Components for interactive elements. TanStack Query is utilized for client-side data fetching.
*   **Justification:** RSCs significantly reduce the initial JavaScript bundle sent to the browser, improving the First Contentful Paint (FCP). For dynamic data (live metrics, logs), TanStack Query provides robust caching, background refetching (stale-while-revalidate), and optimistic UI updates.

## 3. Design Trade-offs
*   **Polling vs. WebSockets for Analytics:** To display real-time analytics, we evaluated WebSockets versus HTTP polling. We chose TanStack Query polling for the metrics dashboards. **Justification:** While WebSockets offer lower latency, they require maintaining stateful connections and complex load balancing. HTTP polling (e.g., every 5 seconds) drastically simplifies the infrastructure while still providing near-real-time visibility adequate for traffic analysis.
*   **High-Fidelity Charts (Recharts) vs. Lightweight SVG:** Rendering massive datasets on the frontend can cause UI blocking. We opted for Recharts (a heavier React wrapper for D3) over native lightweight SVGs. **Justification:** The rich interactivity, tooltips, and responsiveness provided by Recharts outweighed the initial load cost, as the target demographic (DevOps engineers) expects deep, interactive data exploration.

## 4. Coding Traps and Novel Aspects
### 4.1 Coding Traps
*   **Cache Stale-Data Anomalies:** A major coding trap in dashboard applications is failing to invalidate the client cache after a state mutation. For example, updating an upstream target's weight without invalidating the `['services']` query key results in the UI displaying stale data, often prompting users to submit duplicate requests. This was resolved by implementing strict cache invalidation chains after every successful mutation.
*   **Hydration Mismatches:** Using dynamic client-side dates (like "Time ago") inside Server Components causes React hydration errors because the server-rendered HTML does not match the client-rendered output. We mitigated this by isolating time-formatting logic strictly within `useEffect` hooks or dedicated Client Components.

### 4.2 Novel Aspects
*   **Visual Traffic Weighting Algorithm:** The UI implements an interactive, multi-thumb sliding bar for traffic distribution among microservices. As a user drags one slider to increase traffic to "Service A", the algorithm automatically and proportionately recalculates the weights of "Service B" and "Service C" to ensure the total is strictly bounded to 100% before the payload is dispatched to the backend.

## 5. Testing Strategy
Testing was aligned with the analysis phase models, utilizing both Category Partition and State Machine-based approaches tailored for User Interfaces.

### 5.1 Model-Based Testing
*   **State Machine Testing:** Applied to the complex multi-step UI wizards (e.g., *Create Gateway* -> *Define Service* -> *Bind Routes*). We verified that users cannot bypass required steps and that the "Next" state is only unlocked upon successful Zod schema validation.
*   **Category Partition Testing:** Applied to user input validation forms. Partitions included: Empty required fields, malformed URL structures, negative traffic weights, and duplicate route slugs.

### 5.2 Functional and User Acceptance Testing (UAT)
*   **Functional Testing:** Validated the integration between Shadcn UI forms and the backend endpoints, ensuring that success toasts trigger correctly and errors are mapped gracefully to the specific UI fields.
*   **UAT:** Conducted accessibility (a11y) and responsiveness tests. Evaluators tested the platform across different viewports (Desktop vs. Tablet) to ensure the complex routing tables and analytics charts remained usable without horizontal scroll breaking the layout.

### 5.3 Experimental Evaluation
The frontend's rendering performance was experimentally evaluated by loading the Analytics dashboard with a simulated "live" dataset of over 10,000 data points. We measured the Frames Per Second (FPS) and memory heap usage during chart interactions (zooming, hovering). The results confirmed that utilizing Recharts with optimized React `useMemo` hooks maintained a smooth 60 FPS experience, outperforming legacy charting implementations used in previous iterations.
