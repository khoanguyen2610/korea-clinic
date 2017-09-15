import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
	selector: 'app-public-general-partial-navigation',
	templateUrl: './navigation.component.html'
})

export class NavigationComponent implements OnInit {
	@Input() serviceCategories: any;
	@Input() newsCategories: any;
	@Input() modules: any;
	default_language_code: string;

	constructor(
		private _LocalStorageService: LocalStorageService,
	) {
		//=============== Get Params On Url ===============
		this.default_language_code = String(this._LocalStorageService.get('language_code'));
	}

	ngOnInit() {

	}

	onChangeLanguageCode(language_code: string){
		this._LocalStorageService.set('language_code', language_code);
		window.location.reload();
		return false;
	}


}
