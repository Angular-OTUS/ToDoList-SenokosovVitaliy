import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Button } from '../button/button';

export interface CreateTaskPayload {
  text: string;
  description: string;
}

@Component({
  selector: 'app-todo-create-item',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './todo-create-item.html',
  styleUrl: './todo-create-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoCreateItem {
  createItem = output<CreateTaskPayload>();

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
  });

  submit(): void {
    if (this.form.invalid) return;
    const { name, description } = this.form.getRawValue();
    this.createItem.emit({ text: name.trim(), description: description.trim() });
    this.form.reset();
  }
}
