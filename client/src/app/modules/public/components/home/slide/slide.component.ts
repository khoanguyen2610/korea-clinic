import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Configuration } from '../../../../../shared';
import { AuthService, SlideService, ScriptService } from '../../../../../services';

declare var jQuery: any;
declare var JACQUELINE_STORAGE: any;
declare var jacqueline_init_actions: any;
declare var initRevSlider: any;
declare var initRevSlider: any;
declare var initEssGrid: any;
declare var itemsmenu: any;

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-home-slide',
	templateUrl: './slide.component.html',
	providers: [SlideService]
})

export class SlideComponent implements OnInit {

	Items: Array<any> = [];
	language_code: string;
	number_item: number = 4;
	module_name: string = 'slide';

	constructor(
		private _AuthService: AuthService,
		private _SlideService: SlideService,
		private _Configuration: Configuration,
		private _ScriptService: ScriptService,
		private _LocalStorageService: LocalStorageService
	) {
		//=============== Get Params On Url ===============
		this.language_code = String(_LocalStorageService.get('language_code'));

	}

	ngOnInit() {
		this.getListData();
	}


	getListData() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this._Configuration.language_code);;
		params.set('limit', String(this.number_item));
		this._SlideService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				// Process Array include many array with 4 elements
				if (res.data.length) {
					this.Items = res.data;

					// this._ScriptService.load('custom').then(data => {
					// 	console.log('33333333333333333333custom')
					// 	if (jQuery(".rev_slider").length > 0) { initRevSlider() };
					// 	if (jQuery(".esg-grid").length > 0) { initEssGrid() };
					// 	itemsmenu();

					// }).catch(error => console.log(error));

					// this._ScriptService.load('core_init').then(data => {
					// 	JACQUELINE_STORAGE['theme_init_counter'] = 0;
					// 	jacqueline_init_actions();



					// }).catch(error => console.log(error));
				}


			}
		});
	}

	getModuleNameByLang() {
		return this.module_name;
	}
}
