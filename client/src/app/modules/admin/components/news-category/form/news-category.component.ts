import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { NewsCategoryFormContentComponent } from './content/news-category-form-content.component';
import { NewsCategory } from '../../../../../models';
import { AuthService, NewsCategoryService, GeneralService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';

declare let $: any;

@Component({
	selector: 'app-news-category',
	templateUrl: './news-category.component.html',
	providers: [ NewsCategoryService, GeneralService ]
})

export class NewsCategoryFormComponent implements OnInit {
	private subscription: Subscription;
	private querySubscription: Subscription;
	_params: any;
	queryParams: any;
	item_key: string;
	language_code: string;
	is_validated: boolean = true;

	Item_vi = new NewsCategory();
	Item_en = new NewsCategory();
	Items: Array<any> = [];

	constructor(
		private _AuthService: AuthService,
		private _NewsCategoryService: NewsCategoryService,
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

				this._NewsCategoryService.getByID(undefined, params).subscribe(res => {
					if (res.status == 'success') {
						if (res.data == null) {
							this._Router.navigate(['/admin/service-category/list']);
						} else {

							// Binding data for 2 langs
							var Items = res.data;
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
		// Listen event click tab to change lang
		this._ElementRef.nativeElement.querySelectorAll('.link-tab').forEach(function(elm){
			elm.addEventListener('click', function(event){
				self.language_code = event.toElement.dataset.lang;
			});
		});
	}

	onSubmit(form: NgForm){
		this.is_validated = this.validateRequiredField()
		if (this.is_validated) { // Check form is valid
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

				this._NewsCategoryService.save(paramData, Item['id']).subscribe(res => {
					if (res.status == 'success') {
						if (this._params.method == 'create') {
							let lang = Item['language_code'];
							Item = new NewsCategory();
							Item['language_code'] = lang;

						}
						this._ToastrService.success('Record has been saved successfully.');
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