import { Pipe, PipeTransform } from '@angular/core';
import { Configuration } from '../shared';
declare let moment: any;

@Pipe({name: 'trim'})
export class Trim implements PipeTransform {
  	transform(value: any) {
	    if (!value) return '';
	    return value.trim();
  	}
}