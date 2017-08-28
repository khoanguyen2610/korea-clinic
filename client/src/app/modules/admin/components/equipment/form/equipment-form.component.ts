import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../shared';
import { AuthService, EquipmentService } from '../../../../../services';
import { Equipment } from '../../../../../models';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

declare let $: any;

@Component({
	selector: 'app-equipment-form',
	templateUrl: './equipment-form.component.html',
	providers: [ EquipmentService ]
})

export class EquipmentFormComponent implements OnInit {
	private subscription: Subscription;
	private subscriptionEvents: Subscription;

	Item = new Equipment();
	_params: any;
	curRouting?: string;

	uploadProgress: any;
	files_type = [];
	files_upload = 0;
	public uploader: FileUploader = new FileUploader({});
	public hasBaseDropZoneOver: boolean = false;
	public hasAnotherDropZoneOver: boolean = false;

	public lang_options = [
		{'value':'en','label':'English'},
		{'value':'vi','label':'Vietnam'},
	];

	constructor(
		private _AuthService: AuthService,
		private _Configuration: Configuration,
		private _EquipmentService: EquipmentService,

		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,

	) {
		//=============== Get Params On Url ===============
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.files_type = this._Configuration.upload_file_extension;
	}

	ngOnInit(){
		switch(this._params.method){
			case 'create':
				this.Item.language_code = 'en';
				break;
			case 'update':
				if(this._params.id != null){
					this._EquipmentService.getByID(this._params.id).subscribe(res => {
						if (res.status == 'success') {
							if(res.data == null){
								this._Router.navigate(['/admin/equipment/list']);
							}else{
								this.Item = res.data;
							}
						}else{
							this._Router.navigate(['/admin/equipment/list']);
						}
					});
				}else{
					this._Router.navigate(['/']);
				}
				break;
		}
	}

	onReset(){
		this.Item = new Equipment();
		this.Item.language_code = 'en';
		// reset file upload
		this.uploader = new FileUploader({});
	}

	onSubmit(form: NgForm){
		if(form.valid){
			let formData: FormData = new FormData();

			if (this.uploader.queue.length) {
				for (let key in this.uploader.queue) {
					var upload = this.uploader.queue[key]._file;
					//Khoa Nguyen - 2017-03-13 - fix issue when attach file on firefox
					var objUpload = new Blob([upload]);

					formData.append("image", objUpload, upload.name);
				}
			}

			formData.append('language_code', this.Item['language_code']);
			formData.append('title', this.Item['title']);
			formData.append('content', this.Item['content']);
			formData.append('description', this.Item['description']);

			this._EquipmentService.getObserver().subscribe(progress => {
				this.uploadProgress = progress;
			});
			try {
				this._EquipmentService.upload(formData, this.Item.id).then((res) => {
					if (res.status == 'success') {
						if(this._params.method == 'update'){

						}else{
							form.reset();
							this.onReset();
						}
						console.log(res.data);
					}

				});
			} catch (error) {
				document.write(error)
			}
		}
	}

		/*====================================
	 * Validate Form File Type
	 *====================================*/
	onValidateFormFileType() {
		this.uploader['error_limit_files'] = false;
		setTimeout(() => {
			let after_upload_files = +this.uploader.queue.length; // after drag upload files
			if (after_upload_files <= this._Configuration.limit_files) {
				if (after_upload_files != this.files_upload) {
					let uploader = [];
					for (let key in this.uploader.queue) {
						var checked = false;
						var ext = this.uploader.queue[key]._file.name.split('.').pop();
						ext = ext.toLowerCase();

						for (let k in this.files_type) {

							if (ext.indexOf(this.files_type[k]) > -1) {
								checked = true;
								break;
							}
						}

						if (!checked) {
							var msgInvalidFileType = this.uploader.queue[key]._file.type + ' is an invalid file format. Only ' + this.files_type.join() + ' file formats are supported.';
							this._ToastrService.error(msgInvalidFileType);
							checked = false;
						}

						if (this.uploader.queue[key]._file.size > this._Configuration.limit_file_size) {
							var msgSizeTooLarge = 'File ' + this.uploader.queue[key]._file.name + ' (' + Math.round(this.uploader.queue[key]._file.size / (1024 * 1024)) + 'MB) has exceed the uploadable maximum capacity of ' + this._Configuration.limit_file_size / (1024 * 1024) + 'MB';
							this._ToastrService.error(msgSizeTooLarge);
							checked = false;
						}

						if (!checked) {
							// this.uploader.queue.splice(+key, 1);
							this.uploader.queue[key].isError = true;
						} else {
							this.uploader.queue[key]._file['is_keeping'] = true;
							uploader.push(this.uploader.queue[key]);
						}


					}
					this.uploader.queue = uploader;
					this.files_upload = this.uploader.queue.length;
				}
			}

		}, 500);
	}

	public fileOverBase(e: any): void {
		this.hasBaseDropZoneOver = e;
	}

	public fileOverAnother(e: any): void {
		this.onValidateFormFileType();
		this.hasAnotherDropZoneOver = e;
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}
}