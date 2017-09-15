import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

declare let window: any;
// declare let moment: any;

@Component({
	selector: 'app-public-general-header-mobile',
	templateUrl: './header-mobile.component.html',
})

export class HeaderMobileComponent implements OnInit {
	@Input() options: any;
	@Input() serviceCategories: any;
	@Input() newsCategories: any;
	@Input() modules: any;
	default_language_code: string;
	constructor(
		private _LocalStorageService: LocalStorageService,
	) {
		this.default_language_code = String(this._LocalStorageService.get('language_code'));
	}

	ngOnInit() {
	}

	onChangeLanguageCode(language_code: string){
		this._LocalStorageService.set('language_code', language_code);
		window.location.reload();
		return false;
	}


	ngOnDestroy() {

	}
}
