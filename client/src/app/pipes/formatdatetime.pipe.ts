import { Pipe, PipeTransform } from '@angular/core';
import { Configuration } from '../shared';
declare let moment: any;

@Pipe({name: 'formatdatetime'})
export class FormatDateTime implements PipeTransform {
	// constructor(private DatePipe: DatePipe, private Configuration: Configuration){
	constructor(private _Configuration: Configuration
		){}

  	transform(value: any, args?: any) : any {
	   	var parsedDate = Date.parse(value);
	   	if(isNaN(parsedDate)){
	   		return "";
	   	}else{
			return moment(parsedDate).format(this._Configuration.formatDateTimeTS);
	   	}
  	}
}