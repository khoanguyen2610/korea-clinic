import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
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

	constructor(
		private _StaffService: StaffService,
	) {

	}

	ngOnInit() {
		console.log('StaffDetailComponent');
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
