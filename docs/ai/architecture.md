# Architecture

---

## Layer structure

```
┌─────────────────────────────────────────────────────┐
│  Presentation (Components)                          │
│  src/components/*  +  src/app/app.ts                │
├─────────────────────────────────────────────────────┤
│  State / Orchestration (Services)                   │
│  src/services/todo.service.ts                       │
│  src/services/toast.service.ts                      │
├─────────────────────────────────────────────────────┤
│  HTTP / API (Service)                               │
│  src/services/task-api.service.ts                   │
├─────────────────────────────────────────────────────┤
│  Mock Backend (json-server)                         │
│  db.json  →  http://localhost:3000/tasks            │
└─────────────────────────────────────────────────────┘
```

Dependency direction: components depend on services; `TodoService` depends on `TaskApiService`; `TaskApiService` depends on Angular `HttpClient`. Components do NOT call `TaskApiService` directly.

---

## Component tree

```
App  (src/app/app.ts)
├── Header        (src/components/header/)        — static
├── User          (src/components/user/)           — placeholder, no logic
├── Toasts        (src/components/toasts/)         — toast overlay
└── RouterOutlet
    └── TodoList  (src/components/todo-list/)      ← smart
        ├── Spinner     (src/components/spinner/)  — shows when isLoading()
        ├── mat-button-toggle-group                — filter: All/InProgress/Completed
        ├── @for filteredTasks
        │   └── TodoItem (src/components/todo-item/)  — dumb
        │       ├── (display mode) app-button delete
        │       └── (edit mode) input + app-button save/cancel
        ├── TodoCreateItem (src/components/todo-create-item/)  — dumb form
        └── RouterOutlet (child)
            └── TodoItemView (src/components/todo-item-view/)  ← smart
```

**Source:** `src/app/app.html`, `src/components/todo-list/todo-list.html`

### Smart vs dumb

| Component | Classification | Injects services |
|---|---|---|
| TodoList | Smart | `TodoService`, `ToastService`, `Router` |
| TodoItemView | Smart | `TodoService`, `ActivatedRoute` |
| TodoItem | Dumb | None |
| TodoCreateItem | Dumb | None |
| Button | Dumb | None |
| Header | Dumb | None |
| Spinner | Dumb | None |
| Toasts | Mixed | `ToastService` (only notification sink) |
| User | Placeholder | None |

---

## Data-flow narrative: creating a task

1. User fills the form in `TodoCreateItem` (`src/components/todo-create-item/todo-create-item.ts:26`).
2. `TodoCreateItem.submit()` validates, emits `createItem: CreateTaskPayload`.
3. `TodoList` receives it via `(createItem)="addTask($event.text, $event.description)"` (`todo-list.html`).
4. `TodoList.addTask()` calls `todoService.addTask(text, description)` and subscribes (`todo-list.ts:50`).
5. `TodoService.addTask()` calls `taskApiService.create(text, description)` → `POST /tasks` (`todo.service.ts:49`).
6. On success: `tap()` calls `refresh$.next()` — this re-triggers `serverTasks$`.
7. `serverTasks$` re-fetches `GET /tasks`, sets `isLoading` true then false.
8. `tasks$` emits new array; `TodoList.tasks` signal updates via `toSignal()`.
9. `@for filteredTasks()` re-renders with the new task.
10. `TodoList.addTask()` subscriber fires `toastService.showToast('Задача добавлена', 'success')`.

---

## Data-flow narrative: selecting a task

1. User clicks a `TodoItem` row → `selectItem` output emits (`todo-item.html:9`).
2. `TodoList` receives it → `selectTask(task)` → `router.navigate(['/tasks', task.id])` (`todo-list.ts:65`).
3. Route `/tasks/:id` activates `TodoItemView` inside `TodoList`'s child `<router-outlet>`.
4. `TodoItemView.id` signal reads the param (`todo-item-view.ts:26`).
5. `TodoItemView.task` computed: `tasks().find(t => t.id === Number(id()))` (`todo-item-view.ts:28`).
6. Template renders description + status checkbox.
7. `todoService.selectTask()` is NOT called → see `known-risks-and-gotchas.md#2`.

---

## Data-flow narrative: updating task status

1. User checks/unchecks the checkbox in `TodoItemView` (`todo-item-view.html`).
2. `onStatusChanged(event)` fires (`todo-item-view.ts:30`).
3. Reads `(event.target as HTMLInputElement).checked`.
4. Calls `service.updateTaskStatus(Number(id()), isChecked ? 'Completed' : 'InProgress')`.
5. `TodoService.updateTaskStatus()` calls `taskApiService.update(id, { status })` → `PATCH /tasks/:id`.
6. On success: `tap()` fires `refresh$.next()`.
7. Both `TodoList.tasks` and `TodoItemView.tasks` signals update (same `tasks$` observable via `shareReplay`).
8. **No toast is shown on status update** — `subscribe()` has no `next`/`error` callbacks (`todo-item-view.ts:37`).

---

## Where to change X

| Change | Where |
|---|---|
| Add a new component | `src/components/<name>/` — scaffold with `.\component.ps1 <Name>`; add `OnPush` manually |
| Add a new service | `src/services/<name>.service.ts` — use `providedIn: 'root'` |
| Add a new route | `src/app/app.routes.ts` — see `routing.md` |
| Add/change a task mutation | `src/services/task-api.service.ts` + `src/services/todo.service.ts` — see `state.md` |
| Change app-level providers | `src/app/app.config.ts` |
| Change global styles/theme | `src/styles.scss` |
| Change app layout (header/user/router placement) | `src/app/app.html` + `src/app/app.scss` |
| Change task data shape | `src/components/todo-item/todo-item.ts:8` + `db.json` — see `data-model.md#where-to-change-types` |
