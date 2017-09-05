import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import {  ScriptService } from './../../../services';

declare var jQuery: any;
declare var JACQUELINE_STORAGE: any;
declare var jacqueline_init_actions: any;
declare var initRevSlider: any;
declare var initRevSlider: any;
declare var initEssGrid: any;
declare var itemsmenu: any;



@Component({
	selector: 'app-public-root',
	templateUrl: './public.component.html',
})

export class PublicComponent  {
	constructor(
		private _ScriptService: ScriptService,
	) {
		_ScriptService.load('core_init', 'custom', 'grid_layout').then(data => {
			JACQUELINE_STORAGE['theme_init_counter'] = 0;
            jacqueline_init_actions();

            //=========================
            if (jQuery(".rev_slider").length > 0) {initRevSlider()};
			if (jQuery(".esg-grid").length > 0) {initEssGrid()};
			itemsmenu();

        }).catch(error => console.log(error));

   //      _ScriptService.load('custom').then(data => {

   //          if (jQuery(".rev_slider").length > 0) {initRevSlider()};
			// if (jQuery(".esg-grid").length > 0) {initEssGrid()};
			// itemsmenu();

   //      }).catch(error => console.log(error));

	}


	ngViewAfterInit(){




	}



}
