import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Configuration } from '../../../../../shared';
import { AuthService, GalleryService, GeneralService } from '../../../../../services';
import { Gallery } from '../../../../../models';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

declare let $: any;

@Component({
	selector: 'app-gallery-form',
	templateUrl: './gallery-form.component.html',
	providers: [ GalleryService, GeneralService ]
})

export class GalleryFormComponent implements OnInit {
	private subscription: Subscription;
	private querySubscription: Subscription;
	@Output('file') fileOutput = new EventEmitter();

	_params: any;
	queryParams: any;
	files_type = [];
	src_images: Array<any> = [];
	Item = new Gallery();
	public uploader: FileUploader = new FileUploader({});
	public hasBaseDropZoneOver: boolean = false;
	public hasAnotherDropZoneOver: boolean = false;
	uploadProgress: any;
	files_upload: number = 10;

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

	onSubmit(form: NgForm){
		let formData: FormData = new FormData();

		if (this.uploader.queue.length) {
			for (let key in this.uploader.queue) {
				var upload = this.uploader.queue[key]._file;
				//Khoa Nguyen - 2017-03-13 - fix issue when attach file on firefox
				var objUpload = new Blob([upload]);

				formData.append("image", objUpload, upload.name);
			}
		}

		formData.append('title', this.Item.title);
		formData.append('description', this.Item.description);

		this._GalleryService.getObserver().subscribe(progress => {
				this.uploadProgress = progress;
		});
		try {
			this._GalleryService.upload(formData, this.Item.id).then((res) => {
				if (res.status == 'success') {
					if(this._params.method == 'create'){

					}
					this._ToastrService.success('Record has been saved successfully');
				}

			});
		} catch (error) {
			document.write(error)
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
						}


					}
					this.uploader.queue = uploader;
					this.files_upload = this.uploader.queue.length;
					this.fileOutput.emit(this.uploader);
				}
			}

		}, 500);
	}

	onImageChange(event) {

		var self = this;
		let files = event.target.files;


		for (var i = 0; i < files.length; i++) {
			var reader = new FileReader();
			var src_image = '';

			reader.onload = function(e: any) {
				src_image = e.target.result;
				self.src_images.push(src_image);

			};

			var file = files[i];
			//Only pics
			if (!file.type.match('image')) continue;

			//Read the image
			reader.readAsDataURL(file);
		}


		setTimeout(() => {
			var queue_files = self.uploader.queue;
			var queue = [];
			for (var i = 0; i < queue_files.length; i++) {
				queue_files[i]['src'] = this.src_images[i];
				queue.push(self.uploader.queue[i]);
			}
			queue_files = queue;
		}, 100);

	}

	public fileOverBase(e: any): void {
		this.hasBaseDropZoneOver = e;
	}

	public fileOverAnother(e: any): void {
		this.onImageChange(e);
		this.hasAnotherDropZoneOver = e;
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
		this.querySubscription.unsubscribe();
	}
}