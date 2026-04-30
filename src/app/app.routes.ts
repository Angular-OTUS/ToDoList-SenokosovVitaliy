import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'backlog', pathMatch: 'full' },
  {
    path: 'backlog',
    loadComponent: () =>
      import('../components/backlog/backlog').then((m) => m.Backlog),
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('../components/todo-item-view/todo-item-view').then(
            (m) => m.TodoItemView,
          ),
      },
    ],
  },
  {
    path: 'board',
    loadComponent: () =>
      import('../components/board/board').then((m) => m.Board),
  },
  { path: '**', redirectTo: 'backlog' },
];
