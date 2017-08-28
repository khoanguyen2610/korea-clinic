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
	}

	ngOnInit(){
		switch(this._params.method){
			case 'create':

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

	onSubmit(form: NgForm){
		if(form.valid){
			let formData: FormData = new FormData();
			formData.append('title', this.Item['title']);
			formData.append('content', this.Item['content']);
			formData.append('description', this.Item['description']);

			this._EquipmentService.getObserver().subscribe(progress => {
				this.uploadProgress = progress;

			});
		}
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}
}