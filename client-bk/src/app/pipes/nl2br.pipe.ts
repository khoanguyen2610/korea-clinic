import { Pipe, PipeTransform } from '@angular/core';
import { Configuration } from '../shared';
declare let moment: any;

@Pipe({name: 'nl2br'})
export class Nl2br implements PipeTransform {
	constructor(private _Configuration: Configuration
		){}

  	transform(value: any, args?: any) : any {
  		if(value) {
			value = value.replace(/\t/g, "&nbsp;");
			value = value.replace(/\n/g, "<br>");
  		}
		
   		return value;
  	}
}