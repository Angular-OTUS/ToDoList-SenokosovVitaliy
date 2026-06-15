import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Toasts } from '../components/toasts/toasts.component';
import { TodoService } from '../services/todo.service';

@Component({
  imports: [RouterOutlet, Toasts, RouterLink, RouterLinkActive],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly todoService = inject(TodoService);
  private readonly destroyRef = inject(DestroyRef);

  protected title = 'TasksBoard';

  constructor() {
    this.todoService
      .loadTasks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
