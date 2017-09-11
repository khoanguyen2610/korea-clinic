import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { ServiceCategoryFormContentComponent } from './content/service-category-form-content.component';
import { ServiceCategory } from '../../../../../models';
import { AuthService, ServiceCategoryService, GeneralService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

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
	is_validated: boolean = true;

	Item_vi = new ServiceCategory();
	Item_en = new ServiceCategory();
	Items: Array<any> = [];
	uploadProgress: any;

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

	}

	ngOnInit(){
		this.initData();
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

							// Binding data for 2 langs
							let items = res.data;
							setTimeout(() => {
								items.forEach(item => {
									switch(item['language_code']){
										case 'vi':
											this.Item_vi = item;
											break;
										case 'en':
											this.Item_en = item;
											break;
									}
								});
							}, 400);
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
		// Listen event click tab to change lang
		this._ElementRef.nativeElement.querySelectorAll('.link-tab').forEach(function(elm){
			elm.addEventListener('click', function(event){
				self.language_code = event.toElement.dataset.lang;
			});
		});
	}

	onSubmit(form: NgForm){
		this.is_validated = this.validateRequiredField();
		if(!this.is_validated){
			return;
		}

		this.Items.forEach(Item => {
			let formData: FormData = new FormData();

			let uploader = Item['image'];
				var current_image = [];
				if (!(uploader instanceof Object) && typeof uploader != 'undefined') {
					current_image = JSON.parse(Item['image']);
				}

				if (uploader instanceof Object && uploader.queue.length) {
					for (let key in uploader.queue) {
						var upload = uploader.queue[key]._file;
						//Khoa Nguyen - 2017-03-13 - fix issue when attach file on firefox
						var objUpload = new Blob([upload]);

						if (upload['id']) {
						} else {
							formData.append("image[]", objUpload, upload.name);
						}
						current_image.push(upload);
					}
				}
				// current_image for check to remove existing image
				formData.append("current_image", JSON.stringify(current_image));

			if(this._params.method == 'create'){
				formData.append('item_key', this.item_key);
			}

			formData.append('item_key', this.item_key);
			formData.append('language_code', Item['language_code']);
			formData.append('title', Item['title']);
			formData.append('description', Item['description']);
			formData.append('parent', Item['parent']);

			this._ServiceCategoryService.getObserver().subscribe(progress => {
				this.uploadProgress = progress;
			});
			try {
				this._ServiceCategoryService.upload(formData, Item['id']).then((res) => {
					if (res.status == 'success') {
						if(this._params.method == 'create'){
							let lang = Item['language_code'];
							this.onReset(lang);
							this.generateItemKey();
						}
						this._ToastrService.success('Record has been saved successfully');
					}

				});
			} catch (error) {
				document.write(error)
			}

		});

		this.is_validated = true;
	}

	initData() {
		this.Item_en = new ServiceCategory();
		this.Item_vi = new ServiceCategory();
		this.Item_vi.language_code = 'vi';
		this.Item_vi.parent = 0;
		this.Item_en.language_code = 'en';
		this.Item_en.parent = 0;
		this.is_validated = true;

		this.generateItemKey();
	}

	onReset(lang: string){
		switch (lang) {
			case 'vi':
				this.Item_vi = new ServiceCategory();
				this.Item_vi.language_code = lang;
				this.Item_vi.image = new FileUploader({});
				this.Item_vi.parent = 0;
				break;

			case 'en':
				this.Item_en = new ServiceCategory();
				this.Item_en.language_code = lang;
				this.Item_en.image = new FileUploader({});
				this.Item_vi.parent = 0;
				break;
		}
	}

	onSetImage(obj){
		switch(this.language_code){
			case 'vi':
				this.Item_vi.image = obj;
				break;
			case 'en':
				this.Item_en.image = obj;
				break;
		}
	}

	generateItemKey() {
		this._GeneralService.getItemKey().subscribe(res => {
			if (res.status == 'success') {
				this.item_key = res.data.item_key;
			}
		});
	}

	validateRequiredField(){
		let valid = true;
		this.Items = [this.Item_vi, this.Item_en];

		this.Items.forEach(Item => {
			if(!Item['title']){
				valid = false;
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
