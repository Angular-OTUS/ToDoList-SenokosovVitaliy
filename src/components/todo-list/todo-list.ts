import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TodoItem, Task, TaskStatus } from '../todo-item/todo-item';
import { TodoCreateItem } from '../todo-create-item/todo-create-item';
import { Spinner } from '../spinner/spinner';
import { TodoService } from '../../services/todo.service';
import { ToastService } from '../../services/toast.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  imports: [
    MatButtonToggleModule,
    TodoItem,
    TodoCreateItem,
    Spinner,
    RouterOutlet,
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoList {
  private todoService = inject(TodoService);
  private toastService = inject(ToastService);
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
    this.todoService.addTask(text, description).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.toastService.showToast('Задача добавлена', 'success'),
      error: () => this.toastService.showToast('Ошибка при добавлении задачи', 'error'),
    });
  }

  deleteTask(task: Task) {
    this.todoService.deleteTask(task.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.toastService.showToast('Задача удалена', 'success'),
      error: () => this.toastService.showToast('Ошибка при удалении задачи', 'error'),
    });
  }

  selectTask(task: Task) {
    this.editingTaskId.set(null);
    this.router.navigate(['/tasks', task.id]);
  }

  startEditTask(task: Task) {
    this.editingTaskId.set(task.id);
  }

  updateTask(task: Task, newText: string) {
    this.editingTaskId.set(null);
    this.todoService.updateTask(task.id, newText).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.toastService.showToast('Задача обновлена', 'success'),
      error: () => this.toastService.showToast('Ошибка при обновлении задачи', 'error'),
    });
  }

  cancelEditTask() {
    this.editingTaskId.set(null);
  }
}
