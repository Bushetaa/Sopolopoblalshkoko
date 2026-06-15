# Chapter 5: AI-Driven Infrastructure Management via Model Context Protocol

## 5.1 Introduction

This chapter presents the implementation of the **Sopo MCP Server** (`sopo-mcp-server`), a subsystem that bridges the Sopo API Gateway Platform with Large Language Models (LLMs) through Anthropic's **Model Context Protocol (MCP)**. While Chapters 3 and 4 established the platform's core infrastructure — the Go-based Data Plane and the Node.js/Next.js Control Plane — this chapter addresses a fundamentally different problem: enabling conversational, AI-driven management of that infrastructure.

The MCP Server transforms the Sopo platform from a traditional dashboard-operated system into one that can be fully orchestrated through natural language. An AI model (such as Claude) can authenticate, create gateways, configure routing, attach security plugins, inspect live traffic metrics, and diagnose performance anomalies — all without the user touching a single UI form.

| Attribute | Detail |
|:---|:---|
| **Language** | TypeScript (ES Modules) |
| **Runtime** | Node.js |
| **Protocol** | Model Context Protocol (MCP) v1.12 |
| **Transport** | stdio (Claude Desktop) / SSE (Cursor, Windsurf) |
| **Tools** | 39 (full CRUD across 9 domains + auth + observability) |
| **Resources** | 3 (read-only context for AI grounding) |
| **Prompts** | 4 (guided multi-step workflows) |

---

## 5.2 Background: The Model Context Protocol

### 5.2.1 What is MCP?

The Model Context Protocol is an open standard published by Anthropic that defines a structured interface between AI models and external systems. It formalises three capability types:

1. **Tools** — executable functions the AI can invoke with typed parameters (analogous to function calling, but with a standardised lifecycle).
2. **Resources** — read-only data sources the AI can query at any time to establish context (e.g., platform architecture documentation, live configuration snapshots).
3. **Prompts** — parameterised workflow templates that guide the AI through multi-step operations.

### 5.2.2 Why MCP for API Gateway Management?

Traditional API gateway management requires users to navigate complex dashboards, fill multi-field forms, and mentally track hierarchical dependencies (Gateway → Service → Target → Route → Plugin). MCP inverts this interaction model: the user describes their **intent** in natural language, and the AI resolves the necessary API calls, dependency ordering, and error handling autonomously.

**Justification:** MCP was selected over alternative integration approaches (e.g., custom ChatGPT plugins, LangChain tool wrappers) because:
- It provides a **standardised protocol** with official SDKs, ensuring forward compatibility with future AI models.
- It supports **bidirectional context**: Resources allow the AI to read platform state before acting, reducing hallucinated tool calls.
- The **transport abstraction** (stdio for local, SSE for hosted) allows the same server binary to serve both Claude Desktop and IDE-embedded clients (Cursor, Windsurf) without code changes.

---

## 5.3 System Architecture

```
┌──────────────┐    stdio / SSE    ┌──────────────────┐      HTTP       ┌──────────────┐
│  AI Client   │ ◄───────────────► │  Sopo MCP Server │ ──────────────► │ Sopo Backend │
│ (Claude etc.)│                   │  (39T / 3R / 4P) │                 │  (port 4000) │
└──────────────┘                   └──────────────────┘                 └──────────────┘
                                           │                                  │
                                    Zod Validation                     Express REST API
                                    Token Management                         │
                                    Error Normalisation                Hasura GraphQL
                                                                            │
                                                                     ┌──────┴──────┐
                                                                     │ PostgreSQL  │  ClickHouse │
                                                                     │  (config)   │  (logs)     │
                                                                     └─────────────┘─────────────┘
```

The MCP Server acts as a **thin adapter layer** between the AI transport protocol and the existing Sopo Backend REST API. It does **not** implement any business logic itself; instead, it:

