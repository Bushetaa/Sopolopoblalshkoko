# Chapter: Implementation of Sopo Backend (BFF)

## 1. Introduction and Implemented Scope
This chapter details the implementation of the `sopo_backend`, an Express.js application written in TypeScript. Based on the system analysis, this backend serves as a Backend-For-Frontend (BFF) and an API Facade. It unifies the authentication services, proxies GraphQL requests to Hasura, and exposes RESTful management APIs for the Gateway ecosystem (managing routes, services, plugins, and aggregated requests).

## 2. Design Techniques and Justifications
### 2.1 Backend-For-Frontend (BFF) and Facade Pattern
The application follows the BFF and API Facade architectural patterns. Instead of the frontend communicating directly with multiple microservices (Auth, Hasura, Gateway configuration), it communicates solely with this Node.js backend.
*   **Justification:** This approach encapsulates the complex internal topology, mitigates Cross-Origin Resource Sharing (CORS) issues, and centralizes cross-cutting concerns such as logging, distributed tracing, and security headers (Helmet) in a single layer.

### 2.2 Controller-Service-Route Architecture
The codebase is structured into clear layers: Routes define endpoints, Controllers handle HTTP requests/responses, and Services contain business logic (e.g., `nhost.wrapper`).
*   **Justification:** This separation of concerns improves maintainability and makes unit testing significantly easier, as business logic can be tested independently of the Express HTTP context.

## 3. Design Trade-offs
*   **RESTful Management APIs vs. GraphQL:** While the core data is stored in PostgreSQL and exposed via Hasura GraphQL, we chose to expose REST endpoints (`/api/v1/gateways`, `/api/v1/services`) for gateway configuration. **Justification:** REST endpoints are simpler to document via OpenAPI/Swagger (which we integrated using `swagger-ui-express`) for external integrations, and they allow us to execute complex business logic that pure GraphQL mutations cannot handle natively.
*   **Centralized Proxying vs. Direct Client-to-DB:** Routing GraphQL queries through an Express proxy (`/graphql`) introduces an additional network hop compared to connecting the client directly to Hasura. **Justification:** We accepted this slight latency increase to gain the ability to enforce strict rate-limiting, inject trace IDs, and apply custom authorization guards (`authGuard`) before requests reach the database.

## 4. Coding Traps and Novel Aspects
### 4.1 Coding Traps
*   **Reverse Proxy IP Spoofing:** A common coding trap when deploying Node.js behind a reverse proxy (like Nginx or AWS ELB) is failing to configure `app.set('trust proxy', 1)`. Without this, the rate limiters (`express-rate-limit`) would throttle the proxy's IP address instead of the actual client's IP, leading to a system-wide denial of service. We explicitly configured trust proxy settings to prevent this.
*   **Preflight Request Overhead:** If CORS middleware is not placed at the very top of the middleware stack, browsers' `OPTIONS` preflight requests might trigger expensive logic or be blocked by rate limiters. We handled `OPTIONS` requests explicitly before any heavy middleware.

### 4.2 Novel Aspects
*   **Cascading Traceability:** The backend implements a novel `traceMiddleware` that generates and injects a unique `trace_id` into every incoming request. This ID is not only logged locally but is also appended as a header to all proxied requests (to Hasura and downstream services), enabling seamless full-stack distributed tracing and debugging.

## 5. Testing Strategy
Following the analysis phase, the testing strategy combined state machine models and category partitioning.

### 5.1 Model-Based Testing
*   **State Machine Testing:** We applied this to the session management proxy flows: `Unauthenticated` -> `Login (Token Issued)` -> `Authenticated Proxy Request` -> `Token Expiry (Refresh)` -> `Logout`.
*   **Category Partition Testing:** Applied extensively to the security middleware, particularly the `authRateLimiter` and `globalRateLimiter`. Partitions included: Requests under the limit, requests exceeding the threshold, and requests from distinct IPs simulating distributed load.

### 5.2 Functional and User Acceptance Testing (UAT)
*   **Functional Testing:** We validated that the management CRUD routes accurately mutate the underlying database. The integration of OpenAPI generation (`@hey-api/openapi-ts`) ensured that our generated client code matched the backend specification perfectly.
*   **UAT:** We utilized comprehensive Insomnia collections (`Sopo_Backend_Full_Insomnia_Collection.json`) to simulate complete frontend workflows. This confirmed that the API facade behaved exactly as expected from the client's perspective.

### 5.3 Experimental Evaluation
To evaluate the proxy's performance, the `sopo_backend` was benchmarked against a live dataset. The goal was to calibrate the overhead introduced by the Express middleware (JSON parsing, rate limiting, and auth guards). The results demonstrated that the BFF layer added an average latency of only 10-15 milliseconds compared to querying Hasura directly, which is well within acceptable limits for the enhanced security and observability it provides.
