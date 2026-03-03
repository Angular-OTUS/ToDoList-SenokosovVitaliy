import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toasts',
  imports: [CommonModule],
  templateUrl: './toasts.component.html',
  styleUrl: './toasts.component.css',
})
export class Toasts implements OnInit, OnDestroy {
  private toastService = inject(ToastService);
  toasts: Toast[] = [];
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe(
      (toasts) => (this.toasts = toasts),
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  dismiss(id: number): void {
    this.toastService.removeToast(id);
  }
}
