# API

The app uses **json-server** as a mock REST backend.

---

## Setup

- **Data file:** `db.json` (repo root)
- **Start command:** `npm run api` → `json-server db.json --port 3000`
- **Base URL (hardcoded):** `http://localhost:3000/tasks` — string literal at `src/services/task-api.service.ts:14`, no env var

---

## HTTP client

All HTTP calls are in `src/services/task-api.service.ts`.  
`HttpClient` is provided in `src/app/app.config.ts:14` via `provideHttpClient()`.  
Components do NOT call `TaskApiService` directly — only `TodoService` does.

---

## Endpoints

| Method | URL | Source line | Description |
|---|---|---|---|
| `GET` | `/tasks` | `task-api.service.ts:15` | Fetch all tasks |
| `POST` | `/tasks` | `task-api.service.ts:19` | Create a task |
| `PATCH` | `/tasks/:id` | `task-api.service.ts:27` | Update task fields |
| `DELETE` | `/tasks/:id` | `task-api.service.ts:31` | Delete a task |

---

## Request/response shapes

### GET /tasks

Response: `ServerTask[]`

```json
[
  { "id": "1", "text": "Learn Angular", "status": "Completed", "description": "Study the docs." }
]
```

**Note:** json-server returns `id` as a **string**, not a number.  
`TodoService` fixes this with `Number(t.id)` — see `todo.service.ts:28`.

---

### POST /tasks

Request body (from `task-api.service.ts:20–23`):
```json
{ "text": "Task name", "description": "Optional text", "status": "InProgress" }
```

- `status` is always hardcoded to `"InProgress"` on creation.
- `id` is assigned by json-server (auto-increment).

Response: the created `ServerTask` with server-assigned `id`.

---

### PATCH /tasks/:id

Request body: `Partial<ServerTask>` — any subset of task fields.

Used for two operations:
- `updateTask(id, text)` → sends `{ text: value }` (`todo.service.ts:58`)
- `updateTaskStatus(id, status)` → sends `{ status }` (`todo.service.ts:67`)

Response: the updated `ServerTask`.

---

### DELETE /tasks/:id

No request body. Response: void (`task-api.service.ts:32`).

---

## Seed data

`db.json`: 12 tasks, IDs 1–12, mix of `"InProgress"`/`"Completed"`, all have `text`/`status`/`description`. Restart `npm run api` after editing.

---

## Server-owned vs client-owned fields

| Field | Owner | Notes |
|---|---|---|
| `id` | Server | Auto-assigned by json-server |
| `text` | Client on create, both on update | Validated (non-empty) before sending |
| `description` | Client | Optional |
| `status` | Client | Hardcoded `'InProgress'` on create; updatable via PATCH |
| `isSelected` | Client only | Never sent to server; derived in `TodoService` |

---

## Where to change API behavior

| Change | File | Notes |
|---|---|---|
| Change API base URL | `src/services/task-api.service.ts:14` | Currently a string literal |
| Add a new endpoint | `src/services/task-api.service.ts` | Add method, then expose via `TodoService` |
| Change create payload | `src/services/task-api.service.ts:19–24` | Also update `TodoService.addTask()` signature |
| Change default task status on create | `src/services/task-api.service.ts:22` | Currently hardcoded `'InProgress'` |
| Change seed data | `db.json` | Restart `npm run api` after editing |
| Add query params / filtering at API level | `src/services/task-api.service.ts:15` | Currently fetches all; filtering is done client-side |
