# Data Model

**This file is the canonical type reference.** Other docs reference types by name without repeating definitions.

---

## Task

**Defined in:** `src/components/todo-item/todo-item.ts:8–14`  
**Note:** Unusual location — task types live in a component file, not a shared models folder.

```typescript
export interface Task {
  id: number;
  text: string;
  isSelected: boolean;
  description?: string;
  status: TaskStatus;
}
```

| Field | Persisted to API | Notes |
|---|---|---|
| `id` | Yes | API returns it as a string; `TodoService` casts to `Number`. See [string/number mismatch](#string-number-id-mismatch). |
| `text` | Yes | Task title |
| `isSelected` | **No** | Computed in `TodoService.tasks$` by comparing `t.id === selectedId` |
| `description` | Yes | Optional; may be `undefined` |
| `status` | Yes | `'InProgress'` or `'Completed'` |

---

## TaskStatus

**Defined in:** `src/components/todo-item/todo-item.ts:6`

```typescript
export type TaskStatus = 'InProgress' | 'Completed';
```

---

## ServerTask

**Defined in:** `src/services/task-api.service.ts:6`

```typescript
export type ServerTask = Omit<Task, 'isSelected'>;
```

- Represents what the API sends and receives.
- Does **not** include `isSelected`.
- `id` from the API is actually a `string` at runtime despite TypeScript typing it as `number` here — json-server returns string IDs.

---

## CreateTaskPayload

**Defined in:** `src/components/todo-create-item/todo-create-item.ts:5–8`

```typescript
export interface CreateTaskPayload {
  text: string;
  description: string;
}
```

- Emitted by `TodoCreateItem` component via `createItem` output.
- Received by `TodoList.addTask()`.

---

## Toast

**Defined in:** `src/services/toast.service.ts:4–9`

```typescript
export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration: number;
}
```

- Not persisted anywhere. Lives only in `ToastService.toastsSubject`.
- `id` is an auto-incrementing counter managed by `ToastService.nextId`.

---

## Type transformations across layers

```
API response (json-server)
  └─ { id: "5", text: "...", status: "InProgress", description: "..." }   ← id is string
       ↓ TaskApiService.getAll() returns Observable<ServerTask[]>
       ↓ TodoService: map(tasks => tasks.map(t => ({ ...t, id: Number(t.id) })))
  └─ ServerTask[] with id as number
       ↓ combineLatest with selectedId$
       ↓ map: add isSelected = (t.id === selectedId)
  └─ Task[] — the type used everywhere in the UI
```

---

## String/number ID mismatch

**Confirmed.** Found in `src/services/todo.service.ts:28`:

```typescript
map((tasks) => tasks.map((t) => ({ ...t, id: Number(t.id) })))
```

- json-server returns `id` as a string.
- `TaskApiService` types it as `number` (TypeScript lie at the type level).
- `TodoService` explicitly casts via `Number(t.id)` after fetching.
- **Risk:** If you bypass `TodoService` and use `TaskApiService` directly, you get string IDs that the rest of the app treats as numbers. Comparisons like `t.id === selectedId` will silently fail.

---

## Where to change types

| Change | File | Notes |
|---|---|---|
| Add a field to Task | `src/components/todo-item/todo-item.ts:8` | Also update `db.json`, API payload in `task-api.service.ts`, and any template reading that field |
| Change TaskStatus values | `src/components/todo-item/todo-item.ts:6` | Also update `db.json` seed data, filter logic in `todo-list.ts` |
| Change Toast shape | `src/services/toast.service.ts:4` | Also update `ToastService.showToast()` signature |
| Change create-form payload | `src/components/todo-create-item/todo-create-item.ts:5` | Also update `TodoList.addTask()` call signature |
