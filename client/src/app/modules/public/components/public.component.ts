import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import {  ScriptService } from './../../../services';
import { Router, ActivatedRoute } from '@angular/router';
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
	// template_pic
	constructor(
		private _ScriptService: ScriptService,
		private _Router: Router,
		private _TranslateService: TranslateService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService
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
			});

			this._Configuration.language_code = String(this._LocalStorageService.get('language_code'));
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

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}




}
