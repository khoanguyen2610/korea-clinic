import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';

import { Configuration } from '../../../../../shared';


declare let window: any;
// declare let moment: any;

@Component({
	selector: 'app-public-general-header',
	templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {
	default_language_code: string;
	constructor(
		private _LocalStorageService: LocalStorageService,
		private _Configuration: Configuration
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
