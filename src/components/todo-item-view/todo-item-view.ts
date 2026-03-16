import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { Task, TaskStatus } from '../todo-item/todo-item';

@Component({
  selector: 'app-todo-item-view',
  imports: [],
  templateUrl: './todo-item-view.html',
  styleUrl: './todo-item-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemView {
  selectedTask = input<Task>();
  descriptionText = input<string>();
  statusChanged = output<TaskStatus>();

  onStatusChanged(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.statusChanged.emit(isChecked ? 'Completed' : 'InProgress');
  }
}
