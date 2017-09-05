import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { AuthService, StaffService } from '../../../../../services';


// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-staff-detail',
	templateUrl: './staff-detail.component.html',
	providers: [ StaffService ]
})

export class StaffDetailComponent implements OnInit {
	private subscription: Subscription;
	language_code: string = String(this._LocalStorageService.get('language_code'));

	constructor(
		private _StaffService: StaffService,
		private _LocalStorageService: LocalStorageService
	) {

	}

	ngOnInit() {
		console.log('StaffDetailComponent');
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
