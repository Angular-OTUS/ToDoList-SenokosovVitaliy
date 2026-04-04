# Routing

**Source file:** `src/app/app.routes.ts`

---

## Route table

| Path | Component | Loading | Role |
|---|---|---|---|
| `` (empty) | — | — | Redirects to `/tasks` (`pathMatch: 'full'`) |
| `tasks` | `TodoList` | Lazy (`loadComponent`) | Main list view |
| `tasks/:id` | `TodoItemView` | Lazy (`loadComponent`) | Task detail (child of `tasks`) |
| `**` | — | — | Catch-all redirect to `/tasks` |

**Source:** `src/app/app.routes.ts:3–9`

---

## Route configuration (exact)

```typescript
export const appRoutes: Route[] = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    loadComponent: () =>
      import('../components/todo-list/todo-list').then(m => m.TodoList),
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('../components/todo-item-view/todo-item-view').then(m => m.TodoItemView),
      },
    ],
  },
  { path: '**', redirectTo: 'tasks' },
];
```

---

## Important structural detail: child route

`tasks/:id` is a **child route** of `tasks`.  
`TodoItemView` renders inside the `<router-outlet>` that is inside `TodoList`'s template (`src/components/todo-list/todo-list.html`).  
There is also a `<router-outlet>` in `src/app/app.html` — that one renders `TodoList` itself.

The two `<router-outlet>` instances are at different levels:
- `app.html` → renders `TodoList` (at `/tasks`)
- `todo-list.html` → renders `TodoItemView` (at `/tasks/:id`)

---

## Navigation

Only one programmatic navigation call exists — `TodoList.selectTask()` (`src/components/todo-list/todo-list.ts:65`):

```typescript
selectTask(task: Task) {
  this.editingTaskId.set(null);
  this.router.navigate(['/tasks', task.id]);
}
```

`Router` is provided via `provideRouter(appRoutes)` in `src/app/app.config.ts:11`.

---

## How TodoItemView reads the route param

**Source:** `src/components/todo-item-view/todo-item-view.ts:26–28`

```typescript
id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id'))));
tasks = toSignal(this.service.tasks$, { initialValue: [] as Task[] });
task = computed(() => this.tasks().find((t) => t.id === Number(this.id())));
```

- `id` is a `Signal<string | null>` derived from `ActivatedRoute.paramMap`.
- `task` is a computed signal that finds the matching task by `Number(id())`.
- If `id()` is `null` or no task matches, `task()` is `undefined` — template guards with `@if (task())` (`src/components/todo-item-view/todo-item-view.html`).

---

## Direct URL navigation caveat

Navigating to `/tasks/5` directly works — `TodoItemView` resolves the task by route param, not by `isSelected`. No crash. The task list highlight will be absent because `selectedId$` is never set. This is the same root cause as the `isSelected` bug in `state.md#selectedid-and-isselected`.

---

## Where to change routing

| Change | File | Notes |
|---|---|---|
| Add a new top-level route | `src/app/app.routes.ts` | Add entry to `appRoutes` array |
| Add a child route under `tasks` | `src/app/app.routes.ts:5` | Add to `children` array of the `tasks` route |
| Change the redirect target | `src/app/app.routes.ts:2,8` | Two redirect entries |
| Add route guards | `src/app/app.routes.ts` | Add `canActivate` to the route object |
| Add router providers (e.g. `withComponentInputBinding`) | `src/app/app.config.ts:11` | Modify `provideRouter(appRoutes, ...)` |
| Add a `<router-outlet>` for a new child slot | The parent component's template | Must match route nesting |
