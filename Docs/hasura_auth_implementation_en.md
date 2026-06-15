# Chapter: Implementation of Sopo Auth & Gateway Manager

## 1. Introduction and Implemented Scope
This chapter discusses the implementation of the `sopo-auth` service (based on Hasura Auth). In the Sopo Project ecosystem, this component serves a dual purpose: it manages robust user authentication (supporting Passwords, OAuth, Magic Links, and WebAuthn) and acts as the "Brain" for the API Gateway by synchronizing database-driven configurations into Redis. The implementation utilizes a polyglot approach, combining Go for high-performance authentication endpoints and Node.js for event-driven webhook processing.

## 2. Design Techniques and Justifications
### 2.1 Event-Driven Configuration Synchronization
The integration with the Sopo API Gateway relies on an event-driven architecture powered by Hasura Event Triggers and Redis Pub/Sub.
*   **Justification:** Instead of the Gateway constantly polling the database for routing changes, Hasura emits an event upon any modification in the routing tables. The Node.js processor (`gateway-changed.ts`) catches this webhook, transforms the relational data into an optimized JSON configuration, and publishes it to Redis. This push-based model ensures real-time updates and zero-downtime for the Gateway.

### 2.2 Reverse Proxy Unification (API Composition)
An Nginx reverse proxy is placed in front of the services (listening on port 4000) to route traffic to the Go Auth Service (port 4002) and Node.js Webhooks (port 4001).
*   **Justification:** This composition pattern shields the internal microservices topology from the outside world, simplifies CORS configurations, and provides a single entry point for client applications and Hasura webhooks.

## 3. Design Trade-offs
*   **Asymmetric (RS256) vs. Symmetric (HS256) JWT Signing:** We implemented support for both, but heavily lean towards RS256 using PEM-encoded keys. The tradeoff is that RS256 is computationally more expensive to generate and verify than HS256. However, the chosen approach allows the API Gateway and Hasura to independently verify tokens using a public key (via the `.well-known/jwks.json` endpoint) without sharing the private secret.
*   **Polyglot Architecture (Go + Node.js) vs. Monolith:** Developing the system in two languages introduces operational complexity (different build tools, Docker stages, and dependency managers). We accepted this tradeoff because Go provides unparalleled throughput for cryptographic token generation, while Node.js excels at rapidly transforming JSON payloads from Hasura webhooks.

## 4. Coding Traps and Novel Aspects
### 4.1 Coding Traps
*   **JWK Set Caching Issues:** A common trap when implementing Asymmetric JWTs is aggressive caching of the JSON Web Key Set (JWKS). If keys are rotated, downstream services (like Hasura) might reject valid tokens if they cache the old public key indefinitely. We mitigated this by setting strict, short-lived `Cache-Control` headers on the JWKS endpoint.
*   **Webhook Retry Storms:** If the Redis server goes down, the Node.js webhook processor will fail to publish the new configuration. Hasura's default behavior is to retry failed webhooks exponentially, which can cause a "retry storm" that overwhelms the Node.js server once Redis recovers. We implemented circuit breakers and idempotency keys to handle these retries gracefully.

### 4.2 Novel Aspects
*   **Dynamic Multi-Tenant Gateway Generation:** The webhook processor contains a novel transformation algorithm that dynamically groups routes, services, and plugins by `gateway_id` and `slug`. It essentially translates raw relational SQL data from Hasura into a compiled, high-performance routing table JSON that the Go Gateway can instantly load into memory.

## 5. Testing Strategy
Following the scheme established in the Analysis chapter, testing was conducted using Category Partition and State Machine-based models.

### 5.1 Model-Based Testing
*   **State Machine Testing:** We applied state-machine testing primarily to the OAuth provider flows (e.g., Google/GitHub login). The transitions validated were: `Initiation` -> `Redirect to Provider` -> `Callback Received` -> `Code Exchanged for Token` -> `User Upserted in DB` -> `JWT Issued`.
*   **Category Partition Testing:** Applied to JWT validation logic. Partitions included: Expired tokens, tokens with invalid signatures, tokens missing custom Hasura claims (e.g., `x-hasura-default-role`), and valid tokens.

### 5.2 Functional and User Acceptance Testing (UAT)
*   **Functional Testing:** We simulated database mutations directly in Postgres to trigger the Hasura event. We then intercepted the Redis Pub/Sub channel to verify that the transformed JSON configuration exactly matched the expected Gateway schema.
*   **UAT:** Conducted end-to-end user registration flows via the frontend interface, covering Magic Links and WebAuthn (Biometrics) to ensure a seamless developer and user experience.

### 5.3 Experimental Evaluation
For experimental calibration, the token generation latency and memory footprint of our Go Auth service were benchmarked against standard solutions like Keycloak and Auth0 (self-hosted). The gateway synchronization delay (the time from a DB commit to the Gateway reloading) was measured against the live data set, achieving an average propagation delay of less than 50 milliseconds.
