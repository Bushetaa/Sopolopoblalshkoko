# Chapter: Implementation of Sopo API Gateway

## 1. Introduction and Implemented Scope
This chapter details the implementation of the `sopo-gateway-server`, a high-performance API Gateway written in Go. Based on the analysis phase, the implementation focuses on the core gateway engine, including dynamic routing, the plugin architecture, request aggregation (scatter-gather), upstream load balancing, and hot-reload configuration capabilities.

## 2. Design Techniques and Justifications
### 2.1 Microkernel and Plugin Architecture
The gateway is built using a Microkernel (Plugin-based) architecture. The core router only resolves paths and matches methods, while cross-cutting concerns (authentication, rate-limiting, logging) are delegated to a unified plugin registry.
*   **Justification:** This approach ensures the core system remains lightweight and highly extensible. Developers can write custom plugins for specific routes without altering the base proxying logic.

### 2.2 Event-Driven Configuration Management
The gateway utilizes an event-driven mechanism for configuration updates, subscribing to Redis pub/sub channels (`gateway_changed` events).
*   **Justification:** In a cloud-native environment, API configurations change rapidly. Polling for changes is inefficient and introduces latency. Event-driven updates allow the gateway to instantly fetch new configurations from Redis and apply them with zero downtime.

## 3. Design Trade-offs
*   **File-based vs. Redis-based Configuration:** While file-based configuration (e.g., `config.json`) is simpler and standard for isolated deployments, it doesn't scale well in a distributed environment. We opted for Redis as the primary source of truth (synchronized with Hasura/Nhost), utilizing local JSON files merely as a cold-start fallback. This introduces an external dependency (Redis) but significantly improves multi-node synchronization.
*   **Synchronous Logging vs. Asynchronous Analytics (ClickHouse):** Logging every request synchronously would bottleneck the proxy's throughput. We implemented an asynchronous ClickHouse exporter. The tradeoff is a slight risk of losing the last few logs if the server crashes abruptly, but the performance gain on the critical path is substantial.
*   **Thread Safety vs. Performance in Router Swapping:** When reloading configurations, we had to choose between granular locking on individual routes or swapping the entire router instance. We chose the latter, using an `RWMutex` to atomically swap the immutable router pointer. This favors read performance (proxying requests) over write performance (reloading configs).

## 4. Coding Traps and Novel Aspects
### 4.1 Coding Traps
*   **Concurrent Map Writes and Goroutine Leaks:** During hot reloads, abruptly terminating old upstream health checkers while starting new ones can lead to goroutine leaks or panics. We mitigated this by implementing a graceful shutdown mechanism in the `UpstreamManager` to explicitly stop old background workers before fully transitioning to the new configuration.
*   **HTTP/2 Response Streaming:** Buffering entire responses in memory before sending them back to the client could cause OOM (Out Of Memory) errors under heavy load. The proxy is designed to stream the response body directly, reading and writing in chunks.

### 4.2 Novel Aspects
*   **Scatter-Gather Aggregation:** The implementation features a native aggregation engine that breaks a single client request into multiple sub-requests, executes them concurrently against different microservices, and merges the responses based on a defined `MergeStrategy`. It robustly handles partial failures and respects sub-request timeouts independently.

## 5. Testing Strategy
Following the scheme established in the Analysis chapter, testing was conducted using both Category Partition and State Machine-based models.

### 5.1 Model-Based Testing
*   **State Machine Testing:** We tested the lifecycle states of the Gateway: `Bootstrapping` -> `Redis Unavailable (Fallback)` -> `Config Loaded` -> `Running` -> `Graceful Shutdown`. Transitions, such as Redis recovering mid-flight or config files being modified locally (via `FileWatcher`), were strictly verified.
*   **Category Partition Testing:** Routing logic was partitioned into equivalence classes: Exact path matches, wildcard/slug parameters, protocol mismatches (HTTP vs gRPC), and missing upstream targets.

### 5.2 Functional and User Acceptance Testing (UAT)
*   **Functional Testing:** Validated the execution order of plugin phases (e.g., Authentication before Logging). We also tested the gRPC multiplexing alongside standard HTTP/2 proxying on the same port using `h2c`.
*   **UAT:** Deployed the gateway in a staging environment connected to the live database. Clients consumed aggregated endpoints, ensuring that latency remained within the acceptable SLA bounds.

### 5.3 Experimental Evaluation
To evaluate the gateway's performance, we used benchmarking tools (e.g., `wrk` and `hey`) to stress-test the scatter-gather implementation. The results were calibrated against standard industry benchmarks (such as NGINX or KrakenD) running on identical hardware. The results demonstrated that our Go-based asynchronous processing maintained sub-millisecond overhead even when merging payloads from up to 5 concurrent upstream services.
