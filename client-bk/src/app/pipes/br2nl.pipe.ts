import { Pipe, PipeTransform } from '@angular/core';
import { Configuration } from '../shared';
declare let moment: any;

@Pipe({name: 'br2nl'})
export class Br2nl implements PipeTransform {
	constructor(private _Configuration: Configuration
		){}

  	transform(value: any, args?: any) : any {
  		if(value) {
			value = value.replace(/\<br\s*[\/]?\>/g, "");
  		}
		
   		return value;
  	}
}