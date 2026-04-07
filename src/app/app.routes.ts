import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    { path: 'tasks', loadComponent: () => import('../components/todo-list/todo-list').then(m => m.TodoList), children: [
        { path: ':id', loadComponent: () => import('../components/todo-item-view/todo-item-view').then(m => m.TodoItemView) },
    ] },
    { path: '**', redirectTo: 'tasks' },
];
