import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { ToastrService } from 'ngx-toastr';


import { SystemGeneralService, ScriptService } from '../../../../../services';


declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-general-form-contact',
	templateUrl: './form-contact.component.html',
	providers: [ SystemGeneralService ]
})

export class FormContactComponent implements OnInit {
	Item: Array<any> = [];
	is_validated = false;
	constructor(
		private _ToastrService: ToastrService,
		private _ScriptService: ScriptService,
		private _SystemGeneralService: SystemGeneralService,
	) {
		this._ScriptService.load('grid_layout').then(data => {
		}).catch(error => console.log(error));
	}

	ngOnInit() {
	}

	onSubmit(form: NgForm){
		if(form.valid){
			let paramData: URLSearchParams = new URLSearchParams();
			console.log(this.Item);
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

	ngOnDestroy() {

	}
}
