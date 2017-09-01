import { Injectable } from '@angular/core';
import { Router , CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';

import { ToasterService } from 'angular2-toaster/angular2-toaster';

import { AuthService } from '../services';
import { Configuration } from '../shared';

@Injectable()
export class AuthPermissionGuard implements CanActivate {
	current_user_info = {};

	constructor(private _Router: Router,
		private _Configuration: Configuration,
	 	private _AuthService: AuthService,
	 	private _ToasterService: ToasterService
	) {
		
	}

 	canActivate(_ActivatedRouteSnapshot: ActivatedRouteSnapshot,
 		_RouterStateSnapshot: RouterStateSnapshot): Observable<boolean>|boolean{
	   	/*==============================================
		 * Get current user department
		 *==============================================*/
	 	var params: URLSearchParams = new URLSearchParams();
	 	params.set('route_url', _RouterStateSnapshot.url);
		this._AuthService.checkRoutesPermisstion(params).subscribe(res => {
			if (res.status == 'success') {
				if(!res.data.route_permission){
					this._ToasterService.pop('warning', 'アクセス権がありません、TOPに戻ります。');
					this._Router.navigate(['/home']);
					return false;
				}
			}
		});
		
    	return true;
  	}
}