# Components Reference

Compact reference map. For data flow and state logic see `architecture.md` and `state.md`.  
Types (Task, Toast, etc.) are defined in `data-model.md`.

---

## App (root)

| | |
|---|---|
| **File** | `src/app/app.ts` |
| **Selector** | `app-root` |
| **Template** | `src/app/app.html` |
| **Imports** | `RouterOutlet`, `Header`, `User`, `Toasts` |
| **Inputs** | None |
| **Outputs** | None |
| **Notes** | Layout only. No service injection. No `ChangeDetectionStrategy` set (uses default). |

---

## Header

| | |
|---|---|
| **File** | `src/components/header/header.ts` |
| **Selector** | `app-header` |
| **Inputs** | None |
| **Outputs** | None |
| **Notes** | Static. Renders logo (`src/assets/task-management-logo.png`), hardcoded title `'ToDo List'`, subtitle. No `OnPush` (convention violation). |

---

## User

| | |
|---|---|
| **File** | `src/components/user/user.ts` |
| **Selector** | `app-user` |
| **Inputs** | None |
| **Outputs** | None |
| **Notes** | **Placeholder.** Template has a broken `<img src="">` and hardcoded `NAME`. No data wiring. No `OnPush`. Do not build on top of this without replacing it first. |

---

## Toasts

| | |
|---|---|
| **File** | `src/components/toasts/toasts.component.ts` |
| **Selector** | `app-toasts` |
| **Injects** | `ToastService` |
| **Inputs** | None |
| **Outputs** | None |
| **Notes** | Uses `OnInit`/`OnDestroy` + manual `Subscription` instead of `async` pipe or signals — inconsistent with the rest of the codebase. No `OnPush`. Dismisses toasts by calling `toastService.removeToast(id)`. |

---

## Spinner

| | |
|---|---|
| **File** | `src/components/spinner/spinner.ts` |
| **Selector** | `app-spinner` |
| **Inputs** | None |
| **Outputs** | None |
| **Notes** | Pure visual. `OnPush`. Shown by `TodoList` when `isLoading()` is true. |

---

## TodoList (smart)

| | |
|---|---|
| **File** | `src/components/todo-list/todo-list.ts` |
| **Selector** | `app-todo-list` |
| **Injects** | `TodoService`, `ToastService`, `Router`, `DestroyRef` |
| **Imports** | `MatButtonToggleModule`, `TodoItem`, `TodoCreateItem`, `Spinner`, `RouterOutlet` |
| **Inputs** | None |
| **Outputs** | None |
| **`OnPush`** | Yes |

**Local signals:**

| Signal | Type | Purpose |
|---|---|---|
| `tasks` | `Signal<Task[]>` | From `todoService.tasks$` via `toSignal()` |
| `isLoading` | `Signal<boolean>` | Direct reference to `todoService.isLoading` |
| `editingTaskId` | `WritableSignal<number \| null>` | Which task is in inline edit mode |
| `activeFilter` | `WritableSignal<TaskStatus \| null>` | Current filter selection |
| `filteredTasks` | `Signal<Task[]>` | `computed()` filtering `tasks()` by `activeFilter()` |

**Methods:**

| Method | Calls | Shows toast |
|---|---|---|
| `addTask(text, desc)` | `todoService.addTask()` | Yes (Russian messages) |
| `deleteTask(task)` | `todoService.deleteTask(task.id)` | Yes |
| `selectTask(task)` | `router.navigate(['/tasks', task.id])` | No |
| `startEditTask(task)` | `editingTaskId.set(task.id)` | No |
| `updateTask(task, newText)` | `todoService.updateTask(task.id, newText)` | Yes |
| `cancelEditTask()` | `editingTaskId.set(null)` | No |

All subscriptions use `takeUntilDestroyed(this.destroyRef)`.

---

## TodoItem (dumb)

| | |
|---|---|
| **File** | `src/components/todo-item/todo-item.ts` |
| **Selector** | `app-todo-item` |
| **Imports** | `Button`, `ShowHintOnHoverDirective`, `FormsModule` |
| **`OnPush`** | Not set (no `changeDetection` declared — violation) |

**Inputs:**

| Input | Type | Required |
|---|---|---|
| `task` | `Task` | Yes (`input.required`) |
| `isEditing` | `boolean` | No (default: `false`) |

**Outputs:**

