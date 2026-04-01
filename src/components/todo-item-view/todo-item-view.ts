import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  DestroyRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Task } from '../todo-item/todo-item';
import { map } from 'rxjs';

@Component({
  selector: 'app-todo-item-view',
  imports: [],
  templateUrl: './todo-item-view.html',
  styleUrl: './todo-item-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemView {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(TodoService);

  id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id'))));
  tasks = toSignal(this.service.tasks$, { initialValue: [] as Task[] });
  task = computed(() => this.tasks().find((t) => t.id === Number(this.id())));

  onStatusChanged(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.service
      .updateTaskStatus(
        Number(this.id()),
        isChecked ? 'Completed' : 'InProgress',
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
