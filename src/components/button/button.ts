import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrls: ['./button.css'],
})
export class Button {
  @Input() title: string;
  @Input() isDisabled = false;
  @Input() className = '';

  @Output() clicked = new EventEmitter<void>();
}
