# OpenAPI & REST Endpoints Specification

Base URL: `/api`

---

## Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Create user account with email & password | No |
| `POST` | `/auth/login` | Authenticate and obtain JWT Bearer token | No |
| `POST` | `/auth/demo-login` | Instant zero-friction demo access token | No |
| `GET` | `/auth/me` | Fetch active user profile | Yes |

---

## Research Workflow Endpoints (`/api/research`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/research/start` | Launch autonomous multi-agent research workflow | Optional |
| `GET` | `/research/{id}` | Fetch current project state, logs, and executions | No |
| `GET` | `/research/stream/{id}` | Real-time Server-Sent Events (SSE) live stream | No |
| `POST` | `/research/{id}/approve` | Human approval action (`approve`, `reject`, `rewrite`) | Optional |
| `GET` | `/research/graph/definition` | Fetch Mermaid state graph topology definition | No |

---

## Reports & Document Exports (`/api/reports`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/reports` | List completed reports with search & pagination | No |
| `GET` | `/reports/{id}` | Fetch full report details and citations | No |
| `DELETE`| `/reports/{id}` | Delete report record | Optional |
| `POST` | `/reports/{id}/share` | Generate public share token & URL | Optional |
| `GET` | `/reports/public/{token}` | Public read-only view of shared report | No |
| `GET` | `/reports/{id}/export/{format}` | Export as `pdf`, `docx`, `md`, `html`, `json`, `csv` | No |

---

## Sources, Telemetry & Settings (`/api/sources`, `/api/analytics`, `/api/settings`, `/api/admin`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/sources` | List verified sources collected across runs | No |
| `GET` | `/sources/domains/credibility` | Domain reputation directory & trust ratings | No |
| `POST` | `/files/upload` | Upload PDF/DOCX/TXT and index into ChromaDB | Optional |
| `GET` | `/analytics` | System-wide tokens, latency, cost savings metrics | No |
| `GET` | `/settings` | Active LLM providers & inference parameters | No |
| `POST` | `/settings` | Update LLM provider, temperature, and API keys | No |
| `GET` | `/admin/health` | Diagnostic health check of Postgres, Redis, Workers | No |
