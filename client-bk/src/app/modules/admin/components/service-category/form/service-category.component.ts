import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { ServiceCategoryFormContentComponent } from './content/service-category-form-content.component';
import { ServiceCategory } from '../../../../../models';
import { AuthService, ServiceCategoryService, GeneralService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';

declare let $: any;

@Component({
	selector: 'app-service-category',
	templateUrl: './service-category.component.html',
	providers: [ ServiceCategoryService, GeneralService ]
})

export class ServiceCategoryFormComponent implements OnInit {
	private subscription: Subscription;
	private querySubscription: Subscription;
	_params: any;
	queryParams: any;
	item_key: string;
	language_code: string;

	Item_vi = new ServiceCategory();
	Item_en = new ServiceCategory();
	Items: Array<any> = [];

	constructor(
		private _AuthService: AuthService,
		private _ServiceCategoryService: ServiceCategoryService,
		private _GeneralService: GeneralService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
		private _ToastrService: ToastrService,
		private _ElementRef: ElementRef,
	) {

		//=============== Get Params On Url ===============
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.querySubscription = _ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this.queryParams = param;
			}
		);

		this.Item_vi.language_code = 'vi';
		this.Item_vi.parent = 0;
		this.Item_en.language_code = 'en';
		this.Item_en.parent = 0;
		this.Items = [this.Item_vi, this.Item_en];

		_GeneralService.getItemKey().subscribe(res => {
			if(res.status == 'success'){
				this.item_key = res.data.item_key;
			}
		});
	}

	ngOnInit(){

		this.language_code = 'vi';
		if (this._params.method == 'update') {
			if (this._params.id != null) {
				let params: URLSearchParams = new URLSearchParams();
				params.set('item_key', this.queryParams.item_key);
				params.set('response_quantity', 'all');

				this._ServiceCategoryService.getByID(undefined, params).subscribe(res => {
					if (res.status == 'success') {
						if (res.data == null) {
							this._Router.navigate(['/admin/service-category/list']);
						} else {

							var Items = res.data;

							console.log(this.Items)

							for(let i in this.Items) {
								if(Items[i]) {
									this.Items[i] = Items[i];
								}
							}
						}
					} else {
						this._Router.navigate(['/admin/service-category/list']);
					}
				});
			} else {
				this._Router.navigate(['/']);
			}
		}
	}

	ngAfterViewInit(){
		let self = this;
		this._ElementRef.nativeElement.querySelectorAll('.link-tab').forEach(function(elm){
			elm.addEventListener('click', function(event){
				console.log(event.toElement.dataset.lang);
				self.language_code = event.toElement.dataset.lang;
			});
		});
	}

	onSubmit(form: NgForm){

		if (this.validateRequiredField()) { // Check form is valid
console.log(this.Items);
			this.Items.forEach(Item => {
				let paramData: URLSearchParams = new URLSearchParams();
				// Prepare params
				if(this._params.method == 'update'){
					if(Item['item_key']) {
						this.item_key = Item['item_key'];
					}
				}

				paramData.set('item_key', this.item_key);
				paramData.set('language_code', Item['language_code']);
				paramData.set('title', Item['title']);
				paramData.set('description', Item['description']);
				paramData.set('parent', Item['parent']);

				this._ServiceCategoryService.save(paramData, Item['id']).subscribe(res => {
					if (res.status == 'success') {
						if (this._params.method == 'create') {
							let lang = Item['language_code'];
							Item = new ServiceCategory();
							Item['language_code'] = lang;

						}
						this._ToastrService.success('Saved!');
					}

				});
			});


		}

	}


	validateRequiredField(){
		let valid = true;

		this.Items.forEach(Item => {
			if(!Item['title']){
				valid = false;
				console.log(Item['language_code']);
				$('a[href="#tab_' + Item['language_code'] + '"]').click();
				$('div[id^="tab_"]').removeClass('active');
				$('div#tab_' + Item['language_code']).addClass('active');
				return;
			}
		});

		return valid;
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}
}