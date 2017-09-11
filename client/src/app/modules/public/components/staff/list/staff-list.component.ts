import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { TranslateService } from 'ng2-translate';
import { AuthService, StaffService } from '../../../../../services';
import { Configuration } from '../../../../../shared';

// declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-general-staff-list',
	templateUrl: './staff-list.component.html',
	providers: [ StaffService ]
})

export class StaffListComponent implements OnInit {
	private subscription: Subscription;
	private querySubscription: Subscription;

	controller: string = 'chuyen-gia';
	Items: Array<any> = [];
	_params: any;
	queryParams: any;
	language_code: string;
	modules: any;
	number_item: number = 4;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _StaffService: StaffService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService,
		private _TranslateService: TranslateService
	) {
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.querySubscription = _ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this.queryParams = param;
			}
		);

		this.language_code = String(_LocalStorageService.get('language_code'));
		if(this.language_code == 'en'){
			this.controller = 'staff';
		}
	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('image_resize_square', '370');
		params.set('item_status','acitve');
		this._StaffService.getListAll(params).subscribe(res => {
			console.log(res)
			if(res.status == 'success'){
				// let data = res.data;
				// let temp = {
				// 	'items': [],
				// 	'timestamp': 0
				// };

				// let j = 0;
				// let c = res.data.length;
				// for(let i = 0; i < data.length; i++){
				// 	if(i && (i % 4 == 0)){
				// 		this.items.push(temp);
				// 		temp = {
				// 			'items': [],
				// 			'timestamp': 0
				// 		};
				// 	}

				// 	temp.items.push(data[i]);
				// 	temp.timestamp = new Date().getTime();

				// 	j = i + 1;
				// 	if((c == j) && (j % 4 != 0)){
				// 		this.items.push(temp);
				// 	}

				// }

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

		// Translate Module Service
		this._TranslateService.get('MODULE').subscribe((res: string) => {
			this.modules = res;
		});
	}

	getAction(){
		return 'list';
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.querySubscription.unsubscribe();
	}
}
