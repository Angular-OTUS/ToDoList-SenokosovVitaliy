# State Management

All task state lives in `TodoService` (`src/services/todo.service.ts`).  
Toast state lives in `ToastService` (`src/services/toast.service.ts`).  
No NgRx. No localStorage. State resets on full page reload.

---

## TodoService — full pipeline

**File:** `src/services/todo.service.ts`

### Private state

```typescript
private refresh$ = new BehaviorSubject<void>(undefined);   // line 19
private selectedId$ = new BehaviorSubject<number | null>(null); // line 20
readonly isLoading = signal(true);                          // line 22
```

### serverTasks$ — fetch pipeline

```typescript
private serverTasks$ = this.refresh$.pipe(
  tap(() => this.isLoading.set(true)),        // set loading before fetch
  switchMap(() =>
    this.apiService.getAll().pipe(
      map((tasks) => tasks.map((t) => ({ ...t, id: Number(t.id) }))),  // cast IDs
      catchError(() => of([] as ServerTask[])),  // swallow errors, return empty
    ),
  ),
  tap(() => this.isLoading.set(false)),        // clear loading after fetch
  shareReplay({ bufferSize: 1, refCount: true }),
);
```

- `switchMap` cancels any in-flight request when `refresh$` fires.
- On error: returns empty array, sets `isLoading` to false — **no toast is shown from here**.
- `shareReplay` caches the last result; new subscribers get it immediately.

### tasks$ — public observable

```typescript
tasks$: Observable<Task[]> = combineLatest([
  this.serverTasks$,
  this.selectedId$,
]).pipe(
  map(([tasks, selectedId]) =>
    tasks.map((t) => ({ ...t, isSelected: t.id === selectedId })),
  ),
  shareReplay({ bufferSize: 1, refCount: true }),
);
```

- Combines the fetched tasks with the current selected ID.
- Adds `isSelected` field on every emission.
- Emits whenever either `serverTasks$` OR `selectedId$` changes.

### Mutation methods

Every method follows the same pattern: call API, then trigger `refresh$.next()` in `tap()`.

| Method | API call | Trigger refresh |
|---|---|---|
| `addTask(text, description)` | `POST /tasks` | Yes, in `tap()` |
| `updateTask(id, text)` | `PATCH /tasks/:id` | Yes, in `tap()` |
| `deleteTask(id)` | `DELETE /tasks/:id` | Yes, in `tap()` |
| `updateTaskStatus(id, status)` | `PATCH /tasks/:id` | Yes, in `tap()` |
| `selectTask(taskId)` | None | N/A — updates `selectedId$` |

**Source:** `src/services/todo.service.ts:46–74`

---

## refresh$ contract — invariant

> Every method that modifies the server MUST call `this.refresh$.next()` after the API call succeeds.

If `refresh$.next()` is omitted, the UI will not update. There is no other mechanism to invalidate the cache.

The canonical pattern (e.g. `deleteTask`, line 62):
```typescript
return this.apiService.delete(id).pipe(tap(() => this.refresh$.next()));
```

---

## isLoading signal

- Initialized to `true` at service construction (`src/services/todo.service.ts:22`).
- Set to `true` in `serverTasks$` before each fetch.
- Set to `false` after fetch completes (success or error).
- Read directly by `TodoList`: `readonly isLoading = this.todoService.isLoading;` (line 39 of `todo-list.ts`).
- Controls whether `<app-spinner>` or the task list is shown.

---

## selectedId$ and isSelected

- `selectedId$` starts as `null` — no task selected on load.
- Only updated by `TodoService.selectTask(taskId)`.
- **Bug:** `TodoList.selectTask()` never calls `todoService.selectTask()`, so `selectedId$` stays `null` forever. `isSelected` is always `false`. See `known-risks-and-gotchas.md#2` for fix.
- `TodoItemView` does not call `selectTask()` either — it resolves the task from `tasks$` by route param, independently of `isSelected`.

---

## Signal/RxJS bridge (toSignal)

`TodoList` (`todo-list.ts:37`) and `TodoItemView` (`todo-item-view.ts:27`) both call `toSignal(this.todoService.tasks$, { initialValue: [] })`. Both subscribe to the same `tasks$`; `shareReplay` ensures a single HTTP request is in flight. `initialValue: []` prevents `undefined` before first emission.

---

## ToastService

**File:** `src/services/toast.service.ts`

- `showToast(message, type, duration)`: appends a `Toast` to `toastsSubject`, auto-removes via `setTimeout(duration)`.
- `removeToast(id)`: filters by `id`.
- Messages at call sites are in **Russian** — see `src/components/todo-list/todo-list.ts:51–78`.

---

## Where to change state behavior

| Change | File + location |
|---|---|
| Add a new mutation (e.g. `archiveTask`) | `src/services/todo.service.ts` — add method, call `apiService`, pipe `tap(() => refresh$.next())` |
| Fix isSelected highlighting | `src/components/todo-list/todo-list.ts:63` — add `this.todoService.selectTask(task.id)` call |
| Change loading indicator logic | `src/services/todo.service.ts:25,32` — tap operators in `serverTasks$` |
| Change error behavior on fetch | `src/services/todo.service.ts:29` — `catchError` |
| Change toast messages | `src/components/todo-list/todo-list.ts:51–78` |
| Change toast duration/type | `ToastService.showToast()` call sites or its default params at `toast.service.ts:20` |
