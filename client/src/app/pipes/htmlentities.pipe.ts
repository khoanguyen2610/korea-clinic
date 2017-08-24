import { Pipe, PipeTransform } from '@angular/core';
import { Configuration } from '../shared';
declare let moment: any;

@Pipe({name: 'htmlentities'})
export class HTMLEntities implements PipeTransform {
	constructor(private _Configuration: Configuration
		){}

  	transform(value: any, args?: any) : any {
  		if(value) {
			value = value.replace(/</g, "&lt;");
			value = value.replace(/>/g, "&gt;");
  		}
   		return value;
  	}
}