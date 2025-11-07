import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Button } from '../button/button';

export interface Task {
  id: number;
  text: string;
  description?: string;
}

@Component({
  selector: 'app-todo-item',
  imports: [Button],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css',
})
export class TodoItem {
  @Input() task!: Task;
  @Output() deleteItem = new EventEmitter<void>();
  @Output() selectItem = new EventEmitter<void>();
}
