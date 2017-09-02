import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { AuthService, ServiceService } from '../../../../../services';

// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-service-detail',
	templateUrl: './service-detail.component.html',
	providers: [ ServiceService ]
})

export class ServiceDetailComponent implements OnInit {
	private subscription: Subscription;

	constructor(
		private _ServiceService: ServiceService,
	) {

	}

	ngOnInit() {
		console.log('ServiceDetailComponent');
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
