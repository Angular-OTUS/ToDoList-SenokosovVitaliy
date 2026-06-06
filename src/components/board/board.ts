import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { TranslatePipe } from '@ngx-translate/core';

import { TodoService } from '../../services/todo.service';
import { Spinner } from '../spinner/spinner';
import { Task, TaskStatus } from '../todo-item/todo-item';

interface BoardColumn {
  titleKey: string;
  status: TaskStatus;
}

@Component({
  selector: 'app-board',
  imports: [Spinner, TranslatePipe],
  templateUrl: './board.html',
  styleUrl: './board.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
  private readonly taskService = inject(TodoService);

  private readonly tasks = toSignal(this.taskService.tasks$, {
    initialValue: [] as Task[],
  });

  protected readonly isLoading = this.taskService.isLoading;

  private readonly columnDefs: readonly BoardColumn[] = [
    { titleKey: 'board.columns.todo', status: 'ToDo' },
    { titleKey: 'board.columns.inProgress', status: 'InProgress' },
    { titleKey: 'board.columns.done', status: 'Completed' },
  ];

  protected readonly columns = computed(() =>
    this.columnDefs.map((col) => ({
      ...col,
      tasks: this.tasks().filter((t) => t.status === col.status),
    })),
  );
}
