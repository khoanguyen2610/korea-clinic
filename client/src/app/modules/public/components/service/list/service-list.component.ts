import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { AuthService, ServiceService } from '../../../../../services';
import { Configuration } from '../../../../../shared';

// declare let $: any;
declare let moment: any;

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
	lang_code: string = this._Configuration.defaultLang;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _ServiceService: ServiceService,
		private _Configuration: Configuration
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
		params.set('language_code', this.lang_code);
		params.set('item_status','active');

		this._ServiceService.getListData(params).subscribe(res => {
			if(res.status == 'success'){
				let data = res.data;
				let temp = {
					'items': [],
					'timestamp': 0
				};
				let j = 0;
				for(let i in data){
					if(j == 4){
						this.services.push(temp);
						temp = {
							'items': [],
							'timestamp': 0
						};
						j = 0;
					}
					temp.items.push(data[i]);
					temp.timestamp = moment('x');
					j++;
				}
				console.log(this.services);
			}
		})
		console.log('ServiceListComponent');
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.querySubscription.unsubscribe();
	}
}
