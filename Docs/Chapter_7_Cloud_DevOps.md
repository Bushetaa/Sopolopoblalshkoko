# Chapter 7: Cloud Infrastructure and DevOps

## 7.1 Introduction

Chapters 4 and 5 presented the implementation of the Sopo platform's five subsystems — the Go gateway engine, the Express BFF, the Next.js dashboard, the Hasura-Auth service, and the MCP AI server — as standalone, locally runnable applications. This chapter addresses the equally critical question: **how are these subsystems deployed, interconnected, secured, monitored, and continuously delivered in a production cloud environment?**

The answer is a fully automated, Infrastructure-as-Code (IaC) pipeline built on **Amazon Web Services (AWS)**, orchestrated by **Terraform**, deployed to **Kubernetes (EKS)** via **Helm**, and continuously integrated through **GitHub Actions**. The design adheres to three guiding principles:

1. **Immutability** — infrastructure and application artifacts are never mutated in place; every change produces a new, versioned artifact (Terraform state, Docker image, Helm release).
2. **Least Privilege** — every component operates with the minimum permissions required, enforced by IAM policies, Kubernetes RBAC, and network-level isolation.
3. **Observability by Default** — metrics, logs, and traces are collected automatically from every layer, enabling proactive anomaly detection rather than reactive debugging.

| Layer | Technology | Purpose |
|:---|:---|:---|
| Infrastructure as Code | Terraform v1.x | Declarative provisioning of all AWS resources |
| CI/CD | GitHub Actions | Build, test, scan, package, and deploy pipelines |
| Container Registry | Amazon ECR | Secure, versioned storage of Docker images |
| Container Orchestration | Amazon EKS (Kubernetes) | Scheduling, scaling, and lifecycle management of application pods |
| Package Manager | Helm v3 | Templated Kubernetes manifests with release management |
| DNS & TLS | Route 53 + ACM | Domain resolution and automatic TLS certificate provisioning |
| Edge Security | AWS WAF + Shield | DDoS protection and web application firewall rules |
| Load Balancing | Application Load Balancer (ALB) | HTTPS termination and path-based routing to EKS services |
| Database | Amazon RDS PostgreSQL (Multi-AZ) | Primary relational data store with automated failover |
| Cache & Pub/Sub | Amazon ElastiCache (Redis) | Configuration hot-reload channel and response caching |
| Analytics | ClickHouse (self-hosted on EKS) | Columnar storage for request logs and real-time analytics |
| Observability | Prometheus, Grafana, Loki | Metrics collection, dashboarding, and centralised log aggregation |
| Secrets | AWS Secrets Manager | Encrypted storage of database credentials, JWT secrets, API keys |
| Object Storage | Amazon S3 | Terraform state backend, artifact storage, log archival |
| Backup & DR | RDS Snapshots + S3/Glacier | Automated database backups and long-term log retention |

---

## 7.2 Infrastructure as Code (Terraform)

### 7.2.1 Module Architecture

The entire AWS infrastructure is provisioned declaratively using **Terraform**, organised into seven purpose-specific modules:

```
terraform/
├── main.tf                     # Root composition — wires modules together
├── variables.tf                # Environment-specific inputs (dev, staging, prod)
├── outputs.tf                  # Exported values (ALB DNS, RDS endpoint, etc.)
├── backend.tf                  # S3 + DynamoDB state backend configuration
│
├── modules/
│   ├── vpc/                    # VPC, subnets (public + private), NAT Gateway, route tables
│   ├── eks/                    # EKS cluster, managed node groups, OIDC provider, RBAC
│   ├── rds/                    # RDS PostgreSQL instance, Multi-AZ, parameter groups
│   ├── networking/             # ALB, Target Groups, Listener Rules, Security Groups
│   ├── security/               # WAF WebACL, Shield subscription, IAM roles/policies
│   ├── storage/                # S3 buckets (state, artifacts, backups), lifecycle rules
│   └── dns_acm/                # Route 53 hosted zone, DNS records, ACM certificates
```

