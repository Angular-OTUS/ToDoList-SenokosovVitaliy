import { Injectable, inject, signal } from '@angular/core';
import {
  BehaviorSubject,
 EMPTY, Observable,
  combineLatest,
  of,
  switchMap,
} from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { Task, TaskStatus } from '../components/todo-item/todo-item';
import { TaskApiService, ServerTask } from './task-api.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiService = inject(TaskApiService);

  private refresh$ = new BehaviorSubject<void>(undefined);
  private selectedId$ = new BehaviorSubject<number | null>(null);

  readonly isLoading = signal(true);

  private serverTasks$ = this.refresh$.pipe(
    tap(() => this.isLoading.set(true)),
    switchMap(() =>
      this.apiService.getAll().pipe(
        map((tasks) => tasks.map((t) => ({ ...t, id: Number(t.id) }))),
        catchError(() => of([] as ServerTask[])),
      ),
    ),
    tap(() => this.isLoading.set(false)),
    shareReplay(1),
  );

  tasks$: Observable<Task[]> = combineLatest([
    this.serverTasks$,
    this.selectedId$,
  ]).pipe(
    map(([tasks, selectedId]) =>
      tasks.map((t) => ({ ...t, isSelected: t.id === selectedId })),
    ),
    shareReplay(1),
  );

  addTask(text: string, description: string): Observable<ServerTask> {
    const value = text.trim();
    if (!value) return EMPTY;
    return this.apiService
      .create(value, description)
      .pipe(tap(() => this.refresh$.next()));
  }

  updateTask(id: number, text: string): Observable<ServerTask> {
    const value = text.trim();
    if (!value) return EMPTY;
    return this.apiService
      .update(id, { text: value })
      .pipe(tap(() => this.refresh$.next()));
  }

  deleteTask(id: number): Observable<void> {
    return this.apiService.delete(id).pipe(tap(() => this.refresh$.next()));
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<ServerTask> {
    return this.apiService
      .update(id, { status })
      .pipe(tap(() => this.refresh$.next()));
  }

  selectTask(taskId: number): void {
    this.selectedId$.next(taskId);
  }
}
