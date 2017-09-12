import { Component, OnInit, Input, EventEmitter, ElementRef } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { TranslateService } from 'ng2-translate';7

import { Configuration } from '../../../../../../shared';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { AuthService, ServiceService, ServiceCategoryService, NewsCategoryService } from '../../../../../../services';

declare let $: any;

@Component({
	selector: 'app-public-general-partial-navigation',
	templateUrl: './navigation.component.html',
	providers: [ServiceService, ServiceCategoryService, NewsCategoryService]

})

export class NavigationComponent implements OnInit {
	private subscription: Subscription;
	language_code: string;
	modules: any;
	serviceCategories: Array<any>;
	services: Array<any>;
	newsCategories: Array<any>;
	news: Array<any>;

	constructor(
		private _Configuration: Configuration,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
		private _NewsCategoryService: NewsCategoryService,
		private _ServiceCategoryService: ServiceCategoryService,
		private _ServiceService: ServiceService,
		private _TranslateService: TranslateService
	) {
		//=============== Get Params On Url ===============
		this.language_code = this._Configuration.language_code;
	}

	ngOnInit() {
		// Translate Module Service
		this._TranslateService.get('MODULE').subscribe((res: string) => {
			this.modules = res;
			this.getListServiceCategories();
		});

		this.getListNewsCategories();

	}


	getListServiceCategories() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.modules['lang']);
		params.set('item_status', 'active');
		params.set('get_list_services', 'true');

		this._ServiceCategoryService.getListData(params).subscribe(res => {
			if (res.status == 'success') {
				this.serviceCategories = res.data;
			}
		});

	}

	getListNewsCategories() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.modules['lang']);
		params.set('item_status', 'active');

		this._NewsCategoryService.getListData(params).subscribe(res => {
			if (res.status == 'success') {
				this.newsCategories = res.data;
			}
		});

	}


	ngOnDestroy(){
		this.subscription.unsubscribe();
	}
}