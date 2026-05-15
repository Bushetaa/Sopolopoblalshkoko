# Frontend UI Components Plan — Sopo API Gateway

> Every screen below has **3 sections**: Form Inputs → Buttons → Rules.
> The frontend engineer should build exactly what is described here.

---

## 1. Slug Setup (First-Time Only)

> Modal or page shown after first login if user has no profile.

### 1.1 Inputs

| # | Label | HTML Type | Required | Default | Validation |
|---|-------|-----------|----------|---------|------------|
| 1 | Slug | `text` | ✅ | — | Regex: `^[a-z0-9][a-z0-9\-]{1,}[a-z0-9]$` — min 3 chars, lowercase only |

### 1.2 Buttons

| Label | Style | When Visible |
|-------|-------|-------------|
| **Create Profile** | Primary | Always |

### 1.3 Rules

| Rule | Description |
|------|-------------|
| Reserved words | Reject: `admin`, `api`, `healthz`, `metrics`, `docs`, `swagger`, `static`, `assets`, `ws`, `graphql` |
| Live preview | Show below input: _"Your URLs will start with: `/{slug}/...`"_ |
| After success | Redirect to Dashboard |

---

## 2. Gateway

### 2.1 Inputs

| # | Label | HTML Type | Required | Default | Validation |
|---|-------|-----------|----------|---------|------------|
| 1 | Name | `text` | ✅ | — | Non-empty, unique per user |
| 2 | Description | `textarea` | ❌ | — | Free text |
| 3 | Mode | `select` | ✅ | `single` | Options: `single`, `pro` |
| 4 | Active | `toggle` | ❌ | `true` | — |

### 2.2 Buttons

| Label | Style | When Visible |
|-------|-------|-------------|
| **Create Gateway** | Primary | Create mode |
| **Save Changes** | Primary | Edit mode |
| **Cancel** | Secondary | Always |
| **Delete Gateway** | Danger (red) | Edit mode — with confirmation dialog |

### 2.3 Rules

| Rule | Description |
|------|-------------|
| Single limit | If user already has a `single` gateway → disable `single` in the Mode dropdown + show tooltip |
| Mode = `single` info | Show: _"URLs: `/{slug}/{path}`"_ |
| Mode = `pro` info | Show: _"URLs: `/{slug}/{gateway}/{service}/{path}`"_ |

---

## 3. Collection (Pro Mode Only)

> ⚠️ This entire section is **hidden** when gateway mode = `single`.

### 3.1 Inputs

| # | Label | HTML Type | Required | Default | Validation |
|---|-------|-----------|----------|---------|------------|
| 1 | Name | `text` | ✅ | — | Non-empty, unique per gateway. e.g. `v1`, `auth`, `billing` |
| 2 | Description | `textarea` | ❌ | — | Free text |
| 3 | Active | `toggle` | ❌ | `true` | — |

### 3.2 Buttons

| Label | Style | When Visible |
|-------|-------|-------------|
| **Create Collection** | Primary | Create mode |
| **Save Changes** | Primary | Edit mode |
| **Cancel** | Secondary | Always |
| **Delete Collection** | Danger | Edit mode — with confirmation |

### 3.3 Rules

| Rule | Description |
|------|-------------|
| Visibility | Only show when gateway mode = `pro` |

---

## 4. Service

### 4.1 Inputs — Main

| # | Label | HTML Type | Required | Default | Validation |
|---|-------|-----------|----------|---------|------------|
| 1 | Name | `text` | ✅ | — | Non-empty. e.g. `users-service` |
| 2 | Protocol | `select` | ✅ | `http` | Options: `http`, `grpc` |
| 3 | Load Balancing Policy | `select` | ✅ | `round_robin` | Options: `round_robin`, `weighted`, `latency`, `least_connections`, `random` |
| 4 | Collection | `select` | ❌ | — | **Only show if gateway mode = `pro`**. Lists collections in this gateway. |

### 4.2 Inputs — Health Check (Collapsible Section)

> Header: **"⚕️ Health Check Settings (Advanced)"** — collapsed by default.