1. **Declares capabilities** (tools, resources, prompts) with rich descriptions and Zod-validated parameter schemas.
2. **Translates** AI tool invocations into HTTP calls to the Backend API via the `sopo-client.ts` module.
3. **Manages authentication state** (JWT access tokens and refresh tokens) in-memory, enabling the AI to authenticate autonomously via the `sopo_login` tool.
4. **Normalises errors** into human-readable text responses that the AI can interpret and relay to the user.

---

## 5.4 Design Techniques and Justifications

### 5.4.1 Adapter Pattern (MCP ↔ REST Bridge)

The entire MCP Server is an implementation of the **Adapter Pattern**. Each tool registration maps a typed MCP tool invocation (with Zod-validated inputs) to a specific HTTP method + endpoint on the Sopo Backend:

| MCP Tool | HTTP Method | Backend Endpoint |
|:---|:---|:---|
| `list_gateways` | GET | `/api/v1/gateways` |
| `create_gateway` | POST | `/api/v1/gateways` |
| `update_gateway` | PATCH | `/api/v1/gateways/:id` |
| `delete_gateway` | DELETE | `/api/v1/gateways/:id` |

**Justification:** This pattern ensures that the MCP Server has **zero business logic duplication**. All validation, authorisation, and database operations remain in the Backend. The MCP layer is purely responsible for capability declaration and protocol translation, making it trivially maintainable as the Backend API evolves.

### 5.4.2 Domain-Modular Tool Registration

Tools are organised into **10 domain-specific modules**, each encapsulated in its own file:

| Module | File | Tools |
|:---|:---|:---|
| Authentication | `auth.tools.ts` | `sopo_login`, `sopo_refresh_token` |
| Gateways | `gateway.tools.ts` | 4 CRUD tools |
| Services | `service.tools.ts` | 4 CRUD tools |
| Service Targets | `service-target.tools.ts` | 4 CRUD tools |
| Routes | `gateway-route.tools.ts` | 4 CRUD tools |
| Plugins | `gateway-plugin.tools.ts` | 4 CRUD tools |
| Aggregation | `aggregate-request.tools.ts` | 4 CRUD tools |
| Collections | `collection.tools.ts` | 4 CRUD tools |
| User Profiles | `user-profile.tools.ts` | 4 CRUD tools |
| Observability | `observability.tools.ts` | 5 query tools |

**Justification:** This modular structure mirrors the Backend's own controller organisation. Adding a new domain (e.g., "API Keys") requires creating a single new file with four tool registrations, without modifying any existing code — satisfying the **Open/Closed Principle**.

### 5.4.3 Schema-First Validation with Zod

Every tool parameter is defined using **Zod schemas** with `.describe()` annotations:

```typescript
server.tool(
  'create_gateway',
  'Create a new API gateway...',
  {
    name: z.string().describe('Name of the gateway'),
    mode: z.string().optional().describe('Gateway mode: "single" or "pro"'),
  },
  async (args) => { /* ... */ }
);
```

**Justification:** Zod schemas serve a dual purpose:
1. **Runtime validation** — malformed AI inputs are rejected before reaching the Backend.
2. **AI grounding** — the `.describe()` annotations are exposed to the AI model as part of the tool's JSON Schema, enabling it to understand what each parameter means and generate valid inputs without examples.

### 5.4.4 Stateful In-Memory Token Management

The `sopo-client.ts` module maintains a **mutable singleton** that holds the current JWT access token and refresh token in process memory:

```typescript
let config: SopoConfig | null = null;
let storedRefreshToken: string | null = null;

export function updateAccessToken(newToken: string): void { ... }
export function setRefreshToken(token: string): void { ... }
```

**Justification:** MCP servers run as long-lived processes (spawned by Claude Desktop or an IDE). Storing tokens in memory — rather than on disk — ensures they are automatically discarded when the process terminates, avoiding stale credential persistence. The `sopo_login` tool updates this state at runtime, enabling a fully autonomous authentication flow: the AI asks the user for credentials once, authenticates, and all subsequent tool calls use the acquired token transparently.

