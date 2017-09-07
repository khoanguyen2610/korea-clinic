import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
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
	private hashtagSubscription: Subscription;

	controller: string = 'dich-vu';
	categories: Array<any> = [];
	items: Array<any> = [];
	_params: any;
	queryParams: any;
	hashtagParams:any;
	language_code: string;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _ServiceService: ServiceService,
		private _ServiceCategoryService: ServiceCategoryService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService
	) {
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.querySubscription = _ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this.queryParams = param;
			}
		);

		this.hashtagSubscription = _ActivatedRoute.fragment.subscribe(
			(param: any) => {
				this.hashtagParams = param;
			}
		);

		this.language_code = String(_LocalStorageService.get('language_code'));
		if(this.language_code == 'en'){
			this.controller = 'service';
		}

	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
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
				this.items = items;
			}
		})
		console.log('ServiceListComponent');
	}

	getAction(){
		return 'list';
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.querySubscription.unsubscribe();
	}
}
