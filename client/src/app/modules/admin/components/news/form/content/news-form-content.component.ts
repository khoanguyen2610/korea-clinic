import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../../shared';
import { NewsCategoryService, } from '../../../../../../services';
import { News } from '../../../../../../models';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

declare let $: any;

@Component({
	selector: 'app-news-form-content',
	templateUrl: './news-form-content.component.html',
	providers: [ NewsCategoryService ]
})

export class NewsFormContentComponent implements OnInit {
	private subscription: Subscription;
	@Input() is_validated: boolean;
	@Input() language_code: string;
	@Input() Item = new News();
	@Output('file') fileOutput = new EventEmitter();

	category_options: Array<any> = [];
	_params: any;
	files_type = [];
	files_upload: number = 2;

	public uploader: FileUploader = new FileUploader({});
	public uploader_title: FileUploader = new FileUploader({});

	public hasBaseDropZoneOver: boolean = false;
	public hasAnotherDropZoneOver: boolean = false;

	constructor(
		private _Configuration: Configuration,
		private _ToastrService: ToastrService,
		private _NewsCategoryService: NewsCategoryService,
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
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		this._NewsCategoryService.getListData(params).subscribe(res => {
			if(res.status == 'success'){
				let items = res.data;
				for(let i in items){
					this.category_options.push({
						'id': items[i].id, 'text': items[i].title
					});
				}
			}
		})
	}

	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		if(this.Item.image){
			this.onGetImage('image');
		}
		if(this.Item.image_title){
			this.onGetImage('image_title');
		}
	}

	onGetImage(fieldname: string) {
		let uploader = new FileUploader({});
		if (this.Item[fieldname] instanceof Object) {
			uploader = this.Item[fieldname];
		} else {
			let image = JSON.parse(this.Item[fieldname]);
			let filename = image.filename;
			let filepath = image.filepath;
			var file_type = '';
			if (filename) {
				file_type = filename.split('.');
			}

			let image_url = '';
			if (filename) {
				let field_image_url = 'image_url';
				if(fieldname == 'image_title'){
					field_image_url = 'image_title_url';
				}
				image_url = this.Item[field_image_url];
			}

			let item: any = {
				file: { name: filename, filename: filename, filepath: filepath, type: file_type[1], is_download: true },
				src: image_url,
				_file: { id: 1, name: filename, filename: filename, filepath: filepath, type: file_type[1], is_keeping: true },
				edited: true
			};

			uploader.queue.push(item);
		}

		if(fieldname == 'image'){
			this.uploader = uploader;
		}else{
			this.uploader_title = uploader;
		}
	}

	/*==============================================
	 * Remove file on stack
	 *==============================================*/
	onRemoveFile(index, file_id, fieldname: string) {
		if(fieldname == 'image'){
			if (this.uploader.queue.length) {
				this.uploader.queue.splice(index, 1);
				this.fileOutput.emit({ uploader: this.uploader, fieldname: fieldname });
			}
		}else{
			if (this.uploader_title.queue.length) {
				this.uploader_title.queue.splice(index, 1);
				this.fileOutput.emit({ uploader: this.uploader_title, fieldname: fieldname });
			}
		}
	}

	/*====================================
	 * Validate Form File Type
	 *====================================*/
	onValidateFormFileType(fieldname: string) {
		let c_uploader = new FileUploader({});
		if(fieldname == 'image'){
			c_uploader = this.uploader;
		}else{
			c_uploader = this.uploader_title;
		}

		var last = c_uploader.queue.length - 1;
		c_uploader.queue = [c_uploader.queue[last]];
		c_uploader['error_limit_files'] = false;
		setTimeout(() => {
			let after_upload_files = +c_uploader.queue.length; // after drag upload files
			if (after_upload_files <= this._Configuration.limit_files) {
				if (after_upload_files != this.files_upload) {
					let uploader = [];
					for (let key in c_uploader.queue) {
						var checked = false;
						var ext = c_uploader.queue[key]._file.name.split('.').pop();
						ext = ext.toLowerCase();

						for (let k in this.files_type) {

							if (ext.indexOf(this.files_type[k]) > -1) {
								checked = true;
								break;
							}
						}

						if (!checked) {
							var msgInvalidFileType = c_uploader.queue[key]._file.type + ' is an invalid file format. Only ' + this.files_type.join() + ' file formats are supported.';
							this._ToastrService.error(msgInvalidFileType);
							checked = false;
						}

						if (c_uploader.queue[key]._file.size > this._Configuration.limit_file_size) {
							var msgSizeTooLarge = 'File ' + c_uploader.queue[key]._file.name + ' (' + Math.round(c_uploader.queue[key]._file.size / (1024 * 1024)) + 'MB) has exceed the uploadable maximum capacity of ' + this._Configuration.limit_file_size / (1024 * 1024) + 'MB';
							this._ToastrService.error(msgSizeTooLarge);
							checked = false;
						}

						if (!checked) {
							// this.uploader.queue.splice(+key, 1);
							c_uploader.queue[key].isError = true;
						} else {
							c_uploader.queue[key]._file['is_keeping'] = true;
							uploader.push(c_uploader.queue[key]);
						}


					}

					if(fieldname == 'image'){
						this.uploader.queue = uploader;
						this.files_upload = this.uploader.queue.length;
						this.fileOutput.emit({ uploader: this.uploader, fieldname: fieldname });
					}else{
						this.uploader_title.queue = uploader;
						this.files_upload = this.uploader_title.queue.length;
						this.fileOutput.emit({ uploader: this.uploader_title, fieldname: fieldname });
					}

				}
			}

		}, 500);
	}



	public fileOverBase(e: any): void {
		this.hasBaseDropZoneOver = e;
	}

	public fileOverAnother(e: any, fieldname: string): void {
		this.onValidateFormFileType(fieldname);
		this.hasAnotherDropZoneOver = e;
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}
}