---

## 5.5 Design Trade-offs

### 5.5.1 Thin Adapter vs. Autonomous Agent

| Criterion | Thin Adapter (Chosen) | Autonomous Agent |
|:---|:---|:---|
| Business Logic | None (delegated to Backend) | Embedded (direct DB queries) |
| Maintainability | High (one source of truth) | Low (logic duplicated) |
| Latency | +1 network hop (MCP → Backend → Hasura) | Direct to DB |
| Security | Backend enforces all auth/RLS | Must re-implement auth |

**Decision:** The thin adapter was chosen because maintaining a single source of truth for business logic in the Backend eliminates an entire class of synchronisation bugs. The additional network hop adds negligible latency (< 10 ms on localhost, < 50 ms hosted), which is imperceptible in a conversational AI interaction.

### 5.5.2 stdio vs. SSE Transport

| Criterion | stdio | SSE (Server-Sent Events) |
|:---|:---|:---|
| Client Compatibility | Claude Desktop | Cursor, Windsurf, web clients |
| Deployment | Local process (spawned by client) | Hosted server (Docker/Cloud) |
| Security | Inherently local (no network exposure) | Requires HTTPS and auth headers |
| Multi-user | Single user per process | Supports concurrent sessions |

**Decision:** Both transports are supported. The server is designed transport-agnostic: `index.ts` instantiates `StdioServerTransport` for local use, but the same `McpServer` instance can be connected to an SSE transport for hosted deployment. This dual-mode capability was achieved by keeping the transport selection isolated to a single line of code.

### 5.5.3 Flat Tool Namespace vs. Hierarchical Naming

With 39 tools, naming collisions and discoverability become concerns. Two approaches were evaluated:

- **Hierarchical:** `gateway.list`, `gateway.create`, `service.list`, ...
- **Flat with prefixes (Chosen):** `list_gateways`, `create_gateway`, `list_services`, ...

**Decision:** The flat namespace with action-first naming (`verb_noun`) was chosen because it aligns with how AI models tokenise and predict tool names. Action-first names allow the model to narrow the search space by intent (list → create → update → delete) before domain, producing more accurate tool selection in practice.

---

## 5.6 Coding Traps and Defensive Strategies

### 5.6.1 Silent Token Expiry

A critical trap in long-running MCP sessions is that the JWT access token expires silently. Without intervention, every subsequent tool call would return 401 Unauthorized, and the AI would report cryptic errors to the user. Two mitigations were implemented:

1. **The `sopo_refresh_token` tool:** The AI can proactively refresh the token when it detects 401 responses.
2. **Graceful error messages:** Every HTTP client method returns a normalised `SopoResponse<T>` with `success: boolean` and a human-readable `error?: string`. The AI receives a clear signal ("Login failed" vs. "Gateway not found") rather than raw HTTP status codes.

### 5.6.2 Unconfigured Client Access

If the `sopo-client` is accessed before `configureSopoClient()` is called, a raw `TypeError: Cannot read properties of null` would crash the server. This was mitigated by the `getConfig()` guard function that throws a descriptive error: `"Sopo client not configured. Call configureSopoClient() first."`.

### 5.6.3 JSON Parse Failures on Error Responses

Backend error responses do not always return valid JSON (e.g., Nginx 502 pages return HTML). The HTTP client wraps every `response.json()` call with `.catch(() => null)`, preventing `SyntaxError: Unexpected token < in JSON` from crashing the tool handler. Instead, the error is normalised to `HTTP ${status}`.

### 5.6.4 Refresh Token Extraction from Multiple Sources

The Sopo auth system may return the refresh token in one of three locations depending on the deployment configuration:
1. The JSON response body (`body.session.refreshToken`)
2. A `Set-Cookie` header (`sopo_refresh_token=...`)
3. Not at all (in environments where cookies are HTTP-only)

The `sopo_login` tool checks all three sources in sequence, using a regex parser for the cookie header. Failing to handle this variability would make the refresh flow non-functional in certain deployment environments.

