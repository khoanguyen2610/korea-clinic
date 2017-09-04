import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Configuration } from '../../../../../shared';
import { AuthService, GalleryService, GeneralService } from '../../../../../services';
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
	files_upload = 0;
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

		this._GalleryService.getObserver().subscribe(progress => {
				this.uploadProgress = progress;
		});
		try {
			this._GalleryService.upload(formData, undefined).then((res) => {
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
		var reader = new FileReader();
		var image = $('#myImage');

		var src_image = '';
		reader.onload = function(e: any) {
			src_image = e.target.result;
			image.src = src_image;

		};
		var self = this;
		setTimeout(() => {
			self.uploader.queue[0]['src'] = src_image;
			self.uploader.queue = [self.uploader.queue[0]];
		}, 100);

		reader.readAsDataURL(event.target.files[0]);
	}

	public fileOverBase(e: any): void {
		this.hasBaseDropZoneOver = e;
	}

	public fileOverAnother(e: any): void {
		// this.onValidateFormFileType();
		this.onImageChange(e);
		this.hasAnotherDropZoneOver = e;
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
		this.querySubscription.unsubscribe();
	}
}