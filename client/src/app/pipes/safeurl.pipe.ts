import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'safeUrl'})

export class SafeUrlPipe implements PipeTransform {
  	constructor(
  		private _DomSanitizer: DomSanitizer
  	){ }

  	transform(url: string) : any{
		return this._DomSanitizer.bypassSecurityTrustResourceUrl(url);
  	}
}