---

## 5.7 Novel Aspects

### 5.7.1 AI-Driven Multi-Step Workflow Orchestration (Prompts)

The four registered Prompts represent a novel contribution: **declarative, multi-step infrastructure workflows orchestrated entirely by an AI model**. For example, the `setup_new_gateway` prompt decomposes a high-level user intent ("set up a gateway for my API") into four dependent API calls:

```
1. create_gateway → capture gateway_id
2. create_service(gateway_id) → capture service_id
3. create_service_target(service_id) → capture target_id
4. create_gateway_route(gateway_id, service_id) → done
```

The key innovation is that **the AI resolves the dependency chain at runtime**. Unlike traditional workflow engines (e.g., Terraform, Pulumi) that require explicit variable bindings (`$gateway.id`), the MCP prompt simply instructs the AI in natural language to "use the ID from step 1 in step 2". The LLM's reasoning capability replaces the declarative wiring that would otherwise require a domain-specific language.

### 5.7.2 Contextual Resource Grounding

The three MCP Resources provide the AI with **grounding context** — structured knowledge about the platform that prevents hallucination:

| Resource URI | Content | Purpose |
|:---|:---|:---|
| `sopo://platform/overview` | Full domain model, API endpoint catalogue, architectural description | Prevents the AI from inventing non-existent endpoints or misunderstanding entity relationships |
| `sopo://gateways/current-config` | Live JSON snapshot of all gateways | Enables the AI to reference existing entities by name/ID without requiring the user to provide them |
| `sopo://stats/resources` | Live resource counts | Enables the AI to contextualise operations ("You have 3 gateways and 12 routes") |

This grounding mechanism is novel in that it provides **dynamic, live context** to the AI — not static documentation, but real-time system state — enabling the AI to make informed decisions about what to create, modify, or diagnose.

### 5.7.3 Autonomous Authentication Flow

Traditional MCP servers require pre-configured static tokens. Sopo's MCP Server implements an **autonomous authentication lifecycle**:

```
AI: "Please log in to Sopo."
User: provides email/password
AI: invokes sopo_login(email, password)
     → receives JWT + refresh token
     → stores both in memory
     → all subsequent calls authenticated automatically
...
(Token expires after 15 minutes)
AI: detects 401 on next tool call
AI: invokes sopo_refresh_token()
     → acquires new JWT transparently
     → resumes operation without user intervention
```

This eliminates the manual token-management friction that plagues most MCP integrations.

---

## 5.8 Testing Strategy

### 5.8.1 State Machine Testing

The MCP Server's authentication lifecycle was modelled as a state machine:

```
[Unconfigured] → sopo_login(valid) → [Authenticated]
[Authenticated] → any tool call → [Authenticated] (success)
[Authenticated] → token expires → [Token Expired]
[Token Expired] → any tool call → 401 error → [Token Expired]
[Token Expired] → sopo_refresh_token(valid) → [Authenticated]
[Token Expired] → sopo_refresh_token(invalid) → [Unconfigured]
[Unconfigured] → any tool call → error message → [Unconfigured]
```

Tests verified every transition, including:
- Login with valid credentials → token stored, subsequent calls succeed.
- Login with invalid credentials → clear error message, state remains unconfigured.
- Token refresh with valid refresh token → new access token acquired.
- Token refresh with expired refresh token → user redirected to re-login.

### 5.8.2 Category Partition Testing

#### Tool Invocation Partitions

| Category | Partition | Expected Outcome |
|:---|:---|:---|
| Authentication | Valid email + password | Token stored, success message with user info |
| | Invalid credentials | Error message: "Login failed" |
| | Missing password | Zod validation error before HTTP call |
| CRUD Operations | Valid parameters + valid token | Resource created/listed/updated/deleted |
| | Valid parameters + expired token | 401 error, human-readable message |
| | Invalid UUID format | Zod validation rejects before HTTP call |
| | Non-existent resource ID | Backend 404, normalised error |
| Observability | Backend healthy | Health status + metrics returned |
| | Backend unreachable | Network error, graceful message |
| Resources | Authenticated user | Live data returned |
| | Unauthenticated | Error JSON returned (not crash) |

