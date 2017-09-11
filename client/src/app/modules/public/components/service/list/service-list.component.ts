import { Component, OnInit, AfterViewInit, ElementRef, Renderer, ViewEncapsulation } from '@angular/core';
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
	private subscriptionEvents: Subscription;
	private hashtagSubscription: Subscription;

	controller: string = 'dich-vu';
	action_detail: string = 'chi-tiet';
	categories: Array<any> = [];
	items: Array<any> = [];
	_params: any;
	queryParams: any;
	hashtagParams:any;
	language_code: string;
	curRouting: string;
	module_name: string = 'service';

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
		private _ServiceService: ServiceService,
		private _ServiceCategoryService: ServiceCategoryService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService,
		private _ElementRef: ElementRef,
		private _Renderer: Renderer
	) {
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

		this.hashtagSubscription = _ActivatedRoute.fragment.subscribe(
			(param: any) => {
				this.hashtagParams = param;
			}
		);

		this.language_code = String(_LocalStorageService.get('language_code'));
		if(this.language_code == 'en'){
			this.controller = 'service';
			this.action_detail = 'detail';
		}

	}

	ngOnInit() {
		console.log('ServiceListComponent');
	}

	loadPage(){
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('item_status','active');

		this._ServiceCategoryService.getListData(params).subscribe(res => {
			if(res.status == 'success'){
				this.categories = res.data;
			}
		});

		this._ServiceService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				let items = res.data;
				items.forEach(item => {
					var image = JSON.parse(item.image);
					if(image) {
						item['preview_image'] = this._Configuration.base_url_image + this.module_name + '/' + image.filepath;
					}

				});
				this.items = items;
			}
		});
	}

	ngAfterViewInit(){
		setTimeout(() => {
			let data = this.categories;
			for(let i in data){
				/* item_key of service_category*/
				if(this._params.item_key){
					let item_key = this._params.item_key;
					if(item_key == data[i]['item_key'] && data[i]['language_code'] == this.language_code){
						let category_id = data[i]['id'];
						this.onFireClickFilter(category_id);
					}
				}
			}
		}, 500);
	}

	onFireClickFilter(filter_id){
		let self = this;
		this._ElementRef.nativeElement.querySelectorAll('.esg-filterbutton').forEach(function(elm){
			self._Renderer.setElementClass(elm, 'selected', false);
		});

		let ele = this._ElementRef.nativeElement.querySelector('[data-filter="filter-category-'+ filter_id +'"]');
		this._Renderer.setElementClass(ele, 'selected', true);
	}

	getAction(){
		return 'list';
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.subscriptionEvents.unsubscribe();
	}
}
