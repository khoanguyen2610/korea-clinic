import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter, ElementRef } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../../shared';
import { Options } from '../../../../../../models';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

declare let $: any;

@Component({
	selector: 'app-about-us-form-content',
	templateUrl: './about-us-form-content.component.html',

})

export class AboutUsFormContentComponent implements OnInit {
	private subscription: Subscription;
	element: ElementRef;
	@Input() is_validated: boolean;
	@Input() Item = new Options();
	@Output('file') fileOutput = new EventEmitter();

	_params: any;
	files_type = [];
	files_upload:number = 2;
	public uploader: FileUploader = new FileUploader({});
	public hasBaseDropZoneOver: boolean = false;
	public hasAnotherDropZoneOver: boolean = false;

	constructor(
		private _Configuration: Configuration,
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

	ngOnInit(){ }


	ngOnDestroy(){
		this.subscription.unsubscribe();
	}
}
