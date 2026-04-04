# Known Risks and Gotchas

Read this before making any change. Items are ordered by likelihood of causing a silent failure.

---

## 1. `refresh$.next()` must follow every mutation — confirmed

**Source:** `src/services/todo.service.ts:51,59,63,69`

Every mutation pipes `tap(() => this.refresh$.next())`. Omitting it silently leaves the UI stale — no error is thrown. See canonical pattern in `state.md#refresh-contract--invariant`.

---

## 2. `isSelected` is always false — confirmed bug

**Source:** `src/components/todo-list/todo-list.ts:63–66` + `src/services/todo.service.ts:72`

`TodoList.selectTask()` only calls `router.navigate()` — it never calls `todoService.selectTask()`. So `selectedId$` stays `null`, and `isSelected` is `false` for every task. The `.selected` CSS class on `TodoItem` is never applied.

**Fix:** Add `this.todoService.selectTask(task.id)` to `TodoList.selectTask()` (`todo-list.ts:63`).

---

## 3. String/number ID mismatch — confirmed

**Source:** `src/services/todo.service.ts:28` (cast), `src/services/task-api.service.ts:6` (type lie)

json-server returns `id` as a string; `TaskApiService` types it as `number`. `TodoService` fixes it with `Number(t.id)`. Bypassing `TodoService` for data access gives you string IDs; equality checks silently fail. See full diagram in `data-model.md#type-transformations-across-layers`.

---

## 4. CLAUDE.md is stale — confirmed (partially fixed)

CLAUDE.md was updated to fix the most critical claims. The following were corrected: routing, backend, branch, data model, component tree, state signals. See `index.md#claudemd--known-stale-facts` for the full list.

Remaining CLAUDE.md inaccuracy: lists `provideAnimations` as a provider in `app.config.ts`, but the file uses `provideZoneChangeDetection` — no `provideAnimations` present.

---

## 5. `OnPush` missing from several components — confirmed

Required by convention (`CLAUDE.md`). Currently missing from:

| Component | File |
|---|---|
| `App` | `src/app/app.ts` |
| `Header` | `src/components/header/header.ts` |
| `User` | `src/components/user/user.ts` |
| `Toasts` | `src/components/toasts/toasts.component.ts` |
| `TodoItem` | `src/components/todo-item/todo-item.ts` |
| `Button` | `src/components/button/button.ts` |

---

## 6. `Toasts` uses manual subscription — confirmed

**Source:** `src/components/toasts/toasts.component.ts:17–30`

Uses `OnInit`/`OnDestroy` + manual `Subscription` instead of `toSignal()` or `takeUntilDestroyed()`. Inconsistent with codebase style; leak-prone in tests if `ngOnDestroy` is skipped.

---

## 7. `User` component is a non-functional placeholder — confirmed

**Source:** `src/components/user/user.ts`, `src/components/user/user.html`

No logic, no service injection, broken `<img src="">`, hardcoded `NAME`. Do not extend without replacing.

---

## 8. SSR packages installed but not active — confirmed

**Source:** `package.json` (`@angular/ssr`, `express`, `@angular/platform-server`), `project.json:27` (`outputMode: "static"`), no `server.ts` in repo.

Dead weight. Do not write SSR-specific code without adding `server.ts` and changing `outputMode`.

---

## 9. Status update has no error handling — confirmed

**Source:** `src/components/todo-item-view/todo-item-view.ts:37`

`onStatusChanged()` calls `.subscribe()` with no `next`/`error` callbacks. API failure is silent — no toast, no UI feedback.

---

## 10. Toast messages are in Russian — confirmed

**Source:** `src/components/todo-list/todo-list.ts:51,53,57,59,74,76`

Strings like `'Задача добавлена'` are in Russian while all other UI text is English.

---

## 11. Task types defined in a component file — confirmed

**Source:** `src/components/todo-item/todo-item.ts:6–14`

`Task` and `TaskStatus` are exported from a component file, not a shared models dir. Importers: `todo.service.ts:10`, `task-api.service.ts:4`, `todo-list.ts:10`, `todo-item-view.ts:11`. Moving or renaming `todo-item.ts` breaks all four.

---

## 12. `Button` uses `styleUrls` (array) — minor

**Source:** `src/components/button/button.ts:7`

All other components use `styleUrl` (singular, Angular 17+). Minor inconsistency; no current impact.
