import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'en' | 'ru';

const LANG_STORAGE_KEY = 'app.lang';
const SUPPORTED: readonly AppLanguage[] = ['en', 'ru'];

@Component({
  selector: 'app-language-switcher',
  imports: [MatButtonToggleModule, TranslatePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly current = signal<AppLanguage>(this.resolveInitial());
  protected readonly languages = computed<readonly AppLanguage[]>(
    () => SUPPORTED,
  );

  constructor() {
    this.translate.addLangs([...SUPPORTED]);
    this.translate
      .use(this.current())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected change(lang: AppLanguage): void {
    if (lang === this.current()) return;
    this.current.set(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    this.translate
      .use(lang)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private resolveInitial(): AppLanguage {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'ru') return saved;
    return 'en';
  }
}
