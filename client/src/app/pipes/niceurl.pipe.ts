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
		var newStr = a.toLowerCase().trim();
        newStr = newStr.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
		console.log(newStr);
        newStr = newStr.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
        newStr = newStr.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
        newStr = newStr.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
        newStr = newStr.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
        newStr = newStr.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
        newStr = newStr.replace(/(đ)/g, 'd');
        newStr = newStr.replace(/[^a-z0-9-\s]/g, '');
        newStr = newStr.replace(/([\s]+)/g, '-');
        newStr = newStr.replace(/-+/g, '-');
		return newStr;
	};
}
