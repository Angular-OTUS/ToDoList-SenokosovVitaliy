import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { TodoService } from '../../services/todo.service';
import { Spinner } from '../spinner/spinner';
import { Task, TaskStatus } from '../todo-item/todo-item';

interface BoardColumn {
  title: string;
  status: TaskStatus;
}

@Component({
  selector: 'app-board',
  imports: [Spinner],
  templateUrl: './board.html',
  styleUrl: './board.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
  private readonly taskService = inject(TodoService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.taskService
      .loadTasks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private readonly tasks = toSignal(this.taskService.tasks$, {
    initialValue: [] as Task[],
  });

  protected readonly isLoading = this.taskService.isLoading;

  private readonly columnDefs: readonly BoardColumn[] = [
    { title: 'To Do', status: 'ToDo' },
    { title: 'In Progress', status: 'InProgress' },
    { title: 'Done', status: 'Completed' },
  ];

  protected readonly columns = computed(() =>
    this.columnDefs.map((col) => ({
      ...col,
      tasks: this.tasks().filter((t) => t.status === col.status),
    })),
  );
}