**Justification:** Modular decomposition was chosen over a monolithic configuration because:
- Each module has a **single responsibility** and can be planned/applied independently during development.
- Modules accept typed **input variables** and produce **outputs**, creating explicit dependency contracts between infrastructure layers (e.g., the EKS module requires `vpc_id` and `private_subnet_ids` from the VPC module).
- Environment promotion (dev → staging → prod) is achieved by varying the input variables via `.tfvars` files, not by duplicating module code.

### 7.2.2 State Management

Terraform state is stored remotely in an **S3 bucket** with **DynamoDB-based state locking** to prevent concurrent modifications:

```hcl
terraform {
  backend "s3" {
    bucket         = "sopo-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "sopo-terraform-locks"
    encrypt        = true
  }
}
```

**Justification:** Remote state with locking was chosen over local state files because:
- Multiple team members and the CI/CD pipeline may apply changes concurrently; DynamoDB locking prevents state corruption.
- S3 versioning provides an automatic audit trail and rollback capability for every infrastructure change.
- Server-side encryption (AES-256) ensures that sensitive outputs (database passwords, endpoints) are encrypted at rest.

### 7.2.3 Environment Strategy

Three environments are maintained, each with its own Terraform workspace and `.tfvars` file:

| Environment | EKS Node Type | RDS Instance | Redis Node | Purpose |
|:---|:---|:---|:---|:---|
| **dev** | `t3.medium` (2 nodes) | `db.t3.micro` | `cache.t3.micro` | Developer testing, rapid iteration |
| **staging** | `t3.large` (3 nodes) | `db.t3.small` | `cache.t3.small` | Pre-production validation, UAT |
| **prod** | `m5.xlarge` (3+ nodes, auto-scaling) | `db.r6g.large` (Multi-AZ) | `cache.r6g.large` (cluster mode) | Production traffic |

---

## 7.3 CI/CD Pipeline (GitHub Actions)

### 7.3.1 Pipeline Architecture

The CI/CD pipeline is implemented as **GitHub Actions workflows**, triggered on push to `main` (for deployment) and on pull requests (for validation):

```
Developer pushes code
        │
        ▼
┌─────────────────────────┐
│   Build & Test Stage    │
│  • Compile Go binaries  │
│  • Run unit tests       │
│  • Lint (golangci-lint)  │
│  • npm test (Frontend)  │
│  • Security scan        │
└─────────┬───────────────┘
          │ Pass
          ▼
┌─────────────────────────┐
│   Package Stage         │
│  • Docker build         │
│  • Tag with git SHA     │
│  • Push to AWS ECR      │
└─────────┬───────────────┘
          │ Pass
          ▼
┌─────────────────────────┐
│   Infrastructure Stage  │
│  • terraform plan       │
│  • terraform apply      │
│    (auto on main only)  │
└─────────┬───────────────┘
          │ Pass
          ▼
┌─────────────────────────┐
│   Deploy Stage          │
│  • helm upgrade         │
│    --install --atomic   │
│  • Kubernetes rollout   │
│    status verification  │
└─────────────────────────┘
```

### 7.3.2 Multi-Service Build Strategy

The repository is structured as a **monorepo** containing multiple services. Each service has its own Dockerfile and GitHub Actions workflow:

| Service | Dockerfile | Workflow | Build Artefact |
|:---|:---|:---|:---|
| sopo-gateway-server | `Dockerfile` (multi-stage Go) | `gateway-ci.yml` | `sopo-gateway:sha-xxxxx` |
| sopo_backend | `Dockerfile` (Node.js) | `backend-ci.yml` | `sopo-backend:sha-xxxxx` |
| sopo-frontend | `Dockerfile` (Next.js) | `frontend-ci.yml` | `sopo-frontend:sha-xxxxx` |
| hasura-auth | `Dockerfile` (Go multi-stage) | `auth-ci.yml` | `sopo-auth:sha-xxxxx` |
| sopo-mcp-server | `Dockerfile` (Node.js) | `mcp-ci.yml` | `sopo-mcp:sha-xxxxx` |

**Justification:** Per-service workflows were chosen over a single monorepo workflow because:
- A change to the frontend does not need to rebuild the Go gateway, reducing pipeline execution time by 60–70%.
- Each workflow can be gated independently — the gateway may require stricter security scanning than the frontend.
- Docker image tags are tied to the specific service's git SHA, enabling precise rollback of individual components.