| # | Label | HTML Type | Required | Default | Validation |
|---|-------|-----------|----------|---------|------------|
| 5 | Health Check Path | `text` | ❌ | — | Must start with `/`. e.g. `/health` |
| 6 | Check Interval | `text` | ❌ | — | Go duration: e.g. `10s` |
| 7 | Timeout | `text` | ❌ | — | Go duration: e.g. `5s` |
| 8 | Fail Threshold | `number` | ❌ | `0` | Integer ≥ 0 |
| 9 | Pass Threshold | `number` | ❌ | `0` | Integer ≥ 0 |

### 4.3 Buttons

| Label | Style | When Visible |
|-------|-------|-------------|
| **Create Service** | Primary | Create mode |
| **Save Changes** | Primary | Edit mode |
| **Cancel** | Secondary | Always |
| **Delete Service** | Danger | Edit mode |

### 4.4 Rules

| Rule | Description |
|------|-------------|
| Collection field | Hide when gateway mode = `single` |

---

## 5. Service Target

> Displayed as a **table/list** inside the Service detail page.

### 5.1 Inputs (per row)

| # | Label | HTML Type | Required | Default | Validation |
|---|-------|-----------|----------|---------|------------|
| 1 | URL | `url` | ✅ | — | Valid URL with protocol. e.g. `http://localhost:8081` |
| 2 | Weight | `number` | ❌ | `1` | Integer ≥ 1 |

### 5.2 Buttons

| Label | Style | Where |
|-------|-------|-------|
| **+ Add Target** | Primary (small) | Above/below the list |
| **Save** | Primary (small) | Per row (inline edit) |
| 🗑️ (trash icon) | Icon / Danger | Per row — remove target |

### 5.3 Rules

| Rule | Description |
|------|-------------|
| Minimum | At least 1 target required per service |
| Weight hint | When LB policy = `weighted`, show a visual hint (percentage or bar) |
| Delete guard | Warn if deleting the last target |

---

## 6. Route

> The most complex form. Has **Standard** and **Aggregate** modes.

### 6.1 Inputs — Always Visible

| # | Label | HTML Type | Required | Default | Validation |
|---|-------|-----------|----------|---------|------------|
| 1 | Method | `select` | ✅ | `GET` | Options: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, `OPTIONS` |
| 2 | Path | `text` | ✅ | — | Must start with `/`. Supports `:param`, `*`, `**` |
| 3 | Protocol | `select` | ❌ | `http` | Options: `http`, `grpc` |
| 4 | Timeout | `text` | ❌ | `30s` | Go duration: e.g. `30s`, `1m` |
| 5 | Collection | `select` | ❌ | — | **Only show if gateway mode = `pro`** |
| 6 | Is Aggregate? | `toggle` | ❌ | `false` | Toggles between Standard and Aggregate mode |

### 6.2 Inputs — Standard Mode (Is Aggregate = OFF)

| # | Label | HTML Type | Required | Default | Validation |
|---|-------|-----------|----------|---------|------------|
| 7 | Service | `select` | ✅ | — | Dropdown of services in current gateway |
| 8 | Target Path | `text` | ❌ | — | Override path on upstream. e.g. `/webhook/abc123` |
| 9 | WebSocket | `toggle` | ❌ | `false` | — |
| 10 | Max Retry Attempts | `number` | ❌ | — | Integer ≥ 0. Inside collapsible "Retry Settings" section. |
| 11 | Retry On Status | `tags` | ❌ | — | User types status codes and presses Enter. e.g. `502`, `503` |

### 6.3 Inputs — Aggregate Mode (Is Aggregate = ON)

> When toggled ON → **hide** #7 (Service), #8 (Target Path), #9 (WebSocket), #10-11 (Retries).

| # | Label | HTML Type | Required | Default | Validation |
|---|-------|-----------|----------|---------|------------|
| 12 | Merge Strategy | `select` | ✅ | — | Options: `merge_object`, `merge_array`, `first_success` |
| 13 | Aggregate Timeout | `text` | ❌ | `30s` | Go duration |
| 14 | Allow Partial Failure | `toggle` | ❌ | `false` | — |

### 6.4 URL Preview (read-only)

