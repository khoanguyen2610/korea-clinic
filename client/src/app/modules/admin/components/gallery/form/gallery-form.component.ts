import { Component, OnInit, AfterViewInit } from '@angular/core';
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

	_params: any;
	queryParams: any;
	files_type = [];
	src_images: Array<any> = [];
	Item = new Gallery();
	public uploader: FileUploader = new FileUploader({});
	public hasBaseDropZoneOver: boolean = false;
	public hasAnotherDropZoneOver: boolean = false;
	uploadProgress: any;

	constructor(
		private _AuthService: AuthService,
		private _GalleryService: GalleryService,
		private _GeneralService: GeneralService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
		private _ToastrService: ToastrService,
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

	onImageChange(event) {
		console.log(event.srcElement.files)
		var self = this;
		let files = event.target.files;

		console.log(files)

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