### 7.3.3 Security Scanning

Every CI pipeline includes automated security scanning:

1. **Static Analysis:** `golangci-lint` (Go), `eslint` with security rules (TypeScript).
2. **Dependency Scanning:** `go mod audit` / `npm audit` to detect known CVEs in dependencies.
3. **Container Scanning:** AWS ECR native image scanning flags OS-level vulnerabilities in Docker images before deployment.
4. **Secret Detection:** GitHub's built-in secret scanning prevents accidental credential commits.

---

## 7.4 Container Orchestration (Amazon EKS)

### 7.4.1 Cluster Architecture

The EKS cluster runs within the **private subnets** of the VPC, ensuring that worker nodes have no direct internet exposure. All external traffic enters through the ALB in the public subnet:

```
Internet
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│  AWS VPC (10.0.0.0/16)                                       │
│                                                              │
│  ┌─────────────────────┐    ┌──────────────────────────────┐ │
│  │  Public Subnets      │    │  Private Subnets              │ │
│  │                     │    │                              │ │
│  │  ┌───────────────┐  │    │  ┌────────────────────────┐  │ │
│  │  │  ALB          │──┼────┼─►│  EKS Worker Nodes       │  │ │
│  │  │  (HTTPS:443)  │  │    │  │                        │  │ │
│  │  └───────────────┘  │    │  │  ┌──────────────────┐  │  │ │
│  │                     │    │  │  │ Gateway Pod      │  │  │ │
│  │  ┌───────────────┐  │    │  │  │ Backend Pod      │  │  │ │
│  │  │  NAT Gateway  │  │    │  │  │ Frontend Pod     │  │  │ │
│  │  └───────────────┘  │    │  │  │ Auth Pod         │  │  │ │
│  │                     │    │  │  │ Hasura Pod       │  │  │ │
│  └─────────────────────┘    │  │  │ MCP Server Pod   │  │  │ │
│                             │  │  │ ClickHouse Pod   │  │  │ │
│                             │  │  └──────────────────┘  │  │ │
│                             │  │                        │  │ │
│                             │  │  ┌──────────────────┐  │  │ │
│                             │  │  │ RDS PostgreSQL   │  │  │ │
│                             │  │  │ ElastiCache Redis│  │  │ │
│                             │  │  └──────────────────┘  │  │ │
│                             │  └────────────────────────┘  │ │
│                             └──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 7.4.2 Kubernetes Workload Definitions

Each Sopo service is deployed as a **Kubernetes Deployment** with associated **Service** and **Ingress** resources, packaged into a **Helm chart**:

| K8s Deployment | Replicas (Prod) | Resource Requests | Health Check | Exposed Port |
|:---|:---|:---|:---|:---|
| `sopo-gateway` | 3 (HPA: 3–10) | CPU: 500m, Mem: 256Mi | `/health` (HTTP) | 5000 |
| `sopo-backend` | 2 (HPA: 2–5) | CPU: 250m, Mem: 256Mi | `/api/health` (HTTP) | 4000 |
| `sopo-frontend` | 2 | CPU: 200m, Mem: 256Mi | `/` (HTTP) | 3000 |
| `sopo-auth` | 2 | CPU: 250m, Mem: 128Mi | `/healthz` (HTTP) | 4000 |
| `hasura-engine` | 2 | CPU: 500m, Mem: 512Mi | `/healthz` (HTTP) | 8080 |
| `sopo-mcp` | 1 | CPU: 100m, Mem: 128Mi | TCP probe | 3001 |
| `clickhouse` | 1 (StatefulSet) | CPU: 1000m, Mem: 2Gi | `/ping` (HTTP) | 8123 |

### 7.4.3 Horizontal Pod Autoscaling (HPA)

The Go Gateway and Backend services are configured with **Horizontal Pod Autoscalers** that scale based on CPU utilisation:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: sopo-gateway-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: sopo-gateway
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**Justification:** CPU-based autoscaling was chosen for the gateway because its workload is CPU-bound (Radix Tree routing, plugin execution, JSON serialisation). The 70% threshold provides a buffer to absorb traffic bursts while new pods start (EKS pod startup takes approximately 15–30 seconds including image pull and readiness probe).

### 7.4.4 Helm Chart Structure

All Kubernetes manifests are templated using **Helm v3**, enabling environment-specific configuration via `values.yaml` overrides:

```
helm/sopo/
├── Chart.yaml                  # Chart metadata and version
├── values.yaml                 # Default values (dev)
├── values-staging.yaml         # Staging overrides
├── values-prod.yaml            # Production overrides
│
├── templates/
│   ├── gateway-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── auth-deployment.yaml
│   ├── hasura-deployment.yaml
│   ├── mcp-deployment.yaml
│   ├── clickhouse-statefulset.yaml
│   ├── services.yaml           # ClusterIP services for all deployments
│   ├── ingress.yaml            # ALB Ingress with path-based routing
│   ├── hpa.yaml                # Autoscaler definitions
│   ├── configmaps.yaml         # Non-sensitive configuration
│   └── external-secrets.yaml   # AWS Secrets Manager references
```

**Justification:** Helm was chosen over raw manifests or Kustomize because:
- The `--atomic` flag on `helm upgrade` provides **automatic rollback** if any pod fails its readiness probe after deployment, preventing partial deployments.
- Helm's release history (`helm history sopo`) provides a built-in audit trail of every deployment with timestamps and revision numbers.
- The templating engine handles environment-specific differences (replica counts, resource limits, domain names) cleanly.

---

## 7.5 Networking and Edge Security

### 7.5.1 Network Architecture

The VPC is segmented into **public** and **private** subnets across multiple Availability Zones (AZs) for high availability:

| Subnet Type | CIDR Range | Resources | Internet Access |
|:---|:---|:---|:---|
| Public (AZ-a) | `10.0.1.0/24` | ALB, NAT Gateway | Direct (Internet Gateway) |
| Public (AZ-b) | `10.0.2.0/24` | ALB, NAT Gateway | Direct (Internet Gateway) |
| Private (AZ-a) | `10.0.10.0/24` | EKS nodes, RDS primary | Outbound only (via NAT) |
| Private (AZ-b) | `10.0.20.0/24` | EKS nodes, RDS standby | Outbound only (via NAT) |

### 7.5.2 Traffic Flow

External user traffic follows a strictly layered path:

```
User (HTTPS) → Route 53 (DNS) → ALB (TLS Termination)
    → WAF (Rule Evaluation) → EKS Ingress Controller
    → Kubernetes Service → Application Pod
