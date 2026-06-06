import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { LanguageSwitcher } from '../components/language-switcher/language-switcher';
import { Toasts } from '../components/toasts/toasts.component';
import { TodoService } from '../services/todo.service';

@Component({
  imports: [
    RouterOutlet,
    Toasts,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    LanguageSwitcher,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly todoService = inject(TodoService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.todoService
      .loadTasks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
