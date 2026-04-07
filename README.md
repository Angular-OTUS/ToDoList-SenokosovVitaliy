# EasyTrack — ToDo List

Angular 20 single-page app for managing tasks, built as part of the Otus Angular course.

## Tech stack

- Angular 20 + Standalone Components + Signals
- Angular Material
- JSON Server (Fake REST API)
- Nx workspace

## Getting started

Install dependencies:

```sh
npm ci --legacy-peer-deps
```

Start both servers in **separate terminals**:

```sh
# Terminal 1 — Fake API (http://localhost:3000)
npm run api

# Terminal 2 — Angular dev server (http://localhost:4200)
npm start
```

> The Angular app requires the API server to be running to load and persist tasks.

## Available scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Angular dev server on port 4200 |
| `npm run api` | Start JSON Server on port 3000 |
| `npm run build` | Production build → `dist/todo-list` |
| `npm test` | Run unit tests (Jest) |
| `npx nx lint` | Run ESLint |
| `npx nx e2e` | Run E2E tests (Playwright) |

## Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/` | — | Redirects to `/tasks` |
| `/tasks` | `TodoList` | Task list (lazy-loaded) |
| `/tasks/:id` | `TodoItemView` | Task detail view (lazy-loaded, child route) |
| `**` | — | Redirects to `/tasks` |

## API

JSON Server exposes a REST API from `db.json`:

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
