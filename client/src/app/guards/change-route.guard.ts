import { Injectable, ViewChild, Component } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';

import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AuthService } from '../services';
import { Configuration } from '../shared';
declare let swal: any;

@Injectable()
export class ChangeRouteGuard implements CanActivate {
	current_user_info = {};

	constructor(private _Router: Router,
		private _Configuration: Configuration,
		private _AuthService: AuthService,
		private _ToasterService: ToasterService
	) {

	}

	canActivate(_ActivatedRouteSnapshot: ActivatedRouteSnapshot,
		_RouterStateSnapshot: RouterStateSnapshot): Observable<boolean> | boolean {
		/*==============================================
	    * Get current user department
	    *==============================================*/
		if(!this._Configuration.allow_change_page) {
			this._Configuration.allow_change_page = false;
			swal({
			  	text: "入力された内容は破棄されます、よろしいですか？",
			  	type: 'warning',
			  	showCancelButton: true,
			  	confirmButtonText: 'はい',
			  	cancelButtonText: 'いいえ'
			}).then(() => {
				this._Configuration.allow_change_page = true;
			  	this._Router.navigateByUrl(_RouterStateSnapshot.url);
			}, function(dismiss){

			})
			return this._Configuration.allow_change_page;
		} else {
			return true;
		}

	}
}