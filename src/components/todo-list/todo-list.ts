import { Component } from '@angular/core';
import { TodoItem } from '../todo-item/todo-item';

@Component({
  selector: 'app-todo-list',
  imports: [],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList {
  tasks: TodoItem[] = [
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

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }

  textChanged(value: string) {
    this.isTextEmpty = value.trim().length == 0;
    console.log(this.isTextEmpty);
  }
}