```

1. **Route 53** resolves the domain name (e.g., `api.sopo.dev`) to the ALB's public IP.
2. **AWS Certificate Manager (ACM)** provides free, auto-renewing TLS certificates attached to the ALB listener.
3. **AWS WAF** applies rate-limiting rules, SQL injection detection, and geographic restrictions before traffic reaches the application.
4. **AWS Shield Standard** provides baseline DDoS protection at the network and transport layers (included at no extra cost with ALB).
5. The **ALB** performs path-based routing to different Kubernetes services:

| ALB Path Rule | Target K8s Service | Description |
|:---|:---|:---|
| `/api/*` | `sopo-backend:4000` | REST management APIs |
| `/v1/graphql` | `hasura-engine:8080` | Hasura GraphQL endpoint |
| `/auth/*` | `sopo-auth:4000` | Authentication endpoints |
| `/gateway/*` | `sopo-gateway:5000` | Live API traffic (Data Plane) |
| `/*` (default) | `sopo-frontend:3000` | Dashboard UI |

### 7.5.3 Security Groups

Network access is enforced via **Security Groups** operating as stateful firewalls:

| Security Group | Inbound Rules | Outbound Rules |
|:---|:---|:---|
| `sg-alb` | Port 443 from `0.0.0.0/0` | All to `sg-eks` |
| `sg-eks` | All from `sg-alb`, All from `sg-eks` (pod-to-pod) | All (NAT for external APIs) |
| `sg-rds` | Port 5432 from `sg-eks` only | None (no outbound required) |
| `sg-redis` | Port 6379 from `sg-eks` only | None |

**Justification:** This layered security model ensures that the database and cache are **never accessible from the internet** — only EKS worker nodes can reach them. Even if an attacker compromises the ALB, they cannot directly connect to RDS or ElastiCache.

---

## 7.6 Data Services

### 7.6.1 Amazon RDS PostgreSQL

PostgreSQL serves as the **primary relational data store** for both the Sopo gateway configuration (via Hasura) and the authentication system (via hasura-auth).

| Parameter | Value | Rationale |
|:---|:---|:---|
| Engine Version | PostgreSQL 14.x | Stable release with citext extension required by hasura-auth |
| Instance Class | `db.r6g.large` (prod) | 2 vCPUs, 16 GB RAM — sufficient for metadata-heavy workloads |
| Multi-AZ | Enabled (prod) | Synchronous standby replica in a second AZ for automatic failover |
| Storage | 100 GB gp3, autoscaling to 500 GB | gp3 provides consistent baseline IOPS without provisioning overhead |
| Automated Backups | 7-day retention, daily snapshots | Point-in-time recovery to any second within the retention window |
| Encryption | AES-256 (at rest), TLS (in transit) | Compliance requirement for sensitive user data |

### 7.6.2 Amazon ElastiCache (Redis)

Redis serves two critical roles in the Sopo architecture:

1. **Configuration Hot-Reload Channel:** The Nhost Auth webhook publishes gateway configuration updates to a Redis Pub/Sub channel; the Go Gateway subscribes and performs atomic router swaps (Section 4.4.2).
2. **Plugin State Store:** The `ratelimit` plugin stores sliding-window counters and the `cache` plugin stores response caches in Redis, enabling shared state across multiple gateway replicas.

| Parameter | Value | Rationale |
|:---|:---|:---|
| Engine | Redis 7.x | Native Pub/Sub, Lua scripting for atomic rate-limit operations |
| Node Type | `cache.r6g.large` (prod) | 2 vCPUs, 13 GB RAM — accommodates cache + counters + Pub/Sub |
| Cluster Mode | Disabled (single shard) | Configuration data is small; sharding adds unnecessary complexity |
| Encryption | In-transit (TLS) + at-rest | Required for compliance |
| Automatic Failover | Enabled (Multi-AZ replica) | Ensures Pub/Sub channel survives a node failure |

### 7.6.3 ClickHouse (Self-Hosted on EKS)

ClickHouse is deployed as a **Kubernetes StatefulSet** within the EKS cluster for columnar analytics on request logs:

| Parameter | Value | Rationale |
|:---|:---|:---|
| Deployment | StatefulSet (1 replica) | StatefulSet provides stable network identity and persistent volume claims |
| Storage | 200 GB EBS gp3 (PVC) | Persistent storage survives pod restarts |
| Data Retention | 90 days (TTL-based auto-deletion) | Balances storage cost with analytics usefulness |
| Compression | LZ4 (default) | Optimised for columnar append-heavy workloads |

**Justification:** ClickHouse was deployed on EKS (self-hosted) rather than using a managed ClickHouse service because:
- The analytics workload is modest (single-tenant, sub-100K inserts/minute), and a managed service would be disproportionately expensive.
- Self-hosting provides full control over the retention policy, table schemas, and materialized views used by the Hasura ClickHouse Connector.
- The Kubernetes StatefulSet with a PersistentVolumeClaim ensures data durability equivalent to a managed service.

---

## 7.7 Secrets Management

All sensitive configuration values are stored in **AWS Secrets Manager** and injected into Kubernetes pods via the **External Secrets Operator (ESO)**:

```
AWS Secrets Manager                  Kubernetes
┌──────────────────────┐            ┌──────────────────────┐
│ sopo/prod/database   │───ESO───►  │ Secret: db-credentials│
│   • host             │            │   • DB_HOST           │
│   • username         │            │   • DB_USER           │
│   • password         │            │   • DB_PASS           │
├──────────────────────┤            ├──────────────────────┤
│ sopo/prod/jwt        │───ESO───►  │ Secret: jwt-keys      │
│   • private_key      │            │   • JWT_PRIVATE_KEY   │
│   • public_key       │            │   • JWT_PUBLIC_KEY    │
├──────────────────────┤            ├──────────────────────┤
│ sopo/prod/redis      │───ESO───►  │ Secret: redis-creds   │
│   • endpoint         │            │   • REDIS_URL         │
│   • auth_token       │            │   • REDIS_PASSWORD    │
└──────────────────────┘            └──────────────────────┘
```

**Justification:** AWS Secrets Manager + ESO was chosen over Kubernetes-native Secrets because:
- Kubernetes Secrets are base64-encoded (not encrypted) by default, and are visible to anyone with `kubectl get secret` access.
- Secrets Manager provides **automatic rotation** for database credentials, reducing the risk of credential compromise from long-lived passwords.
- ESO's `ExternalSecret` CRDs allow secrets to be managed declaratively in Helm charts without embedding actual secret values in Git.

---

## 7.8 Observability Stack

### 7.8.1 Architecture

The observability stack follows the **three pillars of observability**: metrics, logs, and traces:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Application │     │  Application │     │  Application │
│  Pods        │     │  Pods        │     │  Pods        │
│ /metrics     │     │  stdout/err  │     │  trace spans │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Prometheus  │     │    Loki      │     │   (Future)   │
│  (Metrics)   │     │   (Logs)     │     │   Jaeger     │
└──────┬───────┘     └──────┬───────┘     └──────────────┘
       │                    │
       ▼                    ▼
┌──────────────────────────────────────┐
│            Grafana                   │
│  • Metrics dashboards               │
│  • Log exploration                  │
│  • Alerting rules                   │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│         Alertmanager                 │
│  • Slack / PagerDuty notifications  │
│  • Alert grouping and silencing     │
└──────────────────────────────────────┘
```

### 7.8.2 Metrics (Prometheus)

Prometheus is deployed within the EKS cluster using the **kube-prometheus-stack** Helm chart, which bundles Prometheus, Alertmanager, and Grafana with pre-configured Kubernetes dashboards.

Custom metrics exposed by the Sopo Gateway include:

| Metric Name | Type | Description |
|:---|:---|:---|
| `sopo_requests_total` | Counter | Total requests processed, labelled by gateway, route, method, status |
| `sopo_request_duration_seconds` | Histogram | Request latency distribution (P50, P95, P99) |
| `sopo_upstream_health` | Gauge | Health status of each upstream target (1 = healthy, 0 = unhealthy) |
| `sopo_plugin_errors_total` | Counter | Plugin execution failures, labelled by plugin name and phase |
| `sopo_config_reload_total` | Counter | Number of hot-reload events |
| `sopo_clickhouse_batch_size` | Histogram | Size of each ClickHouse batch flush |

### 7.8.3 Logs (Loki)

Application logs are collected by **Grafana Loki** using the **Promtail** agent, which runs as a DaemonSet on every EKS node:

- All application pods write structured JSON logs to `stdout`, which are captured by the Kubernetes container runtime.
- Promtail ships logs to Loki with labels extracted from Kubernetes metadata (pod name, namespace, container name).
- Loki's LogQL query language enables efficient log search and correlation from the Grafana UI.

**Justification:** Loki was chosen over the ELK stack (Elasticsearch, Logstash, Kibana) because:
- Loki indexes only **labels**, not full text, resulting in 10–100× lower storage costs for equivalent log volumes.
- Loki integrates natively with Grafana, allowing unified metric + log dashboards without context-switching between tools.
- The Promtail DaemonSet is significantly lighter than Logstash, consuming approximately 50 MB per node.

### 7.8.4 Alerting Rules

Critical alerts are configured in Prometheus and routed through Alertmanager:

| Alert | Condition | Severity | Action |
|:---|:---|:---|:---|
| `GatewayHighErrorRate` | 5xx rate > 5% for 5 minutes | Critical | PagerDuty notification |
| `GatewayHighLatency` | P99 latency > 2s for 10 minutes | Warning | Slack notification |
| `RDSHighCPU` | RDS CPU > 80% for 15 minutes | Warning | Slack notification |
| `PodCrashLooping` | Pod restart count > 3 in 10 minutes | Critical | PagerDuty notification |
| `DiskSpaceLow` | PVC usage > 85% | Warning | Slack notification |
| `RedisConnectionFailure` | Redis connection errors > 0 for 2 minutes | Critical | PagerDuty notification |

---

## 7.9 Backup and Disaster Recovery

### 7.9.1 Backup Strategy

A multi-tier backup strategy ensures data durability at every level:

| Data Source | Backup Mechanism | Frequency | Retention | Recovery Time Objective (RTO) |
|:---|:---|:---|:---|:---|
| PostgreSQL (RDS) | Automated snapshots + WAL archiving | Daily snapshots, continuous WAL | 7 days (snapshots), 35 days (WAL) | < 30 minutes (point-in-time restore) |
| ClickHouse (EBS) | EBS snapshots via Kubernetes CronJob | Daily | 30 days | < 1 hour (volume restore) |
| Terraform State | S3 versioning | Every `terraform apply` | Indefinite | < 5 minutes (version rollback) |
| Application Config | S3 artifact storage | Every CI/CD deploy | 90 days | < 5 minutes (re-deploy previous SHA) |
| Logs (Loki) | S3/Glacier archival | Automatic lifecycle transition | 1 year (S3), 7 years (Glacier) | N/A (archival only) |

### 7.9.2 Disaster Recovery Scenarios

| Scenario | Impact | Recovery Procedure | Estimated Recovery Time |
|:---|:---|:---|:---|
| Single pod crash | None (Kubernetes auto-restarts) | Automatic | < 30 seconds |
| Single AZ outage | Partial (50% capacity) | EKS reschedules pods to surviving AZ; RDS fails over to standby | < 5 minutes |
| RDS primary failure | Database unavailable | Multi-AZ automatic failover to standby replica | < 2 minutes |
| Full cluster loss | Complete outage | `terraform apply` + `helm install` from CI/CD | < 30 minutes |
| Region-level outage | Complete outage | Restore from S3 cross-region replicated backups to new region | < 2 hours |

### 7.9.3 Configuration Recovery (Gateway Fallback)

As described in Section 4.5.2 (Chapter 4), the Go Gateway implements a three-tier fallback strategy for configuration recovery:

1. **Primary:** Redis Pub/Sub (real-time updates from ElastiCache).
2. **Secondary:** Local `config.json` file (persisted after every successful Redis update, stored on the pod's ephemeral volume or a PVC).
3. **Tertiary:** Amazon S3 (the "Last Known Good State", uploaded by the CI/CD pipeline after every successful deployment).

This ensures the gateway can always boot into a valid configuration, even if both Redis and the local filesystem are unavailable.

---

## 7.10 Design Trade-offs

### 7.10.1 Managed Kubernetes (EKS) vs. Self-Managed Kubernetes

| Criterion | EKS (Chosen) | Self-Managed (kubeadm on EC2) |
|:---|:---|:---|
| Control Plane Management | AWS-managed (no patching, HA built-in) | Manual (must manage etcd, API server, scheduler) |
| Cost | $0.10/hr for control plane + EC2 node costs | EC2 costs only (but higher operational cost) |
| Integration | Native ALB Ingress Controller, IAM OIDC, ECR | Requires manual configuration |
| Upgrade Path | Managed rolling upgrades | Manual, risky |

**Decision:** EKS was chosen because the operational overhead of managing a Kubernetes control plane (etcd backups, API server certificate rotation, scheduler tuning) is disproportionate to the project's team size. The $0.10/hr control plane cost is negligible compared to the engineering time saved.

### 7.10.2 Self-Hosted ClickHouse vs. Managed ClickHouse Cloud

| Criterion | Self-Hosted on EKS (Chosen) | ClickHouse Cloud |
|:---|:---|:---|
| Cost | ~$50/month (EBS + compute share) | ~$200–500/month (managed pricing) |
| Operational Burden | Moderate (backups, upgrades, monitoring) | Low (fully managed) |
| Customisation | Full (custom TTL, materialized views) | Limited by service tier |
| Data Residency | In same VPC, zero-latency writes | External, requires VPC peering |

**Decision:** Self-hosted ClickHouse was chosen because the analytics workload is modest and the cost savings are significant. The StatefulSet deployment with PVC provides adequate durability, and the observability stack (Prometheus + Grafana) monitors ClickHouse health automatically.

### 7.10.3 ALB Ingress vs. NGINX Ingress Controller

| Criterion | AWS ALB Ingress (Chosen) | NGINX Ingress Controller |
|:---|:---|:---|
| TLS Termination | ACM integration (free, auto-renewing) | Must manage cert-manager + Let's Encrypt |
| WAF Integration | Native AWS WAF attachment | Requires separate WAF proxy |
| Cost | $0.0225/hr + LCU-based pricing | Free (but requires EC2 resources for the NGINX pods) |
| Customisation | Limited (AWS-defined annotations) | Highly customisable (custom NGINX configs) |

**Decision:** ALB Ingress was chosen because the seamless integration with ACM and WAF eliminates two entire operational concerns (certificate management and DDoS protection) with zero additional configuration.

---

## 7.11 Security Considerations

### 7.11.1 Defence in Depth

Security is applied at every layer of the architecture:

| Layer | Mechanism | Protection Against |
|:---|:---|:---|
| **Edge** | AWS WAF rules | SQL injection, XSS, malicious bot traffic |
| **Network** | AWS Shield Standard | DDoS attacks (volumetric, protocol-level) |
| **Transport** | ACM TLS certificates (TLS 1.2+) | Man-in-the-middle attacks, eavesdropping |
| **Network Isolation** | Private subnets + Security Groups | Unauthorised access to databases and caches |
| **Authentication** | JWT (RS256) via hasura-auth | Unauthorised API access |
| **Authorisation** | Hasura Row-Level Security | Cross-tenant data access |
| **Secrets** | AWS Secrets Manager + ESO | Credential exposure in source code or environment variables |
| **Container** | ECR image scanning | Known OS and library vulnerabilities |
| **Runtime** | Kubernetes RBAC + Pod Security Standards | Container escape, privilege escalation |
| **Audit** | CloudTrail + Terraform state versioning | Unauthorized infrastructure changes |

### 7.11.2 Kubernetes RBAC

The EKS cluster enforces Role-Based Access Control:

- **CI/CD service account:** Can create, update, and delete deployments in the `sopo` namespace only.
- **Developer role:** Read-only access to pods, logs, and events (no secret access).
- **Admin role:** Full access (limited to designated operators).

---

## 7.12 Cost Optimisation

The following strategies are employed to minimise cloud costs without compromising reliability:

| Strategy | Estimated Monthly Savings | Impact |
|:---|:---|:---|
| **Spot Instances** for non-critical EKS nodes (dev/staging) | 60–70% on EC2 costs | Pods may be interrupted; acceptable for non-prod |
| **gp3 EBS volumes** instead of gp2 | 20% on storage | Same performance, lower base cost |
| **S3 Intelligent-Tiering** for log archives | 40% on archival storage | Automatic tiering based on access patterns |
| **RDS Reserved Instances** (1-year, partial upfront) | 30–40% on RDS costs | Commitment required |
| **Right-sized resource requests** in Kubernetes | Prevents over-provisioning | Requires periodic review via Prometheus metrics |

---

## 7.13 Summary

The Sopo platform's cloud infrastructure and DevOps pipeline transform five independently developed subsystems into a cohesive, production-grade distributed system. Terraform provides declarative, version-controlled infrastructure provisioning across seven purpose-specific modules. GitHub Actions automates the entire build–test–scan–package–deploy lifecycle with per-service granularity. Amazon EKS orchestrates seven Kubernetes workloads with horizontal pod autoscaling and automatic rollback via Helm's atomic deployments. The network architecture enforces defence-in-depth through layered security controls: WAF at the edge, TLS termination at the ALB, private subnets for all compute and data resources, and Security Groups restricting inter-service communication. The observability stack — Prometheus for metrics, Loki for logs, and Grafana for unified visualisation — provides real-time insight into system health, with alerting rules that escalate anomalies through Alertmanager. The multi-tier backup strategy, combining RDS automated snapshots, EBS volume backups, and S3 cross-region replication, ensures that the platform can recover from failures ranging from single pod crashes (< 30 seconds) to complete region outages (< 2 hours). Collectively, this infrastructure embodies the immutability, least-privilege, and observability-by-default principles established at the outset, providing a robust foundation for the Sopo platform's continued operation and evolution.
