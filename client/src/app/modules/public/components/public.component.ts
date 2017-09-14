import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScriptService } from './../../../services';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { HttpInterceptorService } from 'ng-http-interceptor';
import { TranslateService } from 'ng2-translate';
import { Configuration } from './../../../shared';
import { LocalStorageService } from 'angular-2-local-storage';

import { OptionsService, ServiceService, ServiceCategoryService, NewsCategoryService } from './../../../services';

declare var jQuery: any;
declare var JACQUELINE_STORAGE: any;
declare var jacqueline_init_actions: any;
declare var initRevSlider: any;
declare var initEssGrid: any;
declare var itemsmenu: any;
declare var window: any;
declare var document: any;



@Component({
	selector: 'app-public-root',
	templateUrl: './public.component.html',
	providers: [OptionsService, ServiceCategoryService, NewsCategoryService]
})

export class PublicComponent  {
	private translateSubscription: Subscription;

	curRouting?: string;
	template:string;
	template_home: Array<any> = ['', 'home', 'trang-chu'];
	module_name: string;
	activeRoute: boolean = false;
	is_last: boolean = false;
	options: Array<any> = [];
	modules: any;
	services: Array<any>;
	news: Array<any>;

	page_content_wrap: string = 'page_content_wrap page_paddings_no';

	// template_pic
	constructor(
		private _ScriptService: ScriptService,
		private _Router: Router,
		private _TranslateService: TranslateService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService,
		private _ActivatedRoute: ActivatedRoute,
		private _HttpInterceptorService: HttpInterceptorService,
		private _OptionsService: OptionsService,
		private _NewsCategoryService: NewsCategoryService,
		private _ServiceCategoryService: ServiceCategoryService,
	) {
		JACQUELINE_STORAGE['theme_init_counter'] = 0;

		_HttpInterceptorService.request().addInterceptor((data, method) => {
			this.is_last = false;
			jQuery('.loading').show();

			setTimeout(() => {
				if (this.is_last) {
					setTimeout(() => {
						jQuery('.loading').hide();
					}, 500);
				}
			}, 1500);
			return data;
		});

		_HttpInterceptorService.response().addInterceptor((res, method) => {
			this.is_last = true;
			return res;
		});


		this.getListOption();
		// Translate Module Service
		this._TranslateService.get('MODULE').subscribe((res: string) => {
			this.modules = res;
			this.getListServiceCategories();
		});

		this.getListNewsCategories();

	}

	ngAfterContentChecked() {
    	let routing = this._Router.url;
		if(this.curRouting != routing){

			this.curRouting = routing;
			var str = routing.substring(1);

			if (this.template_home.indexOf(str) > -1) {
				this.template = 'slide';
			} else {
				this.template = 'default';
				let arr_split_routing = routing.split('/');

				if (arr_split_routing.length > 1) {
					var matches = routing.match(/service\/detail|dich-vu\/chi-tiet|news\/detail|tin-tuc\/chi-tiet|equipment\/detail|trang-thiet-bi\/chi-tiet/g);
					if (matches) {
						this.template = 'blog';
					}
				}
			}

			var str_matches = str.match(/([a-z|\-]+)\//);
			var translateEl = str;
			if(str_matches) {
				translateEl = str_matches[1];
			}

			if (translateEl) {
				this.translateSubscription = this._TranslateService.get('PUBLIC').subscribe((res: string) => {
					this.module_name = res[translateEl];
				});
			}
			this._Configuration.language_code = String(this._LocalStorageService.get('language_code'));

			setTimeout(() => {
				jacqueline_init_actions();
				jQuery(window).resize();
				var metas = this._Configuration.metas;
				metas.forEach(meta => {
					jQuery('#' + meta).attr("content", this._Configuration[meta]);
				});
			}, 600);

		}
    }

    getListOption() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this._Configuration.language_code);
		params.set('item_status', 'active');

		this._OptionsService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				let items = res.data;
				items.forEach(item => {
					this.options[item.key] = item;
				});
			}
		});
    }

	// ngOnInit() {


	// }


	getListServiceCategories() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.modules['lang']);
		params.set('item_status', 'active');
		params.set('get_list_services', 'true');

		this._ServiceCategoryService.getListData(params).subscribe(res => {
			if (res.status == 'success') {
				this.services = res.data;
			}
		});

	}

	getListNewsCategories() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.modules['lang']);
		params.set('item_status', 'active');

		this._NewsCategoryService.getListData(params).subscribe(res => {
			if (res.status == 'success') {
				this.news = res.data;
			}
		});

	}


	ngOnDestroy() {
		this.translateSubscription.unsubscribe();
	}

}
