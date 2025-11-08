import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appShowHintOnHover]',
})
export class ShowHintOnHoverDirective {
  @Input() hintText = '';
  @HostBinding('title') title = this.hintText;
}
