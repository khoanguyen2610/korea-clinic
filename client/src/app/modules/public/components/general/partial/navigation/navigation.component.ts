import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from 'angular-2-local-storage';

import { Configuration } from '../../../../../../shared';
import { ServiceCategoryService, NewsCategoryService } from '../../../../../../services';

declare let $: any;

@Component({
	selector: 'app-public-general-partial-navigation',
	templateUrl: './navigation.component.html',
	providers: [ServiceCategoryService, NewsCategoryService]

})

export class NavigationComponent implements OnInit {
	private subscription: Subscription;
	modules: any;
	serviceCategories: Array<any>;
	services: Array<any>;
	newsCategories: Array<any>;
	news: Array<any>;

	default_language_code: string;

	constructor(
		private _Configuration: Configuration,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
		private _NewsCategoryService: NewsCategoryService,
		private _ServiceCategoryService: ServiceCategoryService,
		private _TranslateService: TranslateService,
		private _LocalStorageService: LocalStorageService
	) {
		//=============== Get Params On Url ===============
		this.default_language_code = String(this._LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		// Translate Module Service
		this._TranslateService.get('MODULE').subscribe((res: string) => {
			this.modules = res;
			this.getListServiceCategories();
		});

		this.getListNewsCategories();

	}


	onChangeLanguageCode(language_code: string){
		this._LocalStorageService.set('language_code', language_code);
		window.location.reload();
		return false;
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
