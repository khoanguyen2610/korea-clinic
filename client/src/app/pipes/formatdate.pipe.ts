import { Pipe, PipeTransform } from '@angular/core';
import { Configuration } from '../shared';
declare let moment: any;

@Pipe({name: 'formatdate'})
export class FormatDate implements PipeTransform {
	// constructor(private DatePipe: DatePipe, private Configuration: Configuration){
	constructor(private _Configuration: Configuration
		){}

  	transform(value: any, args?: any) : any {
	   	var parsedDate = Date.parse(value);
	   	var parseString = String(value);
	   	if(isNaN(parsedDate) || parseString.length <= 6){
	   		return value;
	   	}else{
	   		return  moment(parsedDate).format(this._Configuration.formatDateTS);
	   	}
  	}
}