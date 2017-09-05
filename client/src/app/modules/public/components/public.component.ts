import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import {  ScriptService } from './../../../services';
import { Router, ActivatedRoute } from '@angular/router';

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
	curRouting?: string;
	constructor(
		private _ScriptService: ScriptService,
		private _Router: Router
	) {
		JACQUELINE_STORAGE['theme_init_counter'] = 0;

	}


	ngAfterContentChecked() {
    	let routing = this._Router.url;
		if(this.curRouting != routing){
			this.curRouting = routing;
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




}
