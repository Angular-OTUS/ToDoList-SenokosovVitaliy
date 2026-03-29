import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TodoItem, Task, TaskStatus } from '../todo-item/todo-item';
import { TodoCreateItem } from '../todo-create-item/todo-create-item';
import { Spinner } from '../spinner/spinner';
import { TodoService } from '../../services/todo.service';
import { ToastService } from '../../services/toast.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-todo-list',
  imports: [
    MatButtonToggleModule,
    TodoItem,
    TodoCreateItem,
    Spinner,
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList {
  private todoService = inject(TodoService);
  private toastService = inject(ToastService);

  tasks = toSignal(this.todoService.tasks$, { initialValue: [] as Task[] });

  readonly isLoading = this.todoService.isLoading;
  selectedItemId = signal<number | null>(null);
  descriptionOutputText = signal('');
  editingTaskId = signal<number | null>(null);
  activeFilter = signal<TaskStatus | null>(null);
  selectedTask = computed(() => this.tasks().find((t) => t.id === this.selectedItemId()) ?? null);
  filteredTasks = computed(() => {
    const filter = this.activeFilter();
    return filter === null ? this.tasks() : this.tasks().filter((t) => t.status === filter);
  });

  addTask(text: string, description: string) {
    this.todoService.addTask(text, description).subscribe({
      next: () => this.toastService.showToast('Задача добавлена', 'success'),
      error: () => this.toastService.showToast('Ошибка при добавлении задачи', 'error'),
    });
  }

  deleteTask(task: Task) {
    this.todoService.deleteTask(task.id).subscribe({
      next: () => {
        if (this.selectedItemId() === task.id) {
          this.selectedItemId.set(null);
          this.descriptionOutputText.set('');
        }
        this.toastService.showToast('Задача удалена', 'success');
      },
      error: () => this.toastService.showToast('Ошибка при удалении задачи', 'error'),
    });
  }

  selectTask(task: Task) {
    this.selectedItemId.set(task.id);
    this.descriptionOutputText.set(
      task.description ? task.description : '<<No description provided>>',
    );
    this.todoService.selectTask(task.id);
    this.editingTaskId.set(null);
  }

  startEditTask(task: Task) {
    this.editingTaskId.set(task.id);
  }

  updateTask(task: Task, newText: string) {
    this.editingTaskId.set(null);
    this.todoService.updateTask(task.id, newText).subscribe({
      next: () => this.toastService.showToast('Задача обновлена', 'success'),
      error: () => this.toastService.showToast('Ошибка при обновлении задачи', 'error'),
    });
  }

  cancelEditTask() {
    this.editingTaskId.set(null);
  }

  updateTaskStatus(completed: boolean) {
    const task = this.selectedTask();
    if (!task) return;
    const status: TaskStatus = completed ? 'Completed' : 'InProgress';
    this.todoService.updateTaskStatus(task.id, status).subscribe({
      error: () => this.toastService.showToast('Ошибка при обновлении статуса', 'error'),
    });
  }

}
