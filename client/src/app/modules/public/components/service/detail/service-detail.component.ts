import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Rx';
import { LocalStorageService } from 'angular-2-local-storage';
import { ServiceService, ServiceCategoryService } from '../../../../../services';
import { Configuration } from '../../../../../shared';

declare let initMeta: any;
declare let document: any;

@Component({
	selector: 'app-public-service-detail',
	templateUrl: './service-detail.component.html',
	providers: [ ServiceService, ServiceCategoryService ]
})

export class ServiceDetailComponent implements OnInit {
	private subscription: Subscription;
	private subscriptionEvents: Subscription;

	_params: any
	categories: Array<any> = [];
	Item: Array<any> = [];
	controller: string = 'dich-vu';
	action_detail: string = 'chi-tiet';
	action_before_after: string = 'truoc-sau';
	curRouting: string;
	language_code: string;
	currentUrl: string;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
		private _ServiceService: ServiceService,
		private _ServiceCategoryService: ServiceCategoryService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService,
	) {
		//set Url
	    this.currentUrl = document.URL;
		this.language_code = String(_LocalStorageService.get('language_code'));

		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.subscriptionEvents = this._Router.events.subscribe((val) => {
			let routing = this._Router.url;
			if (this.curRouting != routing) {
				this.curRouting = routing;
				this.loadPage();
			}
		});

		if(this.language_code == 'en'){
			this.controller = 'service';
			this.action_detail = 'detail';
			this.action_before_after = 'before-after';
		}

		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('item_status', 'active');
		params.set('get_list_services', 'true');
		_ServiceCategoryService.getListData(params).subscribe(res => {
			if(res.status == 'success'){
				this.categories = res.data;
			}
		});
	}

	ngOnInit() {
		this.loadPage();
	}

	loadPage(){
		let params: URLSearchParams = new URLSearchParams();
		params.set('image_resize_width', '1440');
		params.set('item_key', this._params.item_key);
		params.set('language_code', this.language_code);
		this._ServiceService.getByID(null, params).subscribe(res => {
			if(res.status == 'success'){
				this.Item = res.data;

				var metas = this._Configuration.metas;
				metas.forEach(meta => {
					this._Configuration[meta] = this.Item[meta];
					//set meta data
					initMeta(meta, this.Item[meta]);
				});
			}
		});
	}

	getAction(){
		return 'detail';
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.subscriptionEvents.unsubscribe();
	}
}
