# Research & Architecture Decisions

## Decision 1: Routing & Breadcrumb Context Tracking
- **Decision**: Use Next.js `usePathname()` from `next/navigation` to determine dynamic path segments and build Breadcrumbs without manual nested prop passing.
- **Rationale**: Keeps components loosely coupled; `usePathname()` is the idiomatic Next.js App Router approach. React Router's `useLocation` does not exist in this project.
- **Alternatives considered**: Passing route titles statically through nested route configurations (rejected due to reduced scalability and massive prop-drilling); React Router (rejected — project uses Next.js App Router).

## Decision 2: Sidebar Accordion State Management
- **Decision**: Use a single `Set<string>` locally within `Sidebar.tsx` to trap which menus are expanded, mapping `expandItems.has(itemName)` to rotation toggles. 
- **Rationale**: Minimal memory footprint, natively supported by React state logic, and eliminates the need for Redux just for navigation state tracking.
- **Alternatives considered**: Global state wrapper (Context API) (rejected due to being overkill for local presentational state).

## Decision 3: Responsive Drawer Rendering
- **Decision**: In mobile views (<768px), we use a standalone `MobileSidebar` wrapper with `z-40` to overlay the Drawer over the application alongside a dark backdrop (`bg-black/60 backdrop-blur-sm`).
- **Rationale**: Pushing content via flex margins causes visual reflow that is janky on mobile; overlay drawers provide smooth native-like application feel.
- **Alternatives considered**: Pushing content via flex margins (rejected due to visual reflow issues).

## Decision 4: Dashboard Layout Isolation via Route Group
- **Decision**: Use a Next.js App Router Route Group `app/(dashboard)/layout.tsx` as the shell for all dashboard pages, completely separate from the marketing site's `app/layout.tsx`.
- **Rationale**: The marketing site has a `Navbar` + `ConditionalFooter` layout that must NOT appear on dashboard pages. Route Groups allow two distinct layout trees sharing the same URL namespace without any config.
- **Alternatives considered**: Conditionally hiding Navbar/Footer inside `app/layout.tsx` (rejected — fragile, couples marketing and dashboard concerns).
