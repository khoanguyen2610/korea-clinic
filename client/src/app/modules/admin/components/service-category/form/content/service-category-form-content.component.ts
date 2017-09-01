import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../../shared';

import { ServiceCategory } from '../../../../../../models';
import { ServiceCategoryService } from './../../../../../../services';
import { ToastrService } from 'ngx-toastr';

declare let $: any;

@Component({
	selector: 'app-service-category-form-content',
	templateUrl: './service-category-form-content.component.html',

})

export class ServiceCategoryFormContentComponent implements OnInit {
	private subscription: Subscription;
	@Input('language_code') language_code: string;
	@Input('is_validated') is_validated: boolean;
	@Input('Item') Item = new ServiceCategory();
	@Output('file') fileOutput = new EventEmitter();

	_params: any;
	serviceCategoryOptions: Array<any> = [];

	constructor(
		private _ServiceCategoryService: ServiceCategoryService,
		private _Configuration: Configuration,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
	) {
		//=============== Get Params On Url ===============
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

	}

	ngOnInit(){
		this.getListCategory();
	}

	getListCategory() {
		let paramData: URLSearchParams = new URLSearchParams();
		// Prepare params
		paramData.set('language_code', this.language_code);
		paramData.set('recursive', 'true');


		this._ServiceCategoryService.getListData(paramData).subscribe(res => {
			if (res.status == 'success') {

				var items = res.data;
				var options = [];
				items.forEach(item => {
						let option = {id: item['id'], text: item['title']};
						options.push(option);
				});
				this.serviceCategoryOptions = options;
			}

		});
	}


	ngOnDestroy(){
		this.subscription.unsubscribe();
	}
}