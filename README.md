# SOPO Gateway - Next-Gen API Gateway

**Manage Your APIs Without Config Hell**

SOPO Gateway is a modern, high-performance API gateway designed to turn policy chaos into a clear, unified pipeline. Built for developers who value speed, security, and simplicity.

---

## 🚀 Key Features

- **Ultra-Low Latency:** Engineered for high performance, routing requests in less than 5ms globally.
- **Advanced Security:** Built-in rate limiting, IP whitelisting, and DDoS protection.
- **Intelligent Routing:** Dynamic payload-based routing, A/B testing, and automatic failover.
- **Real-time Analytics:** Monitor traffic, latency, and error rates with a live dashboard.
- **Auth Aggregation:** Centralize authentication with OAuth2, JWT, and custom token validation.
- **Visual Control Plane:** Define routes, auth, and limits in one place without YAML wrestling.
- **Safe Delivery:** Gated promotions, environment-aware configs, and one-click rollbacks.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)

## 🏁 Getting Started

### Prerequisites

- Node.js (v20+)
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd SopoWeb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (if required):
   Create a `.env` file based on existing project needs.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Architecture

- **Data Plane:** Executes a deterministic pipeline per request (routing, auth, rate limits, transforms, CORS, retries, logging).
- **Control Plane:** Visual editor for unified changes, gated promotions, and one-click rollbacks.

## 📄 License

MIT
