# Testing

---

## Infrastructure

### Unit tests (Jest)

| Item | Value | Source |
|---|---|---|
| Runner | Jest 29.7.0 via `@nx/jest:jest` | `project.json:79` |
| Preset | `jest-preset-angular` 14.0.4 | `jest.config.ts:3` |
| Config | `jest.config.ts` | repo root |
| Setup file | `src/test-setup.ts` | `jest.config.ts:4` |
| Coverage output | `coverage/todo-list/` | `jest.config.ts:5` |
| TypeScript config | `tsconfig.spec.json` | `project.json:82` |

`src/test-setup.ts` configures Zone.js with `errorOnUnknownElements: true` and `errorOnUnknownProperties: true` — unknown HTML elements or properties will cause test failures.

### E2E tests (Playwright)

| Item | Value | Source |
|---|---|---|
| Runner | Playwright 1.36.0 | `package.json` |
| Config | `e2e/playwright.config.ts` | `e2e/` directory |
| Base URL | `http://localhost:4200` (or `$BASE_URL`) | `e2e/playwright.config.ts` |
| Browsers | Chromium, Firefox, WebKit | `e2e/playwright.config.ts` |
| Auto web server | Yes — starts `npx nx run todo-list:serve` | `e2e/playwright.config.ts` |

---

## What exists today

### Unit tests

**Zero spec files.** No `*.spec.ts` or `*.test.ts` files exist anywhere in `src/`.

### E2E tests

One test in `e2e/src/example.spec.ts`:

```typescript
test('has title', async ({ page }) => {
  await page.goto('/');
  expect(await page.locator('h1').innerText()).toContain('ToDo List');
});
```

Checks that H1 contains `'ToDo List'`. Does not test any task functionality.

---

## How to run

```bash
# Unit tests
npm test                   # nx test (watch mode off by default in CI)
npx nx test --watch        # watch mode

# E2E tests (app auto-started; API must be started manually)
npm run api &              # start json-server first
npx nx e2e

# All checks (lint + test + build + e2e)
npx nx run-many -t lint test build e2e
```

---

## Where to place new tests

| Test type | Location | Naming |
|---|---|---|
| Service unit test | `src/services/` | `<service-name>.service.spec.ts` |
| Component unit test | `src/components/<name>/` | `<component-name>.spec.ts` |
| Directive unit test | `src/shared/` | `<directive-name>.directive.spec.ts` |
| E2E test | `e2e/src/` | `<feature>.spec.ts` |

Jest will find anything matching `**/*.spec.ts` or `**/*.test.ts` under `src/` — `jest.config.ts:7–10`.

---

## Coverage gaps

All of the following have zero test coverage:

- `TodoService` — state pipeline, `refresh$`, `selectTask`, all mutation methods
- `TaskApiService` — HTTP methods
- `ToastService` — `showToast`, `removeToast`, auto-dismiss timer
- `TodoList` — filter logic, `addTask`, `deleteTask`, `selectTask`, `updateTask`
- `TodoItem` — display/edit modes, keyboard events (Enter/Esc), output emissions
- `TodoCreateItem` — form validation, `submit()`, output emission
- `TodoItemView` — route param reading, `task` computed signal, `onStatusChanged`
- `ShowHintOnHoverDirective` — host binding

---

## Where to change test configuration

| Change | File |
|---|---|
| Add/change Jest options | `jest.config.ts` |
| Change Zone.js test setup | `src/test-setup.ts` |
| Change E2E base URL or browser list | `e2e/playwright.config.ts` |
| Change Nx test target options | `project.json:79–84` |

---

## Testing notes specific to this codebase

- `Task` and `TaskStatus` are imported from `src/components/todo-item/todo-item.ts` — import from there in tests.
- `TodoService` depends on `TaskApiService` which uses `HttpClient`. Use `provideHttpClientTesting()` in `TestBed`.
- Components use `ChangeDetectionStrategy.OnPush` — call `fixture.detectChanges()` manually after input changes.
- `TodoItemView` reads from `ActivatedRoute.paramMap` — stub with `{ paramMap: of(convertToParamMap({ id: '1' })) }`.
- `toSignal()` requires an injection context. Use `TestBed.runInInjectionContext()` if testing outside `TestBed`.
- `Toasts` component uses `OnInit`/`OnDestroy` — standard Angular testing lifecycle applies.
