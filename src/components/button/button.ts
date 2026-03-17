import { Component, input, output } from '@angular/core';
import { ShowHintOnHoverDirective } from '../../shared/show-hint-on-hover.directive';

@Component({
  selector: 'app-button',
  imports: [ShowHintOnHoverDirective],
  templateUrl: './button.html',
  styleUrls: ['./button.css'],
})
export class Button {
  type = input<'button' | 'submit' | 'reset'>('button');
  isDisabled = input(false);
  className = input('');
  hintText = input('');

  clicked = output<void>();
}
