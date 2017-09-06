import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
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
	language_code: string;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _FaqService: FaqService,
		private _ScriptService: ScriptService,
		private _ServiceCategoryService: ServiceCategoryService,
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

		_ScriptService.load('theme_shortcodes', 'widget', 'accordion').then(data => {
            // jacqueline_init_actions();
        }).catch(error => console.log(error));

        this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
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
		});
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.querySubscription.unsubscribe();
	}
}
