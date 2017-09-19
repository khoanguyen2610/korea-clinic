import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Configuration } from '../../../../../shared';
import { SlideService, ScriptService } from '../../../../../services';

declare let jQuery: any;
declare let window: any;
declare let initRevSlider: any;

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
		params.set('language_code', this.language_code);;
		params.set('limit', String(this.number_item));
		params.set('image_resize_width', '1900');
		params.set('image_resize_height', '750');
		params.set('item_status', 'active');
		this._SlideService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				// Process Array include many array with 4 elements
				if (res.data.length) {
					this.Items = res.data;
					// items.forEach(item => {
					// 	var image = JSON.parse(item.image);
					// 	if(image) {
					// 		item['preview_image'] = this._Configuration.base_url_image + this.module_name + '/' + image.filepath;
					// 	}
					//
					// });
					setTimeout(() => {
						if (jQuery(".rev_slider").length > 0) { initRevSlider() };
					}, 200);
				}


			}
		});
	}

	openUrl(url){
		if(url && url != 'undefined' && url !='null'){
			var windowReference = window.open();
			windowReference.location.href = url;
		}
	}

	getModuleNameByLang() {
		return this.module_name;
	}
}
