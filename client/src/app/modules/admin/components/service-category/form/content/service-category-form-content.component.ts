import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../../shared';

import { ServiceCategory } from '../../../../../../models';
import { ToastrService } from 'ngx-toastr';

declare let $: any;

@Component({
	selector: 'app-service-category-form-content',
	templateUrl: './service-category-form-content.component.html',

})

export class ServiceCategoryFormContentComponent implements OnInit {
	private subscription: Subscription;
	@Input('language_code') language_code: string;
	@Input('Item') Item = new ServiceCategory();
	@Output('file') fileOutput = new EventEmitter();

	_params: any;

	constructor(
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
		console.log(this.language_code);
	}


	ngOnDestroy(){
		this.subscription.unsubscribe();
	}
}