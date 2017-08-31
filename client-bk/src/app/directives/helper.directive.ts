import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
	selector: '[helper]'
})
export class HelperDirective {
	constructor(private el: ElementRef) { }
	@HostListener('keyup') onKeyup() {
		this.display('block');
	}
	@HostListener('blur') onBlur() {
		this.display(null);
	}
	private display(display: string) {
	}
}