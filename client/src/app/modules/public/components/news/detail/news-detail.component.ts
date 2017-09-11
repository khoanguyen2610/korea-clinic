import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { AuthService, NewsService, NewsCategoryService, ServiceCategoryService } from '../../../../../services';
import { Configuration } from '../../../../../shared';
import * as moment from 'moment';

// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-news-detail',
	templateUrl: './news-detail.component.html',
	providers: [ NewsService, NewsCategoryService, ServiceCategoryService ]
})

export class NewsDetailComponent implements OnInit {
	private subscription: Subscription;

	_params: any
	news_categories:Array<any> = [];
	service_categories:Array<any> = [];
	Item:Array<any> = [];
	controller: string = 'tin-tuc';
	language_code: string;
	news_format_date: string = this._Configuration.news_format_date;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _ServiceCategoryService: ServiceCategoryService,
		private _NewsCategoryService: NewsCategoryService,
		private _NewsService: NewsService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService
	) {
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.language_code = String(_LocalStorageService.get('language_code'));
		if(this.language_code == 'en'){
			this.controller = 'news';
		}

		let params: URLSearchParams = new URLSearchParams();
		params.set('recursive','true');
		params.set('language_code', this.language_code);
		_ServiceCategoryService.getListData(params).subscribe(res => {
			if(res.status == 'success'){
				this.service_categories = res.data;
			}
		});

		_NewsCategoryService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				this.news_categories = res.data;
			}
		})
	}

	ngOnInit() {
		if(this._params.language_code){
			this.language_code = this._params.language_code;
		}

		let params: URLSearchParams = new URLSearchParams();
		params.set('item_key', this._params.item_key);
		params.set('language_code', this.language_code);
		this._NewsService.getByID(undefined, params).subscribe(res => {
			if(res.status == 'success'){
				let item = res.data;
				item['created_format_date'] = moment(item['created_at']).format(this.news_format_date);
				this.Item = item;
			}
		});
		console.log('NewsDetailComponent');
	}

	getAction(){
		return 'detail';
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
