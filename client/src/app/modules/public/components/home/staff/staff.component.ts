import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Configuration } from '../../../../../shared';
import { AuthService, StaffService } from '../../../../../services';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-home-staff',
	templateUrl: './staff.component.html',
	providers: [StaffService]
})

export class StaffComponent implements OnInit {
	@Input() modules: any;
	Items: Array<any> = [];
	language_code: string;
	number_item: number = 4;
	module_name: string = 'staff';

	constructor(
		private _AuthService: AuthService,
		private _LocalStorageService: LocalStorageService,
		private _StaffService: StaffService,
		private _Configuration: Configuration,

	) {
		//=============== Get Params On Url ===============

		this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		this.getListData();
	}

	ngAfterViewInit() {

	}

	getListData() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('image_resize_square', '370');
		params.set('item_status', 'active');
		this._StaffService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				// Process Array include many array with 4 elements
				var items = res.data;

				var next = 0;
				if (items.length <= this.number_item) {
					for (let i = 0; i < items.length; i++) {

						if (next < this.number_item) {
							if (!next) {
								var arr_item_four = [];
							}
							arr_item_four.push(items[i]);

							next++;
						}
					}
					this.Items.push(arr_item_four);
				} else {
					for (let i = 0; i < items.length; i++) {

						if (next < this.number_item) {
							if (!next) {
								var arr_item_four = [];
							}
							arr_item_four.push(items[i]);

							next++;
						} else {
							next = 0;
							this.Items.push(arr_item_four);
						}


					}
				}

			}
		});
	}

	getModuleNameByLang() {
		return this.module_name;
	}
}
