# <img src="./public/logo-brand.svg" width="40" height="40" /> SOPO Gateway - Next-Gen API Lifecycle Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Sopo** is a modern, high-performance API lifecycle automation platform. It transforms complex policy configurations into a clear, unified visual pipeline, enabling developers to manage APIs with speed, security, and simplicity.

---

## 📊 Project Overview (نظرة عامة)

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Layout System** | Foundation with Sidebar, Topbar, and Mobile support | ✅ Completed |
| **Analytics** | KPI Cards, Traffic Charts, and Live Logs | ✅ Completed |
| **Data Tables** | Generic, sortable, and paginated table system | ✅ Completed |
| **User Mgmt** | Full CRUD, Roles, and Permissions Matrix | ✅ Completed |
| **Reports** | Automated insights and export system | 🏗️ In Progress |

---

## 🏗️ Architecture (الهيكل الهندسي)

The platform is split into a **Data Plane** for high-speed request processing and a **Control Plane** for visual management.

```mermaid
graph TD
    subgraph "External World"
        User([User/Client])
        TargetAPI[Target APIs / Microservices]
    end

    subgraph "SOPO Data Plane (High Performance)"
        Gateway[API Gateway Engine]
        Policies{Policy Execution}
        RateLimit[Rate Limiter]
        Auth[Auth Aggregator]
    end

    subgraph "SOPO Control Plane (Next.js Dashboard)"
        Dashboard[Visual Dashboard]
        ConfigDB[(Drizzle DB / PostgreSQL)]
        AnalyticsEngine[Analytics & Logs]
    end

    User <--> Gateway
    Gateway <--> Policies
    Policies <--> RateLimit
    Policies <--> Auth
    Gateway <--> TargetAPI
    
    Dashboard <--> ConfigDB
    Dashboard <--> AnalyticsEngine
    AnalyticsEngine <--- Gateway
    ConfigDB --- Gateway
```

---

## 🚀 Key Features

-   **⚡ Ultra-Low Latency:** Optimized request routing with minimal overhead.
-   **🛡️ Advanced Security:** Built-in rate limiting, IP whitelisting, and DDoS protection.
-   **📈 Real-time Analytics:** Monitor traffic, latency, and error rates via interactive Recharts dashboards.
-   **👥 User Management:** Granular RBAC (Role-Based Access Control) with a visual permissions matrix.
-   **🔍 Filter System:** Advanced data filtering with persistence and date-range selection.
-   **📋 Spec-Driven Development:** Entirely documented via a comprehensive `Spec-Kit`.

---

## 🛠️ Tech Stack

-   **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
-   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
-   **Visuals:** [Recharts](https://recharts.org/) (Analytics) + [Mermaid](https://mermaid.js.org/) (Documentation)
-   **Database:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
-   **State Management:** [TanStack Query v5](https://tanstack.com/query)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/) + [Magic UI](https://magicui.design/)

---

## 🗺️ Feature Roadmap

```mermaid
mindmap
  root((SOPO Platform))
    Foundation
      Layout System
      Navigation
      Command Palette
    Core Features
      Data Table System
      Advanced Filters
      User Management
    Analytics
      KPI Dashboards
      Traffic Analysis
      Live Logs
    Future
      Auto-Insights
      Export System
      Scheduled Reports
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v20+)
- PostgreSQL

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Bushetaa/SopoWeb.git
    cd SOPO
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run development server:**
    ```bash
    npm run dev
    ```

---

## 📚 Documentation (Spec-Kit)

The project follows a strict specification-driven development process. You can find all specifications in the [specs/](file:///e:/workWeb/SOPO/specs) directory:
- [00-INDEX.md](file:///e:/workWeb/SOPO/specs/00-INDEX.md) - Full project index and status.
- [02-ANALYTICS.md](file:///e:/workWeb/SOPO/specs/02-ANALYTICS.md) - Detailed analytics requirements.
- [05-USERS-MANAGEMENT.md](file:///e:/workWeb/SOPO/specs/05-USERS-MANAGEMENT.md) - User management logic.

---

## 📄 License
MIT
