import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { NewsFormContentComponent } from './content/news-form-content.component';
import { News } from '../../../../../models';
import { AuthService, NewsService, GeneralService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';

declare let $: any;

@Component({
	selector: 'app-news-form',
	templateUrl: './news-form.component.html',
	providers: [ NewsService, GeneralService ]
})

export class NewsFormComponent implements OnInit {
	private subscription: Subscription;
	private querySubscription: Subscription;

	_params: any;
	queryParams: any;
	language_code: string;
	item_key: string;
	Item_vi = new News();
	Item_en = new News();
	Items: Array<any> = [];
	uploadProgress: any;

	constructor(
		private _AuthService: AuthService,
		private _NewsService: NewsService,
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

		_GeneralService.getItemKey().subscribe(res => {
			if(res.status == 'success'){
				this.item_key = res.data.item_key;
			}
		});
	}

	ngOnInit(){
		this.language_code = 'vi';
		if(this._params.method == 'update'){
			if(this._params.id != null){
				let params: URLSearchParams = new URLSearchParams();
				params.set('item_key',this.queryParams.item_key);
				params.set('response_quantity','all');
				this._NewsService.getByID(undefined, params).subscribe(res => {
					if (res.status == 'success') {
						if(res.data == null){
							this._Router.navigate(['/admin/news/list']);
						}else{
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
							}, 500);
						}
					}else{
						this._Router.navigate(['/admin/news/list']);
					}
				});
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
		if(!this.validateRequiredField()){
			return;
		}

		this.Items.forEach(Item => {
			let formData: FormData = new FormData();

			let uploader = Item['image'];
			if (uploader instanceof Object && uploader.queue.length) {
				for (let key in uploader.queue) {
					var upload = uploader.queue[key]._file;
					//Khoa Nguyen - 2017-03-13 - fix issue when attach file on firefox
					var objUpload = new Blob([upload]);

					formData.append("image", objUpload, upload.name);
				}
			}

			if(this._params.method == 'create'){
				console.log(this.item_key);
				formData.append('item_key', this.item_key);
			}

			formData.append('language_code', Item['language_code']);
			formData.append('title', Item['title']);
			formData.append('news_category_id', Item['news_category_id']);
			formData.append('content', Item['content']);
			formData.append('description', Item['description']);

			this._NewsService.getObserver().subscribe(progress => {
				this.uploadProgress = progress;
			});
			try {
				this._NewsService.upload(formData, Item['id']).then((res) => {
					if (res.status == 'success') {
						if(this._params.method == 'create'){
							let lang = Item['language_code'];
							Item = new News();
							Item['language_code'] = lang;

						}
						this._ToastrService.success('Record has been saved successfully');
					}

				});
			} catch (error) {
				document.write(error)
			}

		});

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

	validateRequiredField(){
		let valid = true;
		this.Items = [this.Item_vi, this.Item_en];

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
		this.querySubscription.unsubscribe();
	}
}