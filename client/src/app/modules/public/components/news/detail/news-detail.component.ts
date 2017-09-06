import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { AuthService, NewsService, ServiceCategoryService } from '../../../../../services';
import { Configuration } from '../../../../../shared';

// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-news-detail',
	templateUrl: './news-detail.component.html',
	providers: [ NewsService, ServiceCategoryService ]
})

export class NewsDetailComponent implements OnInit {
	private subscription: Subscription;

	_params: any
	categories:Array<any> = [];
	Item:Array<any> = [];
	language_code: string;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _ServiceCategoryService: ServiceCategoryService,
		private _NewsService: NewsService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService
	) {
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.language_code = String(_LocalStorageService.get('language_code'));

		let params: URLSearchParams = new URLSearchParams();
		params.set('recursive','true');
		params.set('language_code', this.language_code);
		_ServiceCategoryService.getListData(params).subscribe(res => {
			if(res.status == 'success'){
				this.categories = res.data;
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
				this.Item = res.data;
			}
		});
		console.log('NewsDetailComponent');
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
