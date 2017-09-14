import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { NewsService, NewsCategoryService  } from '../../../../../services';
import { Configuration } from '../../../../../shared';
import * as moment from 'moment';

// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-news-detail',
	templateUrl: './news-detail.component.html',
	providers: [ NewsService, NewsCategoryService ]
})

export class NewsDetailComponent implements OnInit {
	private subscription: Subscription;

	_params: any
	categories: Array<any> = [];
	Item: Array<any> = [];
	controller: string = 'tin-tuc';
	service_controller: string = 'dich-vu';
	action_before_after: string = 'truoc-sau';
	language_code: string;
	news_format_date: string = this._Configuration.news_format_date;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
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
			this.service_controller = 'service';
			this.action_before_after = 'before-after';
		}

		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('item_status', 'active');

		_NewsCategoryService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				this.categories = res.data;
			}
		});
	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('item_key', this._params.item_key);
		params.set('language_code', this.language_code);
		this._NewsService.getByID(null, params).subscribe(res => {
			if(res.status == 'success'){
				let item = res.data;
				item['created_format_date'] = moment(item['created_at']).format(this.news_format_date);
				this.Item = item;

				var metas = this._Configuration.metas;
				metas.forEach(meta => {
					this._Configuration[meta] = this.Item[meta];
				});
			}
		});
	}

	getAction(){
		return 'detail';
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
