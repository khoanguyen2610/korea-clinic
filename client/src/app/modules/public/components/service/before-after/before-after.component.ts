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

	constructor(
		private _BeforeAfterService: BeforeAfterService,
		private _Configuration: Configuration,
		private _ServiceCategoryService: ServiceCategoryService,
		private _LocalStorageService: LocalStorageService
	) {
		this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		console.log('BeforeAfterComponent');
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('item_status','active');

		this._ServiceCategoryService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				this.categories = res.data;
				console.log(res.data);
			}
		});

		this._BeforeAfterService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				let items = res.data;
				items.forEach(item => {
					var image = JSON.parse(item.image);
					if(image) {
						item['preview_image'] = this._Configuration.base_url_image + this.module_name + '/' + image.filepath;
					}

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
