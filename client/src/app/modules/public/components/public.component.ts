import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScriptService } from './../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';

declare var jQuery: any;
declare var JACQUELINE_STORAGE: any;
declare var jacqueline_init_actions: any;
declare var initRevSlider: any;
declare var initEssGrid: any;
declare var itemsmenu: any;
declare var window: any;



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

	page_content_wrap: string = 'page_content_wrap page_paddings_no';

	// template_pic
	constructor(
		private _ScriptService: ScriptService,
		private _Router: Router,
		private _TranslateService: TranslateService
	) {
		JACQUELINE_STORAGE['theme_init_counter'] = 0;

	}

	ngAfterContentChecked() {
    	let routing = this._Router.url;
		if(this.curRouting != routing){
			this.curRouting = routing;
			var str = routing.substring(1);


			this.subscription = this._TranslateService.get('PUBLIC').subscribe((res: string) => {
				this.module_name = res[str];
				console.log(res)
				console.log(res[str])
			});


			this.template = 'default';
			if(this.template_home.indexOf(str) > -1) {
				this.template = 'slide';
			}
			// this._ScriptService.load('theme_shortcodes', 'widget', 'accordion', 'custom', 'core_init', 'core_googlemap', 'grid_layout').then(data => {
				// JACQUELINE_STORAGE['theme_init_counter'] = 0;

				setTimeout(() => {

					if (jQuery(".rev_slider").length > 0) { initRevSlider() };
					if (jQuery(".esg-grid").length > 0) { initEssGrid() };
					itemsmenu();
					jacqueline_init_actions();

				}, 500)



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
			case 'detail':
				this.page_content_wrap = 'page_content_wrap page_paddings_yes';
				break;
			default:
				// code...
				break;
		}
		console.log(this.page_content_wrap);
    }

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}




}
