import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Location } from '@angular/common';

import { BreadcrumbComponent } from '../../general';
import { MCompanyService } from '../../../services';
import { MCompany } from '../../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-company-form',
	templateUrl: './company-form.component.html',
	providers: [ MCompanyService ]
})
export class CompanyFormComponent implements OnInit {
	private subscription: Subscription;
	_params: any;
	Item = new MCompany();

	constructor(
		private _MCompanyService: MCompanyService,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
		private _Location: Location
	) { }

	ngOnInit() {
		// Get params on url
		this.subscription = this._ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		switch (this._params.method) {
			case "create":
				// code...
				break;
			case "update":
				let failed = true;
				if( this._params.id != null ) {
					failed = false;
					this._MCompanyService.getByID(this._params.id).subscribe( res => {
						if( res.status == 'success' ){
							this.Item = res.data;
							if( res.data == null ){
								failed = true;
							}
						} else {
							failed = true;
						}
					});
				}
				if( failed ) {
					this._Router.navigate(['/system/company']);
				}
				break;
			default:
				this._Router.navigate(['/system/company']);
				break;
		}
	}

	onSubmit(form: NgForm){
		if(form.valid){ // Check form is valid

			let paramData: URLSearchParams = new URLSearchParams();
			// Prepare params
			paramData.set('code', this.Item['code']);
			paramData.set('name', this.Item['name']);
			paramData.set('name_e', this.Item['name_e']);
			paramData.set('domain', this.Item['domain']);

			if( this._params.method == "update" ) { // Check method is update -> TODO: update company
				paramData.set('id', this.Item['id'].toString());
				this._MCompanyService.save(paramData, this.Item['id']).subscribe( res => {
					if( res.status == "success" ) { // Check status is success
						this._ToastrService.success('情報を登録しました。');
					}
				});
			} else if ( this._params.method == "create" ) { // Check method is create -> TODO: create a new company
				this._MCompanyService.save(paramData).subscribe( res => {
					if( res.status == "success" ){ // Check status is success
						form.reset(); // Reset first state form's inputs
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
