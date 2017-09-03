import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { AuthService, NewsService } from '../../../../../services';

// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-news-list',
	templateUrl: './news-list.component.html',
	providers: [ NewsService ]
})

export class NewsListComponent implements OnInit {
	private subscription: Subscription;
	private querySubscription: Subscription;

	controller: string = 'tin-tuc';
	articles: Array<any> = [];
	_params: any
	queryParams: any;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _NewsService: NewsService,
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
		params.set('item_status','active');

		this._NewsService.getAll(params).subscribe(res => {
			console.log(res);
		})
		console.log('NewsListComponent');
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.querySubscription.unsubscribe();
	}
}
