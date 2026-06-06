import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslatePipe } from '@ngx-translate/core';

import { ShowHintOnHoverDirective } from '../../shared/show-hint-on-hover.directive';
import { Button } from '../button/button';

export type TaskStatus = 'ToDo' | 'InProgress' | 'Completed';

export interface Task {
  id: number;
  text: string;
  isSelected: boolean;
  description?: string;
  status: TaskStatus;
}

@Component({
  selector: 'app-todo-item',
  imports: [Button, ShowHintOnHoverDirective, FormsModule, TranslatePipe],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css',
})
export class TodoItem {
  task = input.required<Task>();
  isEditing = input(false);
  deleteItem = output<void>();
  selectItem = output<void>();
  startEdit = output<void>();
  editItem = output<string>();
  cancelEdit = output<void>();

  editText = signal('');

  enterEditMode(): void {
    this.editText.set(this.task().text);
    this.startEdit.emit();
  }

  saveEdit(): void {
    const trimmed = this.editText().trim();
    if (trimmed) {
      this.editItem.emit(trimmed);
    }
  }

  onCancelEdit(): void {
    this.cancelEdit.emit();
  }
}
