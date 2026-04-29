import { inject, Injectable, signal } from '@angular/core';

import { BehaviorSubject, combineLatest, EMPTY, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Task, TaskStatus } from '../components/todo-item/todo-item';
import { ServerTask, TaskApiService } from './task-api.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiService = inject(TaskApiService);

  private readonly _tasks$ = new BehaviorSubject<ServerTask[]>([]);
  private readonly selectedId$ = new BehaviorSubject<number | null>(null);

  readonly isLoading = signal(false);

  readonly tasks$: Observable<Task[]> = combineLatest([
    this._tasks$,
    this.selectedId$,
  ]).pipe(
    map(([tasks, selectedId]) =>
      tasks.map((t) => ({ ...t, isSelected: t.id === selectedId })),
    ),
  );

  get tasks(): Task[] {
    const selectedId = this.selectedId$.value;
    return this._tasks$.value.map((t) => ({
      ...t,
      isSelected: t.id === selectedId,
    }));
  }

  loadTasks(): Observable<ServerTask[]> {
    this.isLoading.set(true);
    return this.apiService.getAll().pipe(
      map((tasks) => tasks.map((t) => ({ ...t, id: Number(t.id) }))),
      catchError(() => of([] as ServerTask[])),
      tap((tasks) => {
        this._tasks$.next(tasks);
        this.isLoading.set(false);
      }),
    );
  }

  addTask(text: string, description: string): Observable<ServerTask> {
    const value = text.trim();
    if (!value) return EMPTY;
    return this.apiService.create(value, description).pipe(
      tap((created) => {
        const next = { ...created, id: Number(created.id) };
        this._tasks$.next([...this._tasks$.value, next]);
      }),
    );
  }

  updateTask(id: number, text: string): Observable<ServerTask> {
    const value = text.trim();
    if (!value) return EMPTY;
    return this.apiService
      .update(id, { text: value })
      .pipe(tap((updated) => this.patchLocal(id, updated)));
  }

  deleteTask(id: number): Observable<void> {
    return this.apiService.delete(id).pipe(
      tap(() =>
        this._tasks$.next(this._tasks$.value.filter((t) => t.id !== id)),
      ),
    );
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<ServerTask> {
    return this.apiService
      .update(id, { status })
      .pipe(tap((updated) => this.patchLocal(id, updated)));
  }

  selectTask(taskId: number): void {
    this.selectedId$.next(taskId);
  }

  private patchLocal(id: number, updated: ServerTask): void {
    const next = this._tasks$.value.map((t) =>
      t.id === id ? { ...t, ...updated, id: Number(updated.id) } : t,
    );
    this._tasks$.next(next);
  }
}
