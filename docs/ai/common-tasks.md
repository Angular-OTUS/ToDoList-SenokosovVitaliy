# Common Tasks — Playbooks

Concise step-by-step guides for real work in this repo.  
Types live in `data-model.md`. State logic in `state.md`. Route details in `routing.md`.

---

## Add a new field to Task (end-to-end)

Example: add a `priority: 'low' | 'medium' | 'high'` field.

1. **Type definition** — `src/components/todo-item/todo-item.ts:8`  
   Add `priority: 'low' | 'medium' | 'high'` to the `Task` interface.  
   If it has a default, consider a separate type alias.

2. **Seed data** — `db.json`  
   Add `"priority": "medium"` to all existing task objects.

3. **API create payload** — `src/services/task-api.service.ts:19–24`  
   Add `priority` to the POST body. Update `create(text, description, priority)` signature.

4. **TodoService.addTask** — `src/services/todo.service.ts:46`  
   Update the `addTask(text, description)` signature to `addTask(text, description, priority)`.  
   Pass through to `apiService.create()`.

5. **TodoList.addTask** — `src/components/todo-list/todo-list.ts:49`  
   Update call to pass `priority`.

6. **CreateTaskPayload** — `src/components/todo-create-item/todo-create-item.ts:5`  
   Add `priority` to the interface.

7. **TodoCreateItem form** — `src/components/todo-create-item/todo-create-item.ts + .html`  
   Add a form control and UI for `priority`. Update `submit()` to include it in the emitted payload.

8. **Display** — `src/components/todo-item/todo-item.html` or `todo-item-view.html`  
   Add template binding to show the priority value.

9. **Check all import chains** — run `npx nx lint` to catch type errors.

---

## Change task creation behavior

- **Change form fields or validation:** `src/components/todo-create-item/todo-create-item.ts` + `.html`
- **Change what is sent to the API:** `src/services/task-api.service.ts:19`
- **Change default status on create:** `src/services/task-api.service.ts:22` (currently `'InProgress'`)
- **Change success/error toast messages:** `src/components/todo-list/todo-list.ts:51–53`
- **Add optimistic update:** Not currently used; would require changes to `TodoService.serverTasks$` pipeline.

---

## Change task selection behavior

Current behavior: clicking a task row navigates to `/tasks/:id`; `isSelected` is never set.

**To fix `isSelected` highlighting:**
- `src/components/todo-list/todo-list.ts:63`
- Add: `this.todoService.selectTask(task.id);` before or after `router.navigate()`.

**To change what happens on task click:**
- `src/components/todo-item/todo-item.html:9` — click handler emits `selectItem`
- `src/components/todo-list/todo-list.ts:63` — `selectTask()` handles it

**To change the detail view:**
- `src/components/todo-item-view/todo-item-view.ts` + `.html`

---

## Add a new route

1. **Define the component** (or use an existing one).
2. **Add the route** — `src/app/app.routes.ts`  
   ```typescript
   { path: 'my-path', loadComponent: () => import('../components/my/my').then(m => m.MyComponent) }
   ```
3. **Add a `<router-outlet>`** in the parent component's template if it is a child route.
4. **Link to it** via `router.navigate(['/my-path'])` or `[routerLink]` in a template.
5. No module registration needed — standalone + `provideRouter` handles it.

---

## Add a new service/API call

1. **Add method to `TaskApiService`** — `src/services/task-api.service.ts`  
   Use `this.http.get/post/patch/delete<ReturnType>(url, body)`.

2. **Add method to `TodoService`** — `src/services/todo.service.ts`  
   Pattern:
   ```typescript
   myAction(id: number): Observable<ServerTask> {
     return this.apiService.myCall(id).pipe(tap(() => this.refresh$.next()));
   }
   ```
   Include `tap(() => this.refresh$.next())` if the action changes data.

3. **Call from component** — subscribe with `takeUntilDestroyed(this.destroyRef)`.  
   Show toast in `next`/`error` callbacks.

4. **Add to `db.json`** if the new endpoint needs seed data.

---

## Add a unit test

Unit tests belong in `src/` alongside the file being tested (e.g. `todo.service.spec.ts` next to `todo.service.ts`).

**For a service (`TodoService`):**
```typescript
// src/services/todo.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TodoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should fetch tasks', () => {
    service.tasks$.subscribe(tasks => expect(tasks.length).toBe(1));
    http.expectOne('http://localhost:3000/tasks').flush([
      { id: '1', text: 'Test', status: 'InProgress', description: '' }
    ]);
  });
});
```

**For a component (`TodoItem`):**
```typescript
// src/components/todo-item/todo-item.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoItem } from './todo-item';

describe('TodoItem', () => {
  let fixture: ComponentFixture<TodoItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItem],
    }).compileComponents();
    fixture = TestBed.createComponent(TodoItem);
    fixture.componentRef.setInput('task', {
      id: 1, text: 'Test', isSelected: false, status: 'InProgress'
    });
    fixture.detectChanges();
  });

  it('should emit deleteItem', () => {
    let emitted = false;
    fixture.componentInstance.deleteItem.subscribe(() => emitted = true);
    fixture.nativeElement.querySelector('.button--delete button').click();
    expect(emitted).toBe(true);
  });
});
```

Run with: `npm test` or `npx nx test`.

---

## Add an E2E test

Add `.spec.ts` files in `e2e/src/`.

**Example:**
```typescript
// e2e/src/task-creation.spec.ts
import { test, expect } from '@playwright/test';

test('can create a task', async ({ page }) => {
  await page.goto('/tasks');
  await page.fill('input[placeholder="Task name"]', 'My new task');
  await page.click('.button--add');
  await expect(page.locator('text=My new task')).toBeVisible();
});
```

Requires both dev server (`:4200`) and API (`:3000`) running, OR rely on Playwright's `webServer` config (`e2e/playwright.config.ts`) which only starts the Angular dev server automatically. The API must be started manually for E2E tests.

Run with: `npx nx e2e`.

---

## Debug local startup

1. Start API: `npm run api` — watch for `json-server db.json --port 3000`. Verify at `http://localhost:3000/tasks`.
2. Start app: `npm start` — watch for `http://localhost:4200`.
3. If the task list shows empty: API is not running (`catchError` returns `[]`) or `db.json` is malformed.
4. If you get HTTP 404 on tasks: check `src/services/task-api.service.ts:14` for the hardcoded URL.
5. If you get a TypeScript error about `Task` types: the interface is in `src/components/todo-item/todo-item.ts`, not a shared models file — check import paths.
6. If tests fail to find components: check that `TestBed.configureTestingModule` imports the standalone component directly.

---

## Generate a new component

See `development-workflow.md#component-generator`. Remember: generator does not add `OnPush` — add it manually.
