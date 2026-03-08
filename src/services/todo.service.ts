import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of, switchMap } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Task, TaskStatus } from '../components/todo-item/todo-item';
import { TaskApiService, ServerTask } from './task-api.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiService = inject(TaskApiService);

  private refresh$ = new BehaviorSubject<void>(undefined);
  private selectedId$ = new BehaviorSubject<number | null>(null);

  private serverTasks$ = this.refresh$.pipe(
    switchMap(() =>
      this.apiService.getAll().pipe(catchError(() => of([] as ServerTask[]))),
    ),
    shareReplay(1),
  );

  tasks$: Observable<Task[]> = combineLatest([this.serverTasks$, this.selectedId$]).pipe(
    map(([tasks, selectedId]) =>
      tasks.map((t) => ({ ...t, isSelected: t.id === selectedId })),
    ),
    shareReplay(1),
  );

  addTask(text: string, description: string): void {
    const value = text.trim();
    if (!value) return;

    this.apiService.create(value, description).subscribe(() => this.refresh$.next());
  }

  updateTask(id: number, text: string): void {
    const value = text.trim();
    if (!value) return;

    this.apiService.update(id, { text: value }).subscribe(() => this.refresh$.next());
  }

  deleteTask(id: number): void {
    this.apiService.delete(id).subscribe(() => this.refresh$.next());
  }

  updateTaskStatus(id: number, status: TaskStatus): void {
    this.apiService.update(id, { status }).subscribe(() => this.refresh$.next());
  }

  selectTask(taskId: number): void {
    this.selectedId$.next(taskId);
  }
}
