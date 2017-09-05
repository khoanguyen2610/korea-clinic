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
	files_upload = 0;
	public uploader: FileUploader = new FileUploader({});
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
		console.log(this.language_code);
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
			this.onGetImage();
		}
	}

	onGetImage(){
		this.uploader = new FileUploader({});
		if(this.Item.image instanceof Object){
			this.uploader = this.Item.image;
		}else{
			let image = JSON.parse(this.Item.image);
			console.log(image)
			let filename = image.filename;
			let file_type = filename.split('.');
			let image_url = '';
			if (filename) {
				image_url = this.Item['image_url'];
			}

			let item: any = { file: { name: filename, type: file_type[1], is_download: true }, src: image_url, _file: { id: 1, name: filename, type: file_type[1], is_keeping: true } };
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
			self.fileOutput.emit(self.uploader);
		}, 100);

		reader.readAsDataURL(event.target.files[0]);
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
	}
}