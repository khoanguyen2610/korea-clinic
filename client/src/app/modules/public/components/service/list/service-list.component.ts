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
	private subscription: Subscription;
	private querySubscription: Subscription;

	controller: string = 'dich-vu';
	services: Array<any> = [];
	_params: any
	queryParams: any;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _ServiceService: ServiceService,
	) {
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.querySubscription = _ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this.queryParams = param;
			}
		);
	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();
		if(this._params.id){
			params.set('service_category_id',this._params.id);
		}
		params.set('item_status','active');

		this._ServiceService.getAll(params).subscribe(res => {
			console.log(res);
		})
		console.log('ServiceListComponent');
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.querySubscription.unsubscribe();
	}
}
