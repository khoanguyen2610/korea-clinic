import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { AuthService, NewsService, NewsCategoryService } from '../../../../../services';
import { Configuration } from '../../../../../shared';

// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-news-list',
	templateUrl: './news-list.component.html',
	providers: [ NewsService, NewsCategoryService ]
})

export class NewsListComponent implements OnInit {
	private subscription: Subscription;
	private querySubscription: Subscription;

	controller: string = 'tin-tuc';
	categories: Array<any> = [];
	items: Array<any> = [];
	_params: any;
	queryParams: any;
	language_code: string;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _NewsService: NewsService,
		private _NewsCategoryService: NewsCategoryService,
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

		this.language_code = String(_LocalStorageService.get('language_code'));
		if(this.language_code == 'en'){
			this.controller = 'news';
		}
	}

	ngOnInit() {


		let params: URLSearchParams = new URLSearchParams();

		params.set('language_code', this.language_code);
		params.set('item_status','active');

		this._NewsCategoryService.getListData(params).subscribe(res => {
			if(res.status == 'success'){
				this.categories = res.data;
			}
		});

		if(this._params.id){
			params.set('news_category_id',this._params.id);
		}

		this._NewsService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				let data = res.data;
				let items = [];
				for(let i in data){
					data[i]['nice_url'] = data[i]['title'].replace(/ /g, '-');
					items.push(data[i]);
				}
				this.items = items;
			}
		});
		console.log('NewsListComponent');
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.querySubscription.unsubscribe();
	}
}
