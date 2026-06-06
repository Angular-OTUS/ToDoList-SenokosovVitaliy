import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router, RouterOutlet } from '@angular/router';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ToastService } from '../../services/toast.service';
import { TodoService } from '../../services/todo.service';
import { Spinner } from '../spinner/spinner';
import { TodoCreateItem } from '../todo-create-item/todo-create-item';
import { Task, TaskStatus,TodoItem } from '../todo-item/todo-item';

@Component({
  selector: 'app-backlog',
  imports: [
    MatButtonToggleModule,
    TodoItem,
    TodoCreateItem,
    Spinner,
    RouterOutlet,
    TranslatePipe,
  ],
  templateUrl: './backlog.html',
  styleUrl: './backlog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Backlog {
  private todoService = inject(TodoService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  tasks = toSignal(this.todoService.tasks$, { initialValue: [] as Task[] });

  readonly isLoading = this.todoService.isLoading;
  editingTaskId = signal<number | null>(null);
  activeFilter = signal<TaskStatus | null>(null);
  filteredTasks = computed(() => {
    const filter = this.activeFilter();
    return filter === null
      ? this.tasks()
      : this.tasks().filter((t) => t.status === filter);
  });

  addTask(text: string, description: string) {
    this.todoService
      .addTask(text, description)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () =>
          this.toastService.showToast(
            this.translate.instant('toasts.taskAdded'),
            'success',
          ),
        error: () =>
          this.toastService.showToast(
            this.translate.instant('toasts.taskAddError'),
            'error',
          ),
      });
  }

  deleteTask(task: Task) {
    this.todoService
      .deleteTask(task.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () =>
          this.toastService.showToast(
            this.translate.instant('toasts.taskDeleted'),
            'success',
          ),
        error: () =>
          this.toastService.showToast(
            this.translate.instant('toasts.taskDeleteError'),
            'error',
          ),
      });
  }

  selectTask(task: Task) {
    this.editingTaskId.set(null);
    this.todoService.selectTask(task.id);
    this.router.navigate(['/backlog', task.id]);
  }

  startEditTask(task: Task) {
    this.editingTaskId.set(task.id);
  }

  updateTask(task: Task, newText: string) {
    this.editingTaskId.set(null);
    this.todoService
      .updateTask(task.id, newText)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () =>
          this.toastService.showToast(
            this.translate.instant('toasts.taskUpdated'),
            'success',
          ),
        error: () =>
          this.toastService.showToast(
            this.translate.instant('toasts.taskUpdateError'),
            'error',
          ),
      });
  }

  cancelEditTask() {
    this.editingTaskId.set(null);
  }
}
