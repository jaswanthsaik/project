import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appDisableForSomeTime]'
})
export class DisableForSomeTimeDirective {

  constructor() { }
  @Input() showDisableButton!: boolean;
  @HostListener('click', ['$event'])
  onClick(e: any) {
    e.target.setAttribute('disabled', 'true');
    this.showDisableButton = true;
    setTimeout(() => e.target.removeAttribute('disabled'), 3000);
    this.showDisableButton = false;
  }

}
