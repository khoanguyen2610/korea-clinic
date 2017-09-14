import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { OptionsFormContentComponent } from './content/options-form-content.component';
import { Options } from '../../../../../models';
import { AuthService, OptionsService, GeneralService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

declare let $: any;

@Component({
	selector: 'app-about-us-form',
	templateUrl: './options-form.component.html',
	providers: [ OptionsService, GeneralService ]
})

export class OptionsFormComponent implements OnInit {
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
		params.set('response_quantity','all');
		this._OptionsService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				let items = res.data;


				var repeat:number = 0;
		        var loadInterval = setInterval(() => {
					items.forEach(item => {
						switch(item['language_code']){
							case 'vi':
								this.Item_vi[item.key] = item.value;
								if(item.key == 'logo') this.Item_vi['logo_url'] = item.logo_url;
								break;
							case 'en':
								this.Item_en[item.key] = item.value;
								if(item.key == 'logo') this.Item_en['logo_url'] = item.logo_url;
								break;
						}
					});
					repeat++;
					if(repeat >= 3){
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

			let uploader = Item['logo'];
			var current_logo = [];
			if (!(uploader instanceof Object) && typeof uploader != 'undefined') {
				current_logo = JSON.parse(Item['logo']);
			}

			if (uploader instanceof Object && uploader.queue.length) {
				for (let key in uploader.queue) {
					var upload = uploader.queue[key]._file;
					//Khoa Nguyen - 2017-03-13 - fix issue when attach file on firefox
					var objUpload = new Blob([upload]);

					if (upload['id']) {
					} else {
						formData.append("logo[]", objUpload, upload.name);
					}
					current_logo.push(upload);
				}
			}
			// current_logo for check to remove existing image
			formData.append("current_logo", JSON.stringify(current_logo));


			formData.append('language_code', Item['language_code']);
			formData.append('options[logo]', Item['logo']);
			formData.append('options[address]', Item['address']);
			formData.append('options[phone]', Item['phone']);
			formData.append('options[email]', Item['email']);
			formData.append('options[facebook]', Item['facebook']);
			formData.append('options[twitter]', Item['twitter']);
			formData.append('options[google_plus]', Item['google_plus']);
			formData.append('options[instagram]', Item['instagram']);
			formData.append('options[whatsapp]', Item['whatsapp']);
			formData.append('options[kakaotalk]', Item['kakaotalk']);
			formData.append('options[line]', Item['line']);
			formData.append('options[skype]', Item['skype']);
			formData.append('options[youtube]', Item['youtube']);
			formData.append('options[home_about_us]', Item['home_about_us']);
			formData.append('options[working_hour]', Item['working_hour']);
			formData.append('options[home_contact]', Item['home_contact']);
			formData.append('options[meta_title]', Item['meta_title']);
			formData.append('options[meta_description]', Item['meta_description']);
			formData.append('options[meta_keyword]', Item['meta_keyword']);
			formData.append('options[meta_tag]', Item['meta_tag']);

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

	onSetImage(obj){
		switch(this.language_code){
			case 'vi':
				this.Item_vi.logo = obj;
				break;
			case 'en':
				this.Item_en.logo = obj;
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
