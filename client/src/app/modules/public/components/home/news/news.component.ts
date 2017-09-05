import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { Configuration } from '../../../../../shared';
import { AuthService, NewsService } from '../../../../../services';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-home-news',
	templateUrl: './news.component.html',
	providers: [NewsService]
})

export class NewsComponent implements OnInit {

	Items: Array<any> = [];
	lang_code: string = this._Configuration.defaultLang;
	number_item: number = 4;

	constructor(
		private _AuthService: AuthService,
		private _NewsService: NewsService,
		private _Configuration: Configuration,

	) {
		//=============== Get Params On Url ===============


	}

	ngOnInit() {
		this.getListData();
	}

	ngAfterViewInit() {

	}

	getListData() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.lang_code);
		params.set('limit', String(this.number_item));
		this._NewsService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				// Process Array include many array with 4 elements
				if (res.data.length) {
					this.Items = res.data;
				}

			}
		});
	}
}
