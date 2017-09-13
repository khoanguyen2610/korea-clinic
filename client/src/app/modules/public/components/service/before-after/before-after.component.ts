import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Configuration } from '../../../../../shared';
import { AuthService, BeforeAfterService, ServiceCategoryService } from '../../../../../services';

// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-before-after',
	templateUrl: './before-after.component.html',
	providers: [ BeforeAfterService, ServiceCategoryService ]
})

export class BeforeAfterComponent implements OnInit {
	items: Array<any> = [];
	categories: Array<any> = [];
	language_code: string;
	module_name: string = 'beforeafter';
	width: string = '780';
	width_preview = 'width=1280';
	width_default = 'width=' + this.width;

	constructor(
		private _BeforeAfterService: BeforeAfterService,
		private _Configuration: Configuration,
		private _ServiceCategoryService: ServiceCategoryService,
		private _LocalStorageService: LocalStorageService
	) {
		this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('item_status','active');

		this._ServiceCategoryService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				this.categories = res.data;
			}
		});

		params.set('image_resize_width', this.width);
		this._BeforeAfterService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){

				var items = res.data;
				items.forEach(item => {
					var preview_image = item.image_url.replace(this.width_default, this.width_preview);
					item['preview_image'] = preview_image;

				});
				this.items = items;
			}
		});
	}

	getAction(){
		return 'list';
	}

	ngOnDestroy() {

	}
}
