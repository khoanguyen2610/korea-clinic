import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { MObicClientService } from '../../../services';
import { MObicClient } from '../../../models';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbComponent } from '../../general';

declare let $: any;

@Component({
	selector: 'app-manage-list',
	templateUrl: './obicclient-form.component.html',
	providers: [ MObicClientService ]
})

export class ObicClientFormComponent implements OnInit{
	private subscription: Subscription;
	_params: any;
	Item = new MObicClient();
	public client_type = [
		{'value':'1','label':'自社'},
		{'value':'2','label':'他社'}
	];

	constructor(
		private _MObicClientService: MObicClientService,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router
	){ }

	ngOnInit() {
		//=============== Get Params On Url ===============
		this.subscription = this._ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		switch(this._params.method){
			case 'create':
				this.Item.client_type = 1;
				break;
			case 'update':
				let failed = true;
				if(this._params.id != null){
					failed = false;
					this._MObicClientService.getByID(this._params.id).subscribe(res => {
						if (res.status == 'success') {
							this.Item = res.data;
							if(res.data == null){
								failed = true;
							}
						}else{
							failed = true;
						}
					});
				}
				if(failed){
					this._Router.navigate(['/system/obic-client']);
				}
				break;
			default:
				this._Router.navigate(['/system/obic-client']);
				break;
		}
	}

	onSubmit(form: NgForm){
		if(form.valid){
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('client_code', this.Item['client_code']);
			paramData.set('client_type', this.Item['client_type'].toString());
			paramData.set('client_name', this.Item['client_name']);
			if(this._params.method=='update'){
				paramData.set('id', this.Item['id'].toString());
				this._MObicClientService.save(paramData,this.Item['id']).subscribe(res => {
					if(res.status == 'success'){
						this._ToastrService.success('情報を登録しました。');
					}
				});
			}else{
				this._MObicClientService.save(paramData).subscribe(res => {
					if(res.status == 'success'){
						//reset form
						form.reset();
						this.Item.client_type = 1;
						this._ToastrService.success('情報を登録しました。');
					}
				});
			}
		}
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}
}