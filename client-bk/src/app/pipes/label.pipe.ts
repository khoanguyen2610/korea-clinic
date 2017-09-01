import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'label'})
export class LabelPipe implements PipeTransform {
  	transform(objects, args: string, attr?: string) : any{
		return objects.filter(obj => {
			let attribute: any = 'value';
			if(attr){
				attribute = attr;
			}
			return obj[attribute]===args;
		})
  	}
}
