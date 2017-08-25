import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../shared';
import { AuthService, EquipmentService } from '../../../../../services';
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

	_params: any;
	curRouting?: string;

	uploadProgress: any;
	files_type = [];
	files_upload = 0;
	public uploader: FileUploader = new FileUploader({});
	public hasBaseDropZoneOver: boolean = false;
	public hasAnotherDropZoneOver: boolean = false;

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

		this.subscriptionEvents = this._Router.events.subscribe((val) => {
			let routing = this._Router.url;
			if (this.curRouting != routing) {
				this.curRouting = routing;
				this.loadPage();
			}
		});
	}

	ngOnInit(){

	}


	loadPage(){
		switch(this._params.method){
			case 'create':
				console.log('create');
				break;
			case 'copy':
			case 'update':
				if(this._params.id != null){

				}else{
					this._Router.navigate(['/']);
				}
				break;
		}
	}


}