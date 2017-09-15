import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { OptionsService } from './../../../../services';
import { LocalStorageService } from 'angular-2-local-storage';
import { Configuration } from '../../../../shared';


import { SystemGeneralService } from '../../../../services';


declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-contact',
	templateUrl: './contact.component.html',
	providers: [SystemGeneralService, OptionsService]
})

export class ContactComponent implements OnInit {
	Item: Array<any> = [];
	is_validated = false;
	language_code: string;
	address: Array<any> = [];

	constructor(
		private _ToastrService: ToastrService,
		private _SystemGeneralService: SystemGeneralService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService,
		private _OptionsService: OptionsService
	) {
		this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		this.getDetailData();
	}

	getAction(){
		return 'contact';
	}

	getDetailData() {

		let params: URLSearchParams = new URLSearchParams();
		params.set('key', 'address');
		params.set('language_code', this.language_code);
		this._OptionsService.getByID(null, params).subscribe(res => {
			if (res.status == 'success') {
				this.address = res.data;

				var metas = this._Configuration.metas;
				metas.forEach(meta => {
					this._Configuration[meta] = this.Item[meta];
				});

			}
		});
	}


	onSubmit(form: NgForm){
		if(form.valid){
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('fullname', this.Item['fullname']);
			paramData.set('email', this.Item['email']);
			paramData.set('subject', this.Item['subject']);
			paramData.set('content', this.Item['content']);
			this._SystemGeneralService.send_mail_contact(paramData).subscribe(res => {
				if (res.status == 'success') {
					this._ToastrService.success('Email has been sent successfully');
					//reset form
					form.reset();
				}
			});
		}else{
			this.is_validated = true;
		}

	}
}
