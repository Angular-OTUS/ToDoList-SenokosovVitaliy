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
| State Management | Local component state (no NgRx/signals)  |
| Routing          | Configured but empty (single-page)       |
| SSR              | @angular/ssr configured, Express backend |
| Git Branch       | homework-4 (main: main)                  |

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
│   └── app.routes.ts                   # appRoutes — empty array
├── components/
│   ├── button/        # Reusable button (selector: app-button)
│   ├── header/        # Title display (selector: app-header)
│   ├── todo-item/     # Single task row (selector: app-todo-item)
│   ├── todo-list/     # Main task manager (selector: app-todo-list)
│   └── user/          # User profile placeholder (selector: app-user)
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
└── TodoList        — main logic container
    ├── TodoItem[]  — *ngFor loop, @Output deleteItem/selectItem
    │   └── Button  — delete action
    └── Button      — add action
```

## Data Model

```typescript
interface Task {
  id: number;
  text: string;
  isSelected: boolean;
  description?: string;
}
```

## State (TodoList component)

- `tasks: Task[]` — task array (immutable updates)
- `isTextEmpty: boolean` — input validation
- `isLoading: boolean` — simulated loading (setTimeout)
- `selectedItemId: number | null` — selected task
- `descriptionOutputText: string` — description display

No services, no persistence, no API calls. Data resets on refresh.

## Component Communication

- **Parent → Child:** `@Input()` properties
- **Child → Parent:** `@Output()` + `EventEmitter`
- Button: `@Input() text`, `@Output() clicked`
- TodoItem: `@Input() task/isSelected`, `@Output() deleteItem/selectItem`

## Conventions

- Selector prefix: `app-` (components), `app` camelCase (directives)
- All components are **standalone** (no NgModules)
- Template-driven forms (FormsModule, no ReactiveFormsModule)
- BEM-like CSS classes (e.g. `.description-panel__title`)
- ESLint: flat config (`eslint.config.mjs`)
- Prettier: single quotes

## Design Theme

- Dark gradient background (#181023 → #0b0519)
- Purple accent (#9b59b6, #8e44ad)
- Green action (#27ae60, #2ecc71)
- Red destructive (#c0392b, #e74c3c)
- Light purple text (#c3b3d8)
- Font: Poppins (Google Fonts)

## Build Budgets (Production)

- Initial bundle: warning 500kb / error 1mb
- Component styles: warning 4kb / error 8kb

## Current Gaps

- No unit tests written (setup exists, 0 spec files)
- No routing (appRoutes is empty)
- No services or API layer
- No persistent storage (localStorage / backend)
- User component is a placeholder
- No form validation framework
