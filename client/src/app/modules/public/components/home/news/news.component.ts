import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Configuration } from '../../../../../shared';
import { AuthService, NewsService } from '../../../../../services';
import * as moment from 'moment';

declare let $: any;

@Component({
	selector: 'app-public-home-news',
	templateUrl: './news.component.html',
	providers: [NewsService]
})

export class NewsComponent implements OnInit {
	@Input() modules: any;
	Items: Array<any> = [];
	controller: string = 'tin-tuc';
	language_code: string;
	number_item: number = 4;
	news_format_date: string = this._Configuration.news_format_date;

	constructor(
		private _AuthService: AuthService,
		private _NewsService: NewsService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService
	) {
		//=============== Get Params On Url ===============

		this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		this.getListData();
	}

	ngAfterViewInit() {

	}

	getListData() {
		console.log(this._Configuration.language_code);
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('limit', String(this.number_item));
		this._NewsService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				// Process Array include many array with 4 elements
				if (res.data.length) {
					var items = res.data;
					items.forEach(item => {
						item['created_format_date'] = moment(item['created_at']).format(this.news_format_date);
					});
					this.Items = items;

				}

			}
		});
	}
}
