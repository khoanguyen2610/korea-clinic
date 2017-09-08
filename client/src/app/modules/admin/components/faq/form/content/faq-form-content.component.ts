import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter, ElementRef } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../../shared';
import { ServiceService } from '../../../../../../services';
import { Faq } from '../../../../../../models';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

declare let $: any;

@Component({
	selector: 'app-faq-form-content',
	templateUrl: './faq-form-content.component.html',
	providers: [ ServiceService ]
})

export class FaqFormContentComponent implements OnInit {
	private subscription: Subscription;
	element: ElementRef;
	@Input() is_validated: boolean;
	@Input() Item = new Faq();
	@Input() language_code: string;
	@Output('file') fileOutput = new EventEmitter();

	_params: any;
	files_type = [];
	files_upload:number = 2;
	service_options: Array<any> = [];
	public uploader: FileUploader = new FileUploader({});
	public hasBaseDropZoneOver: boolean = false;
	public hasAnotherDropZoneOver: boolean = false;
	category_options: Array<any> = [];

	constructor(
		private _Configuration: Configuration,
		private _ToastrService: ToastrService,
		private _ServiceService: ServiceService,
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
		console.log(this.language_code);
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		this._ServiceService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				let items = res.data;
				console.log(items);
				for(let i in items){
					this.service_options.push({
						'id': items[i].id, 'text': items[i].title
					});
				}
			}
		})
	}

	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		if(this.Item.image){
			this.onGetImage();
		}
	}

	onGetImage() {
		this.uploader = new FileUploader({});
		if (this.Item.image instanceof Object) {
			this.uploader = this.Item.image;
		} else {
			let image = JSON.parse(this.Item.image);
			let filename = image.filename;
				let filepath = image.filepath;
				let file_type = filename.split('.');
			let image_url = '';
			if (filename) {
				image_url = this.Item['image_url'];
			}

			let item: any = { file: { name: filename, filename: filename, filepath: filepath, type: file_type[1], is_download: true }, src: image_url, _file: { id: 1, name: filename, filename: filename, filepath: filepath, type: file_type[1], is_keeping: true }, edited: true };
			this.uploader.queue.push(item);
		}
	}

	/*==============================================
	 * Remove file on stack
	 *==============================================*/
	onRemoveFile(index, file_id) {
		if (this.uploader.queue.length) {
			this.uploader.queue.splice(index, 1);
			this.fileOutput.emit(this.uploader);
		}
	}

	/*====================================
	 * Validate Form File Type
	 *====================================*/
	onValidateFormFileType() {
		var last = this.uploader.queue.length - 1;
		this.uploader.queue = [this.uploader.queue[last]];
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
	}
}
