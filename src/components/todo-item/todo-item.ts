import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [Button, ShowHintOnHoverDirective, FormsModule],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css',
})
export class TodoItem {
  task = input.required<Task>();
  deleteItem = output<void>();
  selectItem = output<void>();
  editItem = output<string>();

  isEditing = signal(false);
  editText = signal('');

  enterEditMode(): void {
    this.isEditing.set(true);
    this.editText.set(this.task().text);
  }

  saveEdit(): void {
    const trimmed = this.editText().trim();
    if (trimmed) {
      this.editItem.emit(trimmed);
    }
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.editText.set('');
  }
}
