import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { ToastrConfig } from 'ngx-toastr';


import { Configuration } from './shared';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {
	title = 'app works!';
	constructor(private _TranslateService: TranslateService,
		private _Configuration: Configuration,
		private _ToastrConfig: ToastrConfig) {


		/*==========================================
		 * Config Default Language
		 *==========================================*/
		this._TranslateService.setDefaultLang(_Configuration.defaultLang);
		this._TranslateService.use(_Configuration.defaultLang);


		/*==========================================
		 * Config ToastrConfig
		 *==========================================*/
		this._ToastrConfig.positionClass = "toast-bottom-right";
		this._ToastrConfig.timeOut = 1000000;
		this._ToastrConfig.maxOpened = 7;
		this._ToastrConfig.progressBar = true;
		this._ToastrConfig.closeButton = true;
		this._ToastrConfig.preventDuplicates = true;
	}
}