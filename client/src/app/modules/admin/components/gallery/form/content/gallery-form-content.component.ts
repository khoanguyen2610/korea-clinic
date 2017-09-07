import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Configuration } from '../../../../../../shared';
import { AuthService, GalleryService, GeneralService } from '../../../../../../services';
import { Gallery } from '../../../../../../models';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

declare let $: any;

@Component({
	selector: 'app-gallery-form-content',
	templateUrl: './gallery-form-content.component.html',
	providers: [ GalleryService, GeneralService ]
})

export class GalleryFormContentComponent implements OnInit {
	private subscription: Subscription;
	private querySubscription: Subscription;
	@Input('language_code') language_code: string;
	@Input('Item') Item = new Gallery();
	@Input('is_validated') is_validated: boolean;
	@Output('file') fileOutput = new EventEmitter();

	_params: any;
	queryParams: any;
	files_type = this._Configuration.upload_file_extension;
	src_images: Array<any> = [];
	public uploader: FileUploader = new FileUploader({});
	public hasBaseDropZoneOver: boolean = false;
	public hasAnotherDropZoneOver: boolean = false;
	uploadProgress: any;
	files_upload: number = 8;

	constructor(
		private _AuthService: AuthService,
		private _GalleryService: GalleryService,
		private _GeneralService: GeneralService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
		private _ToastrService: ToastrService,
		private _Configuration: Configuration
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
		if(this._params.method == 'update'){
			if(this._params.id != null){
				let params: URLSearchParams = new URLSearchParams();
				this._GalleryService.getByID(this._params.id, params).subscribe(res => {
					if (res.status == 'success') {
						if(res.data == null){
							this._Router.navigate(['/admin/gallery/list']);
						}else{
							this.Item = res.data;
							if(this.Item.image){
								let image = JSON.parse(this.Item.image);
								let filename = image.filename;
								let file_type = filename.split('.');
								var image_url = '';
								if (filename) {
									image_url = this.Item['image_url'];
								}

								let item: any = { file: { name: filename, type: file_type[1], is_download: true }, src: image_url, _file: { id: 1, name: filename, type: file_type[1], is_keeping: true } };
								this.uploader.queue.push(item);
							}
						}
					}else{
						this._Router.navigate(['/admin/gallery/list']);
					}
				});
			}else{
				this._Router.navigate(['/']);
			}
		}
	}


	/*==============================================
	 * Remove file on stack
	 *==============================================*/
	onRemoveFile(index, file_id) {
		if (this.uploader.queue.length) {
			this.uploader.queue.splice(index, 1);
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
							console.log(uploader)
						}


					}
					this.uploader.queue = uploader;
					this.files_upload = this.uploader.queue.length;
					this.fileOutput.emit(this.uploader);
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
		this.querySubscription.unsubscribe();
	}
}