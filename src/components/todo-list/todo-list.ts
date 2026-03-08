import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TodoItem, Task, TaskStatus } from '../todo-item/todo-item';
import { Button } from '../button/button';
import { Spinner } from '../spinner/spinner';
import { TodoService } from '../../services/todo.service';
import { ToastService } from '../../services/toast.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    TodoItem,
    Button,
    Spinner,
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList implements OnInit {
  private todoService = inject(TodoService);
  private toastService = inject(ToastService);

  tasks = toSignal(this.todoService.tasks$, { initialValue: [] as Task[] });

  isTextEmpty = signal(true);
  isLoading = signal(true);
  selectedItemId = signal<number | null>(null);
  descriptionOutputText = signal('');
  editingTaskId = signal<number | null>(null);
  activeFilter = signal<TaskStatus | null>(null);
  selectedTask = computed(() => this.tasks().find((t) => t.id === this.selectedItemId()) ?? null);
  filteredTasks = computed(() => {
    const filter = this.activeFilter();
    return filter === null ? this.tasks() : this.tasks().filter((t) => t.status === filter);
  });

  ngOnInit() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }

  addTask(text: string, description: string) {
    const value = text.trim();
    if (!value) return;

    this.todoService.addTask(value, description);
    this.toastService.showToast('Задача добавлена', 'success');
  }

  deleteTask(task: Task) {
    if (this.selectedItemId() === task.id) {
      this.selectedItemId.set(null);
      this.descriptionOutputText.set('');
    }
    this.todoService.deleteTask(task.id);
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
    this.todoService.updateTask(task.id, newText);
    this.toastService.showToast('Задача обновлена', 'success');
    this.editingTaskId.set(null);
  }

  cancelEditTask() {
    this.editingTaskId.set(null);
  }

  updateTaskStatus(completed: boolean) {
    const task = this.selectedTask();
    if (!task) return;
    const status: TaskStatus = completed ? 'Completed' : 'InProgress';
    this.todoService.updateTaskStatus(task.id, status);
  }

  textChanged(value: string) {
    this.isTextEmpty.set(value.trim().length === 0);
  }
}
