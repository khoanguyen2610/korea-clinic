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
	selector: 'app-public-general-header-mobile',
	templateUrl: './header-mobile.component.html',
})

export class HeaderMobileComponent implements OnInit {
	
	constructor(
	) {

	}

	ngOnInit() {
	}


	ngOnDestroy() {

	}
}
