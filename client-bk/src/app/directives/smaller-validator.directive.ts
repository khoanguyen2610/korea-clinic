import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

export const SMALLER_VALIDATOR = { provide: NG_VALIDATORS, useExisting: forwardRef(() => SmallerValidator), multi: true };

@Directive({
    selector: '[smaller][formControlName],[smaller][formControl],[smaller][ngModel]',
    providers: [ SMALLER_VALIDATOR ]
})

export class SmallerValidator implements Validator {

	constructor(@Attribute('smaller') public smaller: number){ }

	validate(control: AbstractControl): { [key: string]: any }{
		//self value
		let v: any = control.value;
		if(v==null || v=='undefined'){
			return null;
		}
		v = v.toString().replace(/,/g,'');
		v = +v;
		//control value
		let e: any = this.smaller.toString().replace(/,/g,'');
		e = +e;
		return (isNaN(v) || v > e) ? { smaller: { valid: false }} : null;
	}
}

