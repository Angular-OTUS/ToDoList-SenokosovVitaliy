import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appShowHintOnHover]',
  host: {
    '[title]': 'hintText()',
  },
})
export class ShowHintOnHoverDirective {
  hintText = input('');
}
