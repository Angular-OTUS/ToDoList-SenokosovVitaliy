import { Route } from '@angular/router';
import { TodoList } from '../components/todo-list/todo-list';
import { TodoItemView } from '../components/todo-item-view/todo-item-view';

export const appRoutes: Route[] = [
    { path: 'tasks', component: TodoList, children: [
        { path: ':id', component: TodoItemView},
    ] },
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    { path: '**', redirectTo: 'tasks' },
];
