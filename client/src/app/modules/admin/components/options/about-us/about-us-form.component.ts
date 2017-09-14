import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { AboutUsFormContentComponent } from './content/about-us-form-content.component';
import { Options } from '../../../../../models';
import { AuthService, OptionsService, GeneralService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

declare let $: any;

@Component({
	selector: 'app-about-us-form',
	templateUrl: './about-us-form.component.html',
	providers: [ OptionsService, GeneralService ]
})

export class AboutUsFormComponent implements OnInit {
	private subscription: Subscription;
	private querySubscription: Subscription;

	_params: any;
	queryParams: any;
	language_code: string;
	is_validated: boolean = true;
	item_key: string;
	Item_vi = new Options();
	Item_en = new Options();
	Items: Array<any> = [];
	uploadProgress: any;

	constructor(
		private _AuthService: AuthService,
		private _OptionsService: OptionsService,
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
		this.Item_en.language_code = 'en';
	}

	ngOnInit(){
		this.language_code = 'vi';
		let params: URLSearchParams = new URLSearchParams();
		params.set('key', 'about_us');
		params.set('response_quantity','all');
		this._OptionsService.getByID(null, params).subscribe(res => {
			if (res.status == 'success') {
				let items = res.data;

				var repeat:number = 0;
		        var loadInterval = setInterval(() => {
					items.forEach(item => {
						item.about_us = item.value;
						switch(item['language_code']){
							case 'vi':
								this.Item_vi = item;
								break;
							case 'en':
								this.Item_en = item;
								break;
						}
					});
					repeat++;
					if(repeat >= 1){
						clearInterval(loadInterval);
					}
				}, 200);
			}
		});
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

			formData.append('language_code', Item['language_code']);
			formData.append('meta_title', Item['meta_title']);
			formData.append('meta_description', Item['meta_description']);
			formData.append('meta_keyword', Item['meta_keyword']);
			formData.append('meta_tag', Item['meta_tag']);
			formData.append('options[about_us]', Item['about_us']);

			this._OptionsService.getObserver().subscribe(progress => {
				this.uploadProgress = progress;
			});
			try {
				this._Router.navigate([this._Router.url], { queryParams: {t: Date.now()} });
				this._OptionsService.upload(formData).then((res) => {
					if (res.status == 'success') {
						if(this._params.method == 'create'){
							let lang = Item['language_code'];
							this.onReset(lang);
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

	onReset(lang: string){
		switch (lang) {
			case 'vi':
				this.Item_vi = new Options();
				this.Item_vi.language_code = lang;
				break;

			case 'en':
				this.Item_en = new Options();
				this.Item_en.language_code = lang;
				break;
		}
	}

	validateRequiredField(){
		let valid = true;
		this.Items = [this.Item_vi, this.Item_en];
		return valid;
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
		this.querySubscription.unsubscribe();
	}
}
