import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EquipmentFormContentComponent } from './content/equipment-form-content.component';
import { Equipment } from '../../../../../models';
import { AuthService, EquipmentService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';

declare let $: any;

@Component({
	selector: 'app-equipment-form',
	templateUrl: './equipment-form.component.html',
	providers: [ EquipmentService ]
})

export class EquipmentFormComponent implements OnInit {
	private subscription: Subscription;
	_params: any;

	language_code: string;
	Item_vi = new Equipment();
	Item_en = new Equipment();
	Items: Array<any> = [];
	uploadProgress: any;

	constructor(
		private _AuthService: AuthService,
		private _EquipmentService: EquipmentService,
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
				let params: URLSearchParams = new URLSearchParams();
				params.set('response_quantity','all');
				params.set('language_code','vi');
				console.log(params);
				this._EquipmentService.getByID(this._params.id, params).subscribe(res => {
					if (res.status == 'success') {
						if(res.data == null){
							this._Router.navigate(['/admin/equipment/list']);
						}else{
							this.language_code = res.data.language_code;
							// var repeat:number = 0;
							// var loadInterval = setInterval(() => {
							// 	// console.log(res.data);
							// 	repeat++;
							// 	if(repeat == 5){
							// 		clearInterval(loadInterval);
							// 	}
							// }, 500);
						}
					}else{
						this._Router.navigate(['/admin/equipment/list']);
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
			if (uploader && uploader.queue.length) {
				for (let key in uploader.queue) {
					var upload = uploader.queue[key]._file;
					//Khoa Nguyen - 2017-03-13 - fix issue when attach file on firefox
					var objUpload = new Blob([upload]);

					formData.append("image", objUpload, upload.name);
				}
			}

			formData.append('language_code', Item['language_code']);
			formData.append('title', Item['title']);
			formData.append('content', Item['content']);
			formData.append('description', Item['description']);

			this._EquipmentService.getObserver().subscribe(progress => {
				this.uploadProgress = progress;
			});
			try {
				this._EquipmentService.upload(formData, Item['id']).then((res) => {
					if (res.status == 'success') {
						if(this._params.method == 'create'){
							let lang = Item['language_code'];
							Item = new Equipment();
							Item['language_code'] = lang;
						}
						this._ToastrService.success('Saved!');
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