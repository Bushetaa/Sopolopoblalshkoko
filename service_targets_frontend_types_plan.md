# Frontend UI Components & Data Types Plan — Service Targets

> Displayed as a **table/list** inside the Service detail page.
> This section outlines the UI components and the precise TypeScript data types required to integrate with the API endpoints.

## 1. Service Target

### 1.1 Inputs (per row)

| # | Label | HTML Type | Data Type (TS) | Required | Default | Validation |
|---|-------|-----------|----------------|----------|---------|------------|
| 1 | URL | `url` | `string` | ✅ | — | Valid URL with protocol. e.g. `http://localhost:8081` |
| 2 | Service ID | *(Hidden/State)* | `string` (UUID)| ✅ | *(From Parent Service)* | Must be a valid UUID string |
| 3 | Weight | `number` | `number` | ❌ | `1` | Integer ≥ 1 |

### 1.2 Buttons & Actions

| Label | Style | Where | API Endpoint Mapping |
|-------|-------|-------|----------------------|
| **+ Add Target** | Primary (small) | Above/below the list | **Create** (`POST /api/v1/service-targets`) |
| **Save** | Primary (small) | Per row (inline edit) | **Update** (`PATCH /api/v1/service-targets/:id`) |
| 🗑️ (trash icon) | Icon / Danger | Per row — remove target| **Delete** (`DELETE /api/v1/service-targets/:id`) |
| *(Page Load)* | *(None)* | Table Component | **Get All** (`GET /api/v1/service-targets`) |

### 1.3 Rules

| Rule | Description |
|------|-------------|
| Minimum | At least 1 target required per service |
| Weight hint | When LB policy = `weighted`, show a visual hint (percentage or bar) |
| Delete guard | Warn if deleting the last target |

---

## 2. Data Types (TypeScript)

Based on the inputs above and the API schema, these are the exact data types the frontend needs to handle the CRUD operations:

```typescript
// 1. Base Entity (Used for Get All & Stream responses)
export interface ServiceTarget {
  id: string;
  url: string;
  service_id: string; // References the parent service
  weight: number;
}

// 2. Create Payload (Used for POST requests)
export interface CreateServiceTargetPayload {
  url: string;
  service_id: string;
  weight: number;
}

// 3. Update Payload (Used for PATCH requests)
// Uses Partial because it's a PATCH request, allowing partial updates.
export type UpdateServiceTargetPayload = Partial<CreateServiceTargetPayload>;
```

### API Functions Example Usage

```typescript
// For fetching the list on load:
const fetchTargets = (): Promise<ServiceTarget[]> => { ... }

// For clicking "+ Add Target":
const addTarget = (data: CreateServiceTargetPayload): Promise<ServiceTarget> => { ... }

// For clicking "Save" on a row:
const editTarget = (id: string, data: UpdateServiceTargetPayload): Promise<ServiceTarget> => { ... }
```
