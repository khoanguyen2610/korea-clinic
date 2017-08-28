import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../shared';
import { AuthService, ServiceCategoryService } from '../../../../../services';
import { ServiceCategory } from '../../../../../models';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

declare let $: any;

@Component({
	selector: 'app-service-category-form',
	templateUrl: './service-category-form.component.html',
	providers: [ ServiceCategoryService ]
})

export class ServiceCategoryFormComponent implements OnInit {
	private subscription: Subscription;
	private subscriptionEvents: Subscription;

	Item = new ServiceCategory();
	_params: any;
	curRouting?: string;

	constructor(
		private _AuthService: AuthService,
		private _Configuration: Configuration,
		private _ServiceCategoryService: ServiceCategoryService,

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
		switch(this._params.method){
			case 'create':
				console.log('create');
				break;
			case 'update':
				if(this._params.id != null){
					this._ServiceCategoryService.getByID(this._params.id).subscribe(res => {
						if (res.status == 'success') {
							if(res.data == null){
								this._Router.navigate(['/admin/service-category/list']);
							}else{
								this.Item = res.data;
							}
						}else{
							this._Router.navigate(['/admin/service-category/list']);
						}
					});
				}else{
					this._Router.navigate(['/']);
				}
				break;
		}
	}


	loadPage(){

	}


}