/*
* @Author: th_le
* @Date:   2016-11-29 15:25:16
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-05 11:06:02
*/
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { Router, ActivatedRoute } from "@angular/router";
import { URLSearchParams } from "@angular/http";
import { Location } from '@angular/common';
import { BreadcrumbComponent } from '../../general';

import { MBank } from '../../../models';
import { MBankService } from '../../../services';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-bank-form',
	templateUrl: 'bank-form.component.html',
	providers: [ MBankService ]
})

export class BankFormComponent implements OnInit {
	private subscription: Subscription;
	Item = new MBank();
	_params: any;
	validateErrors: Array<any> = [];

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _MBankService: MBankService,
		private _ToastrService: ToastrService,
		private _Router: Router,
		private _Location: Location
	){}

	ngOnInit(){
		// Get params on URL
		this.subscription = this._ActivatedRoute.params.subscribe((param: any) => {
				this._params = param;
			}
		)

		switch (this._params.method) {
			case "create":
				// code...
				break;
			case "update": // Init input data
				let failed = true;
				if(this._params.id != null){
					failed = false;
					this._MBankService.getByID(this._params.id).subscribe( res => {
						if(res.status == "success" ){
							this.Item = res.data;
							if( res.data == null ){
								failed = true;
							}
						} else {
							failed = true;
						}
					})
				}
				if( failed ) {
					this._Router.navigate['/system/bank'];
				}
				break;
			default:
				this._Router.navigate['/system/bank'];
				break;
		}
	}

	/*=================================
	 * Create | update Bank Information
	 *=================================*/
	onSubmit(form: NgForm) {
		if(form.valid) { //  Check form is valid
			// Prepare params
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('code', this.Item['code']);
			paramData.set('name', this.Item['name']);
			paramData.set('name_kana', this.Item['name_kana']);
			paramData.set('name_e', this.Item['name_e']);

			if( this._params.method == "update" ) { // Check method is update -> TODO: update bank
				paramData.set('id', this.Item['id'].toString());
				this._MBankService.save(paramData, this.Item['id']).subscribe( res => {
					if(res.status == "success"){
						this._ToastrService.success('情報を登録しました。');
					} else if (res.status == "error") {
						this.validateErrors = res.error;
					}
				})
			} else if(this._params.method == "create") { // Check method is create -> TODO: create a new bank
				this._MBankService.save(paramData).subscribe( res => {
					if(res.status == "success") {
						form.reset();
						this._ToastrService.success('情報を登録しました。');
					}else if(res.status == 'error'){
						this.validateErrors = res.error;
					}
				})
			}
		}
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}
}