import { Pipe, PipeTransform } from '@angular/core';
import { Configuration } from '../shared';
declare let $: any;
@Pipe({name: 'selectobject'})
export class SelectObject implements PipeTransform {
	// constructor(private DatePipe: DatePipe, private Configuration: Configuration){
	constructor(private _Configuration: Configuration
		){}

  	transform(value: any, items?: any) : any {
	   	return $.grep(items, function(e){ return e.id == value; });
  	}
}