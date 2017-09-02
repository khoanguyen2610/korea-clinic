import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { AuthService, ServiceService } from '../../../../../services';

// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-service-list',
	templateUrl: './service-list.component.html',
	providers: [ ServiceService ]
})

export class ServiceListComponent implements OnInit {
	controller: string = 'dich-vu';

	constructor(
		private _ServiceService: ServiceService,
	) {

	}

	ngOnInit() {
		console.log('ServiceListComponent');
	}


	ngOnDestroy() {

	}
}
