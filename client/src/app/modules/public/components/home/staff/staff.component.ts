import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
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

	Items: Array<any> = [];
	lang_code: string = this._Configuration.defaultLang;
	number_item: number = 4;
	module_name: string = ''

	constructor(
		private _AuthService: AuthService,
		private _StaffService: StaffService,
		private _Configuration: Configuration,

	) {
		//=============== Get Params On Url ===============


	}

	ngOnInit() {
		this.getListData();
	}

	ngAfterViewInit() {

	}

	getListData() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.lang_code);
		this._StaffService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				// Process Array include many array with 4 elements
				if(res.data.length) {
					var items = res.data;

					var next = 0;
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
}
