import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../../shared';

import { NewsCategory } from '../../../../../../models';
import { NewsCategoryService } from './../../../../../../services';
import { ToastrService } from 'ngx-toastr';

declare let $: any;

@Component({
	selector: 'app-news-category-form-content',
	templateUrl: './news-category-form-content.component.html',

})

export class NewsCategoryFormContentComponent implements OnInit {
	private subscription: Subscription;
	@Input('language_code') language_code: string;
	@Input('Item') Item = new NewsCategory();
	@Input('is_validated') is_validated: boolean;
	@Output('file') fileOutput = new EventEmitter();

	_params: any;
	NewsCategoryOptions: Array<any> = [];

	constructor(
		private _NewsCategoryService: NewsCategoryService,
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


		this._NewsCategoryService.getListData(paramData).subscribe(res => {
			if (res.status == 'success') {

				var items = res.data;
				var options = [];
				items.forEach(item => {
						let option = {id: item['id'], text: item['title']};
						options.push(option);
				});
				this.NewsCategoryOptions = options;

				if (this._params.method == 'create') {
					let lang = this.language_code;
					var Item = new NewsCategory();
					this.Item['language_code'] = lang;
					this.Item['parent'] = this.NewsCategoryOptions[0].id;

				}
console.log(this.NewsCategoryOptions[0].id)
				console.log(this.Item)
			}

		});
	}


	ngOnDestroy(){
		this.subscription.unsubscribe();
	}
}