import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ServiceCategoryFormContentComponent } from './content/service-category-form-content.component';
import { ServiceCategory } from '../../../../../models';
import { AuthService, ServiceCategoryService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';

declare let $: any;

@Component({
	selector: 'app-service-category',
	templateUrl: './service-category.component.html',
	providers: [ ServiceCategoryService ]
})

export class ServiceCategoryFormComponent implements OnInit {
	private subscription: Subscription;
	_params: any;

	language_code: string;
	Item_vi = new ServiceCategory();
	Item_en = new ServiceCategory();
	Items: Array<any> = [];
	uploadProgress: any;

	constructor(
		private _AuthService: AuthService,
		private _ServiceCategoryService: ServiceCategoryService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
		private _ToastrService: ToastrService,
		private _ElementRef: ElementRef,
	) {
		//=============== Get Params On Url ===============
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.Item_vi.language_code = 'vi';
		this.Item_en.language_code = 'en';
		this.Items = [this.Item_vi, this.Item_en];
	}

	ngOnInit(){
		this.language_code = 'vi';
		if(this._params.method == 'update'){
			if(this._params.id != null){
				// let params = new URLSearchParams();
				// params.set('response_quantity','all');
				// params.set('language_code','vi');
				// console.log(params);
				// this._ServiceCategoryService.getByID(this._params.id, params).subscribe(res => {
				// 	if (res.status == 'success') {
				// 		if(res.data == null){
				// 			this._Router.navigate(['/admin/service-category/list']);
				// 		}else{
				// 			this.language_code = res.data.language_code;
				// 			// var repeat:number = 0;
				// 			// var loadInterval = setInterval(() => {
				// 			// 	// console.log(res.data);
				// 			// 	repeat++;
				// 			// 	if(repeat == 5){
				// 			// 		clearInterval(loadInterval);
				// 			// 	}
				// 			// }, 500);
				// 		}
				// 	}else{
				// 		this._Router.navigate(['/admin/service-category/list']);
				// 	}
				// });
			}else{
				this._Router.navigate(['/']);
			}
		}
	}

	ngAfterViewInit(){
		let self = this;
		this._ElementRef.nativeElement.querySelectorAll('.link-tab').forEach(function(elm){
			elm.addEventListener('click', function(event){
				self.language_code = event.toElement.dataset.lang;
			});
		});
	}

	onSubmit(form: NgForm){
		

	}


	validateRequiredField(){
		let valid = true;

		this.Items.forEach(Item => {
			if(!Item['title']){
				valid = false;
			}
			if(!Item['language_code']){
				valid = false;
			}
		});

		return valid;
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}
}