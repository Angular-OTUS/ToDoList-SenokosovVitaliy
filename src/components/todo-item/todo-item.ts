import { Component, input, output } from '@angular/core';
import { Button } from '../button/button';
import { ShowHintOnHoverDirective } from '../../shared/show-hint-on-hover.directive';

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
  task = input.required<Task>();
  deleteItem = output<void>();
  selectItem = output<void>();
}
