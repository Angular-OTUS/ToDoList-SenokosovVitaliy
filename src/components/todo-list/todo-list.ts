import { Component } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  imports: [],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList {
  tasks: string[] = ['Task 1', 'Task 2', 'Task 3'];

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }
}
