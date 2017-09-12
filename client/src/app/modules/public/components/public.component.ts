import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScriptService } from './../../../services';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { HttpInterceptorService } from 'ng-http-interceptor';
import { TranslateService } from 'ng2-translate';
import { Configuration } from './../../../shared';
import { LocalStorageService } from 'angular-2-local-storage';

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
})

export class PublicComponent  {
	private subscription: Subscription;

	curRouting?: string;
	template:string;
	template_home: Array<any> = ['', 'home', 'trang-chu'];
	module_name: string;
	activeRoute: boolean = false;
	is_last: boolean = false;

	page_content_wrap: string = 'page_content_wrap page_paddings_no';

	// template_pic
	constructor(
		private _ScriptService: ScriptService,
		private _Router: Router,
		private _TranslateService: TranslateService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService,
		private _ActivatedRoute: ActivatedRoute,
		private _HttpInterceptorService: HttpInterceptorService
	) {
		JACQUELINE_STORAGE['theme_init_counter'] = 0;

		_HttpInterceptorService.request().addInterceptor((data, method) => {
			this.is_last = false;
			jQuery('.loading').show();
			// this._LoadingAnimateService.setValue(true);

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
					var matches = routing.match(/service\/detail|dich-vu\/chi-tiet|news\/detail|tin-tuc\/chi-tiet/g);
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
				this.subscription = this._TranslateService.get('PUBLIC').subscribe((res: string) => {
					this.module_name = res[translateEl];
				});
			}
			this._Configuration.language_code = String(this._LocalStorageService.get('language_code'));

			// this._ScriptService.load('theme_shortcodes', 'widget', 'accordion', 'custom', 'core_init', 'core_googlemap', 'grid_layout').then(data => {
				//

			// this.initLayout();
			// this.initFullRow();
			jQuery(window).resize();
			setTimeout(() => {
				jacqueline_init_actions();
				if (jQuery(".rev_slider").length > 0) { initRevSlider() };
				if (jQuery(".esg-grid").length > 0) { initEssGrid(); };
				itemsmenu();
				jQuery(window).resize();
			}, 600)



	   //          //=========================
	   //          if (jQuery(".rev_slider").length > 0) {initRevSlider()};
				// if (jQuery(".esg-grid").length > 0) {initEssGrid()};
				// itemsmenu();

	        // }).catch(error => console.log(error));
			// jacqueline_init_actions();
		}
    }

    onActivate(componentRef){
		let action = componentRef.getAction();
		switch (action) {
			case 'list':
				this.page_content_wrap = 'page_content_wrap';
				break;
			case 'contact':
			case 'detail':
				this.page_content_wrap = 'page_content_wrap page_paddings_yes';
				break;
			default:
				// code...
				break;
		}
    }

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

}
