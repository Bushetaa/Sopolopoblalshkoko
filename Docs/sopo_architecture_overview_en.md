# Chapter: Sopo API Gateway Architectural Design & System Overview

## 1. Introduction
The **Sopo** project is a comprehensive Full Lifecycle API Management Platform. It is engineered as a Cloud-Native Infrastructure, acting as a Single Entry Point that securely manages and routes traffic between client applications and downstream microservices. The system features dynamic hot-reloading and real-time observability.

The internal architecture is strictly divided into two primary layers, enforcing the **Separation of Control Plane and Data Plane**:

---

## 2. Control Plane (Management & Configuration)
The Control Plane is responsible for multi-tenancy, user management, and the CRUD operations related to routing configurations and plugins.

* **Hasura & GraphQL:** Acts as the core database engine and API. It exposes schemas and manages multi-tenancy securely using JWT Tokens. The `username` or `slug` is injected into the JWT to ensure strict data isolation between tenants.
* **Hasura Event Triggers:** Whenever a user modifies configuration tables or routes (Insert/Update/Delete), Hasura emits an instantaneous Event Trigger.
* **Nhost Webhook Server (Node.js):** Receives the trigger from Hasura, fetches the updated routing state, transforms it into a highly optimized Configuration Object, and pushes it directly to the message broker.

---

## 3. Data Plane (Routing & Execution)
The beating heart of the project is the **High-Performance Go Gateway Engine**. It is a stable, stateless proxy that sits at the edge to receive and route requests.

### 3.1 Dynamic Hot-Reload Mechanism (Event-Driven)
1. **The Broker (Redis Pub/Sub):** Redis is utilized as an In-Memory Message Broker due to its ultra-low latency in passing messages using the Fire & Forget pattern.
2. **Go Hot-Reload:** The Go server subscribes to the Redis Channel. The moment the Nhost server pushes a new configuration, the Go server intercepts it via lightweight Goroutines within milliseconds.
3. **In-Memory Thread-Safe Map:** The JSON configuration is unmarshaled, and the routing map pointer is atomically updated in memory. This achieves **Zero Downtime** routing updates. Concurrent read/write crashes are prevented by securing the map with a `sync.RWMutex`.

### 3.2 Resiliency & Fallback Strategy
* To prevent a **Single Point of Failure**, upon receiving a new configuration, the Go server saves a local backup as `config.json` and pushes a copy to **Amazon S3**.
* In the event of a crash or Redis outage, the Go server initiates a **Fallback Strategy** upon startup. It instantly fetches the configuration from S3 or the local file, ensuring it boots into the Last Known Good State.

---

## 4. Observability and Analytics Layer
This layer tracks data movement with extreme precision without bottlenecking server performance:

* **In-Memory Log Buffering (Ticking Buffer):** To protect the server from Network I/O exhaustion, individual logs are not written synchronously. Instead, the Go server buffers logs in an internal channel. They are flushed asynchronously via a Worker Pool based on two conditions: the buffer reaching **1000 logs**, or an intelligent Ticker interval of **3 seconds**.
* **ClickHouse Database:** Logs are ingested via **Batch Inserts** into ClickHouse, widely recognized as the industry's most powerful database for Analytics and Column-oriented storage.
* **Unified GraphQL Log Access:** ClickHouse is integrated with Hasura via the **Hasura Connector**. This allows the platform to fetch and display logs directly in the user dashboard using the same GraphQL endpoint, secured by the `slug/username` extracted from the JWT to guarantee privacy.

---

## 5. Data Flow Summaries

**1. Proxy Execution Flow:**
`Client Request` ➔ `[ Go Gateway ]` ➔ *(In-Memory Map Lookup)* ➔ `Target Microservice`

**2. Configuration Hot-Reload Flow:**
`User Config Change` ➔ `Hasura` ➔ `Nhost (Webhook)` ➔ *(Pub/Sub)* ➔ `Redis` ➔ `Go Server (Hot-Reload)`

**3. Analytics Logging Flow:**
`Go Gateway Logs` ➔ *(Batching: 3s / 1k)* ➔ `ClickHouse` ➔ `Hasura Connector` ➔ `User Dashboard (GraphQL)`

---

## 6. Implementation Chapter Requirements
* **Design Techniques & Trade-offs:** The separation of the Control Plane (Node.js/Hasura) and Data Plane (Go) is a classic SDN (Software Defined Networking) pattern applied to APIs. The trade-off is architectural complexity (requiring Redis and ClickHouse) in exchange for zero-downtime reloads and non-blocking I/O.
* **Coding Traps:** The Ticking Buffer pattern requires careful handling of graceful shutdowns; otherwise, logs residing in the buffer during a server crash will be lost. We implemented `context` cancellation to flush the remaining buffer on SIGTERM.
* **Testing & Evaluation:** Tested using State Machine models for the Gateway lifecycle (Boot -> S3 Fallback -> Redis Connected). Evaluated against live datasets where the batching log mechanism successfully sustained thousands of requests per second without impacting routing latency.
