import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { Configuration } from '../../../../shared';


import { SystemGeneralService } from '../../../../services';


declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-contact',
	templateUrl: './contact.component.html',
	providers: [ SystemGeneralService ]
})

export class ContactComponent implements OnInit {
	Item: Array<any> = [];
	is_validated = false;

	constructor(
		private _ToastrService: ToastrService,
		private _SystemGeneralService: SystemGeneralService,
		private _Configuration: Configuration
	) {

	}

	ngOnInit() {
	}

	getAction(){
		return 'contact';
	}


	ngOnDestroy() {

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
