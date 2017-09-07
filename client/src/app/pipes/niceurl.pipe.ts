import { Pipe, PipeTransform } from '@angular/core';
import { Configuration } from '../shared';
declare let moment: any;

@Pipe({name: 'niceurl'})
export class NiceUrl implements PipeTransform {
	// constructor(private DatePipe: DatePipe, private Configuration: Configuration){
	constructor(private _Configuration: Configuration
		){}

  	transform(value: any, args?: any) : any {
		if (!value) {
	   		return "";
	   	} else {
			return this.urlify(value);
	   	}
  	}

	urlify(a) {
		return a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '')
	};
}
