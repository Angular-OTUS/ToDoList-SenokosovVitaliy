import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly _toasts$ = new BehaviorSubject<Toast[]>([]);
  private readonly removed$ = new Subject<number>();

  readonly toasts$: Observable<Toast[]> = this._toasts$.asObservable();

  private nextId = 1;

  get toasts(): Toast[] {
    return this._toasts$.value;
  }

  showToast(
    message: string,
    type: Toast['type'] = 'info',
    duration = 3000,
  ): void {
    const toast: Toast = {
      id: this.nextId++,
      message,
      type,
      duration,
    };
    this._toasts$.next([...this._toasts$.value, toast]);

    timer(duration)
      .pipe(takeUntil(this.removed$.pipe(filter((id) => id === toast.id))))
      .subscribe(() => this.removeToast(toast.id));
  }

  removeToast(id: number): void {
    if (!this._toasts$.value.some((t) => t.id === id)) return;
    this._toasts$.next(this._toasts$.value.filter((t) => t.id !== id));
    this.removed$.next(id);
  }
}
