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

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }
}
