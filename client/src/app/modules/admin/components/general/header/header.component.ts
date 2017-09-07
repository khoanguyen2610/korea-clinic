import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { AuthService } from '../../../../../services';


// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-admin-header',
	templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {

	constructor(
		private _AuthService: AuthService,
	) {

	}

	ngOnInit() {
		console.log('Admin Header');
	}

	/*===================================================
	 * Logout system
	 *===================================================*/
  	logout(){
  		let redirect_url = '/admin/auth/login';
  		this._AuthService.logout(redirect_url);
		console.log('test');
		return false;
  	}


	ngOnDestroy() {

	}
}
