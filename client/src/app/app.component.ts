import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { ToastrConfig } from 'ngx-toastr';
import { LocalStorageService } from 'angular-2-local-storage';

import { Configuration } from './shared';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {
	title = 'app works!';
	constructor(private _TranslateService: TranslateService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService,
		private _ToastrConfig: ToastrConfig) {


		/*==========================================
		 * Config Default Language
		 *==========================================*/
		if(!this._LocalStorageService.get('language_code')){
			this._LocalStorageService.set('language_code', _Configuration.defaultLang);

		}
		let language_code: string = String(this._LocalStorageService.get('language_code'));
		this._TranslateService.setDefaultLang(language_code);
		this._TranslateService.use(language_code);

		/*==========================================
		 * Config ToastrConfig
		 *==========================================*/
		this._ToastrConfig.positionClass = "toast-top-right";
		this._ToastrConfig.timeOut = 2000;
		this._ToastrConfig.maxOpened = 7;
		this._ToastrConfig.progressBar = true;
		this._ToastrConfig.closeButton = true;
		this._ToastrConfig.preventDuplicates = true;
	}
}
