import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TodoItem, Task } from '../todo-item/todo-item';
import { Button } from '../button/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  tasks = signal<Task[]>([
    {
      id: 1,
      text: 'Learn Angular',
      isSelected: false,
      description:
        'Study the official documentation and build sample projects.',
    },
    {
      id: 2,
      text: 'Build an app',
      isSelected: false,
      description: 'Create a new Angular application using the CLI.',
    },
    {
      id: 3,
      text: 'Deploy to production',
      isSelected: false,
      description: 'Deploy the application to a cloud provider.',
    },
  ]);

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

    const nextId = (this.tasks().at(-1)?.id ?? 0) + 1;
    this.tasks.set([
      ...this.tasks(),
      { id: nextId, text: value, description: description, isSelected: false },
    ]);
  }

  deleteTask(task: Task) {
    if (this.selectedItemId() === task.id) {
      this.selectedItemId.set(null);
      this.descriptionOutputText.set('');
    }
    this.tasks.set(this.tasks().filter((t) => t !== task));
  }

  selectTask(task: Task) {
    this.selectedItemId.set(task.id);
    this.descriptionOutputText.set(
      task.description ? task.description : '<<No description provided>>',
    );
    this.tasks.update((tasks) =>
      tasks.map((t) => ({ ...t, isSelected: t.id === task.id })),
    );
  }

  textChanged(value: string) {
    this.isTextEmpty.set(value.trim().length === 0);
  }
}