| Output | Payload | When |
|---|---|---|
| `deleteItem` | `void` | Delete button clicked |
| `selectItem` | `void` | Row clicked (display mode) |
| `startEdit` | `void` | Row double-clicked |
| `editItem` | `string` (trimmed text) | Save button clicked or Enter key |
| `cancelEdit` | `void` | Cancel button clicked or Esc key |

**Local state:** `editText = signal('')` — temporary buffer for the edit input.

**Behaviors:**
- Display mode: single click → `selectItem`, double-click → `enterEditMode()`.
- Edit mode: Enter key → `saveEdit()`, Esc key → `onCancelEdit()`.
- Uses `[ngModel]` binding for the edit input (requires `FormsModule`).
- `appShowHintOnHover` on the row wrapper shows `task().description` as a tooltip.
- `.selected` CSS class applied when `task().isSelected` is true (currently always false — see `known-risks-and-gotchas.md`).

---

## TodoCreateItem (dumb)

| | |
|---|---|
| **File** | `src/components/todo-create-item/todo-create-item.ts` |
| **Selector** | `app-todo-create-item` |
| **Imports** | `ReactiveFormsModule`, `Button` |
| **`OnPush`** | Yes |

**Outputs:**

| Output | Payload |
|---|---|
| `createItem` | `CreateTaskPayload { text: string, description: string }` |

**Form fields:** `name` (required, text input), `description` (optional, textarea).  
`submit()` trims both values, emits, then resets the form.  
Submit button is disabled when `form.invalid`.

---

## TodoItemView (smart)

| | |
|---|---|
| **File** | `src/components/todo-item-view/todo-item-view.ts` |
| **Selector** | `app-todo-item-view` |
| **Injects** | `TodoService`, `ActivatedRoute`, `DestroyRef` |
| **Imports** | None (empty array) |
| **`OnPush`** | Yes |

**Signals:**

| Signal | Type | Source |
|---|---|---|
| `id` | `Signal<string \| null>` | `toSignal(route.paramMap.pipe(map(p => p.get('id'))))` |
| `tasks` | `Signal<Task[]>` | `toSignal(service.tasks$, { initialValue: [] })` |
| `task` | `Signal<Task \| undefined>` | `computed(() => tasks().find(t => t.id === Number(id())))` |

**Method:** `onStatusChanged(event)` — reads checkbox state, calls `service.updateTaskStatus()`.  
No toast on status change. Subscribe has no callbacks.

---

## Button (dumb)

| | |
|---|---|
| **File** | `src/components/button/button.ts` |
| **Selector** | `app-button` |
| **Imports** | `ShowHintOnHoverDirective` |
| **`OnPush`** | Not set (violation) |

**Inputs:**

| Input | Type | Default |
|---|---|---|
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `isDisabled` | `boolean` | `false` |
| `className` | `string` | `''` |
| `hintText` | `string` | `''` |

**Outputs:** `clicked: void`

**Usage pattern:** CSS class is passed via `className` input and applied as `[class]="className()"`. Common values: `button button--add`, `button button--delete`, `button button--save`, `button button--cancel`.

**Note:** Uses `styleUrls` (plural array) while all other components use `styleUrl` (singular).

---

## ShowHintOnHoverDirective

| | |
|---|---|
| **File** | `src/shared/show-hint-on-hover.directive.ts` |
| **Selector** | `[appShowHintOnHover]` |

**Input:** `hintText: string` (default `''`)  
**Effect:** Binds `hintText()` to `title` via `host: { '[title]': 'hintText()' }`. Browser renders tooltip natively — no custom hover logic.

Used on: `TodoItem` row wrapper (`todo-item.html:5`, shows `task().description`); `Button` template.

---

## Where to change component behavior

| Change | File |
|---|---|
| Task row click / double-click behavior | `src/components/todo-item/todo-item.html:9–10` |
| Edit mode keyboard shortcuts (Enter/Esc) | `src/components/todo-item/todo-item.html:30–31` |
| Create-form validation rules | `src/components/todo-create-item/todo-create-item.ts:21–23` |
| Status checkbox logic | `src/components/todo-item-view/todo-item-view.ts:30–38` |
| Filter toggle options (All/InProgress/Completed) | `src/components/todo-list/todo-list.html` (mat-button-toggle values) + `todo-list.ts:42–46` |
| Toast display / dismiss | `src/components/toasts/toasts.component.ts` + `toasts.component.html` |
| Button CSS variant (add a style) | `src/components/button/button.css` + pass new class via `className` input |
