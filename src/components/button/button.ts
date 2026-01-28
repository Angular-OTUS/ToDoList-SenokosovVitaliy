import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ShowHintOnHoverDirective } from '../../shared/show-hint-on-hover.directive';

@Component({
  selector: 'app-button',
  imports: [ShowHintOnHoverDirective],
  templateUrl: './button.html',
  styleUrls: ['./button.css'],
})
export class Button {
  @Input() title: string;
  @Input() isDisabled = false;
  @Input() className = '';
  @Input() hintText = '';

  @Output() clicked = new EventEmitter<void>();
}
