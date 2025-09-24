import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrls: ['./button.css'],
})
export class Button {
  @Input() Title: string;
  @Input() isDisabled = false;
  @Input() className = '';

  @Output() Clicked = new EventEmitter<void>();
}
