# Project Metadata — OtusAngular (EasyTrack / ToDo List)

## Quick Reference

| Key              | Value                                    |
|------------------|------------------------------------------|
| Framework        | Angular 20.2.4 (Standalone Components)   |
| Build System     | Nx 21.4.1 + @angular/build:application   |
| UI Library       | Angular Material 20.2.2                  |
| Language         | TypeScript 5.8.2 (strict mode)           |
| Styling          | SCSS (global) + CSS (components)         |
| Testing          | Jest 29.7.0 (unit) + Playwright 1.36.0 (e2e) |
| Linting          | ESLint 9.8 (flat config) + Prettier      |
| State Management | Signals (no NgRx)                        |
| Routing          | Active — /tasks and /tasks/:id (lazy-loaded) |
| SSR              | Packages installed; not active (outputMode: static, no server.ts) |
| Git Branch       | homework-7 (main: main)                  |

## Commands

```bash
npm start          # nx serve — dev server on localhost:4200
npm run build      # nx build — production build → dist/todo-list
npm test           # nx test  — unit tests (Jest)
npx nx lint        # ESLint
npx nx e2e         # E2E tests (Playwright)
npx nx run-many -t lint test build e2e   # all checks
```

CI installs with: `npm ci --legacy-peer-deps`

## Directory Structure

```
src/
├── app/
│   ├── app.ts / app.html / app.scss    # Root component (selector: app-root)
│   ├── app.config.ts                   # provideRouter, provideAnimations, provideHttpClient, provideZone
│   └── app.routes.ts                   # appRoutes — /tasks (TodoList) + /tasks/:id (TodoItemView child)
├── components/
│   ├── button/        # Reusable button (selector: app-button)
│   ├── header/        # Title display (selector: app-header)
│   ├── spinner/       # Loading spinner (selector: app-spinner)
│   ├── todo-item/     # Single task row (selector: app-todo-item) — also defines Task, TaskStatus types
│   ├── todo-item-view/ # Task detail / status update (selector: app-todo-item-view)
│   ├── todo-create-item/ # Create-task form (selector: app-todo-create-item)
│   ├── todo-list/     # Main task manager (selector: app-todo-list)
│   ├── toasts/        # Toast notifications (selector: app-toasts)
│   └── user/          # User profile placeholder (selector: app-user)
├── services/
│   ├── todo.service.ts      # Task state + CRUD orchestration (refresh$ pattern)
│   ├── task-api.service.ts  # HTTP client for json-server API
│   └── toast.service.ts     # Toast notification state
├── shared/
│   └── show-hint-on-hover.directive.ts  # Tooltip directive (selector: [appShowHintOnHover])
├── assets/
│   └── task-management-logo.png
├── main.ts            # Bootstrap entry point
├── index.html         # HTML shell (title: EasyTrack)
├── styles.scss        # Global styles (Poppins font, dark theme)
└── test-setup.ts      # Jest setup (jest-preset-angular)
e2e/
└── src/example.spec.ts  # Basic Playwright smoke test
```

## Component Tree

```
App
├── Header          — static title "ToDo List"
├── User            — placeholder, underdeveloped
├── Toasts          — toast notification overlay
└── RouterOutlet → TodoList  — main logic container (lazy, /tasks)
    ├── Spinner     — shown while isLoading()
    ├── mat-button-toggle-group  — All/InProgress/Completed filter
    ├── TodoItem[]  — @for filteredTasks, outputs: deleteItem/selectItem/editItem
    │   └── Button  — delete/save/cancel actions
    ├── TodoCreateItem  — create form, output: createItem
    └── RouterOutlet → TodoItemView  — task detail (lazy, /tasks/:id)
```

## Data Model

```typescript
interface Task {
  id: number;
  text: string;
  isSelected: boolean;  // derived; not persisted to API
  description?: string;
  status: TaskStatus;   // 'InProgress' | 'Completed'
}
```

## State (TodoList component)

- `tasks` — signal derived from `TodoService.tasks$` via `toSignal()`
- `isLoading` — signal from `TodoService.isLoading` (set by RxJS tap in service)
- `editingTaskId` — signal for currently edited task id
- `activeFilter` — signal for current status filter (null | TaskStatus)
- `filteredTasks` — computed signal filtering tasks by activeFilter

State is persisted to json-server at localhost:3000. Data resets only if db.json is reset.

## Component Communication

- **Parent → Child:** `input()` functions
- **Child → Parent:** `output()` functions
- Button: `input() text`, `output() clicked`
- TodoItem: `input() task / isSelected`, `output() deleteItem / selectItem`

## Conventions

- Selector prefix: `app-` (components), `app` camelCase (directives)
- All components are standalone — do NOT set `standalone: true` (it is the default in Angular v20+)
- `ChangeDetectionStrategy.OnPush` on every component
- Reactive forms preferred over template-driven
- Native control flow: `@if`, `@for`, `@switch` — never `*ngIf` / `*ngFor` / `*ngSwitch`
- Class bindings instead of `ngClass`; style bindings instead of `ngStyle`
- `inject()` instead of constructor injection
- Host bindings inside `host: {}` object — never `@HostBinding` / `@HostListener`
- `NgOptimizedImage` for all static images
- BEM-like CSS classes (e.g. `.description-panel__title`)
- ESLint: flat config (`eslint.config.mjs`)
- Prettier: single quotes

## Angular & TypeScript Best Practices

### TypeScript
- Strict type checking enabled — never disable
- Prefer type inference when type is obvious
- Avoid `any`; use `unknown` when type is uncertain

### Components
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of `@Input()` / `@Output()` decorators
- Use `computed()` for derived state — never recompute manually
- Always set `changeDetection: ChangeDetectionStrategy.OnPush`
- Prefer Reactive forms over template-driven

### State
- Use signals for local component state
- Use `computed()` for derived values
- Keep state transformations pure
- Use `.set()` or `.update()` on signals — never `.mutate()`

### Services
- Single responsibility per service
- Always use `providedIn: 'root'` for singletons
- Use `inject()` — no constructor injection
- Mutate state via dedicated methods only (e.g. `addTask`, `deleteTask(id)`)
- Filter / find by `id` — never by object reference

### Templates
- Use native control flow (`@if`, `@for`, `@switch`)
- Use async pipe for observables
- Keep templates free of complex logic — move it to the component class or a `computed()`
- Do not use globals like `new Date()` in templates

### Accessibility
- All components must pass AXE checks
- Follow WCAG AA: focus management, color contrast ≥ 4.5:1, ARIA attributes

## Design Theme

- Dark gradient background (#181023 → #0b0519)
- Purple accent (#9b59b6, #8e44ad)
- Green action (#27ae60, #2ecc71)
- Red destructive (#c0392b, #e74c3c)
- Light purple text (#c3b3d8)
- Font: Poppins (Google Fonts)

## Build Budgets (Production)

- Initial bundle: warning 500 kb / error 1 mb
- Component styles: warning 4 kb / error 8 kb

## Self-Review Checklist (required before every final answer)

- Re-read all written code before submitting
- Check consistency: if neighbouring methods follow a pattern (e.g. filter by `id`), the new method must follow the same pattern
- Verify that variables declared for data processing (e.g. `const value = text.trim()`) are actually used everywhere they should be — not the original unprocessed values
- When a service method signature changes, immediately update all call sites

## Current Gaps

- No unit tests written (setup exists, 0 spec files)
- User component is a placeholder
- No form validation framework beyond Validators.required
- isSelected highlighting broken: TodoList.selectTask() navigates but does not call todoService.selectTask()
- Status update (TodoItemView) has no error handling or toast feedback