| Gateway Mode | Preview Format |
|-------------|---------------|
| `single` | `/{slug}/{path}` → e.g. `/mycompany/users/:id` |
| `pro` | `/{slug}/{gateway}/{service}/{path}` → e.g. `/mycompany/ecommerce/users-backend/users/:id` |

### 6.5 Buttons

| Label | Style | When Visible |
|-------|-------|-------------|
| **Create Route** | Primary | Create mode |
| **Save Changes** | Primary | Edit mode |
| **Cancel** | Secondary | Always |
| **Delete Route** | Danger | Edit mode |

### 6.6 Rules

| Rule | Description |
|------|-------------|
| gRPC lock | If service protocol = `grpc` → lock Method to `POST`, disable dropdown |
| Aggregate toggle | ON: hide Service, Target Path, WebSocket, Retries. Show Merge Strategy, Timeout, Partial Failure. |
| Collection field | Hide when gateway mode = `single` |

---

## 7. Aggregate Sub-Request

> Dynamic list inside an Aggregate Route page. User clicks "+ Add Sub-Request".

### 7.1 Inputs (per row)

| # | Label | HTML Type | Required | Default | Validation |
|---|-------|-----------|----------|---------|------------|
| 1 | Key Name | `text` | ✅ | — | Unique within this route. e.g. `users`, `orders` |
| 2 | Service | `select` | ✅ | — | Dropdown of services in gateway |
| 3 | Target Path | `text` | ✅ | — | Must start with `/`. e.g. `/api/users/:id` |
| 4 | Method | `select` | ❌ | (parent method) | HTTP methods |
| 5 | Required | `checkbox` | ❌ | `false` | If checked → entire aggregation fails on this sub-request failure |
| 6 | Timeout | `text` | ❌ | — | Go duration override |

### 7.2 Buttons

| Label | Style | Where |
|-------|-------|-------|
| **+ Add Sub-Request** | Primary (small) | Above/below the list |
| 🗑️ (trash icon) | Icon / Danger | Per row |
| **Save Sub-Requests** | Primary | Bottom of list |

---

## 8. Plugin

### 8.1 Inputs — Main

| # | Label | HTML Type | Required | Default | Validation |
|---|-------|-----------|----------|---------|------------|
| 1 | Plugin Name | `select` | ✅ | — | Options: `jwt`, `apikey`, `ratelimit`, `cache`, `cors`, `waf`, `schema_validation`, `request_id`, `logging` |
| 2 | Enabled | `toggle` | ❌ | `true` | — |
| 3 | Phase | `select` | ❌ | (auto) | Options: `PreRouting`, `Authentication`, `RateLimiting`, `RequestTransform`, `UpstreamForward`, `ResponseTransform`, `Logging` |
| 4 | Fail Open | `toggle` | ❌ | `false` | If true → request continues even if plugin errors |

### 8.2 Config — jwt

| # | Label | HTML Type | Required | Default |
|---|-------|-----------|----------|---------|
| 1 | Secret | `password` | ✅ | — |
| 2 | Allowed Issuers | `text[]` (dynamic array) | ❌ | — |
| 3 | Allowed Audiences | `text[]` (dynamic array) | ❌ | — |

### 8.3 Config — apikey

| # | Label | HTML Type | Required | Default |
|---|-------|-----------|----------|---------|
| 1 | API Keys | `text[]` (dynamic array) | ✅ (min 1) | — |
| 2 | Header Name | `text` | ❌ | `X-API-Key` |

### 8.4 Config — ratelimit

| # | Label | HTML Type | Required | Default |
|---|-------|-----------|----------|---------|
| 1 | Capacity | `number` | ✅ | `100` |
| 2 | Refill Rate | `number` | ✅ | `10` |
| 3 | Key Type | `select` | ✅ | `ip` |
| 4 | Prefix | `text` | ❌ | `global` |
| 5 | Backend | `select` | ✅ | `redis` |
| 6 | Fail Open | `toggle` | ❌ | `false` |

### 8.5 Config — cache

| # | Label | HTML Type | Required | Default |
|---|-------|-----------|----------|---------|
| 1 | TTL (seconds) | `number` | ✅ | `300` |
| 2 | Max Items | `number` | ✅ | `500` |
| 3 | Backend | `select` | ✅ | `redis` |

