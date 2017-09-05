import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { ScriptService, FaqService, ServiceCategoryService } from '../../../../../services';
import { Configuration } from '../../../../../shared';

// declare let moment: any;

@Component({
	selector: 'app-public-faq-list',
	templateUrl: './faq-list.component.html',
	providers: [ FaqService, ServiceCategoryService ]
})

export class FaqListComponent implements OnInit {
	private subscription: Subscription;
	private querySubscription: Subscription;
	Items: Array<any> = [];
	serviceCategories: Array<any> = [];
	_params: any;
	queryParams: any;
	lang_code: string;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _ScriptService: ScriptService,
		private _FaqService: FaqService,
		private _ServiceCategoryService: ServiceCategoryService,
		private _Configuration: Configuration
	) {
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.querySubscription = _ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this.queryParams = param;
			}
		);

		this.lang_code = _Configuration.defaultLang;
	}

	ngOnInit() {
		if(this._params.lang_code){
			this.lang_code = this._params.lang_code;
		}

		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.lang_code);
		params.set('item_status','active');



		this._ServiceCategoryService.getListData(params).subscribe(res => {
			if(res.status == 'success'){
				this.serviceCategories = res.data;
			}
		});

		this._FaqService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				this.Items = res.data;
			}
		})
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.querySubscription.unsubscribe();
	}
}
