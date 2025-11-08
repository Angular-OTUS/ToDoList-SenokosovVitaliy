import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Button } from '../button/button';
import { ShowHintOnHoverDirective } from '../../directives/todo-item-hint.directive'

export interface Task {
  id: number;
  text: string;
  isSelected: boolean;
  description?: string;
}

@Component({
  selector: 'app-todo-item',
  imports: [Button, ShowHintOnHoverDirective],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css',
})
export class TodoItem {
  @Input() task!: Task;
  @Output() deleteItem = new EventEmitter<void>();
  @Output() selectItem = new EventEmitter<void>();
}
