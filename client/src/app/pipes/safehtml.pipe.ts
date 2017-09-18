import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'safeHtml'})

export class SafeHtmlPipe implements PipeTransform {
  	constructor(
  		private _DomSanitizer: DomSanitizer
  	){ }

  	transform(content: string) : any{
		return this._DomSanitizer.bypassSecurityTrustHtml(content);
  	}
}