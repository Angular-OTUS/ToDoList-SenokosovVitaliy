import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TodoItem, Task } from '../todo-item/todo-item';

@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TodoItem,
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList {
  tasks: Task[] = [
    { id: 1, text: 'Learn Angular' },
    { id: 2, text: 'Build an app' },
    { id: 3, text: 'Deploy to production' },
  ];

  isTextEmpty = true;

  addTask(text: string) {
    const value = text.trim();
    if (!value) return;

    const nextId = (this.tasks.at(-1)?.id ?? 0) + 1;
    this.tasks = [...this.tasks, { id: nextId, text: value }];
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t !== task);
  }

  textChanged(value: string) {
    this.isTextEmpty = value.trim().length == 0;
    console.log(this.isTextEmpty);
  }
}
