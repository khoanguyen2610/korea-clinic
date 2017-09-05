import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { AuthService, ServiceService, ServiceCategoryService } from '../../../../../services';
import { Configuration } from '../../../../../shared';

// declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-service-list',
	templateUrl: './service-list.component.html',
	providers: [ ServiceService, ServiceCategoryService ]
})

export class ServiceListComponent implements OnInit {
	private subscription: Subscription;
	private querySubscription: Subscription;

	controller: string = 'dich-vu';
	categories: Array<any> = [];
	services: Array<any> = [];
	_params: any
	queryParams: any;
	lang_code: string;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _ServiceService: ServiceService,
		private _ServiceCategoryService: ServiceCategoryService,
		private _Configuration: Configuration,
		private _cdr: ChangeDetectorRef
	) {
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.querySubscription = _ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this.queryParams = param;
			}
		);

		this.lang_code = _Configuration.defaultLang;
	}

	ngOnInit() {
		if(this._params.lang_code){
			this.lang_code = this._params.lang_code;
		}

		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.lang_code);
		params.set('item_status','active');

		this._ServiceCategoryService.getListData(params).subscribe(res => {
			if(res.status == 'success'){
				this.categories = res.data;
			}
		});


		if(this._params.id){
			params.set('service_category_id',this._params.id);
		}

		this._ServiceService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				let data = res.data;
				let items = [];
				for(let i in data){
					data[i]['nice_url'] = data[i]['title'].replace(/ /g, '-');
					items.push(data[i]);
				}
				this.services = items;
			}
		})
		console.log('ServiceListComponent');
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.querySubscription.unsubscribe();
	}
}