### 8.6 Config — cors

| # | Label | HTML Type | Required | Default |
|---|-------|-----------|----------|---------|
| 1 | Allowed Origins | `text[]` (dynamic array) | ✅ | `["*"]` |
| 2 | Allowed Methods | `multi-select` checkboxes | ✅ | `GET, POST, PUT, DELETE, OPTIONS, PATCH` |
| 3 | Allowed Headers | `text[]` (dynamic array) | ❌ | `Content-Type, Authorization, X-API-Key, X-Request-ID` |
| 4 | Allow Credentials | `toggle` | ❌ | `false` |
| 5 | Max Age (seconds) | `number` | ❌ | `86400` |

### 8.7 Config — waf

| # | Label | HTML Type | Required | Default |
|---|-------|-----------|----------|---------|
| 1 | Mode | `select` | ✅ | `log_only` |
| 2 | Inspect Body | `toggle` | ❌ | `false` |
| 3 | Trusted Proxies | `text[]` (dynamic array) | ❌ | — |

### 8.8 Config — schema_validation

| # | Label | HTML Type | Required | Default |
|---|-------|-----------|----------|---------|
| 1 | Schema Path | `text` | ✅ | — |

### 8.9 Config — request_id

| # | Label | HTML Type | Required | Default |
|---|-------|-----------|----------|---------|
| 1 | Header Name | `text` | ❌ | `X-Request-ID` |

### 8.10 Config — logging

| # | Label | HTML Type | Required | Default |
|---|-------|-----------|----------|---------|
| 1 | Log Level | `select` | ✅ | `info` |

> `select` options for Log Level: `debug`, `info`, `warn`, `error`

### 8.11 Buttons

| Label | Style | When Visible |
|-------|-------|-------------|
| **Add Plugin** | Primary | Create mode |
| **Save Changes** | Primary | Edit mode |
| **Cancel** | Secondary | Always |
| **Remove Plugin** | Danger | Edit mode |

### 8.12 Rules

| Rule | Description |
|------|-------------|
| Scope | Plugin belongs to **either** a Gateway (global) **or** a Route. Never both. |
| Config swap | When user picks a different Plugin Name → swap the config section to match |

---

## 9. Component Summary

| Component Type | Used In |
|---------------|---------|
| `text` | Name, Path, Slug, Target Path, Timeout, Schema Path, Header Name, Prefix, Health Check Path, Interval |
| `password` | JWT Secret |
| `number` | Weight, Thresholds, Capacity, TTL, Max Items, Max Age, Retry Attempts, Refill Rate |
| `url` | Service Target URL |
| `toggle` | Active, Enabled, WebSocket, Is Aggregate, Required, Fail Open, Allow Credentials, Inspect Body, Allow Partial Failure |
| `select` | Mode, Protocol, LB Policy, Method, Merge Strategy, Plugin Name, Phase, Key Type, Backend, WAF Mode, Log Level |
| `textarea` | Description |
| `tags` / `multi-select` | Retry On Status, Allowed Methods |
| `text[]` (dynamic array) | API Keys, Allowed Issuers, Audiences, Origins, Headers, Trusted Proxies |

---

## 10. Visibility Rules

| Condition | Show | Hide |
|-----------|------|------|
| No user profile exists | Slug Setup modal | Dashboard |
| Gateway mode = `single` | — | Collection form, Collection dropdown on Service & Route |
| Gateway mode = `pro` | Collection form, Collection dropdown on Service & Route | — |
| User already has `single` gateway | Disable `single` option in Mode dropdown | — |
| Service protocol = `grpc` | Lock Method to `POST` (disabled) | — |
| Is Aggregate = `ON` | Merge Strategy, Aggregate Timeout, Partial Failure, Sub-Requests | Service dropdown, Target Path, WebSocket, Retries |
| Is Aggregate = `OFF` | Service dropdown, Target Path, WebSocket, Retries | Merge Strategy, Aggregate Timeout, Partial Failure |
| LB Policy = `weighted` | Weight importance hint on Targets | — |
| Plugin selected | Matching config form | Other config forms |
