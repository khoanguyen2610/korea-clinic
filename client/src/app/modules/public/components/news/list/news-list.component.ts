import { Component, OnInit, AfterViewInit, Renderer, ElementRef, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { AuthService, NewsService, NewsCategoryService } from '../../../../../services';
import { Configuration } from '../../../../../shared';
import * as moment from 'moment';

// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-news-list',
	templateUrl: './news-list.component.html',
	providers: [ NewsService, NewsCategoryService ]
})

export class NewsListComponent implements OnInit {
	private subscription: Subscription;
	private subscriptionEvents: Subscription;

	controller: string = 'tin-tuc';
	action_detail: string = 'chi-tiet';
	categories: Array<any> = [];
	items: Array<any> = [];
	_params: any;
	queryParams: any;
	language_code: string;
	curRouting: string;
	module_name: string = 'news';
	news_format_date: string = this._Configuration.news_format_date;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
		private _NewsService: NewsService,
		private _NewsCategoryService: NewsCategoryService,
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

		this.language_code = String(_LocalStorageService.get('language_code'));
		if(this.language_code == 'en'){
			this.controller = 'news';
			this.action_detail = 'detail';
		}
	}

	ngOnInit() {

	}

	loadPage(){
		let params: URLSearchParams = new URLSearchParams();

		params.set('language_code', this.language_code);
		params.set('item_status','active');

		this._NewsCategoryService.getListData(params).subscribe(res => {
			if(res.status == 'success'){
				this.categories = res.data;
			}
		});

		if(this._params.category_id){
			params.set('item_key',this._params.item_key);
		}


		params.set('image_resize_width','1280');
		this._NewsService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				this.items = res.data;
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
