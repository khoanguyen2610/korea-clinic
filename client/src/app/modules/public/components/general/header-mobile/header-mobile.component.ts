import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import { Configuration } from '../../../../../shared';

declare let window: any;
// declare let moment: any;

@Component({
	selector: 'app-public-general-header-mobile',
	templateUrl: './header-mobile.component.html',
})

export class HeaderMobileComponent implements OnInit {
	@Input() options: any;
	constructor(
	) {

	}

	ngOnInit() {
	}


	ngOnDestroy() {

	}
}
