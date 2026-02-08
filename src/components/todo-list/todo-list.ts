import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TodoItem, Task } from '../todo-item/todo-item';
import { Button } from '../button/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    TodoItem,
    Button,
    MatProgressSpinnerModule,
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

  ngOnInit() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }

  addTask(text: string, description: string) {
    const value = text.trim();
    if (!value) return;

    this.todoService.addTask(text, description);
    this.toastService.showToast('Задача добавлена', 'success');
  }

  deleteTask(task: Task) {
    if (this.selectedItemId() === task.id) {
      this.selectedItemId.set(null);
      this.descriptionOutputText.set('');
    }
    this.todoService.deleteTask(task);
  }

  selectTask(task: Task) {
    this.selectedItemId.set(task.id);
    this.descriptionOutputText.set(
      task.description ? task.description : '<<No description provided>>',
    );
    this.todoService.selectTask(task.id);
  }

  updateTask(task: Task, newText: string) {
    this.todoService.updateTask(task.id, newText);
    this.toastService.showToast('Задача обновлена', 'success');
  }

  textChanged(value: string) {
    this.isTextEmpty.set(value.trim().length === 0);
  }
}
