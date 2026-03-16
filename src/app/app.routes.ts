import { Route } from '@angular/router';
import { TodoList } from '../components/todo-list/todo-list';

export const appRoutes: Route[] = [
    { path: 'tasks', component: TodoList },
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    { path: '**', redirectTo: 'tasks' },
];
