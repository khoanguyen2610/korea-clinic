import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { AuthService } from '../../../../../services';

@Component({
	selector: 'app-admin-header',
	templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {

	constructor(
		private _AuthService: AuthService
	) {
	}

	ngOnInit() {

	}

	/*===================================================
	 * Logout system
	 *===================================================*/
  	logout(){
  		this._AuthService.logout('/admin/auth/login');
		return false;
  	}


	ngOnDestroy() {

	}
}
