# docs/ai — AI Agent Knowledge Base

Entry point for any AI agent working in this repository.  
Read this file first; it tells you what to read next and in what order.

---

## What this folder is

Grounded documentation for AI agents. Every claim references a specific file.  
This is NOT a copy of `CLAUDE.md` — it extends and corrects it where needed.

---

## Quick repo facts

| Item | Value | Source |
|---|---|---|
| App name | EasyTrack (ToDo List) | `src/index.html:5` |
| Framework | Angular 20.2.4 standalone | `package.json` |
| Build system | Nx 21.4.1 | `nx.json` |
| UI | Angular Material 20.2.2 | `package.json` |
| State | Signals + RxJS (no NgRx) | `src/services/todo.service.ts` |
| Dev app port | 4200 | `e2e/playwright.config.ts` |
| API port | 3000 (json-server) | `src/services/task-api.service.ts:14` |
| API data file | `db.json` | root of repo |
| Unit tests | Jest 29.7.0, **0 spec files exist** | `jest.config.ts`, `src/` (no `*.spec.ts`) |
| E2E tests | Playwright 1.36.0, 1 smoke test | `e2e/src/example.spec.ts` |
| SSR | Packages installed, **not configured** | `project.json` (`outputMode: "static"`, no `server.ts`) |

---

## Start commands

```bash
npm start     # nx serve → localhost:4200
npm run api   # json-server db.json --port 3000  (required — see development-workflow.md)
```

---

## Recommended reading order

1. **`index.md`** (this file) — orientation
2. **`data-model.md`** — all types; nothing else makes sense without them
3. **`state.md`** — TodoService internals; critical before touching mutations
4. **`architecture.md`** — layers, data flow, dependency direction
5. **`api.md`** — HTTP contract with json-server
6. **`routing.md`** — routes, lazy loading, navigation caveats
7. **`components.md`** — reference map for component inputs/outputs
8. **`known-risks-and-gotchas.md`** — read before making any change
9. **`common-tasks.md`** — playbooks for typical work
10. **`testing.md`** — when adding or running tests

---

## Document summaries

| File | What it covers |
|---|---|
| `data-model.md` | `Task`, `ServerTask`, `Toast`, `TaskStatus`, `CreateTaskPayload` — definitions, locations, field persistence |
| `state.md` | `TodoService` RxJS pipeline, `refresh$` contract, `selectedId$`, signal/RxJS bridge |
| `architecture.md` | Service/component layers, data-flow narratives, dependency direction |
| `api.md` | json-server setup, endpoints, payloads, which fields are server-owned |
| `routing.md` | Route table, lazy loading, child route, navigation calls, direct-URL caveats |
| `components.md` | Every component/directive: selector, file, inputs, outputs, notes |
| `known-risks-and-gotchas.md` | Bugs, invariants, stale docs, convention violations |
| `common-tasks.md` | Step-by-step playbooks for real work |
| `testing.md` | Jest + Playwright infrastructure, what exists, how to add tests |
| `development-workflow.md` | Dev commands, component generator, CI pipeline |

---

## CLAUDE.md — known stale facts

CLAUDE.md was updated to fix: routing (now active), backend (json-server), branch (homework-7), data model (`status` field), component tree, state signals. Remaining: lists `provideAnimations` as a provider but `src/app/app.config.ts` does not contain it.

For full list see `known-risks-and-gotchas.md#4`.