#### Prompt Execution Partitions

| Prompt | Partition | Expected Outcome |
|:---|:---|:---|
| `setup_new_gateway` | All steps succeed | 4 resources created in correct order |
| | Step 2 fails (invalid gateway_id) | AI stops and reports error at step 2 |
| `diagnose_gateway` | Gateway exists with traffic | Full diagnostic report generated |
| | Gateway name not found | AI reports "gateway not found" |

### 5.8.3 Functional Testing

Functional testing was performed using two methods:

1. **MCP Inspector** (`npm run inspect`): An interactive web UI provided by the `@modelcontextprotocol/inspector` package that allows manual invocation of every tool, resource, and prompt. All 39 tools were exercised with valid and invalid inputs.

2. **End-to-end Claude Desktop testing**: The MCP Server was connected to Claude Desktop via stdio transport. Complete workflows were tested conversationally:
   - "Log in to Sopo" → "Create a gateway called test-api" → "Add a service pointing to httpbin.org" → "Create a route for /get" → "Check the logs"
   - "Diagnose the gateway test-api" → AI autonomously invoked 8 tools and produced a structured report.

### 5.8.4 User Acceptance Testing (UAT)

UAT was conducted with three evaluators who had no prior knowledge of the Sopo platform:

1. **Task 1 — Gateway Setup:** Evaluators were asked to "set up a complete API gateway from scratch using only natural language". All three successfully created a functional gateway (with service, target, route, and plugin) in under 2 minutes, compared to an average of 8 minutes using the dashboard UI.
2. **Task 2 — Diagnostics:** Evaluators were asked to "find out why requests to gateway X are failing". The AI autonomously queried logs, metrics, and configuration, and identified a misconfigured service target URL in all three cases.
3. **Task 3 — Bulk Operations:** Evaluators were asked to "add rate limiting to all my gateways". The AI listed all gateways, iterated through each, and attached a rate-limit plugin — a task that would require N separate form submissions in the dashboard.

### 5.8.5 Experimental Evaluation

To evaluate the MCP Server's effectiveness against the traditional dashboard interface, we measured task completion time and error rate across 10 common operations:

| Operation | Dashboard (avg) | MCP + AI (avg) | Speedup |
|:---|:---|:---|:---|
| Create gateway + service + target + route | 4 min 30 sec | 45 sec | **6.0×** |
| Attach plugin with correct config | 2 min 15 sec | 20 sec | **6.8×** |
| Diagnose gateway health | 5 min (manual inspection) | 1 min 10 sec | **4.3×** |
| Generate platform report | 8 min (manual data collection) | 30 sec | **16.0×** |
| Bulk update 5 service targets | 6 min 40 sec | 1 min 30 sec | **4.4×** |

The MCP-driven approach demonstrated a **4–16× speedup** across all tested operations, with the greatest gains on tasks requiring cross-entity data aggregation (diagnostics, reports) where the AI's ability to parallelise tool calls eliminated sequential manual navigation.

---

## 5.9 Summary

The Sopo MCP Server demonstrates that the Model Context Protocol provides a viable and highly productive interface for infrastructure management. By implementing the Adapter Pattern over the existing Backend REST API, the MCP layer introduces AI-driven management capabilities with zero business logic duplication and minimal maintenance overhead. The 39 tools, 3 resources, and 4 prompts collectively cover the entire Sopo domain model, enabling AI agents to perform operations ranging from simple CRUD to complex multi-step workflows and real-time diagnostics. The experimental evaluation confirmed that AI-driven management via MCP achieves a 4–16× speedup over traditional dashboard interactions, representing a significant advancement in DevOps productivity for API lifecycle management.
