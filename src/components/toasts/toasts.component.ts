import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { TranslatePipe } from '@ngx-translate/core';

import { Toast, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toasts',
  imports: [TranslatePipe],
  templateUrl: './toasts.component.html',
  styleUrl: './toasts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toasts {
  private readonly toastService = inject(ToastService);

  protected readonly toasts = toSignal(this.toastService.toasts$, {
    initialValue: [] as Toast[],
  });

  dismiss(id: number): void {
    this.toastService.removeToast(id);
  }
}
